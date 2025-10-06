const express = require('express');
const { searchVideos, getAudioStream } = require('../controllers/youtubeController');

const router = express.Router();

router.get('/search', searchVideos);

router.get('/stream', getAudioStream);

module.exports = router;