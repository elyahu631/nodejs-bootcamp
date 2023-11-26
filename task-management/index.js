// index.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Initial tasks array
const tasks = [];

// Routes
app.get('/', (req, res) => {
    res.render('index', { tasks });
});

app.post('/add', (req, res) => {
    const { task } = req.body;
    tasks.push(task);
    res.redirect('/');
});

app.get('/delete/:task', (req, res) => {
    const { task } = req.params;
    const index = tasks.indexOf(task);
    if (index !== -1) {
        tasks.splice(index, 1);
    }
    res.redirect('/');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
