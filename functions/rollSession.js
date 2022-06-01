const { bold, italic, strikethrough, underscore, spoiler, quote, blockQuote } = require('@discordjs/builders');

function rollDice() {
    return parseInt(Math.floor(Math.random() * 6)) + 1;
}

function bet() {

}

async function rollDice() {
    let dice = []
    dice[0] = parseInt(Math.floor(Math.random() * 6)) + 1;
    dice[1] = parseInt(Math.floor(Math.random() * 6)) + 1;
    dice[2] = parseInt(Math.floor(Math.random() * 6)) + 1;
    return dice;
}

function calculateResult(dice) {
    let total = dice[0] + dice[1] + dice[2]
    let result = null
    if (total >= 3 && total <= 10) {
        result = "xiu"
    } else if (total >= 11 && total <= 18) {
        result = "tai"
    }
    return result;
}

function calculateResultCL(dice) {
    let total = dice[0] + dice[1] + dice[2]
    let result = null
    if (total % 2 == 0) {
        result = "chan"
    } else {
        result = "le"
    }
    return result;
}

module.exports = { rollDice, calculateResult, calculateResultCL }