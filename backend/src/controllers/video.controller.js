const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const {videoService} = require("../services");

    
  
const addVideo = catchAsync(async (req, res) => {
    console.log(req.body);
    const video = await videoService.addVideo(req.body);
  
    res.status(httpStatus.CREATED).send(video);
});
const getVideos = catchAsync(async (req, res) => {
    const title = req.query.title ? req.query.title : "";
    
    if('genres' in req.query){
        if(req.query.genres.split(',').every((val) => ["All Genre","Education", "Sports", "Movies", "Comedy", "Lifestyle"].includes(val))===false)
            throw new ApiError(httpStatus.BAD_REQUEST, "Genre must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]");
    }
    if('contentRating' in req.query){
        if(["Any Age Group","7+","12+","16+","18+"].includes(req.query.contentRating)===false)
            throw new ApiError(httpStatus.BAD_REQUEST, "contentRating must be one of [Anyone, 7+, 12+, 16+, 18+, All]");
    }
    if('sortBy' in req.query){
        if(['releaseDate','viewCount'].includes(req.query.sortBy)===false)
            throw new ApiError(httpStatus.BAD_REQUEST,"sortBy must be one of [viewCount, releaseDate]")
    }
    const contentRating = req.query.contentRating ? req.query.contentRating : "Any Age Group";
    const genres = req.query.genres ? req.query.genres.split(',') : ["All Genre"];
    const sortBy = req.query.sortBy ? req.query.sortBy : "releaseDate";
    const videos = await videoService.getVideos(
        title,
        contentRating,
        genres,
        sortBy
    );
    res.status(200).send({ videos: videos });
});

const getVideo = catchAsync(async(req,res)=>{
    const data = await videoService.getVideoById(req.params.videoId)
    if (!data){
        throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
    }
    res.status(200).send(data);
})

const patchVotes = catchAsync(async (req,res)=>{
    
    await videoService.patchVotes(req.body,req.params.videoId);
    res.status(204).send();
})

const patchViews = catchAsync(async (req,res)=>{
    
    await videoService.patchViews(req.params.videoId);
    res.status(204).send();
})

module.exports = {
    getVideos,
    addVideo,
    getVideo,
    patchVotes,
    patchViews,
}