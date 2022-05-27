const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
const { ReactionUserManager } = require('discord.js');

function createUser(amount) {
    return (`Tài khoản đã được tạo với số tiền ban đầu là ${amount} RTM\nBạn có thể nạp tiền bằng cách sử dụng: ${bold("rtm.send <@965473856628342814> <số tiền>")}`)
}

function napTien(amount, newBalance) {
    return (`Bạn đã nạp ${amount} vào tài khoản\nTài khoản hiện tại là: ${bold(newBalance)} RTM`)
}

function balance(balance) {
    return (`Bạn đang có ${bold(balance)} RTM`)
}

function balanceNotEnough(currentBalance) {
    return (`Số dư tài khoản của bạn không đủ để thực hiện. Bạn đang có ${currentBalance} RTM\nBạn có thể nạp tiền bằng cách sử dụng: ${bold("rtm.send <@965473856628342814> <số tiền>")}`)
}

function betWin(amount, newBalance) {
    return (`Bạn đã thắng ${bold(amount)} RTM\nTài khoản hiện tại là: ${bold(newBalance)} RTM`)
}

function betLose(amount, newBalance) {
    return (`Bạn đã thua ${bold(amount)} RTM\nTài khoản hiện tại là: ${bold(newBalance)} RTM`)
}

module.exports = { createUser,
    napTien,
    balance,
    balanceNotEnough,
    betWin,
    betLose
}