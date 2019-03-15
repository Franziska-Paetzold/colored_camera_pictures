const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const server = express().use(express.static('public')).listen(PORT, port);

let Schema = mongoose.Schema;
const dbUrl = "mongodb://admin:password123@ds223605.mlab.com:23605/ctech_image_fun"

let ImageSchema = new Schema(
    {
        imgSrc: String
    });

let Image = mongoose.model('image', ImageSchema);
     

const io = socketIO(server); 
io.on('connection', connectionLive); 

function port()
{
    console.log(`Listening on ${ PORT }`);
}


mongoose.connect(dbUrl, {useNewUrlParser: true}, dbConnected);
function dbConnected(err)
{
    if (err)
    {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } 
    else 
    {
        console.log('Connection established to', dbUrl);
    }
}

function connectionLive(socket)
{
    console.log('Client connected');

    Image.find(getAllImagesFromDB);
    function getAllImagesFromDB(err, data)
    {
        if (err) return console.error(err);

        if(data.length == 0)
        {
           // getNewScentence(data);
           console.log('empty database');
        }
        else
        {
            console.log('Init Client');
            io.emit('initSketch', data);
            console.log(data);
        }
    }

    socket.on('addImageToDatabase', getNewImage);


    function getNewImage(data)
    {
        console.log('Got data: ', data);
        
        Image.findOne({ index:Number(data.index) }, saveData);
        function saveData(err, dataDb)
        {
            // console.log('Save data', dataDb);
            if (err) return console.error(err);
           
            let tmpImage = new Image(data);
            tmpImage.save(saveNewImage);
            function saveNewImage(err, element) 
            {
                if (err) return console.error(err);

                console.log('New element saved', element);
            };
            
        };

        Image.find(getAllImagesFromDB);
    }
};