console.log("📦 ProductScanner module loaded");

async function scan() {

console.log("🔍 Product scan running...");

const products = [
{
title: "Smart Pet Hair Remover",
description: "Reusable pet hair remover for sofa, carpet and clothes.",
price: "19.99",
images: [
"https://m.media-amazon.com/images/I/71hKQqv2qXL._AC_SL1500_.jpg"
]
},
{
title: "LED Dog Collar",
description: "Rechargeable glowing dog collar for night safety.",
price: "14.99",
images: [
"https://m.media-amazon.com/images/I/61Z9ZzF9EJL._AC_SL1000_.jpg"
]
},
{
title: "Automatic Pet Water Fountain",
description: "Smart water fountain for cats and dogs with filtration.",
price: "29.99",
images: [
"https://m.media-amazon.com/images/I/61K8F6H6yQL._AC_SL1200_.jpg"
]
}
];

return products;

}

module.exports = {
scan
};
