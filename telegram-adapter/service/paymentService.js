const fetch = require("node-fetch");

const buildMessage = (message) => {
  return `Has realizado una nueva transaccion
  Aqui tienes mas detalles:
  ID: ${message.id}
  DETALLE: 
  ${message.description}.
      
Si deseas agregar una descripcion adicional realiza la siguiente accion
  
    /trackPayment 
    `;
};

const buildLastMessage = (message) => {
  return `Ultima transaccion registrada:
  ID: ${message.id}
  DETALLE: 
  ${message.description}.
  DETAILS:
  ${message.details}
    `;
};

async function getPaymentInfo(id) {
  try {
    console.log("trying to get payment info")
    const response = await fetch(`http://localhost:8083/payment/${id}`);
    const paymentInfo = await response.json();
    return paymentInfo;
  } catch (error) {
    console.error("Error al obtener la información del pago:", error);
    throw error;
  }
}

async function confirmPaymentDescription(payment) {
  try {
    await fetch("http://localhost:8083/payment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
  } catch (error) {
    console.error("Error al confirmar el detalle del pago:", error);
    throw error;
  }
}

module.exports = {
  getPaymentInfo,
  confirmPaymentDescription,
  buildMessage,
  buildLastMessage
};
