// const BASE_URL = '/api/v1';
const BASE_URL = 'http://vfast.bits-pilani.ac.in/api/v2';
// const BASE_URL = 'https://vfast-backend-16dd4b0bfa8f.herokuapp.com/api/v1';
// const BASE_URL = 'https://ec2-15-207-110-230.ap-south-1.compute.amazonaws.com/api/v1';
// const BASE_URL = 'https://e86a-103-144-92-171.ngrok-free.app/api/v1';

/**
 * Decode a JWT token and return the payload.
 * @param {string} token - The JWT token.
 * @returns {object} Decoded payload of the token.
 */
function jwt_decode(token) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}

/**
 * Store the authentication token in localStorage.
 * @param {string} token - The OAuth2 token.
 */
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authToken_expires', jwt_decode(token).exp);
}

/**
 * Get the current authentication token.
 * Clears it automatically if expired.
 * @returns {string|null} The OAuth2 token.
 */
function getAuthToken() {
    const expires = localStorage.getItem('authToken_expires');
    if (expires && Date.now() >= expires * 1000) {
        clearAuthToken();
    }
    return localStorage.getItem('authToken');
}

/**
 * Remove authentication token from storage.
 */
function clearAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authToken_expires');
}

/**
 * Decode and return user data from JWT token.
 * @returns {object|null} The decoded user data.
 */
function getUserData() {
    const token = getAuthToken();
    return token ? jwt_decode(token) : null;
}

/**
 * Make an HTTP request to the API.
 *
 * @param {string} endpoint - API endpoint (e.g., '/user/login').
 * @param {object} [options={}] - Fetch options.
 * @param {string} [options.method='GET'] - HTTP method.
 * @param {object} [options.headers] - Extra headers.
 * @param {object} [options.body] - Request payload as JSON.
 * @param {boolean} [requiresAuth=false] - Whether auth is required.
 * @returns {Promise<object>} JSON response or error.
 */
async function apiRequest(endpoint, options = {}, requiresAuth = false) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (requiresAuth) {
        const authToken = getAuthToken();
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
    }

    console.log("ApiRequest →", url);

    const fetchOptions = {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    };

    try {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.detail) errorMessage = JSON.stringify(errorData.detail);
                if (errorData.data) errorMessage += " error_data: " + JSON.stringify(errorData.data);
                if (errorData.message) errorMessage += " error_message: " + JSON.stringify(errorData.message);
            } catch (e) {
                console.log("Error parsing response JSON:", e);
            }
            throw new Error(errorMessage);
        }

        if (response.status === 204) {
            return {};
        }

        return await response.json();
    } catch (error) {
        console.error("apiRequest failed:", error.message);
        throw error;
    }
}

// Export helpers
export {
    apiRequest,
    setAuthToken,
    getAuthToken,
    clearAuthToken,
    getUserData
};
