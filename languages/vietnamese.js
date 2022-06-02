const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

function createUser(amount) {
    return (`Tài khoản đã được tạo với số tiền ban đầu là ${amount} RTM\nBạn có thể nạp tiền bằng cách sử dụng: ${bold("rtm.send <@954355946065375242> <số tiền>")}`)
}

function napTien(amount, newBalance) {
    return (`Bạn đã nạp ${amount} vào tài khoản\nTài khoản hiện tại là: ${bold(newBalance)} RTM`)
}

function balance(balance) {
    return (`Bạn đang có ${bold(balance)} RTM`)
}

function balanceNotEnough(currentBalance) {
    return (`Số dư tài khoản của bạn không đủ để đặt cược. Bạn đang có ${bold(currentBalance)} RTM\nBạn có thể nạp tiền bằng cách sử dụng: ${bold("rtm.send <@954355946065375242> <số tiền>")}`)
}

function betEmbed(userID, resulttx, resultwl, amount, newBalance, avatarURL) {
    if (resulttx == "xiu") {
        resulttx = bold("Xỉu")
    } else if (resulttx == "tai") {
        resulttx = bold("Tài")
    }
    amount = bold(amount)

    if (resultwl == "win") {
        resultwl = "thắng"
        var color = "#000FF00"
    } else if (resultwl == "lose") {
        resultwl = "thua"
        var color = "FF0000"
    }

    const embed = {
        color: color,
        title: `Kết quả: ${resulttx}`,
        description: `<@${userID}> đã ${resultwl} ${amount} RTM`,
        thumbnail: {
            url: avatarURL,
        },
        fields: [
            {
                name: `\u200b`,
                value: `Số dư mới của bạn là ${bold(newBalance)} RTM`,
            }
        ],
        footer: {
            text: 'Party Games developed by Long Zer',
        },
    }
    return embed
}

function timeout(lastMessage, currentTime) {
    return (`Vui lòng đợi ${bold((4000 - (currentTime - lastMessage)) / 1000)} giây trước khi thực hiện câu lệnh tiếp theo`)
}

function diceEmbed(dice, round, betAmount, userID, choice, avatarURL) {
    if (choice == "xiu") {
        choice = "xỉu"
    } else if (choice == "tai") {
        choice = "tài"
    }
    const embed = {
        color: "#08B2E3",
        title: `${bold(`Vòng #${round}`)}`,
        description: `<@${userID}> đã đặt ${bold(betAmount)} RTM vào ${bold(choice)}`,
        thumbnail: {
            url: avatarURL,
        },
        fields: [
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
            text: `Party Games developed by Long Zer`,
        },
    }
    return embed
}

function helpEmbed() {
    const embed = {
        color: "#08B2E3",
        title: `${bold("Danh sách các câu lệnh")}`,
        description: `${bold("rtm.create")} - Tạo tài khoản mới\n${bold("rtm.send")} - Nạp tiền vào tài khoản\n${bold("rtm.balance")} - Hiển thị số dư tài khoản\n${bold("rtm.bet")} - Đặt cược\n${bold("rtm.help")} - Hiển thị danh sách các câu lệnh`,
        footer: {
            text: 'Developed by Long Zer',
        },
    }
    return embed
} 

function otherUserBalance(userID, balance) {
    return (`Số dư của <@${userID}> là ${bold(balance)} RTM`)
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