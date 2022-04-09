const Joi = require("joi");
const { objectId, voteChange, voteType } = require("./custom.validation");


const addVideo = {
  body: Joi.object().keys({
    "id":Joi.string().custom(objectId),
    "videoLink": Joi.string().required(),
    "title": Joi.string().required(),
    "genre": Joi.string().required(),
    "contentRating": Joi.string().required(),
    "releaseDate": Joi.string().required(),
    "previewImage": Joi.string().required(),
  }),
};

const patchVotes = {
  params: Joi.object().keys({
    videoId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    "vote": Joi.string().required().custom(voteType),
    "change": Joi.string().required().custom(voteChange),
  })
}

const patchViews = {
  params: Joi.object().keys({
    videoId: Joi.string().required().custom(objectId),
  }),
}

const getVideo = {
  params: Joi.object().keys({
    videoId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  addVideo,
  getVideo,
  patchVotes,
  patchViews,
};
