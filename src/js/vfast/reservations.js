// vfast/reservations.js 

const BASE_URL = 'http://vfast.bits-pilani.ac.in/api/v2';

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
 * Set the authentication token.
 * @param {string} token - OAuth2 token.
 */
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authToken_expires', jwt_decode(token).exp);
}
/**
 * Get the current authentication token.
 * @returns {string|null} The OAuth2 token.
 */
function getAuthToken() {
    const expires = localStorage.getItem('authToken_expires');
    if (expires && Date.now() >= expires * 1000) clearAuthToken();
    return localStorage.getItem('authToken');
}


function clearAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authToken_expires');
}

function getUserData() {
    const token = getAuthToken();
    return token ? jwt_decode(token) : null;
}


async function apiRequest(endpoint, options = {}, requiresAuth = false) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    const authToken = getAuthToken();
    if (requiresAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

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
            } catch (e) { console.log("Error parsing JSON:", e); }
            throw new Error(errorMessage);
        }

        if (response.status === 204) return {};
        return await response.json();
    } catch (error) {
        console.error("apiRequest failed:", error.message);
        throw error;
    }
}



async function getGuests() {
    return await apiRequest('/user/guests', { method: 'GET' }, true);
}

async function createGuest(guestData) {
    return await apiRequest('/user/guests', {
        method: 'POST',
        body: guestData
    }, true);
}

async function requestBooking(bookingData) {
    return await apiRequest('/user/reservation-requests', {
        method: 'POST',
        body: bookingData,
    }, true);
}


$("#bookingForm").on('submit', async function(e) {
    e.preventDefault();

    if (!$('#agreeTerms').is(':checked')) {
        alert("Please agree to the Terms and Conditions.");
        return;
    }

    let check_in_date = new Date($("#startDate").val());
    check_in_date = `${check_in_date.getFullYear()}-${String(check_in_date.getMonth() + 1).padStart(2,'0')}-${String(check_in_date.getDate()).padStart(2,'0')}`;

    let check_out_date = new Date($("#endDate").val());
    check_out_date = `${check_out_date.getFullYear()}-${String(check_out_date.getMonth() + 1).padStart(2,'0')}-${String(check_out_date.getDate()).padStart(2,'0')}`;

    const email = $("#email").val();

    try {
        const guests = await getGuests();
        let guest = guests.find(g => g.email === email);

        
        if (!guest) {
            guest = await createGuest({
                first_name: $("#firstName").val(),
                last_name: $("#lastName").val(),
                email: email,
                phone: $("#phone").val(),
                gender: $("#gender").val()
            });
        }

        const booking_data = {
            guest_id: guest.id,
            room_type: $("#roomType").val(),
            checkin: check_in_date,
            checkout: check_out_date,
            purpose_of_visit: $("#purpose").val(),
            relation_to_user: $("#relation_to_user").val(),
            remarks: '',
            num_guests: $("#guestCount").val()
        };

        console.log("Booking Data:", booking_data);

        await requestBooking(booking_data);

        alert("Your booking request has been submitted successfully.");
        e.target.reset();
        window.location.href = "./dashboard.html";

    } catch (error) {
        console.error("Booking Error:", error);
        alert("There was an error submitting your booking request: " + error.message);
    }
});
