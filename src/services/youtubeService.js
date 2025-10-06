const axios = require('axios');

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// Search function remains the same
const searchYouTube = async (query) => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
      params: { q: query, part: 'snippet', maxResults: 15, type: 'video', key: API_KEY },
    });
    return response.data.items.map(item => ({ videoId: item.id.videoId, title: item.snippet.title, thumbnail: item.snippet.thumbnails.default.url, channel: item.snippet.channelTitle }));
  } catch (error) {
    console.error('Error searching YouTube:', error.message);
    throw new Error('Failed to fetch videos from YouTube.');
  }
};

// --- THIS FUNCTION IS UPDATED TO USE THE PUBLIC API ---
const getAudioStreamInfo = async (videoId) => {
  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const apiUrl = `https://yt-dlp-api.vercel.app/api/info?url=${videoUrl}`;

    const response = await axios.get(apiUrl);
    
    if (response.data && response.data.formats) {
      // Find all the audio-only formats
      const audioFormats = response.data.formats
        .filter(f => f.acodec !== 'none' && f.vcodec === 'none') 
        .sort((a, b) => b.abr - a.abr); // Sort by audio quality (bitrate)

      if (audioFormats.length > 0) {
        // Return the URL of the best quality audio
        return { url: audioFormats[0].url };
      }
    }
    throw new Error('No suitable audio stream found in API response.');
  } catch (error) {
    console.error('Error getting audio stream from public API:', error.message);
    throw new Error('Failed to get audio stream.');
  }
};

module.exports = {
  searchYouTube,
  getAudioStreamInfo,
};