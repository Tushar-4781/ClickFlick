const express = require("express");
// const validate = require("../../middlewares/validate");
const vidServerController = require("../../controllers/vidServer.controller")
// const videoValidation = require("../../validations/video.validation")

const router = express.Router();

router.get("/playVideo/:videoId",vidServerController.getBlob)

module.exports = router;
