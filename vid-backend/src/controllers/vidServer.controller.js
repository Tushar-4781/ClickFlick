const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const azure = require("azure-storage")

const storageAccName = "clickflick", containerName = "files";
const sasToken = "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2021-12-30T04:33:06Z&st=2021-12-24T20:33:06Z&spr=https&sig=jm%2FD9UjA9bQQPX6wjsEBfk0eOoD89rEczXxGsydfzpw%3D";
const host = `https://${storageAccName}.blob.core.windows.net`
    
  
const getBlob = catchAsync(async (req,res) => {
    var range  = req.headers.range;   
    var blobName=req.params.videoId+".mp4";
    console.log(req.params)
    const blobService = new azure.createBlobServiceWithSas(host,sasToken);
    blobService.getBlobProperties(containerName,blobName,(err,blobResult,header)=>{
        let fileSize;
        if(!err){
            fileSize = Number(header.headers["content-length"])
            if(range){
                const CHUNK_SIZE = 1.5 * 10**6;
                const start = Number(range.replace(/\D/g,""));
                const end = Math.min(start+CHUNK_SIZE, fileSize-1);
                const contentLength = end- start +1;

                const stream = blobService.createReadStream(containerName, blobName, { rangeStart: start, rangeEnd: end,highWaterMark: 1280 * 720 }); // highWaterMark: 640 * 640
                const headers = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': contentLength,
                'Content-Type': "video/mp4",
                }
                res.writeHead(206, headers)
                stream.pipe(res)
            }
            // else{
            //     const headers = {
            //         'Content-Length': fileSize,
            //         'Content-Type': 'video/mp4',
            //         }
            //     res.writeHead(200, headers)
            //     blobService.createReadStream(containerName, blobName, null).pipe(res);
        
            // }
        }
        else{
            throw new ApiError(httpStatus.NOT_FOUND,"SERVER : Video not found in database");
            
        }
    })
})

module.exports = {
    getBlob,
}