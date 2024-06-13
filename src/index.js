const express = require('express');
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
const { getToken } = require('./tokenGeneration');

const app = express();
app.use(cors());

const port = 9876

let token = "";
const previousRequests = [];

const initializeToken = () => {
    return getToken()
        .then(result => {
            token = result;
        })
        .catch(error => {
            console.error('Error fetching token:', error.message || error);
        });
};

initializeToken().then(() => {
    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });
});

const routeMap = {
    p: "primes",
    f: "fibo",
    e: "even",
    r: "rand"
};

app.get("/numbers/:id", (request, response) => {
    const { params: { id } } = request;
    console.log(id);

    if (!token) {
        return response.status(401).send("Unauthorized Token");
    }

    const routeName = routeMap[id];
    if (!routeName) {
        return response.status(400).json({ error: 'Invalid Number Id' });
    }

    axios.get(`http://20.244.56.144/test/${routeName}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(result => {
        const numbers = result.data.numbers;
        if (!Array.isArray(numbers)) {
            return response.status(500).json({ error: 'Invalid response format' });
        }

        const sum = numbers.reduce((acc, num) => acc + num, 0);
        const avg = sum / numbers.length;

        const windowPrevState = previousRequests.length === 0 ? [] : previousRequests[previousRequests.length - 1];
        const windowCurrState = numbers;

        const responseData = {
            windowPrevState,
            windowCurrState,
            avg
        };

        response.status(200).json(responseData);
        previousRequests.push(numbers);
    })
    .catch(e => {
        console.error('Error:', e.message || e);
        response.status(500).send("Error fetching data");
    });
});
