// vfast/reservations.js

// /**
//  * Get Availability Calendar
//  * @param {string} start - The start date (e.g., '2024-12-01').
//  * @param {string} end - The end date (e.g., '2024-12-31').
//  * @returns {Promise<object>} The availability data.
//  */
// async function getAvailability(start, end) {
//     const params = new URLSearchParams({ start, end });
//     const endpoint = `/booking/availability?${params.toString()}`;
//     const response = await apiRequest(endpoint, {
//         method: 'GET',
//     }, true);
//     return response;
// }

/**
 * Request a Booking
 * @param {object} bookingData - The booking request data.
 * @returns {Promise<object>} The response data.
 */
async function requestBooking(bookingData) {
    const response = await apiRequest('/booking/booking-request', {
        method: 'POST',
        body: bookingData,
    }, true);
    return response;
}

/**
 * Confirm a Booking
 * @param {object} confirmData - The booking confirmation data.
 * @returns {Promise<object>} The response data.
 */
async function confirmBooking(confirmData) {
    const response = await apiRequest('/booking/confirm-booking', {
        method: 'POST',
        body: JSON.stringify(confirmData),
    }, true);
    return response;
}

/**
 * Get Booking Dashboard
 * @param {string} [reqDate] - The requested date (optional).
 * @returns {Promise<object>} The dashboard data.
 */
async function getBookingDashboard(reqDate = '') {
    const params = reqDate ? `?req_date=${encodeURIComponent(reqDate)}` : '';
    const endpoint = `/booking/booking-dashboard${params}`;
    const response = await apiRequest(endpoint, {
        method: 'GET',
    }, true);
    return response;
}

/**
 * Get Booking Statistics
 * @param {string} [reqDate] - The requested date (optional).
 * @returns {Promise<object>} The statistics data.
 */
async function getBookingStatistics(reqDate = '') {
    const params = reqDate ? `?req_date=${encodeURIComponent(reqDate)}` : '';
    const endpoint = `/booking/booking-statistics${params}`;
    const response = await apiRequest(endpoint, {
        method: 'GET',
    }, true);
    return response;
}

/**
 * Get Booking Requests
 * @param {string} [reqDate] - The requested date (optional).
 * @returns {Promise<object>} The booking requests data.
 */
async function getBookingRequests(reqDate = '') {
    const params = reqDate ? `?req_date=${encodeURIComponent(reqDate)}` : '';
    const endpoint = `/booking/booking-requests${params}`;
    const response = await apiRequest(endpoint, {
        method: 'GET',
    }, true);
    return response;
}

/**
 * Get User Bookings
 * @returns {Promise<object>} The user's bookings data.
 */
async function getUserBookings() {
    const endpoint = '/booking/user-bookings';
    const response = await apiRequest(endpoint, {
        method: 'GET',
    }, true);
    return response;
}


$("#bookingForm").on('submit', function (e) {
    e.preventDefault();

    let check_in_date = new Date($("#startDate").val());
    check_in_date = `${check_in_date.getFullYear()}-${String(check_in_date.getMonth() + 1).padStart(2, '0')}-${String(check_in_date.getDate()).padStart(2, '0')}`;

    let check_out_date = new Date($("#endDate").val());
    check_out_date = `${check_out_date.getFullYear()}-${String(check_out_date.getMonth() + 1).padStart(2, '0')}-${String(check_out_date.getDate()).padStart(2, '0')}`;

    if (!$('#agreeTerms').is(':checked')) {
        alert("Please check the box to agree with the Terms and Conditions.");
        return;
    }
    
    const booking_data = {
        first_name: $("#firstName").val(),
        last_name: $("#lastName").val(),
        gender: $("#gender").val(),
        purpose_of_visit: $("#purpose").val(),
        relation_to_user: $("#relation_to_user").val(),
        remarks: "",
        email: $("#email").val(),
        phone_number: $("#phone").val(),
        check_in: check_in_date,
        check_out: check_out_date,
        room_type: $("#roomType").val(),
        pax: $("#guestCount").val()
    };

    console.log(booking_data);

    requestBooking(booking_data)
    .then(response => {
        alert("Your booking request has been submitted successfully.");
        e.target.reset();
        window.location.href = "./dashboard.html";
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was an error submitting your booking request.");
    });
});