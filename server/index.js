const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const fs = require('fs');
const md5File = require('md5-file');


const app = express()

app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.post('/generate', async (req, res)=>{
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let song = req.files.song;
            var mp3hash;
            console.log('Hey!')
            song.mv('./infer/data/unprocessed.mp3');
            md5File('./infer/data/unprocessed.mp3',(err,hash)=>{
                console.log(hash);
                mp3hash = hash;
            })
            const { spawn } = require('child_process');
            const infer = spawn('cmd.exe', ['/c','infer\\program\\infer.bat']);

            
            infer.stdout.on('data', (data)=>{
                console.log(data.toString())
            })

            infer.stderr.on('data', (data)=>{
                console.log(data.toString())
            })
            
            infer.on('close', function() {
                // console.log(data.toString())
                let raw = fs.readFileSync('./infer/beats.json');
                let json = JSON.parse(raw);
                // console.log(json)
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: song.name,
                        mimetype: song.mimetype,
                        size: song.size
                    },
                    beats: json,
                    hash: mp3hash
                });
            });

        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})


//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`Threesonance server is listening on port ${port}.`)
);