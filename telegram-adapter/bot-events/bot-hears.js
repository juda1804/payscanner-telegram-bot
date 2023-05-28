const hears = [
  {
    name: "hello",
    handler: async (ctx) => {
      await ctx.reply("Hello there!");
    },
  },
  {
    name: "bye",
    handler: async (ctx) => {
      await ctx.reply("Goodbye!");
    },
  },
  {
    name: "computer",
    handler: async (ctx) => {
      await ctx.reply("Hey I am selling coputer");
    },
  },
  {
    name: "opciones",
    handler: (ctx) => {
      ctx.reply("Por favor, selecciona una opción:", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Opción 1", callback_data: "option1" },
              { text: "Opción 2", callback_data: "option2" },
              { text: "Opción 3", callback_data: "option3" },
              { text: "Cancelar", callback_data: "cancelar" },
            ],
          ],
          resize_keyboard: true,
        },
      });
    },
  },

  // Add more actions as needed
];

module.exports = hears;