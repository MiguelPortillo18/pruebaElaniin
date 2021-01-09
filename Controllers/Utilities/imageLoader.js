const aws = require('aws-sdk')
const multer = require('multer')

const s3 = new aws.s3({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ID,
})

const storage = multer.memoryStorage({
    destination: (req, document, callback) => {
        callback(null, '')
    }
})

const uploader = {
    uploadMulter: multer({storage}),
    uploaderMethod: function(document, location) {
        try {
            const params = {
                Bucket: process.env.AWS_BUCKET_INFO,
                Key: `${location}/${new Date().toISOString()}_${document.originalname}`,
                Body: document.buffer,
                ACL: 'public-read'
            }
    
            s3.upload(params, function(error, data) {
                if(error)
                    console.log(`Error: ${JSON.stringify(error)}`);
                else   
                console.log(`Data: ${JSON.stringify(data)}`);
            })
        }
        catch(err) {
            console.log(err);
        }
    }
}

module.exports = uploader
