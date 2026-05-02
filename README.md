# Logging Middleware & Maintenance Scheduler

## Features
- **Logging Middleware**: API-based logging with reusable service logic.
- **Maintenance Scheduler**: Optimized vehicle maintenance planning using 0/1 Knapsack algorithm.
- **Notification System Design**: Full architectural breakdown for scalable notifications.

## Tech Used
- Node.js
- Axios
- REST APIs

## How to Run
```bash
npm install
node test.js
node vehicle_maintenance_scheduler/scheduler.js
```

## Architecture Flow
```text
User → API → Message Queue → Worker → Notification Service
```

## Sample Logs
- ✔ [INFO] Server started successfully
- ✔ [ERROR] Invalid user input received
- ✔ [FATAL] Database connection failed
