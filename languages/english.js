const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

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
    return (`You don't have enough balance to execute this command. Your current balance is ${bold(currentBalance)} RTM\nYou can add balance to account by using: ${bold("rtm.send <@954355946065375242> <amount>")}`)
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

function withdrawAddressChange(address) {
    return ("Your new RTM withdraw address is " + "`" + address + "`")
}

function otherUserBalance(userID, balance) {
    return (`<@${userID}>'s balance is ${bold(balance)} RTM`)
}

function withdrawConfirmation(amount, address) {
    const embed = {
        color: "#08B2E3",
        title: "Withdrawal Confirmation",
        description: "Please confirm your withdraw request by clicking the button below \n We won't be responsible for invalid address",
        thumbnail: {
            url: "https://i.imgur.com/PNyjWYq.png"
        },
        fields: [
            {
                name: "Amount",
                value: "`" + amount + " RTM`",
                inline: true
            },
            {
                name: "Address",
                value: "`" + address + "`",
                inline: true,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: true    ,
            },
            {
                name: 'Fee (5%)',
                value: "`" + (amount * 0.05) + " RTM`",
                inline: false,
            },
            {
                name: 'Final amount',
                value: "`" + (amount - (amount * 0.05)) + " RTM`",
            }
        ],
        footer: {
            text: 'Your action will be canceled after 60 seconds\nParty Games developed by Long Zer',
        },
    }
    return embed
}

function withdrawConfirmationButton() {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('confirm')
					.setLabel('Confirm')
					.setStyle('SUCCESS')
                    .setEmoji("✅"),
                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
                    .setEmoji("❎")
		)
    return row
}

function withdrawConfirmed(amount, address) {
    const embed = {
        color: "#000FF00",
        title: "Withdrawal confirmed",
        description: "Your withdraw request has been confirmed",
        thumbnail: {
            url: "https://i.imgur.com/PNyjWYq.png"
        },
        fields: [
            {
                name: "Address",
                value: "`" + address + "`",
                inline: false,
            },
            {
                name: "Amount",
                value: "`" + (amount - (amount * 0.05)) + " RTM`",
                inline: true
            },
        ],
        footer: {
            text: 'You will receive in 1-24 hours\nParty Games developed by Long Zer',
        },
    }
    return embed
}

function withdrawCancelled() {
    const embed = {
        color: "#FF0000",
        title: "Withdrawal canceled",
        description: "Your withdraw request has been canceled",
        thumbnail: {
            url: "https://i.imgur.com/PNyjWYq.png"
        },
        footer: {
            text: 'Party Games developed by Long Zer',
        },
    }
    return embed
}

module.exports = { createUser,
    napTien,
    balance,
    balanceNotEnough,
    betEmbed,
    timeout,
    diceEmbed,
    helpEmbed,
    otherUserBalance,
    withdrawAddressChange,
    withdrawConfirmation,
    withdrawConfirmationButton,
    withdrawConfirmed,
    withdrawCancelled
}