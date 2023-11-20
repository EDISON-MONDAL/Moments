require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer_lib = require('multer')
const multerPath = multer_lib({ storage: multer_lib.memoryStorage() })

const expressFileUpload = require('express-fileupload')

const sharp = require('sharp')
const ExifParser = require('exif-parser')

const fs = require('fs')
const path = require('path');

const ffmpeg = require('fluent-ffmpeg')
const pathToFfmpeg = require('ffmpeg-static')




//configure mySql database
/*
const mysql = require('mysql');

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "moments"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("MySql database Connected Successfully!");
});
*/
//configure mySql database

//operation mySql db
/*
//----new id
app.post("/signup", (req, res)=>{
    
    const sql = 'INSERT INTO allusers (fullName, uid) VALUES ("'+ req.body.firstname +' '+ req.body.lastname +'", "' + req.body.email + '")';
    con.query(sql, function (err, result) {
     if (err) throw err;
     console.log("Full Name of user and his email stored in mySql db successfully");
    })

    //create my personalized account
    const escapeAtTheRate = req.body.email.replaceAll('@',"_")
    const escapedDot = escapeAtTheRate.replaceAll('.',"_")


    const sql1 = "CREATE TABLE " + escapedDot + " (id int NOT NULL AUTO_INCREMENT, fullName TEXT, uid VARCHAR(255), connection TEXT, UNIQUE(uid), PRIMARY KEY (id) )";
    con.query(sql1, function (err, result) {
        if (err) throw err;
        console.log("Personalized Table created");
    })
    //create my personalized account    
})
//-----new id

//-----profile picture
/*
app.post("/uploadProfilePictureInMysql", multerPath.single('profilePhoto'), (req, res)=>{
    const sql = 'UPDATE allusers SET profilePic = "' + req.file.buffer.toString('base64') + '" WHERE uid = "' + myId + '"';
    con.query(sql, function (err, result) {
     if (err) throw err;
     console.log("profile picture stored in mysql db");
    })    
})
/*

app.post("/uploadProfilePictureInMysql", (req, res)=>{
    const sql = 'UPDATE allusers SET profilePic = "' + req.body.croppedImage + '" WHERE uid = "' + req.body.myid + '"';
    con.query(sql, function (err, result) {
     if (err) throw err;

     console.log("profile picture stored in mysql db");
     res.send({mysqlSuccess: 'profile picture stored in mysql db'})
    })    
})
//-----profile pictures

//set friend
app.post("/sendFriendId", (req, res)=>{    
    const FriendId = req.body.friendId
    const myId = req.body.myid

    console.log('friend id is '+ FriendId)

    const sql = 'SELECT * FROM allusers WHERE uid = "' + FriendId + '"'

    con.query( sql, function (err, result, fields) {
        if (err) throw err;
        //console.log(result[0]);

        //remove sepecial charecter from email
        const escapeAtTheRate = myId.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        //remove special charecter from email

        const sql = 'INSERT INTO ' + escapedDot + ' (fullName, uid, connection) VALUES ("'+ result[0].fullName +'", "' + result[0].uid +'", "friend")';
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("All the data of "+ FriendId + " has been stored in my friend list in mysql");
        })
    })

    const sql1 = 'SELECT * FROM allusers WHERE uid = "' + myId + '"'

    con.query( sql1, function (err, result, fields) {
        if (err) throw err;
        //console.log(result[0]);

        //remove sepecial charecter from email
        const escapeAtTheRate = FriendId.replaceAll('@',"_")
        const escapedDot = escapeAtTheRate.replaceAll('.',"_")
        //remove special charecter from email

        const sql = 'INSERT INTO ' + escapedDot + ' (fullName, uid, connection) VALUES ("'+ result[0].fullName +'", "' + result[0].uid +'", "friend")';
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("All the data of my profile has been stored in "+ FriendId +" friend list in mysql");

            res.send({myidSuccess: "All the data of "+ FriendId + " has been stored in my friend list in mysql", useridSuccess: "All the data of my profile has been stored in "+ FriendId +" friend list in mysql"})
        })
    })
})
//set friend

//delete friend
app.post("/sendUnfriendId", (req, res)=>{    
    const UnfriendId = req.body.unfriendId
    const myId = req.body.myid

    console.log('unfriend id is '+ UnfriendId)

    //remove sepecial charecter from email
    const escapeAtTheRate = myId.replaceAll('@',"_")
    const escapedDot = escapeAtTheRate.replaceAll('.',"_")
    //remove special charecter from email

    const sql = 'DELETE FROM '+ escapedDot +' WHERE uid = "'+ UnfriendId +'"';
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log( UnfriendId + " has been deleted from my friend list in mysql");
        console.log(result.affectedRows)
    })
    

    

    //remove sepecial charecter from email
    const escapeAtTheRate1 = UnfriendId.replaceAll('@',"_")
    const escapedDot1 = escapeAtTheRate1.replaceAll('.',"_")
    //remove special charecter from email

    const sql1 = 'DELETE FROM '+ escapedDot1 +' WHERE uid = "'+ myId +'"';
    con.query(sql1, function (err, result) {
        if (err) throw err;
        console.log( "my id has been deleted from "+ UnfriendId +" friend list in mysql");
        console.log(result.affectedRows)

        res.send({myidSuccess: UnfriendId + " has been deleted from my friend list in mysql", useridSuccess: "my id has been deleted from "+ UnfriendId +" friend list in mysql"})
    })
    
})
//delete friend

//add new peer
app.use('/searchIdInMySql', (req, res) => {
    
    const myId = req.body.myid
    const fieldValue = req.body.searchValue


    //remove sepecial charecter from email
    const escapeAtTheRate = myId.replaceAll('@',"_")
    const escapedDot = escapeAtTheRate.replaceAll('.',"_")
    //remove special charecter from email

    let searchedId = []

    const sql = 'SELECT * FROM ' + escapedDot + ' WHERE fullName LIKE "%'+ fieldValue +'%" AND connection = "friend"'
    con.query( sql, function (err, result, fields) {
        if (err) throw err;
        
        for (let i = 0; i < result.length; i++) {

          if(searchedId.includes( result[i].uid ) == false ){
            searchedId.push( result[i].uid )
          }

          if( i+1 == result.length){
            
            let retrivedId = []

            for (let j = 0; j < searchedId.length; j++) {

                const sql1 = 'SELECT * FROM allusers WHERE uid = "'+ searchedId[j] +'"'

                con.query( sql1, function (err1, resulted, fields1) {
                    if (err1) throw err1;
                                        
                    if(retrivedId.includes( {name: resulted[0].fullName, uid: resulted[0].uid, photo: resulted[0].profilePic } ) == false ){
                        retrivedId.push( {name: resulted[0].fullName, uid: resulted[0].uid, photo: resulted[0].profilePic } )
                        
                        if(j+1 == searchedId.length){
                            //res.send(retrivedId)
                            res.render('addNewPeer', {showPeerForAdd: retrivedId, myid: myId})
                        }
                    }  
                })
                
                
                
            }
            
          }
        }
    })
})
//add new peer
*/
//operation mySql db

//connect to mongoose
/*
  mongoose.connect('mongodb+srv://edison_mondal:admin@moments-database.b78ofus.mongodb.net/Moments-All-Users?retryWrites=true&w=majority')
  .then(()=>{
    console.log('MongoDb successfully connected!')
  })
  .catch((err)=>{
    console.warn(err)
  })
  */
//connect to mongoose

/* ----- firebase init ------- */
  const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');

  const serviceAccount = require('./serviceAccountsKey.json');

  initializeApp({
    credential: cert(serviceAccount)
  });
/* ----- firebase init ------- */



app.set('view engine', 'ejs')		
app.use(express.static('dist'))	
app.use(express.static('src'))	
app.use(express.static('css'))
app.use(express.static('media'))

// parse application/ x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/ json
app.use(bodyParser.json())


app.use(
  expressFileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)


ffmpeg.setFfmpegPath( pathToFfmpeg )
// ffmpeg.setFfprobePath("ffprobe.exe")
// ffmpeg.setFlvtoolPath("ffplay.exe")



// image resizing and compression (single)
  app.post('/resizeNewProfilePic', multerPath.single('newProfileImgFile'), (req, res) => {
    // req.file 
    // req.file.buffer
    // req.file.buffer.toString('base64')

    const width = Number(req.body.width)
    const height = Number(req.body.height)

        
    
    const parser = ExifParser.create(req.file.buffer);
    const result = parser.parse();
    const orientation = result.tags.Orientation;

    let sharpImage = sharp( req.file.buffer )

    switch (orientation) {
      case 3:
        sharpImage = sharpImage.rotate(180);
        break;
      case 6:
        sharpImage = sharpImage.rotate(90);
        break;
      case 8:
        sharpImage = sharpImage.rotate(270);
        break;
      default:
        // No rotation needed
        break;
    }
      
    sharpImage
    .resize(width, height)
    .toBuffer((err, outputBuffer) => {
        if (err) {
          return res.status(500).send('Error resizing image');
        }
        // render updateAllProfile.js
        res.send( { base64image: outputBuffer.toString('base64') } );
    })
  });
// image resizing and compression (single)

// image resizing and compression (multiple)
  app.post('/resizeNewProfilePicM', multerPath.any(), (req, res) => {
    // req.file 
    // req.file.buffer
    // req.file.buffer.toString('base64')
  
    const width = Number(req.body.width)
    const height = JSON.parse(req.body.height)
  
    const base64imageArray = []
    
    console.log('multer length '+ req.files.length)
     
    for (let i = 0; i < req.files.length; i++) {

      const parser = ExifParser.create(req.files[i].buffer);
      const result = parser.parse();
      const orientation = result.tags.Orientation;

      let sharpImage = sharp(req.files[i].buffer);

      switch (orientation) {
        case 3:
          sharpImage = sharpImage.rotate(180);
          break;
        case 6:
          sharpImage = sharpImage.rotate(90);
          break;
        case 8:
          sharpImage = sharpImage.rotate(270);
          break;
        default:
          // No rotation needed
          break;
      }
      
      sharpImage
      .resize(width, height[i])
      .toBuffer((err, outputBuffer) => {
          if (err) {
            return res.status(500).send('Error resizing image');
          }
                 
          base64imageArray.push( outputBuffer.toString('base64') )
           
      })  
  
      // end of loop
        if(i+1 == req.files.length ){
          setTimeout(()=>{
            sendResponse()
          }, 20000)
          
        }
      // end of loop
    }
  
    function sendResponse() {
      console.log('base64imageArray length '+ base64imageArray.length)
      res.send( { base64imageArray: JSON.stringify( base64imageArray ) } );
    }
  });
// image resizing and compression (multiple)




// video resizing and compression
  app.post('/resizeVideo', (req, res)=>{
    let file = req.files.video_field_ajax_appendFormData

    const d = new Date();
    const month = Number( d.getMonth() + 1)
    const date_string = d.getDate() + '-' + month + '-' + d.getFullYear() + ' ' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds()

    let file_name = req.body.myId + ' ' + date_string + ' ' + file.name
    
    file.mv('tmp/' + file_name , function(err){
      if(err) return res.sendStatus(500).send(err);
      console.log('File Uploaded successfully')
    })
    
    
    
    ffmpeg( 'tmp/' + file_name )
    .format('mp4')
    .videoCodec('libx264')
    .videoBitrate('200k', true)
    .audioCodec('libmp3lame')
    .size('100x?') // 640x480, 1280x?
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);

      // delete unprocessed uploaded video
      fs.unlink("tmp/" + file_name, function(err){
        if(err) throw err;
        console.log('unprocessed video deleted')
      })
    })
    .on('end', function() {
      console.log('Processing finished !');

      // delete unprocessed uploaded video
      fs.unlink("tmp/" + file_name, function(err){
        if(err) throw err;
        console.log('unprocessed video deleted')
      })


      // manage compressed video
        try {
          /*
          // Read the MP4 file and create a buffer
          const buffer = fs.readFileSync( "tmp/output-" + file_name );
      
          // Set appropriate headers
          res.setHeader('Content-Type', 'video/mp4');
          res.setHeader('Content-Length', buffer.length);
      
          // Send the buffer as the response
          // res.json({videoBuffer: buffer})
          setTimeout(()=>{
            res.send(JSON.stringify(buffer))
          }, 2000)          
          // res.end(buffer);
          */

          const filePath = path.join(__dirname, 'tmp', "output-" + file_name);

          // Check if the file exists
          fs.stat(filePath, (err, stat) => {
            if (err) {
              console.error(err);
              return res.status(404).send('File not found');
            }

            // Set the Content-Type header to indicate the type of the response
            res.setHeader('Content-Type', 'video/mp4');

            // Set the Content-Length header to the size of the file
            res.setHeader('Content-Length', stat.size);

            // Stream the file to the response
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
          });
          

          // delete compressed video
          // fs.unlink("tmp/output-" + file_name, function(err){
          //   if(err) throw err;
          //   console.log('compressed video deleted')
          // })

        } catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        }       
      // manage compressed video
    })
    .save("tmp/output-" + file_name);
    
  })
// video resizing and compression


/* ------------------ firebase ------------------ */
  //signin page
  /*
  app.use('/signin', (req, res) => { 
    res.render('firebase/signin')	
  })
  */

  //Login page
  /*  
  app.get('/', (req, res) => {
    res.render('firebase/login') //default page
  })
  */

  //Profile page
  /*  
  app.use('/allProfile', (req, res) => {
    res.render('firebase/allProfile', {Uid: req.body.uId})
  })
  */

  // update profile
  /*
  app.use('/updateProfile', (req, res) => {
    res.render('firebase/updateAllProfile', {uid: req.body.uid})
  })
  */



  //Main page
  /*
  app.use('/main', (req, res) => {
    res.render('firebase/main')
  })
  */

  //leftNavigator page
  /*
  app.use('/leftNav', (req, res) => {
    res.render('firebase/leftNav')
  })
  */

  //chat page
  /*
  app.use('/chat5', (req, res) => {
    res.render('firebase/chat5')
  })
  */

/* ------------------ firebase ------------------ */



/* ------------------ mongoDB ------------------- */
  /* ---------- route to mongoDB js --------- */
    // signin
    app.use('/mongoJs/signin', require('./src/mongoDB/signin'))

    // login
    app.use('/mongoJs/login', require('./src/mongoDB/login'))

    // main
      //leftNavigator
    app.use('/mongoJs/main', require('./src/mongoDB/main')) 

    // profile
    app.use('/mongoJs/profile', require('./src/mongoDB/profile'))

    // profile update
    app.use('/mongoJs/profileUpdate', require('./src/mongoDB/updateAllProfile'))

  /* ---------- route to mongoDB js --------- */

  //Login page
      /*
      // landing page (default)
      // an example of persing html without view engings
      
      app.get("/", function (req, res) {
        res.sendFile(__dirname + '/views/index.html');
      });
      */
  app.get('/', (req, res) => {
    res.render('mongoDB/login') //default page
  })

  

  //signin page
  app.use('/signin', (req, res) => { 
    res.render('mongoDB/signin')	
  })

  //Main page
  app.use('/main', (req, res) => {
    res.render('mongoDB/main')
  })

  //Profile page
  app.use('/profile', (req, res) => {
    res.render('mongoDB/profile', {
        Uid: req.body.uId,
        Admin: req.body.admin
    })
  })

  // update profile page
  app.use('/updateProfile', (req, res) => {
    res.render('mongoDB/updateAllProfile', {
        uid: req.body.uid,
        Admin: req.body.admin
    })
  })


/* ------------------ mongoDB ------------------- */


























/*
---------- test -------- test -------------- test ------------------- 
*/

app.use('/metadata', (req, res) => {
    res.render('test/metadata')
})

const cheerio = require('cheerio');
const axios = require('axios');
const { URL } = require('url');

app.get('/metaInfo', (req, res) => {
    res.send('meta info')

    async function extractOpenGraphMetadata(url) {
        const response = await axios.get(url);
        const html = response.data;

        var url = new URL(url);
        var baseUrl = url.origin
      
        const $ = cheerio.load(html);
        const metadata = {};
        /*
        $('meta[property^="og:"]').each((index, element) => {
          const property = $(element).attr('property');
          const content = $(element).attr('content');
      
          if (property) {
            const key = property.replace('og:', '');
            metadata[key] = content;
          }
        });
      
        console.log(metadata);
        // Do something with the extracted metadata
        */
        
        
          /*
          $('img').each((index, element) => {
            console.log('src '+index +' '+ baseUrl + $(element).attr('src'))
            
          });
          */
          if( $('meta[name="title"]').length > 0 ){
            console.log('title ' + $('meta[name="title"]').attr('content'))

          }
          if( $('meta[name="description"]').length > 0 ){
            console.log('description ' + $('meta[name="description"]').attr('content'))

          }
          if( $('meta[name="keywords"]').length > 0 ){
            console.log('keywords ' + $('meta[name="keywords"]').attr('content'))

          }
          if( $('link[rel="icon"]').length > 0 ){
            console.log('icon ' + $('link[rel="icon"]').attr('href'))

          }

          if( $('meta[property="og:title"]').length > 0 ){
            console.log('og:title' + $('meta[property="og:title"]').attr('content'))
          }
          if( $('meta[property="og:site_name"]').length > 0 ){
            console.log('og:site_name' + $('meta[property="og:site_name"]').attr('content'))
          }
          if( $('meta[property="og:description"]').length > 0 ){
            console.log('og:description' + $('meta[property="og:description"]').attr('content'))
          }
          if( $('meta[property="og:image"]').length > 0 ){
            console.log('og:image' + $('meta[property="og:image"]').attr('content'))
          }

          if( $('meta[name="twitter:title"]').length > 0 ){
            console.log('twitter:title' + $('meta[name="twitter:title"]').attr('content'))
          }

          if( $('meta[name="twitter:description"]').length > 0 ){
            console.log('twitter:description' + $('meta[name="twitter:description"]').attr('content'))
          }
          if( $('meta[name="twitter:image"]').length > 0 ){
            console.log('twitter:image' + $('meta[name="twitter:image"]').attr('content'))
          }

          if( $('meta[name="apple-mobile-web-app-title"]').length > 0 ){
            console.log('apple-mobile-web-app-title' + $('meta[name="apple-mobile-web-app-title"]').attr('content'))
          }
      }
      
      extractOpenGraphMetadata('https://loremipsum.io/');
})
/*
app.use('/profile', (req, res) => {
    res.render('test/profile', {Uid: req.body.uid})
})

//profilePersonal page
app.use('/profilePersonal', (req, res) => {
    res.render('test/profilePersonal')
})


app.use('/sharp', (req, res) => { 
    res.render('test/demo_multer_sharp')
})

app.post("/temp", (req, res)=>{
    
    
    const mailText = req.body.sendMyId

    console.log(mailText)
    /*
    con.query("SELECT * FROM customers", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    })

    res.send({nodeRespond: mailText})
    /*
})

app.post("/demoupload", multerPath.single('image'), (req, res)=>{
    const sql = 'INSERT INTO aaa (demo) VALUES ("'+req.file.buffer.toString('base64') + '")';
    con.query(sql, function (err, result) {
     if (err) throw err;
     console.log("picture stored in mysql db");
     //console.log('file:'+ req.file.buffer.toString('base64'))
    })
})


app.post("/resizeupload", (req, res)=>{
    const sql = 'INSERT INTO aaa (demo) VALUES ("'+req.body.croppedImage + '")';
    con.query(sql, function (err, result) {
     if (err) throw err;
     console.log("cropped picture stored in mysql db");
     //console.log('file:'+ req.file.buffer.toString('base64'))
    })

    res.send({afterSuccess: 'cropped picture stored in mysql db'})
})





app.use('/webrtc', (req, res) => {
    res.render('test/demo2')
})

app.use('/facedetect', (req, res) => {
    res.render('test/faceDetect')
})

app.use('/sharescreen', (req, res) => {
    res.render('test/sharescreen')
})

app.use('/chat', (req, res) => {
    res.render('test/chat')
})

app.use('/chat3', (req, res) => {
    res.render('test/chat3')
})


app.use('/demo', (req, res) => {
    //res.render('test/demo')
    /*
    con.query("SELECT * FROM aaa ORDER BY id DESC", function (err, result, fields) {
        if (err) throw err;
        console.log(result[0].demo);
        res.render('test/demo', {dbimg: result})
    })
    /*
    
    con.query("SELECT * FROM allusers WHERE uid = 'edisonmondal@gmail.com'", function (err, result, fields) {
        if (err) throw err;
        console.log(result[0]);
        res.render('test/demo', {dbimg: result})
    })
    
})

*/

/*
---------- test -------- test -------------- test ------------------- 
*/









	
//listen port
app.listen(PORT, ()=>{
  console.log('server is running on port: ' + PORT)
})
