const util = require('util')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
require('dotenv').config();


var storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    options: {useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"]; 
        if(match.indexOf(file.mimetype) === -1){ 
            const filename = `${Date.now()}-${file.originalname}`
            return filename
        } //if file type is not mimetype, 
        return {
            bucketName: 'avatars',
            filename:`${Date.now()}-${file.originalname}`
        }
    }
})

var uploadFile = multer({storage: storage}).single('file')//initialize middleware
var uploadFilesMiddleware = util.promisify(uploadFile);//enable async-await
module.exports = uploadFilesMiddleware;
