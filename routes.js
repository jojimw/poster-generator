const express = require('express')
const router = express.Router();

const utils = require('./utils/utils');
const logger = require('./utils/logger');

// for testing only
router.get('/', (req, res) => {
    res.send('SERVER RUNNING :)');
});

// for testing only
router.post('/download', (req, res) => {
    logger.logInfo.info('[from routes.js] post(/download)\nRequest received');
    logger.logDebug.debug('[from routes.js] post(/download)\nRequest query param:', req.query);
    const subDomain = req.query.subdomain;
    if(subDomain) {
        utils.addTextAndDownloadImg(subDomain)
            .then(output => {
                logger.logDebug.debug('[from routes.js] post(/download)\nFile Output:', output);
                res.send({
                    'result': output + ' file generated'
                });
            })
            .catch(error => {
                logger.logError.error('[from routes.js] post(/upload)\n', error);
                res.status(400).send({
                    'error': error
                });
            })
    }
    else {
        logger.logError.error('[from routes.js] post(/download)\nInvalid query param');
        res.status(400).send({
            'error': 'Invalid query param'
        });
    }
})

// upload to aws s3 bucket
router.post('/upload', (req, res) => {
    logger.logInfo.info('[from routes.js] post(/upload)\nRequest received');
    logger.logDebug.debug('[from routes.js] post(/upload)\nRequest query param:', req.query);
    const subDomain = req.query.subdomain;
    if(subDomain) {
        utils.addTextAndUpload(subDomain)
            .then(result => {
                logger.logDebug.debug('[from routes.js] post(/upload)\nResult:', result); 
                res.send({
                    'result': result
                })
            })
            .catch(error => {
                logger.logError.error('[from routes.js] post(/upload)\n', error);
                res.status(400).send({
                    'error': error
                });
            })
    }
    else {
        logger.logError.error('[from routes.js] post(/upload)\nInvalid query param');
        res.status(400).send({
            'error': 'Invalid query param'
        });
    }
})

module.exports = router;