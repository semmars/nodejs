//Import required modules
const express = require('express')
const multer = require('multer')
const path = require('path')

//Initialize app and setup port
const app = express()
const port = process.env.port || 668

//Set path for public directory
app.use(express.static('public'));

//Home route
app.get(/^(.+)$/, function (req, res) {
    //console.log('static file request : ' + req.params);
    res.sendfile(path.join(__dirname, req.params[0]));
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})


app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, '/index2.html'));
})

//Fileupload code will write here
//Define storage location for file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/public/uploads'))
    },
    filename: function (req, file, cb) {
        const flname = file.originalname.substring(0, file.originalname.lastIndexOf('.')) + '-' + Date.now() + path.extname(file.originalname)
        cb(null, flname)
    }
})

//Define file filter function
const fileFilter = function (req, file, cb) {
    // Validate file, accept only image
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|gif|png|mp4|mkv)$/)) {
        req.fileError = 'Please upload an image'
        return cb(new Error('Please upload an image'))
    }
    cb(null, true)
};

//Define route to upload single file
app.post('/uploadsinglefile', (req, res) => {
    let upload = multer({storage: storage, fileFilter: fileFilter}).single('fileupload1')
    upload(req, res, function (err) {
        //return error if any
        if (err) {
            return res.status(400).send(err.message)
        }

        // return uploaded file
//        res.send(`<div><a href="./">Go to Home Page</a><br/><h1>Uploaded file<h1/><br/><a href="uploads/${req.file.filename}" />download</a></div>`);
        //res.send(req.file.filename)
       // res.send(req.file.filename);
        res.send({message:req.file.filename})
        console.log(req.file.filename + 'just uploaded');
    })
})

//Define route to upload multiple files
app.post('/uploadmultiplefiles', (req, res) => {
    let upload = multer({storage: storage, fileFilter: fileFilter}).array('fileupload2', 5)
    upload(req, res, function (err) {
        //return error if any
        if (err) {
            return res.status(400).send(err)
        }

        // return uploaded files
        let finalResult = '<a href="./">Go to Home Page</a><br/><h1>Uploaded files<h1/>'

        for (i = 0; i < req.files.length; i++) {
            finalResult += `<div style="margin-top:10px;"><h4>${req.files[i].originalname}<h4/><a href="uploads/${req.files[i].filename}" />go</a></div>`
        }

        res.send(finalResult)
    })
})

//Listen on port
app.listen(port, () => {
    console.log(`Server is up and runing on ${port} version:1.5`)
})