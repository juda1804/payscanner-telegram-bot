const amqp = require('amqplib');
const { buildMessage } = require("./paymentService");

const rabbitmqConfig = {
  host: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
  virtualHost: 'juda-host'
};

async function consume(bot, chatId = "6225750157:6225750157") {
  try {
    const connection = await amqp.connect({
      protocol: 'amqp',
      hostname: rabbitmqConfig.host,
      port: rabbitmqConfig.port,
      username: rabbitmqConfig.username,
      password: rabbitmqConfig.password,
      vhost: rabbitmqConfig.virtualHost
    });

    const channel = await connection.createChannel();

    await channel.assertQueue('payment-created', { durable: true });

    console.log("Esperando por mensajes en la cola 'payment-created'...");

    while (true) {
      const msg = await channel.consume('payment-created', (msg) => {
        console.log(msg.content.toString());
        try {
            const payment = JSON.parse(msg.content.toString());
            console.log(`id: ${payment.id}, price: ${payment.price}`);
            bot.telegram.sendMessage(chatId, buildMessage(payment));
            channel.ack(msg);
        } catch (ex) {
            
            console.log("ERRR!", ex)
        }
        
      }, { noAck: false });

      if (!msg) {
        await new Promise(resolve => setTimeout(resolve, 50000));
      }
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = consume;
