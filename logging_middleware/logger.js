const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkbjAzODAwQHNybWlzdC5lZHUuaW4iLCJleHAiOjE3Nzc3MDM3ODIsImlhdCI6MTc3NzcwMjg4MiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImIyNWZkMzBiLTMxOTgtNGE5MS04MmMxLWRkZDllMjEzN2EwZCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImRpbmVzaCBrdW1hciBuIiwic3ViIjoiMzJjMzgyMDItOTZjOC00NDUzLWI2NWUtYzI5ZjQ3ZDdkN2EwIn0sImVtYWlsIjoiZG4wMzgwMEBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImRpbmVzaCBrdW1hciBuIiwicm9sbE5vIjoicmEyMzExMDI2MDUwMDEwIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzJjMzgyMDItOTZjOC00NDUzLWI2NWUtYzI5ZjQ3ZDdkN2EwIiwiY2xpZW50U2VjcmV0IjoiZ0ZHWnV6cVR4VlpoRU5LSyJ9.fGonU3efkw-i6Wk9j7qomMrMEW9s3DWg_q2LJY1mrpI";
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
    console.error(` Logging failed:`, err.response?.data || err.message);
  }
};

module.exports = Log;