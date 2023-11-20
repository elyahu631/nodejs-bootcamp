// index.js
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

// Properly handling file reads with try-catch can prevent the server from crashing
let templateCard, templateOverview, templateProduct, data;
try {
  templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
  templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
  templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
  data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
} catch (err) {
  console.error('Error reading template files', err);
}

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }
  // Product page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  }
  // API endpoint
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  } else {
    // Improved error message
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'X-My-Own-Header': 'hello-world',
    });
    res.end('<h1>404 - Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
