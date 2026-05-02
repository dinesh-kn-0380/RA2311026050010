# Notification System Design

## Stage 1: API Design

### 1. Get Notifications
GET /notifications?userId={id}

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

### 2. Create Notification
POST /notifications

Request:
```json
{
  "userId": 101,
  "type": "push",
  "message": "New offer available"
}
```

### 3. API Headers
**Required for all requests:**
- **Authorization:** `Bearer <token>`
- **Content-Type:** `application/json`

### 4. Real-time Notifications
- Use WebSockets
- Alternative: Server-Sent Events (SSE)

## Stage 2: Database Design

Table: **notifications**

Columns:
- **id** (Primary Key)
- **userId** (Foreign Key)
- **type** (email / sms / push)
- **message** (text)
- **isRead** (boolean)
- **createdAt** (timestamp)

Indexes:
- userId
- createdAt

## Stage 3: Query Optimization

**Problem:**
Fetching unread notifications is slow due to full table scan.

**Solution:**
Create composite index:
`(userId, isRead, createdAt DESC)`

**Optimized Query (Unread Notifications):**
```sql
SELECT * FROM notifications
WHERE userId = ? AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;
```

**Query: Students with Placement in last 7 days:**
```sql
SELECT * FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

## Stage 4: Performance Improvements

**Techniques:**
- Pagination (LIMIT, OFFSET)
- Caching (Redis)
- Lazy loading
- Use WebSockets instead of polling
- Index optimization

## Stage 5: notify_all Issue

**Problem:**
- Email sending and DB write are not atomic.
- Failures lead to inconsistent state.

**Question:** Should DB + email sending happen together?
**Answer:** No. 
**Reason:** 
- Email services can fail independently due to network issues or rate limits. 
- Keeping them together blocks the main process and risks DB inconsistency if the email fails but the DB write succeeds (or vice-versa).

**Solution:**
- Use **Message Queue** (Kafka / RabbitMQ) to decouple the operations.
- Push notification job to queue and return success to the user immediately.
- Worker process handles the actual email sending asynchronously.
- Implementation of a **Retry Mechanism** for transient failures.

**Improved Flow:**
1. Save notification metadata to Database.
2. Push a "send email" job to the Message Queue.
3. Asynchronous Worker consumes the job.
4. Worker sends the email and handles retries if necessary.

## Stage 6: Top N Notifications

**Goal:**
Get top N important notifications

**Approach:**
- Sort by Impact (priority)
- Then by Timestamp

**Example Code:**
```javascript
const getTopNotifications = (notifications, n = 10) => {
  return notifications
    .sort((a, b) => {
      return (
        b.Impact - a.Impact ||
        new Date(b.Timestamp) - new Date(a.Timestamp)
      );
    })
    .slice(0, n);
};
```

**Efficient Approach for Dynamic Data:**
To maintain the top N important notifications efficiently as new data arrives:
- Use a **Min-Heap** of size N.
- For every new notification, if the heap has fewer than N elements, add it.
- If the heap is full, compare the new notification with the root (minimum of the top N). If the new one is more important, replace the root and re-heapify.
- **Time Complexity:** $O(\log N)$ per insertion, making it much more efficient than $O(M \log M)$ sorting of the entire list $M$ every time.
