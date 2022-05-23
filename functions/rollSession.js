const sessionDb = require("sheetdb-node")
const session = sessionDb({ address: 'ihbzrsj20kcuh' })

function createSession() {
    session.endpoint('count').then(function(rawCount) {
        count = JSON.parse(rawCount)
        sheet.create({ id: count.rows+1, unixTime: unixTime, result: undefined, taiId: [], taiMoney: [], xiuId: [], xiuMoney: []}).then(function(data) {
            console.log(data);
        }, function(err){
            console.log(err);
        });
    }, function(error){
        console.log(error);
    });
}

function rollDice() {
    return parseInt(Math.floor(Math.random() * 6)) + 1;
}



module.exports = { createSession, rollDice }