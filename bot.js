require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const chatId = process.env.CHAT_ID; 


const schedule = {
    monday: ["Data Concepts - (5.00 to 6.30)", "Web Programming - (6.30 to 9.30)"],
    tuesday: ["No Class Day !"],
    wednesday: ["Data Structures - (5.00 to 6.30)", "Operating System Concepts - (6.30 to 9.30)"],
    thursday: ["Introduction to Data - (5.00 to 7.00)", "UI/UX - (6.30 to 9.30)"],
    friday: ["Off Day !"],
    saturday: ["No Class Day !"],
    sunday: ["Operating System Concepts - (6.30 to 9.30)"],
};

bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.toLowerCase();

    if (schedule[text]) {
        bot.sendMessage(chatId, `📅 *${text.toUpperCase()}*:\n${schedule[text].join("\n")}`, { parse_mode: "Markdown" });
    } else {
        bot.sendMessage(chatId, "Please send a valid day name (e.g., Monday, Tuesday...).");
    }
});

// Function to calculate time until next midnight
function getMillisecondsUntilMidnight() {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0); 
    return nextMidnight - now;
}

// Function to send a daily notification
function sendDailyNotification() {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const message = `🌙 Midnight Check-in!\nToday is *${today.toUpperCase()}*\n\n${schedule[today].join("\n")}`;

    bot.sendMessage(chatId, message, { parse_mode: "Markdown" });

    setTimeout(sendDailyNotification, 24 * 60 * 60 * 1000);
}

setTimeout(sendDailyNotification, getMillisecondsUntilMidnight());

console.log("Bot is running...");
