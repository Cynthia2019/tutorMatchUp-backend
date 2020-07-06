const upload = require('../middleware/upload')

const uploadFile = async(req, res) => {
    try{
        await upload(req, res)
        console.log(req.file)
        if(req.file === undefined){
            return(res.send('Please select a file'))
        }
        res.send('File has been uploaded.')
    }
    catch(err){
        return(res.json({error: err}))
    }
}
module.exports = uploadFile;