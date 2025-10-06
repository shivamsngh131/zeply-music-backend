const axios = require('axios');
const pd = require('play-dl'); // Use play-dl

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

const searchYouTube = async (query) => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: { q: query, part: 'snippet', maxResults: 15, type: 'video', key: API_KEY },
    });
    return response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      channel: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error('Error searching YouTube:', error.response?.data?.error || error.message);
    throw new Error('Failed to fetch videos from YouTube.');
  }
};

const getAudioStreamInfo = async (videoId) => {
  try {
    // Refresh tokens to make play-dl more reliable
    await pd.setToken({ soundcloud: { client_id: await pd.getFreeClientID() } });
    const stream = await pd.stream(`https://www.youtube.com/watch?v=${videoId}`);
    
    if (!stream || stream.type !== 'audio') {
      throw new Error('Could not find a valid audio stream.');
    }
    
    return { url: stream.stream.url };
  } catch (error) {
    console.error('Error getting audio stream from play-dl:', error.message);
    throw new Error('Failed to get audio stream.');
  }
};

module.exports = {
  searchYouTube,
  getAudioStreamInfo,
};