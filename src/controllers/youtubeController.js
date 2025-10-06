const { searchYouTube, getAudioStreamInfo } = require('../services/youtubeService');

const searchVideos = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    const results = await searchYouTube(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAudioStream = async (req, res) => {
  const videoId = req.query.id;

  // This is the new debugging line
  console.log(`[DEBUG] Received request for videoId: ${videoId}`);

  if (!videoId) {
    return res.status(400).json({ message: 'Video ID is required.' });
  }

  try {
    const streamInfo = await getAudioStreamInfo(videoId);
    res.status(200).json(streamInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchVideos,
  getAudioStream,
};