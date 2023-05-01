const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const LocalSession = require('telegraf-session-local');
const { formatColombianPesos } = require('./currency');

//bot api use the api key
const bot = new Telegraf('6164948105:AAHyQxNrSywSPFCpltrTC5rPDA1cy8USJKQ');


const localSession = new LocalSession({ database: 'session_db.json' });

bot.use(localSession.middleware());

//override default commnads
bot.start((ctx) =>  {
    ctx.reply(`Welcome ${ctx.from.first_name}`)
});

bot.settings((ctx) => ctx.reply('Settings'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => {
    console.log("message",ctx.message)
    ctx.reply('👍')
});

//hear user input
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.hears('computer', ctx => {
    ctx.reply('Hey I am selling coputer');
})

bot.command('peticion', (ctx) => {
    ctx.reply('Por favor, ingrese la compra ID:');
    ctx.session.step = 1;
  });

  bot.command('resumen', (ctx) => {
    const value = formatColombianPesos(ctx.session.valor)
    ctx.reply(`
    Usted ha registrado el siguiente producto.
    id:             ${ctx.session.compraId}
    Detalle:    ${ctx.session.descripcion}
    valor:        ${value}
    `);
  });
  
  bot.on('message', (ctx) => {
    const { step } = ctx.session;
    if (step === 1) {
      ctx.session.compraId = ctx.message.text;
      ctx.reply(`Por favor, confirme que el ID de compra es ${ctx.session.compraId} escribiendo "Si" o "No".`);
      ctx.session.step = 2;
    } else if (step === 2) {
      const confirmacion = ctx.message.text.toLowerCase();
      if (confirmacion === 'si') {
        ctx.reply('Por favor, ingrese el valor de la compra:');
        ctx.session.step = 3;
      } else if (confirmacion === 'no') {
        ctx.reply('¿Qué dato desea modificar? (Ingrese "ID", "valor" o "descripcion")');
        ctx.session.step = 1;
      } else {
        ctx.reply('Por favor, confirme que el ID de compra es correcto escribiendo "Si" o "No".');
      }
    } else if (step === 3) {
      ctx.session.valor = ctx.message.text;
      ctx.reply(`Por favor, confirme que el valor de la compra es ${ctx.session.valor} escribiendo "Si" o "No".`);
      ctx.session.step = 4;
    } else if (step === 4) {
      const confirmacion = ctx.message.text.toLowerCase();
      if (confirmacion === 'si') {
        ctx.reply('Por favor, ingrese la descripción de la compra:');
        ctx.session.step = 5;
      } else if (confirmacion === 'no') {
        ctx.reply('¿Qué dato desea modificar? (Ingrese "ID", "valor" o "descripcion")');
        ctx.session.step = 3;
      } else {
        ctx.reply(`Por favor, confirme que el valor de la compra es ${ctx.session.valor} escribiendo "Si" o "No".`);
      }
    } else if (step === 5) {
      ctx.session.descripcion = ctx.message.text;
      ctx.reply(`Por favor, confirme que la descripción de la compra es ${ctx.session.descripcion} escribiendo "Si" o "No".`);
      ctx.session.step = 6;
    } else if (step === 6) {
      const confirmacion = ctx.message.text.toLowerCase();
      if (confirmacion === 'si') {
        // Envía la petición HTTP a la API con los datos ingresados
        // Puedes usar la librería 'axios' para hacer la petición
        // Aquí va el código para hacer la petición HTTP
        const value = formatColombianPesos(ctx.session.valor)
        console.log("log value", value)
        ctx.reply(`
        Usted ha registrado el siguiente producto.
        id:             ${ctx.session.compraId}
        Detalle:    ${ctx.session.descripcion}
        valor:       ${value}
        `);
        ctx.session.step = null;
      } else if (confirmacion === 'no') {
        ctx.reply('¿Qué dato desea modificar? (Ingrese "ID", "valor" o "descripcion")');
        ctx.session.step = 5;
      } else {
        ctx.reply(`Por favor, confirme que la descripción de la compra es ${ctx.session.descripcion} escribiendo "Si" o "No".`);
      }
    }
  });

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
  })

bot.telegram.sendMessage('6225750157:6225750157', 'Hola desde el servidor!')

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
