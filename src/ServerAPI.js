import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
// Set the base URL for axios
axios.defaults.baseURL = 'http://localhost:8080'; // Include the protocol (http://)

// the ServerAPI class is a wrapper around the axios library that makes it easier to fetch data from the server
class ServerAPI {

  constructor() {
    this.axios = axios.create();
    this.updateToken();
    this.setupStorageListener();
  }

  updateToken() {
    const token = localStorage.getItem('loggedInUserToken');
    if (token) {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.axios.defaults.headers.common['Authorization'];
    }
  }

  setupStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'loggedInUserToken') {
        this.updateToken();
      }
    });
  }

  //#region User
  static async login(username, password) {
    try {
      const response = await axios.post('/api/login', {
        username,
        password
      });
      localStorage.setItem('loggedInUserToken', response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      localStorage.setItem('loggedInUserDetails', JSON.stringify(decodedToken));
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

  static async getUserByChannelName(channelName) {
    try {
      const response = await axios.get(`/api/users/channel/${channelName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by channel name:', error);
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

  static async updateUser(username, updatedUserData, token) {
    try {
      const response = await axios.put(`/api/users/${username}`, updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }); //CHECK THIS TO RETURN TOKEN ON SERVER SIDE
      localStorage.setItem('loggedInUserToken', response.data.token);
      localStorage.setItem('loggedInUserDetails', jwtDecode(response.data.token));

      return response.data.updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(username, token) {
    try {
      const response = await axios.delete(`/api/users/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        localStorage.setItem('loggedInUserToken', 'null');
        localStorage.setItem('loggedInUserDetails', 'null');
      }
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

//#endregion
//#region Video

  static async getVideoById(id) {
    try {
      const response = await axios.get(`/api/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('loggedInUserToken')}`
        }
      });
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

  static async addVideo(videoData, token) {
    try {
      const response = await axios.post('/api/videos', videoData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
    }
  }

  static async deleteVideoById(id) {
    try {
      const token = localStorage.getItem('loggedInUserToken');
      const response = await axios.delete(`/api/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting video by ID:', error);
      throw error;
    }
  }

  static async updateVideo(id, videoData) {
    try {
      const token = localStorage.getItem('loggedInUserToken');
      const response = await axios.put(`/api/videos/${id}`, videoData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  }

//#endregion
//#region Like

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
      const response = await axios.post(
        `/api/videos/${id}/likes`,
        {}, // Empty body for the POST request
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('loggedInUserToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  }

  static async addDisLike(id, userId) {
    try {
      const response = await axios.post(`/api/videos/${id}/dislikes`,
         {}, // Empty body for the POST request
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('loggedInUserToken')}`
          }
        }
      );
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

//#endregion
//#region Comment

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
      const response = await axios.delete(`/api/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('loggedInUserToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  static async addComment(id, commentData) {
    try {
      const response = await axios.post(`/api/videos/${id}/comments`, commentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('loggedInUserToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  static async updateComment(id, commentData) {
    try {
      const token = localStorage.getItem('loggedInUserToken');
      const response = await axios.put(`/api/comments/${id}`, commentData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }
}
//#endregion
const serverAPI = new ServerAPI();
export default ServerAPI;