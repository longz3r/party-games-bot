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
    return (`You don't have enough balance to place bet. Your current balance is ${bold(currentBalance)} RTM\nYou can add balance to account by using: ${bold("rtm.send <@954355946065375242> <amount>")}`)
}

function timeout(lastMessage, currentTime) {
    return (`Please wait ${bold((4000 - (currentTime - lastMessage)) / 1000)} before execute next command`)
}

function betEmbed(userID, resulttx, resultwl, amount, newBalance, avatarURL) {
    if (resultwl == "win") {
        resultwl = "won"
        var color = "#000FF00"
    } else if (resultwl == "lose") {
        resultwl = "lost"
        var color = "FF0000"
    }

    if (resulttx == "xiu") {
        resulttx = bold("Xỉu")
    } else if (resulttx == "tai") {
        resulttx = bold("Tài")
    } else if (resulttx == "chan") {
        resulttx = bold("Chẵn")
    } else if (resulttx == "le") {
        resulttx = bold("Lẻ")
    }

    amount = bold(amount)

    const embed = {
        color: color,
        title: `Result: ${resulttx}`,
        description: `<@${userID}> ${resultwl} ${amount} RTM`,
        thumbnail: {
            url: avatarURL,
        },
        fields: [
            {
                name: `\u200b`,
                value: `Your new balance is ${bold(newBalance)} RTM`,
            }
        ],
        footer: {
            text: 'Party Games developed by Long Zer',
        },
    }
    return embed
}

function diceEmbed(dice, round, betAmount, userID, choice, avatarURL) {
    if (choice == "xiu") {
        choice = bold("Xỉu")
    } else if (choice == "tai") {
        choice = bold("Tài")
    } else if (choice == "chan") {
        choice = bold("Chẵn")
    } else if (choice == "le") {
        choice = bold("Lẻ")
    }
    const embed = {
        color: "#08B2E3",
        title: `${bold(`Round #${round}`)}`,
        description: `<@${userID}> placed ${bold(betAmount)} RTM into ${bold(choice)}`,
        thumbnail: {
            url: avatarURL,
        },
        fields: [
            {
                name: '\u200b',
                value: '\u200b',
                inline: false,
            },
            {
                name: '🎲1:',
                value: spoiler(dice[0]),
                inline: true,
            },
            {
                name: '🎲2:',
                value: spoiler(dice[1]),
                inline: true,
            },
            {
                name: '🎲3:',
                value: spoiler(dice[2]),
                inline: true,
            },
        ],
        footer: {
            text: 'Party Games developed by Long Zer',
        },
    }
    return embed
}

function helpEmbed() {
    const embed = {
        color: "#08B2E3",
    }
    return embed
}

function otherUserBalance(userID, balance) {
    return (`<@${userID}>'s balance is ${bold(balance)} RTM`)
}

module.exports = { createUser,
    napTien,
    balance,
    balanceNotEnough,
    betEmbed,
    timeout,
    diceEmbed,
    helpEmbed,
    otherUserBalance
}