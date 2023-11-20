// /modules/replaceTemplate.js
const replaceTemplate = (template, product) => {
  const {
    productName,
    image,
    price,
    from,
    nutrients,
    quantity,
    description,
    id,
    organic,
  } = product;

  let output = template
    .replace(/{%PRODUCTNAME%}/g, productName)
    .replace(/{%IMAGE%}/g, image)
    .replace(/{%PRICE%}/g, price)
    .replace(/{%FROM%}/g, from)
    .replace(/{%NUTRIENTS%}/g, nutrients)
    .replace(/{%QUANTITY%}/g, quantity)
    .replace(/{%DESCRIPTION%}/g, description)
    .replace(/{%ID%}/g, id);

  if (!organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }

  return output;
};

module.exports = replaceTemplate;
