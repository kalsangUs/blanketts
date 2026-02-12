/**
 * Discogs API Client
 * Handles all API requests to the Discogs service
 */

const DISCOGS_API_BASE = 'https://api.discogs.com';

class DiscogsClient {
  constructor() {
    this.token = process.env.DISCOGS_TOKEN;
    this.consumerKey = process.env.DISCOGS_CONSUMER_KEY;
    this.consumerSecret = process.env.DISCOGS_CONSUMER_SECRET;
  }

  /**
   * Make a GET request to the Discogs API
   * @param {string} endpoint - API endpoint (e.g., '/database/search')
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response data
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${DISCOGS_API_BASE}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    const headers = {
      'User-Agent': 'BlanketsMusicApp/1.0',
      'Accept': 'application/json',
    };

    // Add authentication
    if (this.token) {
      headers['Authorization'] = `Discogs token=${this.token}`;
    } else if (this.consumerKey && this.consumerSecret) {
      url.searchParams.append('key', this.consumerKey);
      url.searchParams.append('secret', this.consumerSecret);
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Discogs API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Discogs API request failed:', error);
      throw error;
    }
  }

  /**
   * Search the Discogs database
   * @param {string} query - Search query
   * @param {Object} options - Additional search options (type, artist, release_title, etc.)
   * @returns {Promise<Object>} Search results
   */
  async search(query, options = {}) {
    return this.get('/database/search', {
      q: query,
      ...options,
    });
  }

  /**
   * Get release details by ID
   * @param {string|number} releaseId - Discogs release ID
   * @returns {Promise<Object>} Release details
   */
  async getRelease(releaseId) {
    return this.get(`/releases/${releaseId}`);
  }

  /**
   * Get artist details by ID
   * @param {string|number} artistId - Discogs artist ID
   * @returns {Promise<Object>} Artist details
   */
  async getArtist(artistId) {
    return this.get(`/artists/${artistId}`);
  }

  /**
   * Get master release details by ID
   * @param {string|number} masterId - Discogs master release ID
   * @returns {Promise<Object>} Master release details
   */
  async getMaster(masterId) {
    return this.get(`/masters/${masterId}`);
  }

  /**
   * Get label details by ID
   * @param {string|number} labelId - Discogs label ID
   * @returns {Promise<Object>} Label details
   */
  async getLabel(labelId) {
    return this.get(`/labels/${labelId}`);
  }
}

// Export singleton instance
export const discogsClient = new DiscogsClient();
export default discogsClient;
