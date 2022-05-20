// basic shit
const { token, guildId, clientId, sheet_id, gg_credentials } = require('./config.json');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    // Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
] });
client.login(token);
console.log("Login successful");

const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');

const sheetdb = require("sheetdb-node")
const sheet = sheetdb({ address: '90s3csi5c9r61' });
const axios = require('axios');

let sessionStatus = false
let sessionId = 0

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("rtm.send") && message.channelId == "750350048730153081") {
        let args = message.content.split(/\s+/);
        args.shift();
        console.log(args)
        if (args[0] == "<@965473856628342814>") {
            // message.reply("good")
            const filter = (reaction, user) => user.id === '916225084698550314';
            const collector = message.createReactionCollector({ filter, time: 5_000 });
            collector.on('collect', r => {
                // console.log(`Collected ${r.emoji.name}`)
                if (r.emoji.name == "✅" && args.length >= 2) {
                    sheet.read({ search: { userId: message.author.id } }).then(function(rawData) {
                        // console.log(data);
                        let data = JSON.parse(rawData)
                        if (data.length == 0) {
                            createUser(message.author.id, args[1])
                            message.channel.send("Tạo tài khoản thành công!")
                            // naptien(message.author.id)
                            message.channel.send("Nạp thành công " + args[1] + " RTM vào tài khoản")
                        } else {
                            naptien(message.author.id, args[1])
                            message.channel.send("Nạp thành công " + args[1] + " RTM vào tài khoản")
                        }
                    }, function(err){
                        console.log(err);
                    });
                } else {
                    message.channel.send("you fking broke haha!")
                }
            });
            // collector.on('end', collected => console.log(`Collected ${collected.size} items`));
        }
    }
    if (message.content.startsWith("bet") && message.channelId == "750350048730153081") {
        let args = message.content.split(/\s+/);
        args.shift();
        sheet.read({ search: { userId: message.author.id } }).then(function(rawData) {
            let data = JSON.parse(rawData)
            if (data.length == 0) {
                message.channel.send("Bạn chưa có tài khoản!")
            } else {
                if (typeof args[0] == "undefined") {
                    message.channel.send("VD: bet tai 69")
                } else if (args[0] == "tai" || args[0] == "xiu") {
                    if (sessionStatus == false) {
                        // console.log(sessionStatus)
                        const parsedBal = parseInt(data[0].actualBalance)
                        if (parsedBal < args[1]) {
                            message.channel.send("Bạn không đủ tiền để đặt cược")
                        } else {
                            if (sessionStatus = false) {
                                sessionStatus = true
                                message.channel.send(`Bắt đầu đặt cược round #${sessionId + 1}`)
                                placeBet(args[0], args[1], message.author.id)
                            }else if (sessionStatus = true) {
                                placeBet(args[0], args[1], message.author.id)
                                if (args[0] == "tai") {
                                    message.channel.send(`<@${message.author.id}> đã đặt cược ${args[1]} RTM vào tài`)
                                } else if (args[0] == "xiu") {
                                    message.channel.send(`<@${message.author.id}> đã đặt cược ${args[1]} RTM vào xỉu`)
                                }
                                
                                setTimeout(() => {
                                    message.channel.send("Còn 15 giây để đặt cược")
                                }, 15000)
                                setTimeout(() => {
                                    message.channel.send("Còn 5 giây để đặt cược")
                                }, 25000)

                                setTimeout(() => {
                                    dice[0] = parseInt(Math.floor(Math.random() * 6)) + 1;
                                    dice[1] = parseInt(Math.floor(Math.random() * 6)) + 1;
                                    dice[2] = parseInt(Math.floor(Math.random() * 6)) + 1;

                                    let total = dice[0] + dice[1] + dice[2]
                                    let result = null
                                    if (total >= 4 && total <= 10) {
                                        result = "xiu"
                                    } else if (total >= 11 && total <= 17) {
                                        result = "tai"
                                    }

                                    message.channel.send("🎲1: " + spoiler(dice[0]))
                                    message.channel.send("🎲2: " + spoiler(dice[1]))
                                    message.channel.send("🎲3: " + spoiler(dice[2]))

                                    setTimeout(() => {
                                        if (result == "tai") {
                                            message.channel.send(`Kết quả: Tài`)
                                            message.channel.send(`${taiPeople.length} người đã thắng`)
                                        } else if (result == "xiu") {
                                            message.channel.send(`Kết quả: Xỉu`)
                                            message.channel.send(`${xiuPeople.length} người đã thắng`)
                                        }
                                            sessionStatus = false ;
                                            taiPeople.length = 0;
                                            taiMoney.length = 0;
                                            xiuPeople.length = 0;
                                            xiuMoney.length = 0;
                                            dice.length = 0;
                                    }, 7500)
                                }, 30000)
                            }
                        }
                    }
                } 
            }
        }, function(err){
            console.log(err);
        });
    }
    if (message.content == "roll") {
        naptien(message.author.id, 100)
    }
});

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

let dice = [];
let taiPeople = []
let taiMoney = []
let xiuPeople = []
let xiuMoney = []
function placeBet(choice, money, userId) {
    if (choice == "tai") {
        taiPeople[taiPeople.length] = [userId]
        taiMoney[taiMoney.length] = [money]
    } else if (choice == "xiu") {
        xiuPeople[xiuPeople.length] = [userId]
        xiuMoney[xiuMoney.length] = [money]
    }
}

function checkSession() {
    console.log("tai: "+taiPeople)
    console.log(taiMoney)
    console.log("xiu: "+xiuPeople)
    console.log(xiuMoney)
    console.log(sessionStatus)
}

setInterval(() => { checkSession() }, 1000);