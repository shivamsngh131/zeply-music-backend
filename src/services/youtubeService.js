const axios = require('axios');
const youtubedl = require('youtube-dl-exec');

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

const searchYouTube = async (query) => {
  // This function does not need to change
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
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    const streamUrl = await youtubedl(videoUrl, {
      format: 'bestaudio',
      getUrl: true, 
    });

    if (!streamUrl) {
      throw new Error('Could not retrieve stream URL from yt-dlp.');
    }
    
    return { url: streamUrl };
  } catch (error) {
    // --- THIS IS THE ONLY CHANGE ---
    // Log the entire error object to get more details
    console.error('Full yt-dlp error object:', error);
    
    if (error.message.includes('ENOENT')) {
       console.error('Error: yt-dlp.exe not found. Make sure it is in the "backend" folder.');
    }
    throw new Error('Failed to get audio stream.');
  }
};

module.exports = {
  searchYouTube,
  getAudioStreamInfo,
};