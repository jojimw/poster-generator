const fs = require("fs");
const mime = require('mime');
const gm = require('gm');
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const logger = require('./logger');
const im = gm.subClass({ imageMagick: true });
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();
const inputDir = './templates/template-image.png';
const fontDir = './fonts/Catamaran-Bold.ttf';

// for testing only
const addTextAndDownloadImg = text => {
    try {
        logger.logAccess.info('[from utils/utils.js] addTextAndDownloadImg()\ntext:', text);
        logger.logInfo.info('[from utils/utils.js] addTextAndDownloadImg()\ntext:', text);
        logger.logDebug.debug('[from utils/utils.js] addTextAndDownloadImg()\ntext:', text);
        const fontSize = getFontSizeForText(text);
        const outFile = `${uuidv4()}-${text}.png`;
        im(inputDir)
            .fontSize(fontSize)
            .font(fontDir)
            .out('-gravity', 'center')
            .fill('#fff')
            .drawText(0, 55, text + ".sievehq.com")
            .write(`./${outFile}`, function (err) {
                if(err){
                    logger.logError.error('[from utils/utils.js] addTextAndDownloadImg() im.write()\nError:', err)
                }
                else{
                    logger.logDebug.debug('[from utils/utils.js] addTextAndDownloadImg() im.write()\nFile created')
                }
            });
        return outFile;
    }
    catch (err) {
        logger.logError.error('[from utils/utils.js] addTextAndDownloadImg()\nError:', err);
        throw err;
    }
}

// generate poster and upload to aws s3 bucket
const addTextAndUpload = text => {
    try {
        logger.logAccess.info('[from utils/utils.js] addTextAndDownloadImg()\ntext:', text);
        logger.logInfo.info('[from utils/utils.js] addTextAndUpload()\ntext:', text);
        logger.logDebug.debug('[from utils/utils.js] addTextAndUpload()\ntext:', text);
        const fontSize = getFontSizeForText(text);
        const outFile = `${uuidv4()}-${text}.png`;
        logger.logDebug.debug('[from utils/utils.js] addTextAndUpload()\nfontSize:', fontSize, '\noutFile:', outFile);
        
        return new Promise((resolve, reject) => {
            im(inputDir)
                .fontSize(fontSize)
                .font(fontDir)
                .out('-gravity', 'center')
                .fill('#fff')
                .drawText(0, 55, text + ".sievehq.com")
                .stream((err, stdout, stderr) => {
                    stdout.on('error', (err) => {
                        logger.logError.error('[from utils/utils.js] addTextAndUpload() \nstdout error:', err);
                        reject(err);
                        return;
                    });

                    if(stderr) {
                        logger.logError.error('[from utils/utils.js] addTextAndUpload() \nstderr error:', stderr);
                        reject('Input stream error');
                        return;
                    }
                      
                    var data = {
                        Bucket: "sieve-sharable-poster-cdn",
                        Key: outFile,
                        Body: stdout,
                        ContentType: mime.getType(outFile)
                    };

                    // Upload to aws s3 bucket
                    s3.upload(data, (err, res) => {
                        if (err) {
                            logger.logError.error('[from utils/utils.js] addTextAndUpload() \ns3 upload error:', err);
                            reject(err);
                            return;
                        }
                        
                        // Upload success
                        if (res) {
                            logger.logDebug.debug('[from utils/utils.js] addTextAndUpload() \ns3 upload response:', res);
                            resolve({
                                "uploadLink": res.Location,
                                "fileName": outFile
                            });
                        }
                    });
                });
        });    
    }
    catch (err){
        logger.logError.error('[from utils/utils.js] addTextAndUpload()\nError:', err);
        throw err;
    }
}

// Get font-size for corresponding text
const getFontSizeForText = text => text.length < 10 ? '40' : text.length < 14 ? '35' : text.length < 18 ? '30' : '25'

module.exports = {
    addTextAndDownloadImg,
    addTextAndUpload
}