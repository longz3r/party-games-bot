const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');

function createUser(amount) {
    return (`Your account is created with balance is ${amount} RTM\nYou can add balance to account by using: ${bold("rtm.send <@965473856628342814> <amount>")}`)
}

function napTien(amount, newBalance) {
    return (`Your account was added ${bold(amount)} RTM\nYour current balance is: ${bold(newBalance)} RTM`)
}

function balance(balance) {
    return (`Your current balance is ${bold(balance)} RTM`)
}

function balanceNotEnough(currentBalance) {
    return (`You don't have enough balance to bet. Your current balance is ${currentBalance} RTM\nYou can add balance to account by using: ${bold("rtm.send <@965473856628342814> <amount>")}`)
}

function betWin(amount, newBalance) {
    return (`You won ${bold(amount)} RTM\nYour current balance is ${bold(newBalance)} RTM`)
}

function betLose(amount, newBalance) {
    return (`You lost ${bold(amount)} RTM\nYour current balance is ${bold(newBalance)} RTM`)
}

module.exports = { createUser,
    napTien,
    balance,
    balanceNotEnough,
    betWin,
    betLose
}