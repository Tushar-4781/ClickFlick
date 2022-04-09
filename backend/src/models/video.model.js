const mongoose = require("mongoose");
// const validator = require("validator")
const genres = ["Education", "Sports", "Movies", "Comedy", "Lifestyle" ];
const videoSchema =  new mongoose.Schema(
    {
        videoLink : {
            type: String,
            required: true,
            trim: true,
        },
        title : {
            type: String,
            required: true,
            trim: true,
        },
        genre : {
            type: String,
            enum: ["All Genre","Education", "Sports", "Movies", "Comedy", "Lifestyle" ],
            required: true,
            trim: true,
            description: "must be a string if the field exists"
        },
        contentRating : {
            type: String,
            required: true,
            trim: true,
            enum: ["Any Age Group","7+", "12+", "16+", "18+"]
        },
        releaseDate :{
            type: String,
            required: true,
            trim: true,
        },
        previewImage :{
            type: String,
            required: true,
            trim: true,
        },
        votes: {
            upVotes: {type:Number,default:0},downVotes: {type:Number,default:0},
        },
        viewCount : {
            type: Number,
            default: 0,
        }
    },
        {
            timestamps:false,
        }
);

videoSchema.statics.isVideoPresent = async function (videoLink) {
    exist=await this.find({"videoLink": videoLink}).countDocuments();
    if(exist>=1)
      return true
    else
      return false
  };

module.exports.Video = mongoose.model("Video",videoSchema);