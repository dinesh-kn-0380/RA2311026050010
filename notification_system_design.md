# Notification System Design

## Stage 1: API Design

I need to design REST APIs so the frontend can show notifications to users when they log in.

### GET /notifications
Used to fetch all notifications for a user.

Request:
```
GET /notifications?userId=101
Authorization: Bearer <token>
Content-Type: application/json
```

Response:
```json
[
  {
    "id": 1,
    "type": "email",
    "message": "Order shipped",
    "timestamp": "2026-05-02T10:00:00Z"
  }
]
```

### POST /notifications
Used to create a new notification.

Request:
```
POST /notifications
Authorization: Bearer <token>
Content-Type: application/json
```

Body:
```json
{
  "userId": 101,
  "type": "push",
  "message": "New offer available"
}
```

### Real-time Notifications
For real-time delivery I'll use WebSockets. This keeps a live connection open so the server can push notifications instantly. An alternative is Server-Sent Events (SSE) which is simpler but one-way only.

---

## Stage 2: Database Design

I'll use a relational database (MySQL or PostgreSQL) since the data is structured and we need queries like filtering by user, type, and date.

### Table: notifications

| Column | Type | Notes |
|--------|------|-------|
| id | UUID / INT | Primary Key |
| userId | INT | Foreign Key → users table |
| type | ENUM | email, sms, push |
| message | TEXT | Notification content |
| isRead | BOOLEAN | Default: false |
| createdAt | TIMESTAMP | Auto-set on insert |

### Indexes
- `userId` — most queries filter by user
- `createdAt` — for sorting by time

---

## Stage 3: Query Optimization

### Problem
The original query does a full table scan which is slow with 50,000 students and 5 million rows:
```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

### Why it's slow
There's no index on `(studentID, isRead, createdAt)` together so MySQL scans all 5 million rows every time.

### Fix
Create a composite index:
```sql
CREATE INDEX idx_user_unread ON notifications (userId, isRead, createdAt DESC);
```

### Optimized Query
```sql
SELECT * FROM notifications
WHERE userId = ? AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;
```

### Should we index every column?
No. Indexes speed up reads but slow down writes. Indexing every column would hurt INSERT/UPDATE performance badly. Only index the columns you actually filter or sort on.

### Query: Students who got Placement in last 7 days
```sql
SELECT * FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

---

## Stage 4: Performance Improvements

The DB is getting hit on every page load for every student which is causing slowness.

### Solutions

**Pagination** — Don't load all notifications at once. Use LIMIT and OFFSET to load 20 at a time.

**Caching with Redis** — Store recent notifications in Redis. First check cache, only hit DB if cache miss. Set TTL of a few minutes.

**Lazy Loading** — Only load notifications when the user scrolls or opens the notification panel.

**WebSockets instead of polling** — Polling means the client asks "any new notifications?" every few seconds. WebSockets keep a live connection so the server pushes only when there's something new. Much lighter on the DB.

### Tradeoffs
- Redis adds complexity but reduces DB load significantly
- Pagination improves response time but requires frontend changes
- WebSockets are ideal for real-time but need more infrastructure

---

## Stage 5: notify_all Issue

### The Problem
When HR clicks "Notify All", the current code does this for each of 50,000 students:
```
send_email(student_id, message)   # calls Email API
save_to_db(student_id, message)   # DB insert
push_to_app(student_id, message)  # real-time push
```

### Issues I see
1. If `send_email` fails midway (it did for 200 students), those students never get the email but we can't easily tell which ones or retry them.
2. Email + DB are not atomic. If email fails, DB might still be written — inconsistent state.
3. This runs synchronously for 50,000 students. It'll be extremely slow and timeout.

### Should DB write and email happen together?
No. They should be decoupled.

**Reason:** The email service is an external API that can fail independently due to network issues or rate limits. If we do both together and email fails halfway, we have no clean way to retry just the failed ones.

### Solution: Message Queue
Use a queue like Kafka or RabbitMQ.

**Improved Flow:**
1. Save notification to DB immediately
2. Push a job to the queue for each student (non-blocking)
3. Workers pick up jobs and send emails
4. Failed jobs are retried automatically

**Revised Pseudocode:**
```
function notify_all(student_ids, message):
    for student_id in student_ids:
        save_to_db(student_id, message)
        enqueue_job({ student_id, message })  # fast, non-blocking

# Worker (runs separately):
function worker():
    job = dequeue()
    try:
        send_email(job.student_id, job.message)
        push_to_app(job.student_id, job.message)
    catch error:
        retry(job)  # retry up to 3 times
```

This way DB writes are safe, emails are retried on failure, and the whole process doesn't block.

---

## Stage 6: Top N Notifications

### Goal
Show the top 10 most important unread notifications first. Priority is: Placement > Event > Result, then by most recent.

### Approach
Assign a weight to each type:
- Placement → 3
- Event → 2
- Result → 1

Sort by weight first, then by timestamp if weights are equal.

### Code
```javascript
const getTopNotifications = (notifications, n = 10) => {
  const weight = { Placement: 3, Event: 2, Result: 1 };

  return notifications
    .sort((a, b) => {
      return (
        (weight[b.Type] || 0) - (weight[a.Type] || 0) ||
        new Date(b.Timestamp) - new Date(a.Timestamp)
      );
    })
    .slice(0, n);
};
```

### How to maintain top N efficiently as new data comes in
Using `.sort()` on the full list every time is O(M log M) where M is all notifications. This gets expensive as data grows.

Better approach — use a **Min-Heap of size N**:
- Keep only the top N notifications in memory
- When a new notification arrives, compare it with the smallest in the heap
- If it's more important, replace the smallest and re-heapify
- This runs in O(log N) per new notification instead of sorting everything

This way we always have the top N ready without scanning the full list.
