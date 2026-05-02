const Log = require("./logging_middleware/logger");

async function runTests() {
  console.log(" Starting Log Tests...\n");

  await Log("backend", "info", "service", "Server started successfully");
  await Log("backend", "error", "handler", "Invalid user input received");
  await Log("backend", "fatal", "db", "Database connection failed");

  console.log("\n Log Tests Completed");
}

runTests();