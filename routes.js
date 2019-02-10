const express = require('express')
const router = express.Router();

const utils = require('./utils/utils');
const logger = require('./utils/logger');

// for testing only
router.get('/', (req, res) => {
    res.send('SERVER RUNNIG :)');
});

// for testing only
router.post('/download', (req, res) => {
    logger.logInfo.info('[from routes.js] post(/download)\nRequest received');
    logger.logDebug.debug('[from routes.js] post(/download)\nRequest query param:', req.query);
    const subDomain = req.query.domain;
    if(subDomain) {
        const output = utils.addTextAndDownloadImg(subDomain);
        logger.logDebug.debug('[from routes.js] post(/download)\nFile Output:', output);
        res.send({
            'result': output + ' file generated'
        });
    }
    else {
        logger.logError.error('[from routes.js] post(/download)\nInvalid query param');
        res.status(500).send('Invalid query param');
    }
})

// upload to aws s3 bucket
router.post('/upload', (req, res) => {
    logger.logInfo.info('[from routes.js] post(/upload)\nRequest received');
    logger.logDebug.debug('[from routes.js] post(/upload)\nRequest Query:', req.query);
    const subDomain = req.query.domain;
    if(subDomain) {
        utils.addTextAndUpload(subDomain)
            .then(result => {
                logger.logDebug.debug('[from routes.js] post(/upload)\nResult:', result); 
                res.send({
                    'result': result
                })
            })
            .catch(err => {
                logger.logError.error('[from routes.js] post(/upload)\n', err);
                res.status(500).send(err);
            })
    }
    else {
        logger.logError.error('[from routes.js] post(/upload)\nInvalid query param');
        res.status(500).send('Invalid query param');
    }
})

module.exports = router;