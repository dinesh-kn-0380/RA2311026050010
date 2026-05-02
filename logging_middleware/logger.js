const axios = require("axios");

/**
 * Log function to send application logs to the centralized evaluation service.
 * 
 * @param {string} stack - The application stack (e.g., 'backend', 'frontend')
 * @param {string} level - The severity level (e.g., 'info', 'warn', 'error', 'fatal')
 * @param {string} pkg - The package or service name generating the log
 * @param {string} message - The log message content
 */
const Log = async (stack, level, pkg, message) => {
  const payload = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const response = await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      payload,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkbjAzODAwQHNybWlzdC5lZHUuaW4iLCJleHAiOjE3Nzc2OTk2NzksImlhdCI6MTc3NzY5ODc3OSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjA4M2QzNGFmLTllNjctNDA5Mi1hYmJmLTU2OGNjOTJhOWQ4YSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImRpbmVzaCBrdW1hciBuIiwic3ViIjoiMzJjMzgyMDItOTZjOC00NDUzLWI2NWUtYzI5ZjQ3ZDdkN2EwIn0sImVtYWlsIjoiZG4wMzgwMEBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImRpbmVzaCBrdW1hciBuIiwicm9sbE5vIjoicmEyMzExMDI2MDUwMDEwIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzJjMzgyMDItOTZjOC00NDUzLWI2NWUtYzI5ZjQ3ZDdkN2EwIiwiY2xpZW50U2VjcmV0IjoiZ0ZHWnV6cVR4VlpoRU5LSyJ9.lPzlwRjXNrevgA5BJarNVpWRCMoOE7_k0Vg_AnYlQ_o`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`[${level.toUpperCase()}] Log pushed successfully:`, response.data);
  } catch (error) {
   
    const errorData = error.response ? error.response.data : error.message;
    console.error(`[LOG ERROR] Failed to send log:`, errorData);
  }
};

module.exports = Log;