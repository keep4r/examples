const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

app.use(bodyParser.json());
const generateRandomIntegerBetween = (min, max) => {
    return Math.floor(Math.random() * (max-min) + min);
}
app.post('/api/data', (req, res) => {
    let {command, x} = req.body;
    const random = generateRandomIntegerBetween(1, 6);
    const shutdown = command === 'shutdown';
    res.json({
        x,
        a: random
    });
    if(shutdown) process.exit(2);
});

app.listen(port, () => {
    console.log('server started on port: ' + port);
});