const axios = require("axios");

const data = {
    "email": "dn03800@srmist.edu.in",
    "name": "dinesh kumar n",
    "rollNo": "ra2311026050010",
    "accessCode": "QkbpxH",
    "clientID": "32c38202-96c8-4453-b65e-c29f47d7d7a0",
    "clientSecret": "gFGZuzqTxVZhENKK"
};

async function getToken() {
    try {
        const res = await axios.post("http://20.207.122.201/evaluation-service/auth", data);
        console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error(err.response?.data || err.message);
    }
}

getToken();
