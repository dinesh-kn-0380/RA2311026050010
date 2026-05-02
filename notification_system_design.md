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

### 3. Real-time Notifications
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

**Optimized Query:**
```sql
SELECT * FROM notifications
WHERE userId = ? AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;
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
- Email sending and DB write are not atomic
- Failures cause inconsistency

**Solution:**
- Use **Message Queue** (Kafka / RabbitMQ)
- Push notification job to queue
- Worker processes email sending
- Retry mechanism for failures

**Flow:**
1. Event triggered
2. Push to queue
3. Worker consumes
4. Send email

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
