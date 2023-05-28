const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const LocalSession = require("telegraf-session-local");
const commands = require("./telegram-adapter/bot-events/bot-command");
const hears  = require("./telegram-adapter/bot-events/bot-hears");
const actions  = require("./telegram-adapter/bot-events/bot-actions");
const botService = require("./telegram-adapter/service/botService")
const consume = require('./rabbitmq');

//bot api use the api key
const bot = new Telegraf("6164948105:AAHyQxNrSywSPFCpltrTC5rPDA1cy8USJKQ");

const localSession = new LocalSession({ database: "session_db.json" });

bot.use(localSession.middleware());

//Set the bot with the info
commands.forEach((command) => {
  bot.command(command.name, command.handler);
});

hears.forEach((command) => {
  bot.hears(command.name, command.handler);
});

actions.forEach(command => {
  bot.action(command.name, command.handler);
})

//override default commnads
bot.start((ctx) => {
  ctx.reply(`Welcome ${ctx.from.first_name}`);
});

bot.settings((ctx) => ctx.reply("Settings"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on(message("sticker"), (ctx) => {
  console.log("message", ctx.message);
  ctx.reply("👍");
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});


//botService(bot,"6225750157:6225750157", "Hola desde el Bot Service!" );

bot.launch();

consume(bot);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
