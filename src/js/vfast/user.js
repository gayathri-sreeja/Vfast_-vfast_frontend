const logged_in_user = getUserData();
console.log(`Logged in user: ${JSON.stringify(logged_in_user)}`);

const login_info_element = document.querySelector("#login-btn");
const bookingDetailsContainer = document.querySelector("#booking-details");

const statusClasses = {
    "Pending": "text-warning border-warning",
    "Reserved": "text-warning border-warning",
    "Approved": "text-success border-success",
    "CheckedIn": "text-success border-success",
    "Rejected": "text-danger border-danger",
    "Cancelled": "text-danger border-danger"
};

// Helper for "no bookings" message
function showNoBookingsMessage() {
    bookingDetailsContainer.innerHTML = `
        <div class="col text-center">
            It seems that you have not made any bookings. <br>
            Please head on to Reserve Now Button to make a booking. <br><br>
            <small class='text-danger'>Contact us immediately if you think this is an error.</small>
        </div>
    `;
}

function fill_reservation_data(data) {
    bookingDetailsContainer.innerHTML = ""; // Clear existing content

    if (!data || data.length === 0) {
        bookingDetailsContainer.innerHTML = `
            <div class="col align-center">
                It seems that you have not made any bookings. <br>
                Please head on to Reserve Now Button to make a booking. <br><br>
                <small class='text-danger'>Contact us immediately if you think this is an error.</small>
            </div>
        `;
        return;
    }

    data.forEach(booking => {
        const bookingCard = document.createElement("div");
        bookingCard.classList.add("col-6", "my-2", "contact-text");

        bookingCard.innerHTML = `
            <div class="card p-4">
                <h4><b>${booking.room_type} Room</b></h4>
                <small class="text-secondary">#${booking.request_id || "N/A"}</small>
                <table class="mt-2">
                    <tbody>
                        <tr>
                            <td class="c-o">Guest Name:</td>
                            <td>${booking.guest_name || "N/A"}</td>
                        </tr>
                        <tr>
                            <td class="c-o">Number of Guests:</td>
                            <td>${booking.num_guests || "N/A"}</td>
                        </tr>
                        <tr>
                            <td class="c-o">Number of Rooms:</td>
                            <td>${booking.num_rooms || "N/A"}</td>
                        </tr>
                        <tr>
                            <td class="c-o">From:</td>
                            <td>${booking.checkin_date || "N/A"}</td>
                        </tr>
                        <tr>
                            <td class="c-o">To:</td>
                            <td>${booking.checkout_date || "N/A"}</td>
                        </tr>
                        <tr>
                            <td class="c-o">Phone:</td>
                            <td>${booking.guest_ph || "N/A"}</td>
                        </tr>
                        <tr>
                            <td class="c-o">Status:</td>
                            <td>
                                <b class="text-center p-2 rounded-3 text-uppercase border ${statusClasses[booking.status] || 'text-secondary border-secondary'}">
                                    ${booking.status || 'Pending'}
                                </b>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        bookingDetailsContainer.appendChild(bookingCard);
    });
}

// Handle login button display
if (logged_in_user) {
    const displayName = logged_in_user.name || logged_in_user.username || "User";

    login_info_element.innerHTML = `
        <a href="./dashboard.html">
            <i class="fa fa-user-circle-o fa-lg" aria-hidden="true"></i>
            ${displayName}
        </a>
        &nbsp;&nbsp;
        <a id="logout-btn">
            <i class="fa fa-power-off fa-lg text-danger" aria-hidden="true"></i>
        </a>
    `;

    const logoutBtn = document.querySelector("#logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", e => {
            if (confirm("Do you really want to log out?")) {
                clearAuthToken();
                location.reload();
            } else e.preventDefault();
        });
    }

    // Fetch bookings if on dashboard
    if (window.location.href.includes("dashboard")) {
        apiRequest('/user/reservation-requests', { method: 'GET' }, true)
            .then(response => {
                console.log("Reservation API response:", response);

                // Detect bookings array in different possible paths
                let bookings = [];
                if (Array.isArray(response.data?.bookings)) bookings = response.data.bookings;
                else if (Array.isArray(response.bookings)) bookings = response.bookings;
                else if (Array.isArray(response.data)) bookings = response.data;

                if (!bookings.length) showNoBookingsMessage();
                else fill_reservation_data(bookings);
            })
            .catch(error => {
                console.error('Booking Details error:', error);
                showNoBookingsMessage();
            });
    }

} else {
    // Redirect to login if not logged in
    if (window.location.href.includes("booking") || window.location.href.includes("dashboard")) {
        window.location.href = "./login.html";
    }
}
