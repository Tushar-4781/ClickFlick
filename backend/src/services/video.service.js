const { Video } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const azure = require("azure-storage");
const { objectId } = require("../../../vid-backend/src/validations/custom.validation");
const { mongo } = require("mongoose");


async function getVideoById(id){
    const x = await Video.findById(id);
    return x;
}

const getVideos = async (title, contentRating, genres, sortBy) => {
    const titleMatch = { title: { $regex: title, $options: "i" } };
    const contentRatings = getPossibleContentRatings(contentRating);
    const contentRatingMatch = { contentRating: { $in: contentRatings } };
    let genreMatch = { genre: { $in: genres } };
    if (genres.includes("All Genre")) {
      genreMatch = null;
    }
    const videos = await Video.find({
      ...titleMatch,
      ...contentRatingMatch,
      ...genreMatch,
    });
    const sortedVideos = sortVideos(videos, sortBy);
    return sortedVideos;
  };
  
const getPossibleContentRatings = (contentRating) => {
    contentRatings = ["Any Age Group","7+","12+","16+","18+"];
    if (contentRating === "Any Age Group") {
      return contentRatings;
    }
    let contentIndex = contentRatings.indexOf(contentRating)+1;
    contentRatings.splice(contentIndex)
    return contentRatings;
  };

const sortVideos = (videos, sortBy) => {
    videos.sort((video1, video2) => {
        let field1 = video1[sortBy];
        let field2 = video2[sortBy];
        if (sortBy === "releaseDate") {
        field1 = new Date(field1).getTime();
        field2 = new Date(field2).getTime();
        }
        if (field1 > field2) {
            return -1;
        }
        return 1;
    });
    return videos;
};

const patchVotes = async(obj,id)=>{
    let video = await Video.findById(id);
    if(!video){
        throw new ApiError(httpStatus.NOT_FOUND,"Video not found");
    }
    if(obj.vote==="downVote"){
        if(obj.change==="increase"){
            video.votes.downVotes+=1;
        }
        else if(obj.change==="decrease"){
            video.votes.downVotes-=1;
        }
    }
    else if(obj.vote==="upVote"){
        if(obj.change==="increase"){
            video.votes.upVotes+=1;                
        }
        else if(obj.change==="decrease"){
            video.votes.upVotes-=1;
        }
    }
    
    await video.save();
}

const patchViews = async(id)=>{
    let video = await Video.findById(id);
    if(!video){
        throw new ApiError(httpStatus.NOT_FOUND,"Video not found");
    }
    video.viewCount+=1;
    await video.save();
}


const storageAccName = "clickflick", containerName = "thumbs";
const sasToken = "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2021-12-30T04:33:06Z&st=2021-12-24T20:33:06Z&spr=https&sig=jm%2FD9UjA9bQQPX6wjsEBfk0eOoD89rEczXxGsydfzpw%3D";
const host = `https://${storageAccName}.blob.core.windows.net`

async function addVideo(video){

    const c1 = await Video.isVideoPresent(video.videoLink)

    if(c1===true){
        throw new ApiError(httpStatus.OK, "Video Already Exist. Upload Something New!!")
    }
    else{
        var blobName = video.previewImage
        const blobService = new azure.createBlobServiceWithSas(host,sasToken);
        const imgUrl = blobService.getUrl(containerName,blobName,sasToken);
        video.previewImage = imgUrl
        
        return await Video.create(video);
    }
}

module.exports = {
    getVideos,
    addVideo,
    getVideoById,
    patchVotes,
    patchViews,
}