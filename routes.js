const express = require('express')
const router = express.Router();

const utils = require('./utils/utils');

// for testing only
router.get('/', (req, res) => {
    res.send('GO CHECK POSTMAN MAN');
});

// for testing only
router.post('/download', (req, res) => {
    const reqData = req.body;
    console.log('reqData', reqData);
    const output = utils.addTextAndDownloadImg(reqData.subDomain);
    res.send({
        'result': output + ' file generated'
    });
})

// upload to aws s3 server
router.post('/upload', (req, res) => {
    const subDomain = req.query.domain;
    console.log('param:', subDomain);
    utils.addTextAndUpload(subDomain)
        .then(result => {
            res.send({
                'result': result
            })
        })
        .catch(err => {
            console.log('Error: ', err)
        })
})

module.exports = router;