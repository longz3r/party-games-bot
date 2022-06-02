// basic shit
const config = require('./config.json');
const { Client, Intents, BaseGuildEmojiManager } = require('discord.js');
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
] });
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
    await redis.connect()
    client.user.setActivity("slash commands available", { type: "WATCHING" });
})

redis.on('error', (err) => console.log('Redis Client Error', err));

//import function
const userInteraction = require('./functions/userInteraction.js');
const vi = require('./languages/vietnamese.js');
const en = require('./languages/english.js');
const rollSession = require("./functions/rollSession.js");

//checking shit
var timeout = new Map
function nat(n) {
    return n >= 0 && Math.floor(n) === +n;
}

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("rtm.send")) {
            var userLanguage = await userInteraction.getLanguage(message.author.id);
            let args = message.content.split(/\s+/);
            args.shift();
            //args processing
            var processedArgs = []
            if (args[0] == "<@965473856628342814>") {
                processedArgs[0] = "<@965473856628342814>"
                processedArgs[1] = args[1]
            } else if (args[1] == "<@965473856628342814>") {
                processedArgs[0] = "<@965473856628342814>"
                processedArgs[1] = args[0]
            }

            if (processedArgs[0] == "<@965473856628342814>" || processedArgs[0] == "<@954355946065375242>") {
                let rtmBalance = await userInteraction.getBalance(message.author.id);
                const filter = (reaction, user) => user.id === '916225084698550314';
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
    if (message.channel.id == "981847789841547305") {
        let args = message.content.split(/\s+/);
        content = args.join(" ");
        if (args.length == 2 && args[0].length == 4) {
            fs.writeFile('F:/coding/gt-autoclick/worldlist.txt', content, { flag: 'a' }, err => {console.log(err)});
            fs.writeFile('F:/coding/gt-autoclick/worldlist.txt', "\n", { flag: 'a' }, err => {console.log(err)});
            message.delete()
        }
    }
    if (message.content.startsWith("pg")) {
        var unixTime = Math.floor(Date.now());
        var lastUserCommand = timeout.get(message.author.id);
        var userLanguage = await userInteraction.getLanguage(message.author.id);


        if (unixTime - lastUserCommand <= 5000) {
            if (userLanguage == "vi") {
                message.reply(vi.timeout(lastUserCommand, unixTime));
            } else {
                message.reply(en.timeout(lastUserCommand, unixTime));
            }
        } else {
            timeout.set(message.author.id, unixTime);
            if (userLanguage == "vi") {
                message.reply(`Vui lòng sử dụng lệnh bắt đầu bằng "/" (slash commands)\nLệnh bắt đầu bằng "pg" sẽ không hoạt động do bị trùng với bot khác`);
            } else {
                message.reply(`Please use slash commands\n Command starts with "pg" will not work because of conflict with other bots`);
            }
        }
    } // cuoi check timeout
    if (message.content == "admin bot balance" && message.author.id == "744091948985614447") {
        message.channel.send("rtm.balance")
    }
});

//discord.js interaction handle
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    var userLanguage = await userInteraction.getLanguage(interaction.user.id)
    console.log(interaction.commandName)
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
            }
            break;
    }
})
