var fileUrl = 'https://ia800300.us.archive.org/1/items/night_of_the_living_dead/night_of_the_living_dead_512kb.mp4';

var range = req.headers.range;
var positions, start, end, total, chunksize;

// HEAD request for file metadata
request({
  url: fileUrl,
  method: 'HEAD'
}, function(error, response, body){
  setResponseHeaders(response.headers);
  pipeToResponse();
});

function setResponseHeaders(headers){
  positions = range.replace(/bytes=/, "").split("-");
  start = parseInt(positions[0], 10); 
  total = headers['content-length'];
  end = positions[1] ? parseInt(positions[1], 10) : total - 1;
  chunksize = (end-start)+1;

  res.writeHead(206, { 
    "Content-Range": "bytes " + start + "-" + end + "/" + total, 
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type":"video/mp4"
  });
}

function pipeToResponse() {
  var options = {
    url: fileUrl,
    headers: {
      range: "bytes=" + start + "-" + end,
      connection: 'keep-alive'
    }
  };

  request(options).pipe(res);
}


const range = req.headers.contentLength;
    console.log(req.headers)
    if(!range){
        res.status(400).send("Requires Range Header");
    }
    let storageAccName = "clickflick";
    let containerName = "files"
    let blobName = "E-CART.mp4"
    
    const videoSize = fs.createReadStream(videoPath).size;
    console.log(videoSize)
    const CHUNK_SIZE = 10**6;
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start+CHUNK_SIZE, videoSize-1);

    const contentLength = end- start +1;
    const headers = {
        "Content-Range":`bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length":contentLength,
        "Content-Type":"video/mp4"
    }
    res.writeHead(206,headers);
    const videoStream = fs.createReadStream(videoPath)//, {start,end});
    videoStream.pipe(res);
    






    const got = require("got");
const { createWriteStream } = require("fs");

const url = "https://media0.giphy.com/media/4SS0kfzRqfBf2/giphy.gif";
const fileName = "image.gif";

const downloadStream = got.stream(url);
const fileWriterStream = createWriteStream(fileName);

downloadStream
  .on("downloadProgress", ({ transferred, total, percent }) => {
    const percentage = Math.round(percent * 100);
    console.error(`progress: ${transferred}/${total} (${percentage}%)`);
  })
  .on("error", (error) => {
    console.error(`Download failed: ${error.message}`);
  });

fileWriterStream
  .on("error", (error) => {
    console.error(`Could not write file to system: ${error.message}`);
  })
  .on("finish", () => {
    console.log(`File downloaded to ${fileName}`);
  });

downloadStream.pipe(fileWriterStream);










global.blobService.getBlobProperties(config.azure.container, filename, function (err, blobResult, headers) {
  if (!err) {
  const fileSize = Number(params.contentLength);
  if (range) {
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1]
  ? parseInt(parts[1], 10)
  : fileSize - 1
  const chunksize = (end - start) + 1;
  const stream = global.blobService.createReadStream(config.azure.container, filename, { rangeStart: start, rangeEnd: end, highWaterMark: 256 * 1024 });
  const head = {
  'Content-Range': 'bytes ${start}-${end}/${fileSize}',
  'Accept-Ranges': 'bytes',
  'Content-Length': chunksize,
  'Content-Type': params.contentType,
  }
  
    res.writeHead(206, head)
    stream.pipe(res)
  } else {
    const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    global.blobService.createReadStream(config.azure.container, filename, null).pipe(res);
  }
  }
  })