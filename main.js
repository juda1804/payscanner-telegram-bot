const { configureBot } = require('./telegram-adapter/service/botService');
const consume = require('./telegram-adapter/service/rabbitmq');

const botToken = '6164948105:AAHyQxNrSywSPFCpltrTC5rPDA1cy8USJKQ';

// Configurar el bot
const bot = configureBot(botToken);

consume(bot);

// Iniciar el bot
bot.launch();