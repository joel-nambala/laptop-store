'use strict';
// Core modules
const fs = require('fs');
const http = require('http');
const url = require('url');

// npm modules

// local modules

// State files
const numberFormat = function (num) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(num);
};

const replaceTemplate = function (temp, product) {
  let output = temp.replaceAll('{%PRODUCTNAME%}', product.productName);
  output = output.replaceAll('{%IMAGE%}', product.image);
  output = output.replaceAll('{%SCREEN%}', product.screen);
  output = output.replaceAll('{%CPU%}', product.cpu);
  output = output.replaceAll('{%PRICE%}', numberFormat(product.price));
  output = output.replaceAll('{%ID%}', product.id);
  output = output.replaceAll('{%RAM%}', product.ram);
  output = output.replaceAll('{%DESCRIPTION%}', product.description);
  output = output.replaceAll('{%STORAGE%}', product.storage);

  return output;
};

const dataJSON = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const data = JSON.parse(dataJSON);

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/laptop.html`,
  'utf-8'
);

// Create server
const server = http.createServer(function (request, response) {
  // Get the route and the query
  const { query, pathname } = url.parse(request.url, true);

  // Home page
  if (pathname === '/') {
    // Write the data to the browser
    response.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = data
      .map(function (el, i, arr) {
        return replaceTemplate(templateCard, el);
      })
      .join('');

    const output = templateOverview.replace('{%PRODUCT_CARD%}', cardsHtml);

    // Display the data to the UI
    response.end(output);

    // API
  } else if (pathname === '/product') {
    // Get the project ID
    const productId = query.id;
    const product = data[productId];
    const output = replaceTemplate(templateProduct, product);
    // Display the products to the UI
    response.end(output);
  } else if (pathname === '/api') {
    // Write the data to the browser
    response.writeHead(200, { 'Content-type': 'application/json' });

    // Display the JSON data to the UI
    response.end(dataJSON);
  } else {
    // Write the data to the browser
    response.writeHead(404, { 'Content-type': 'text/html' });

    // Display the error to the browser
    response.end('<h1>404 - Page not found</h1>');
  }
});

// Listen to the changes in the server
server.listen(8000, '127.0.0.1', function () {
  console.log('Server is running on port 8000');
});
