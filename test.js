
const Log = require("./logging_middleware/logger");

async function runTests() {
    console.log("--- Starting Log Tests ---");

    try {
        // Using shorter messages to comply with service limits (max 48 chars)
        await Log("backend", "info", "service", "Server started");
        await Log("backend", "error", "handler", "Invalid input received");
        await Log("backend", "fatal", "db", "Database connection failed");

        console.log("--- Log Tests Completed ---");
    } catch (err) {
        console.error("Test execution failed:", err);
    }
}

runTests();
