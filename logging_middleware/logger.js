const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkbjAzODAwQHNybWlzdC5lZHUuaW4iLCJleHAiOjE3Nzc3MDEzNzAsImlhdCI6MTc3NzcwMDQ3MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjIzY2IxYzVlLTAzMDktNGMwMy1iNjI4LWFhNTQwMmQ5ODVjZiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImRpbmVzaCBrdW1hciBuIiwic3ViIjoiMzJjMzgyMDItOTZjOC00NDUzLWI2NWUtYzI5ZjQ3ZDdkN2EwIn0sImVtYWlsIjoiZG4wMzgwMEBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImRpbmVzaCBrdW1hciBuIiwicm9sbE5vIjoicmEyMzExMDI2MDUwMDEwIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzJjMzgyMDItOTZjOC00NDUzLWI2NWUtYzI5ZjQ3ZDdkN2EwIiwiY2xpZW50U2VjcmV0IjoiZ0ZHWnV6cVR4VlpoRU5LSyJ9.WjC0cY8HaVib4I3gXWblljrKeYLlEWCP4ps8v_A6jH4";

const Log = async (stack, level, pkg, message) => {
  try {
    const res = await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`✔ [${level.toUpperCase()}] ${message}`);
  } catch (err) {
    console.error(`❌ Logging failed:`, err.response?.data || err.message);
  }
};

module.exports = Log;