const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "1753174713:AAHgSG9ZWqoz56_wvMWpEFMA0epdmE7aeV4";

const bot = new TelegramApi(token, { polling: true });
const chats = {};



const startGame = async (chatId) => {
	await bot.sendMessage(chatId, "Загадай число от 0 до 9")
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, "Отгадай", gameOptions)
}



const start = () => {
	bot.setMyCommands([
		{ command: "/start", description: "Начальное приветствие" },
		{ command: "/info", description: "Тебя зовут" },
		{ command: "/game", description: "Игра угадай число " },
	]);

	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === "/start") {
			await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp")
			return bot.sendMessage(chatId, `Привет, я телеграм бот BrolTVbot`)
		}

		if (text === "/game") {
			return startGame(chatId);
		}

		if (text === "/info") {
			return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
		}

		return bot.sendMessage(chatId, "Я тебя непонимаю.")
	});

	bot.on("callback_query", async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;

		if (data === "/again") {
			return startGame(chatId);
		}

		if (data === chats[chatId]) {
			return bot.sendMessage(chatId, `Поздавляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
		} else {
			return bot.sendMessage(chatId, `Ты не отгадал, бот загадал цифру ${chats[chatId]}`, againOptions)
		}

	});
}

start();