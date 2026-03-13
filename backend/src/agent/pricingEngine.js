function calculatePrice(cost) {

  const costNum = parseFloat(cost);

  let sellPrice;

  if (costNum <= 5) {
    sellPrice = costNum * 3.5;
  } else if (costNum <= 10) {
    sellPrice = costNum * 3;
  } else if (costNum <= 20) {
    sellPrice = costNum * 2.5;
  } else {
    sellPrice = costNum * 2.2;
  }

  // psychological pricing
  sellPrice = Math.ceil(sellPrice) - 0.01;

  const comparePrice = (sellPrice * 1.4).toFixed(2);

  return {
    price: sellPrice.toFixed(2),
    compare_at_price: comparePrice
  };
}

module.exports = { calculatePrice };