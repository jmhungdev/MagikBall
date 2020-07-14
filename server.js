const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above
 
const express = require('express');
const app = express();
app.use(express.static('public'))
app.use('/music', express.static('serveraudio'))


   

app.get('/playlist', (req,res)=>{
  res.send(fs.readdirSync('./serveraudio'));
})



app.get('/music/:name/:id', (req, res) =>{
  console.log(req.params);
  let name = req.params.name.replace(/[^a-zA-Z ]/g, "").replace(/\s/g, '')
  ytdl(`https://www.youtube.com/watch?v=${req.params.id}`)
  .pipe(fs.createWriteStream(`${name}.mp3`).on('close', ()=>{
    let oldPath = path.join(__dirname,`${name}.mp3`);
    let newPath = path.join(__dirname,`/serveraudio/${name}.mp3`)
    fs.renameSync(oldPath, newPath)
    app.use('/music', express.static('serveraudio'))
    res.send(fs.readdirSync('./serveraudio'));
    })
    
    
  )


 
})

// })


// app.get('/stream', (req, res) => {
//   const file = __dirname + '/video.mp3';
//   const stat = fs.statSync(file);
//   const total = stat.size;
//   if (req.headers.range) {

//   }
//   fs.exists(file, (exists) => {
//       if (exists) {
//           const range = req.headers.range;
//           const parts = range.replace(/bytes=/, '').split('-');
//           const partialStart = parts[0];
//           const partialEnd = parts[1];

//           const start = parseInt(partialStart, 10);
//           const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
//           const chunksize = (end - start) + 1;
//           const rstream = fs.createReadStream(file, {start: start, end: end});

//           res.writeHead(206, {
//               'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
//               'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
//               'Content-Type': 'audio/mpeg'
//           });
//           rstream.pipe(res);

//       } else {
//           res.send('Error - 404');
//           res.end();
//           // res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
//           // fs.createReadStream(path).pipe(res);
//       }
//   });
// });

// function fetchMusic(){
//   //ashley O -  download on a roll

// .then(res => console.log(res))
// ytdl('https://www.youtube.com/watch?v=NrJEFrth27Q')
//   .pipe(fs.createWriteStream('./public/av/audio/ashley.mp3'))

//   console.log('fetchMusic function ran');

// }






app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
); 
