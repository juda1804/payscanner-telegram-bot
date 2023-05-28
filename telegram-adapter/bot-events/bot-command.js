const { formatColombianPesos } = require("../../currency");
const apiService = require('../../paymentService');

const commands = [
  {
    name: "peticion", //ejemplo
    handler: (ctx) => {
      ctx.reply("Por favor, ingrese la compra ID:");
      ctx.session.step = 1;
    },
  },
  {
    name: "resumen", //ejemplo
    handler: (ctx) => {
      const value = formatColombianPesos(ctx.session.valor);
      ctx.reply(`
              Usted ha registrado el siguiente producto.
              id:             ${ctx.session.compraId}
              Detalle:    ${ctx.session.descripcion}
              valor:        ${value}
              `);
    },
  },

  // Add more actions as needed
];


module.exports = commands;