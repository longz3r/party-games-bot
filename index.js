// basic shit
const config = require('./config.json');
const { Client, Intents, ButtonInteraction, MessageComponentInteraction, Collection } = require('discord.js');
const client = new Client({ partials: ["CHANNEL"], intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
] });
const { MessageActionRow, MessageButton } = require('discord.js');
console.time("login")
client.login(config.token);
const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');

const fs = require('fs')

//database
const redisDB = require('redis');
const redis = redisDB.createClient({
    url: config.redisURL
});

//bot start
client.on('ready', async () => {
    console.log("Ready!");
    console.timeEnd("login")
    await redis.connect()
    client.user.setActivity("slash commands available", { type: "WATCHING" });
})

redis.on('error', (err) => console.log('Redis Client Error', err));

//date
// let date_ob = new Date();
// let date = ("0" + date_ob.getDate()).slice(-2);
// let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// let year = date_ob.getFullYear();
// let hours = date_ob.getHours();
// let minutes = date_ob.getMinutes();
// let seconds = date_ob.getSeconds();

//import function
const userInteraction = require('./functions/userInteraction.js');
const vi = require('./languages/vietnamese.js');
const en = require('./languages/english.js');
const rollSession = require("./functions/rollSession.js");
const { channel } = require('diagnostics_channel');

//checking shit
var timeout = new Map
var oaq = new Map
function nat(n) {
    return n >= 0 && Math.floor(n) === +n;
}

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("rtm.send")) {
            let userLanguage = await userInteraction.getLanguage(message.author.id);
            console.log("here2")
            let args = message.content.split(/\s+/);
            args.shift();
            //args processing
            var processedArgs = []
            if (args [0] == "<@954355946065375242>") {
                processedArgs[0] = "<@954355946065375242>"
                processedArgs[1] = args[1]
            } else if (args[1] == "<@954355946065375242>") {
                processedArgs[0] = "<@954355946065375242>"
                processedArgs[1] = args[0]
            }

            if (processedArgs[0] == "<@954355946065375242>") {
                console.log(processedArgs)
                let rtmBalance = await userInteraction.getBalance(message.author.id);
                let filter = (reaction, user) => user.id === '916225084698550314';
                const collector = message.createReactionCollector({ filter, time: 5_000 });
                collector.on('collect', reaction => {
                    if (reaction.emoji.name == "✅" && args.length >= 2 && nat(processedArgs[1])) {
                        if (rtmBalance == null) {
                            userInteraction.createUser(message.author.id, processedArgs[1])
                            if (userLanguage == "vi") {
                                message.channel.send(vi.createUser(processedArgs[1]))
                            } else {
                                message.channel.send(en.createUser(processedArgs[1]))
                            }
                        } else {
                            userInteraction.naptien(message.author.id, processedArgs[1])
                            if (userLanguage == "vi") {
                                let newBalance = parseInt(rtmBalance) + parseInt(processedArgs[1])
                                message.channel.send(vi.napTien(processedArgs[1], newBalance))
                            } else {
                                let newBalance = parseInt(rtmBalance) + parseInt(processedArgs[1])
                                message.channel.send(en.napTien(processedArgs[1], newBalance))
                            }
                        }
                    } else if (!nat(processedArgs[1])) {
                        message.channel.send("You lost money because of entering a float amount of money")
                    }
                });
            }
    }
    // if (message.channel.id == "981847789841547305") {
    //     let args = message.content.split(/\s+/);
    //     let content = args.join(" ") + "\n";
    //     let AllContent = `${message.author.tag} - ${date}/${month} - ${hours}:${minutes} : ${content}`
    //     if (args.length == 2 && args[0].length == 4) {
    //         fs.writeFile('F:/coding/gt-autoclick/worldlist.txt', content, { flag: 'a' }, err => {console.log(err)});
    //         fs.writeFile('F:/coding/gt-autoclick/Allworldlist.txt', AllContent, { flag: 'a' }, err => {console.log(err)});
    //         message.delete()
    //     }
    // }
    if (message.content.startsWith("pg")) {
        var unixTime = Math.floor(Date.now());
        var lastUserCommand = timeout.get(message.author.id);
        let userLanguage = await userInteraction.getLanguage(message.author.id);


        if (unixTime - lastUserCommand <= 5000) {
            if (userLanguage == "vi") {
                message.reply(vi.timeout(lastUserCommand, unixTime));
            } else {
                message.reply(en.timeout(lastUserCommand, unixTime));
            }
        } else {
            timeout.set(message.author.id, unixTime);
            if (userLanguage == "vi") {
                message.reply(`Vui lòng sử dụng lệnh bắt đầu bằng "/" (slash commands)\nLệnh bắt đầu bằng "pg" sẽ không hoạt động do bị trùng với <@916225084698550314>`);
            } else {
                message.reply(`Please use slash commands\n Command starts with "pg" will not work because of conflict with <@916225084698550314>`);
            }
        }
    } // cuoi check timeout
    if (message.content == "balance" && message.author.id == "744091948985614447") {
        message.channel.send("rtm.balance")
    }

    if (message.content.startsWith("give") && message.author.id == "744091948985614447") {
        let args = message.content.split(/\s+/)
        args.shift()
        message.channel.send("rtm.send " + args[0] + " <@744091948985614447>")
    }

    if (message.channel.type == 'DM' && message.author.id == 744091948985614447) {
        let userLanguage = await userInteraction.getLanguage(message.author.id);
        let args = message.content.split(/\s+/);
        // 1. id
        // 2. so luong
        // 3. dia chi
        // 4. tx id
        if (args.length != 4) {
            message.reply("require more args\nid\nso luong\ndia chi\ntx id")
        } else {
            target = await client.users.fetch(args[0]);
            const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('TX Link')
					.setStyle('LINK')
                    .setURL("https://explorer.raptoreum.com/tx/" + args[3])
		    )
            if (userLanguage == "vi") {
                target.send({ embeds: [vi.withdrawDM(args[1], args[2], args[3])], components: [row] });
            } else {
                target.send({ embeds: [en.withdrawDM(args[1], args[2], args[3])], components: [row] });
            }
        }
    }
});

//discord.js interaction handle
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        console.time("lang")
        var userLanguage = await userInteraction.getLanguage(interaction.user.id)
        console.timeEnd("lang")
        switch (interaction.commandName) {
            case "balance":
                if (await userInteraction.getBalance(interaction.user.id) == null) {
                    interaction.reply(`Account not found\nYou can create account by using: ${bold("rtm.send <@965473856628342814> <amount>")}`)
                } else if (interaction.options.getUser("user") == null) {
                    if (userLanguage == "vi") {
                        interaction.reply({ content: vi.balance(await userInteraction.getBalance(interaction.user.id)), ephemeral: false })
                    } else {
                        interaction.reply({ content: en.balance(await userInteraction.getBalance(interaction.user.id)), ephemeral: false })
                }
            } else {
                let user = interaction.options.getUser("user");
                if (await userInteraction.getBalance(user.id) == null) {
                    interaction.reply(`Account not found\nYou can create account by using: ${bold("rtm.send <@965473856628342814> <amount>")}`)
                } else {
                    if (userLanguage == "vi") {
                        interaction.reply({ content: vi.otherUserBalance(user.id, await userInteraction.getBalance(user.id)), ephemeral: true })
                    } else {
                        interaction.reply({ content: en.otherUserBalance(user.id, await userInteraction.getBalance(user.id)), ephemeral: true })
                    }
                }
            }
            break;

            case "bet":
                var unixTime = Math.floor(Date.now());
                var lastUserCommand = timeout.get(interaction.user.id);


            if (unixTime - lastUserCommand <= 4000) {
                if (userLanguage == "vi") {
                    interaction.reply(vi.timeout(lastUserCommand, unixTime));
                } else {
                    interaction.reply(en.timeout(lastUserCommand, unixTime));
                }
            } else {
                const userBalance = parseInt(await userInteraction.getBalance(interaction.user.id))
                let betAmount = interaction.options.getInteger("amount")
                if (betAmount > userBalance) {
                    if (userLanguage == "vi") {
                            interaction.reply(vi.balanceNotEnough(userBalance))
                        } else {
                            interaction.reply(en.balanceNotEnough(userBalance))
                        }
                }  else {
                    timeout.set(interaction.user.id, unixTime);
                    let choice = interaction.options.getString("choice")
                    redis.HINCRBY(interaction.user.id, "totalBet", betAmount)
                    let dice = await rollSession.rollDice();
                    let round = await redis.GET("round");
                    redis.INCRBY("round", 1)

                    console.log(interaction.user.tag)
                    console.log(dice)
                    if (userLanguage == "vi") {
                        var diceEmbed = await vi.diceEmbed(dice, round, betAmount, interaction.user.id, choice, interaction.user.avatarURL())
                    } else {
                        var diceEmbed = await en.diceEmbed(dice, round, betAmount, interaction.user.id, choice, interaction.user.avatarURL())
                    }
                    interaction.reply({ embeds: [diceEmbed] })

                    if (interaction.options.getString("choice") == "chan" || interaction.options.getString("choice") == "le") {
                        var result = rollSession.calculateResultCL(dice)
                    } else if (interaction.options.getString("choice") == "tai" || interaction.options.getString("choice") == "xiu") {
                        var result = rollSession.calculateResult(dice)
                    }

                    setTimeout(() => {
                        if (choice == result) {
                            redis.HINCRBY(interaction.user.id, "rtmBalance", betAmount)
                            redis.HINCRBY(interaction.user.id, "totalWinning", betAmount)
                            redis.HINCRBY(interaction.user.id, "exp", betAmount * 2)
                            redis.HINCRBYFLOAT(interaction.user.id, "coinBalance", betAmount)
                            if (userLanguage == "vi") {
                                let embed = vi.betEmbed(interaction.user.id, result, "win", betAmount, userBalance + betAmount, interaction.user.avatarURL())
                                interaction.editReply({ embeds: [embed] })
                            } else {
                                let embed = en.betEmbed(interaction.user.id, result, "win", betAmount, userBalance + betAmount, interaction.user.avatarURL())
                                interaction.editReply({ embeds: [embed] })
                            }
                        } else {
                            redis.HINCRBY(interaction.user.id, "rtmBalance", betAmount * -1)
                            redis.HINCRBY(interaction.user.id, "totalWinning", betAmount * -1)
                            redis.HINCRBYFLOAT(interaction.user.id, "exp", betAmount)
                            if (userLanguage == "vi") {
                                let embed = vi.betEmbed(interaction.user.id, result, "lose", betAmount, userBalance - betAmount, interaction.user.avatarURL()) 
                                interaction.editReply({ embeds: [embed] })
                            } else  {
                                let embed = en.betEmbed(interaction.user.id, result, "lose", betAmount, userBalance - betAmount, interaction.user.avatarURL())
                                interaction.editReply({ embeds: [embed] })
                            }
                        }
                    }, 5000);
                }}
                break;
            case "settings":
                if (interaction.options.getSubcommand() == "language") {
                    let newLanguage = interaction.options.getString("language")
                        if (newLanguage == "vi") {
                            userInteraction.setLanguage(interaction.user.id, "vi")
                            interaction.reply("Ngôn ngữ đã được thay đổi thành tiếng Việt")
                        } else if (newLanguage == "en") {
                            userInteraction.setLanguage(interaction.user.id, "en")
                            interaction.reply("Language has been changed to English")
                        }
                } else if (interaction.options.getSubcommand() == "withdrawaddress") {
                    let address = interaction.options.getString("address")
                    console.log(address)
                    redis.HSET(interaction.user.id, "RTMwithdrawAddress", address)
                    if (userLanguage == "vi") {
                        interaction.reply(vi.withdrawAddressChange(address))
                    } else {
                        interaction.reply(en.withdrawAddressChange(address))
                }
                break;
            }

            case "withdraw":
                let withdrawAddress = await redis.HGET(interaction.user.id, "RTMwithdrawAddress")
                let balance = await userInteraction.getBalance(interaction.user.id)
                if (withdrawAddress == null) {
                    if (userLanguage == "vi") {
                        interaction.reply("Vui lòng thêm địa chỉ rút tiền của bạn bằng cách sử dụng lệnh `/settings withdrawaddress`")
                    } else {
                        interaction.reply("Please add your withdraw address by using the command `/settings withdrawaddress`")
                    }
                } else {
                    let amount = interaction.options.getInteger("amount")
                    if (parseInt(amount) > balance) {
                        if (userLanguage == "vi") {
                            interaction.reply(vi.balanceNotEnough(balance))
                        } else {
                            interaction.reply(en.balanceNotEnough(balance))
                        }
                    } else if (parseInt(amount) == 0) {
                        if (userLanguage == "vi") {
                            interaction.reply("Bạn đã nhập số lượng không hợp lệ")
                        } else {
                            interaction.reply("You have entered an invalid amount")
                        }
                    } else if (parseInt(amount) <= balance) {
                        if (userLanguage == "vi") {
                            interaction.reply({ embeds: [vi.withdrawConfirmation(amount, withdrawAddress)], components: [vi.withdrawConfirmationButton()]})
                        } else {
                            interaction.reply({ embeds: [en.withdrawConfirmation(amount, withdrawAddress)], components: [en.withdrawConfirmationButton()]})
                        }
                        const owner = await client.users.fetch('744091948985614447');

                        let filter = (ButtonInteraction) => {
                            return interaction.user.id == ButtonInteraction.user.id
                        }

                        let collector = interaction.channel.createMessageComponentCollector({filter, max: 1, time: 60000})

                        collector.on('end', (collection) => {
                            collection.forEach((click) => {
                                console.log(click.user.id, click.customId)
                            })
                            if (collection.size == 0) {
                                if (userLanguage == "vi") {
                                    interaction.editReply({ components: [], embeds: [vi.withdrawCancelled()] })
                                } else {
                                    interaction.editReply({ components: [], embeds: [en.withdrawCancelled()] })
                                }
                            }

                            if (collection.first()?.customId == "confirm") {
                                owner.send(`${interaction.user.tag}\n${interaction.user.id}\n${withdrawAddress}\n${amount}`)
                                redis.HINCRBY(interaction.user.id, "rtmBalance", amount * -1)
                                if (userLanguage == "vi") {
                                    interaction.editReply({ components: [], embeds: [vi.withdrawConfirmed(amount, withdrawAddress)] })
                                } else {
                                    interaction.editReply({ components: [], embeds: [en.withdrawConfirmed(amount, withdrawAddress)] })
                                }
                            } else if (collection.first()?.customId == "cancel") {
                                if (userLanguage == "vi") {
                                    interaction.editReply({ components: [], embeds: [vi.withdrawCancelled()] })
                                } else {
                                    interaction.editReply({ components: [], embeds: [en.withdrawCancelled()] })
                                }
                            }
                        })
                    }
                }
                break;
        }
    }
})
