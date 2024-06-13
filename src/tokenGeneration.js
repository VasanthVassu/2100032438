// tokenGeneration.js
const axios = require('axios');

const obj = {
 "companyName": "KL University",
  "clientID": "98be46c8-18df-4466-90a9-8ad53851fa20",
  "clientSecret": "UMLiAPGiRNnOfnkJ",
  "ownerName": "V V Vishnu Vasanth Teja Marisetti",
  "ownerEmail": "2100032438cseh@gmail.com",
  "rollNo": "2100032438"
};

const getToken = () => {
    return axios.post("http://20.244.56.144/test/auth", obj)
        .then(response => {
            return response.data.access_token;
        })
        .catch(error => {
            console.error('Error fetching token:', error.message || error);
            throw error;
        });
};

module.exports = {
    getToken: getToken
};
