function generateLanding(product) {

  const title = product.title;
  const desc = product.description;

  return `
  <h2>${title}</h2>

  <p>${desc}</p>

  <h3>Why Pet Owners Love It</h3>
  <ul>
    <li>Easy to use</li>
    <li>Safe for pets</li>
    <li>Durable design</li>
    <li>Perfect for daily use</li>
  </ul>

  <h3>How It Works</h3>
  <p>Simply use the product as intended and enjoy a cleaner, happier pet lifestyle.</p>

  <h3>Perfect For</h3>
  <p>Dog owners, cat owners, grooming routines and daily pet care.</p>

  <h3>FAQs</h3>

  <p><b>Is it safe for pets?</b><br>
  Yes, it is designed specifically for safe pet use.</p>

  <p><b>Does it work for all breeds?</b><br>
  Yes, it works for both small and large pets.</p>

  <p><b>How long does it last?</b><br>
  Built with durable materials for long term usage.</p>

  `;
}

module.exports = { generateLanding };