require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);

const router = require('./routes');
const logger = require('./utils/logger');
const ip = process.env.IP_ADDRESS;
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

server.listen(port, ip, () => {
    logger.logInfo.info(`[from index.js] Server running at ${ip}:${port}`);
    logger.logAccess.info(`[from index.js] Server running at ${ip}:${port}`);
    logger.logDebug.debug(`[from index.js] Server running at ${ip}:${port}`);
});