const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkbjAzODAwQHNybWlzdC5lZHUuaW4iLCJleHAiOjE3Nzc3MDI1MTYsImlhdCI6MTc3NzcwMTYxNiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY1OGRkMjMwLTM3MDMtNGRlYi05MGRlLTFiMDA4ODBiMjc1MyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImRpbmVzaCBrdW1hciBuIiwic3ViIjoiMzJjMzgyMDItOTZjOC00NDUzLWI2NWUtYzI5ZjQ3ZDdkN2EwIn0sImVtYWlsIjoiZG4wMzgwMEBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImRpbmVzaCBrdW1hciBuIiwicm9sbE5vIjoicmEyMzExMDI2MDUwMDEwIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzJjMzgyMDItOTZjOC00NDUzLWI2NWUtYzI5ZjQ3ZDdkN2EwIiwiY2xpZW50U2VjcmV0IjoiZ0ZHWnV6cVR4VlpoRU5LSyJ9._GvA6ULFSXvTX4qIPV39Y9fVuUQVJQp2D14DTGizc5g";

const fetchData = async (url) => {
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  return res.data;
};

const knapsack = (tasks, maxHours) => {
  const n = tasks.length;
  const dp = Array.from({ length: n + 1 }, () =>
    Array(maxHours + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];

    for (let w = 0; w <= maxHours; w++) {
      if (Duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          Impact + dp[i - 1][w - Duration]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][maxHours];
};

async function run() {
  try {
    const depots = await fetchData(
      "http://20.207.122.201/evaluation-service/depots"
    );

    const vehicles = await fetchData(
      "http://20.207.122.201/evaluation-service/vehicles"
    );

    const tasks = vehicles.vehicles;

    for (const depot of depots.depots) {
      const maxImpact = knapsack(tasks, depot.MechanicHours);

      console.log(
        `Depot ${depot.ID} → Max Impact: ${maxImpact}`
      );
    }
  } catch (error) {
    console.error("Execution failed:", error.response?.data || error.message);
  }
}

run();
