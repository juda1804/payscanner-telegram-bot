const { Telegraf } = require("telegraf");
const apiService = require("./paymentService");
const LocalSession = require("telegraf-session-local");

function configureBot(token) {
  const bot = new Telegraf(token);
  const localSession = new LocalSession({ database: "session_db.json" });
  bot.use(localSession.middleware());

  bot.command("trackPayment", async (ctx) => {
    // Solicitar el ID de la transacción
    await ctx.reply("Por favor, ingresa el ID de la transacción:");
  });

  bot.on("text", async (ctx) => {
    const message = ctx.message.text;
    console.log(message);
    console.log(ctx.session);
    if (ctx.session && !ctx.session.paymentId) {
      try {
        // Realizar una llamada a la API para obtener la información del pago
        console.log("Querying to payment service for payment id", message)
        const paymentInfo = await apiService.getPaymentInfo(message);
        // Guardar el ID en la sesión
        ctx.session.paymentId = message;
        ctx.session.paymentInfo = paymentInfo
        // Solicitar el detalle del pago
        await ctx.reply("Por favor, ingresa el detalle del pago:");
      } catch (error) {
        console.error("Error al rastrear el pago:", error);
        await ctx.reply(
          "Ocurrió un error al rastrear el pago. Por favor, inténtalo nuevamente más tarde."
        );
      }
    } else if (ctx.session && !ctx.session.description){
        ctx.session.description = message;
        const paymentId = ctx.session.paymentId;
        const payment = ctx.session.paymentInfo

        const paymentUpdated = {
            ...payment,
            details: message
        }

        console.log("Payment to update", paymentUpdated)
      try {
        // Realizar una llamada a la API para confirmar el detalle del pago
        await apiService.confirmPaymentDescription(paymentUpdated);
        // Confirmar que la transacción se realizó correctamente
        await ctx.reply("La transacción se realizó correctamente.");
      } catch (error) {
        console.error("Error al confirmar el detalle del pago:", error);
        await ctx.reply(
          "Ocurrió un error al confirmar el detalle del pago. Por favor, inténtalo nuevamente más tarde."
        );
      }
    }
  });

  return bot;
}

module.exports = {
  configureBot,
};
