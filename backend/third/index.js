const express = require('express');
const bodyParser = require('body-parser')
const fetch = require('node-fetch');
const app = express();
const port = 3000;
const extUrl = 'https://jsonplaceholder.typicode.com';

app.use(bodyParser.json());

app.get('/api/todos', async (req, res) => {
    const todos = await fetch(`${extUrl}/todos`, {
        method: "GET"
    })
    .then(async data => await data.json())
    .catch(error => {
        return next(error)
    });
    res.json({
        todos
    });
});

app.get('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const todos = await fetch(`${extUrl}/todos/${id}`, {
        method: "GET"
    })
    .then(async data => await data.json())
    .catch(error => {
        return next(error)
    });
    res.json({
        todos
    });
});


app.listen(port, () => {
    console.log('server started on port: ' + port);
});