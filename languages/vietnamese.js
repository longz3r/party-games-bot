const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

function createUser(amount) {
    return (`Tài khoản đã được tạo với số tiền ban đầu là ${amount} RTM\nBạn có thể nạp tiền bằng cách sử dụng: ${bold("rtm.send <@954355946065375242> <số tiền>")}`)
}

function napTien(amount, newBalance) {
    return (`Bạn đã nạp ${bold(amount)} RTM vào tài khoản\nTài khoản hiện tại là: ${bold(newBalance)} RTM`)
}

function balance(balance) {
    return (`Bạn đang có ${bold(balance)} RTM`)
}

function balanceNotEnough(currentBalance) {
    return (`Số dư tài khoản của bạn không đủ để thực hiện. Bạn đang có ${bold(currentBalance)} RTM\nBạn có thể nạp tiền bằng cách sử dụng: ${bold("rtm.send <@954355946065375242> <số tiền>")}`)
}

function betEmbed(userID, resulttx, resultwl, amount, newBalance, avatarURL) {
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
    } else if (choice == "le") {
        choice = "lẻ"
    } else if (choice == "chan") {
        choice = "chẵn"
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

function withdrawAddressChange(address) {
    return ("Địa chỉ ví RTM mới của bạn là: " + "`" + address + "`")
}

function withdrawConfirmation(amount, address) {
    const embed = {
        color: "#08B2E3",
        title: "Xác nhận lệnh rút tiền",
        description: "Vui lòng xác nhận lệnh rút tiền của bạn bằng cách ấn nút bên dưới \nChúng tôi sẽ không chịu trách nhiệm nếu sai địa chỉ",
        thumbnail: {
            url: "https://i.imgur.com/PNyjWYq.png"
        },
        fields: [
            {
                name: "Số lượng",
                value: "`" + amount + " RTM`",
                inline: true
            },
            {
                name: "Địa chỉ",
                value: "`" + address + "`",
                inline: true,
            },
            {
                name: '\u200b',
                value: '\u200b',
                inline: true    ,
            },
            {
                name: 'Phí (5%)',
                value: "`" + (amount * 0.05) + " RTM`",
                inline: false,
            },
            {
                name: 'Số lượng cuối cùng',
                value: "`" + (amount - (amount * 0.05)) + " RTM`",
            }
        ],
        footer: {
            text: 'Hành động này sẽ bị huỷ sau 60 giây\nParty Games developed by Long Zer',
        },
    }
    return embed
}

function withdrawConfirmationButton() {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('confirm')
					.setLabel('Xác nhận')
					.setStyle('SUCCESS')
                    .setEmoji("✅"),
                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Huỷ')
                    .setStyle('DANGER')
                    .setEmoji("❎")
		)
    return row
}

function withdrawConfirmed(amount, address) {
    const embed = {
        color: "#000FF00",
        title: "Lệnh rút tiền đã được xác nhận",
        description: "Lệnh rút tiền của bạn đã được xác nhận",
        thumbnail: {
            url: "https://i.imgur.com/PNyjWYq.png"
        },
        fields: [
            {
                name: "Địa chỉ",
                value: "`" + address + "`",
                inline: false,
            },
            {
                name: "Số lượng",
                value: "`" + (amount - (amount * 0.05)) + " RTM`",
                inline: true
            },
        ],
        footer: {
            text: 'Bạn sẽ nhận được trong 24 giờ\nParty Games developed by Long Zer',
        },
    }
    return embed
}

function withdrawCancelled() {
    const embed = {
        color: "#FF0000",
        title: "Lệnh rút tiền đã bị hủy",
        description: "Lệnh rút tiền của bạn đã bị huỷ",
        thumbnail: {
            url: "https://i.imgur.com/PNyjWYq.png"
        },
        footer: {
            text: 'Party Games developed by Long Zer',
        },
    }
    return embed
}

function withdrawDM(amount, address, txid) {
    const embed = {
        color: "#08B2E3",
        title: "Lệnh rút tiền đã được hoàn thành",
        description: `${amount} da duoc gui (ko biet cai unikey tren linux)`,
        thumbnail: {
            url: "https://i.imgur.com/PNyjWYq.png"
        },
        fields: [
            {
                name: "Address",
                value: "`" + address + "`",
            },
            {
                name: "TXID",
                value: "`" + txid + "`",
            }
        ]
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
    withdrawCancelled,
    withdrawDM,
}