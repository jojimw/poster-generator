const fs = require("fs");
const mime = require('mime');
const gm = require('gm');
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const im = gm.subClass({ imageMagick: true });
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();

const addTextAndDownloadImg = text => {
    const fontSize = getFontSizeForText(text);
    const outFile = `out-${text}-${Math.floor(Math.random() * 100)}.png`;
    im('./templates/template-image.png')
        .fontSize(fontSize)
        .font('./fonts/Catamaran-Bold.ttf')
        .out('-gravity', 'center')
        .fill('#fff')
        .drawText(0, 55, text + ".sievehq.com")
        .write(`./${outFile}`, function (err) {
            if(err) console.log(err)
            else console.log('file created')
        });
    return outFile;
}

const addTextAndUpload = text => {
    const fontSize = getFontSizeForText(text);
    const outFile = `${uuidv4()}-${text}.png`;
    
    return new Promise((resolve, reject) => {
        im('./templates/template-image.png')
            .fontSize(fontSize)
            .font('./fonts/Catamaran-Bold.ttf')
            .out('-gravity', 'center')
            .fill('#fff')
            .drawText(0, 55, text + ".sievehq.com")
            .stream((err, stdout, stderr) => {
                stdout.on('error', (err) => {
                    reject('File Error: ' + err);
                });
                  
                var data = {
                    Bucket: "sieve-sharable-poster-cdn",
                    Key: outFile,
                    Body: stdout,
                    ContentType: mime.getType(outFile)
                };
                s3.upload(data, (err, res) => {
                    if (err) {
                        reject("Error: " + err);
                    }
                    //success
                    if (res) {
                        resolve({
                            "uploadLink": res.Location,
                            "fileName": outFile
                        });
                    }
                });
            });
    });    
}

const getFontSizeForText = text => text.length < 10 ? '40' : text.length < 14 ? '35' : text.length < 18 ? '30' : '25'

module.exports = {
    addTextAndDownloadImg,
    addTextAndUpload
}