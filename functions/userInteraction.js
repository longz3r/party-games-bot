const sheetdb = require("sheetdb-node")
const sheet = sheetdb({ address: '90s3csi5c9r61' });

function createUser(userID, preBal) {
    sheet.endpoint('count').then(function(rawCount) {
        count = JSON.parse(rawCount)
        sheet.create({ id: count.rows+1, userId: userID, balance: preBal, withdrawal:0, actualBalance: `=C${count.rows+2}-D${count.rows+2}`}).then(function(data) {
            console.log(data);
        }, function(err){
            console.log(err);
        });
    }, function(error){
        console.log(error);
    });
}

function naptien(userID, amount) {
    sheet.read({ search: { userId: userID } }).then(function(rawData) {
        let processedData = JSON.parse(rawData)
        const parsedBal = parseInt(processedData[0].balance)
        const parsedAmount = parseInt(amount)
        const newBalance =  parsedBal + parsedAmount
        console.log(typeof newBalance)
        sheet.update(
            'userId', // column name
            userID, // value to search for
            { 'balance': newBalance } // object with updates
        ).then(function (data) {
            console.log(data);
        }, function (err) {
            console.log(err);
        });
    }, function(err){
        console.log(err);
    });
}

module.exports = { createUser, naptien }