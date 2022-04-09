const express = require("express");
const validate = require("../../middlewares/validate");
const videoController = require("../../controllers/video.controller")
const videoValidation = require("../../validations/video.validation")

const router = express.Router();

router.get("/",videoController.getVideos)
router.get("/:videoId",validate(videoValidation.getVideo),videoController.getVideo)

router.patch("/:videoId/votes",validate(videoValidation.patchVotes),videoController.patchVotes)
router.patch("/:videoId/views",validate(videoValidation.patchViews),videoController.patchViews)

router.post("/",validate(videoValidation.addVideo),videoController.addVideo)

module.exports = router;
