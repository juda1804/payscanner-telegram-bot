const sendDirectMessage = async (bot, chatId, message) => {
    try {
      await bot.telegram.sendMessage(chatId, message);
      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

module.exports = sendDirectMessage;