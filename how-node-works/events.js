// This script demonstrates *events in practice* using the EventEmitter class and an HTTP server. 

// Importing necessary modules.
const EventEmitter = require('events');
const http = require('http');

// A 'Sales' class extends EventEmitter to handle 'newSale' events and manage stock levels.
// Defining a Sales class that manages stock and sales events.
class Sales extends EventEmitter {
  constructor(initialStock) {
    super();
    this.stock = initialStock;
  }

  // Method to handle new sales.
  newSale(customerName) {
    this.stock -= 1;
    console.log(`Sale for ${customerName}`);
    this.emit('newSale', customerName, this.stock);
  }
}

// Creating an instance of Sales with initial stock.
const myEmitter = new Sales(10);

// Event listener for a new sale.
myEmitter.on('newSale', (customerName, remainingStock) => {
  console.log(`There was a new sale for ${customerName}!`);
  console.log(`Remaining Stock: ${remainingStock}`);
});

// Function to handle HTTP requests.
const requestHandler = (req, res) => {
  const { url } = req;
  console.log(`Request received for ${url}`);

  if (url === '/new-sale') {
    myEmitter.newSale('John Doe');
    res.end('New sale processed');
  } else {
    res.end('Request received');
  }
};

// Creating an HTTP server.
const server = http.createServer(requestHandler);

// Event listener for server 'close' event.
server.on('close', () => console.log('Server closed'));

// Server is set up to listen on port 8000.
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
