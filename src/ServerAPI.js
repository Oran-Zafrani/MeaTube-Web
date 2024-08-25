import axios from 'axios';

// Set the base URL for axios
axios.defaults.baseURL = 'http://localhost:8080'; // Include the protocol (http://)

// the ServerAPI class is a wrapper around the axios library that makes it easier to fetch data from the server
class ServerAPI {
  
  static async login(username, password) {
    try {
      const response = await axios.post('/api/login', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async getUserByUsername(username) {
    try {
      const response = await axios.get(`/api/users/username/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  static async createUser(userData) {
    try {
      const response = await axios.post('/api/users', userData);
      return response.data; 
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; 
    }
  }

  static async updateUser(username, userData) {
    try {
      const response = await axios.put(`/api/users/${username}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(username) {
    try {
      const response = await axios.delete(`/api/users/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getVideoById(id) {
    try {
      const response = await axios.get(`/api/videos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching video by ID:', error);
      throw error;
    }
  }

  static async getTop20Videos() {
    try {
      const response = await axios.get('/api/videos');
      return response.data;
    } catch (error) {
      console.error('Error fetching top 20 videos:', error);
      throw error;
    }
  }

  static async getVideosByUsername(username) {
    try {
      const response = await axios.get(`/api/videos/username/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos by username:', error);
      throw error;
    }
  }

  static async addVideo(videoData) {
    try {
      const response = await axios.post('/api/videos', videoData);
      return response.data;
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
    }
  }

  static async deleteVideoById(id) {
    try {
      const response = await axios.delete(`/api/videos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting video by ID:', error);
      throw error;
    }
  }

  static async updateVideo(id, videoData) {
    try {
      const response = await axios.put(`/api/videos/${id}`, videoData);
      return response.data;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

  static async getLikesByVideoId(id) {
    try {
      const response = await axios.get(`/api/videos/${id}/likes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching likes by video ID:', error);
      throw error;
    }
  }

  static async getDisLikesByVideoId(id) {
    try {
      const response = await axios.get(`/api/videos/${id}/dislikes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dislikes by video ID:', error);
      throw error;
    }
  }

  static async addLike(id, userId) {
    try {
      const response = await axios.post(`/api/videos/${id}/likes`, { user_id: userId });
      return response.data;
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  }

  static async addDisLike(id, userId) {
    try {
      const response = await axios.post(`/api/videos/${id}/dislikes`, { user_id: userId });
      return response.data;
    } catch (error) {
      console.error('Error adding dislike:', error);
      throw error;
    }
  }

  static async deleteLike(id, userId) {
    try {
      const response = await axios.delete(`/api/videos/${id}/likes`, { data: { user_id: userId } });
      return response.data;
    } catch (error) {
      console.error('Error deleting like:', error);
      throw error;
    }
  }

  static async deleteDisLike(id, userId) {
    try {
      const response = await axios.delete(`/api/videos/${id}/dislikes`, { data: { user_id: userId } });
      return response.data;
    } catch (error) {
      console.error('Error deleting dislike:', error);
      throw error;
    }
  }

  static async getCommentsByVideoId(id) {
    try {
      const response = await axios.get(`/api/videos/${id}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments by video ID:', error);
      throw error;
    }
  }

  static async deleteComment(id) {
    try {
      const response = await axios.delete(`/api/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  static async addComment(id, commentData) {
    try {
      const response = await axios.post(`/api/videos/${id}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  static async updateComment(id, commentData) {
    try {
      const response = await axios.put(`/api/comments/${id}`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }
}

export default ServerAPI;