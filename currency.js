
function formatColombianPesos(amount = 0) {
    console.log(amount);
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount).replace(',00','');    
}

module.exports = { formatColombianPesos };