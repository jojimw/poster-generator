require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);

const router = require('./routes');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

server.listen(port, "0.0.0.0", () => {
    console.log('App running at port 3001 !!');
});