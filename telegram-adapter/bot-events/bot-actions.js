const actions = [
  {
    name: "option1",
    handler: (ctx) => {
      ctx.reply("Has seleccionado la opción 1");
    },
  },
  {
    name: "option2",
    handler: (ctx) => {
      ctx.reply("Has seleccionado la opción 2");
    },
  },
];

module.exports = actions;