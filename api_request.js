const axios = require("axios");

axios
    .get('https://explorer.raptoreum.com/api/getmininginfo')
    .then(res => {
        console.log(`statusCode: ${res.status}`);
        // console.log(res);
        // let data = JSON.parse(res)
        console.log(res.data)
    })
    .catch(error => {
        console.error(error);
    });