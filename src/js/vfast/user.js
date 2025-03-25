const logged_in_user = getUserData();
console.log(`Logged in user: ${JSON.stringify(logged_in_user)}`);

const login_info_element = document.querySelector("#login-btn");
const bookingDetailsContainer = document.querySelector("#booking-details");

function fill_reservation_data(data){
    bookingDetailsContainer.innerHTML = ""; // Clear existing content
    const statusClasses = {
        "Pending": ["text-warning", "border-warning"],
        "Approved": ["text-success", "border-success"],
        "Rejected": ["text-danger", "border-danger"]
    };

    data.forEach(booking => {
        const bookingCard = document.createElement("div");
        bookingCard.classList.add("col-6", "contact-text");
        bookingCard.innerHTML = `
            <div class="card p-4">
                <h4> <b>${booking.booked_room_type} Room</b></h4>
                <small class="text-secondary text-secondary">#${booking._id}</small>
                <table class="mt-2">
                    <tbody>
                        <tr>
                            <td class="c-o">Number of Guests:</td>
                            <td>${booking.pax}</td>
                        </tr>
                        <tr>
                            <td class="c-o">From:</td>
                            <td>${booking.check_in}</td>
                        </tr>
                        <tr>
                            <td class="c-o">To:</td>
                            <td>${booking.check_out}</td>
                        </tr>
                        <tr>
                            <td class="c-o">Email:</td>
                            <td>${booking.email}</td>
                        </tr>
                        <tr>
                            <td class="c-o">Phone:</td>
                            <td>+91${booking.phone_number}</td>
                        </tr>
                        <tr>
                            <td class="c-o">Status:</td>
                            <td>
                                <b class="text-center p-2 rounded-3 text-uppercase border ${statusClasses[booking.booking_status].join(' ')}">${booking.booking_status}</b>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        bookingDetailsContainer.appendChild(bookingCard);
    });
}

if (logged_in_user){
    login_info_element.innerHTML = `
    <a href="./dashboard.html">
        <i class="fa fa-user-circle-o fa-lg" aria-hidden="true"></i>
        ${logged_in_user.username}
    </a>
    `
} else {
    if(window.location.href.includes("booking") || window.location.href.includes("dashboard")){
        window.location.href = "./login.html";
    }
}

if (logged_in_user){
    if(document.location.href.includes("dashboard")){
        apiRequest('/booking/user-bookings', {
            method: 'GET',
        }, true)
        .then(response => {
            console.log(response);
            fill_reservation_data(response.data.bookings);
        })
        .catch(error => {
            console.error('Booking Details error:', error);
            // alert('Booking Details failed: ' + error.message);
            bookingDetailsContainer.innerHTML = `
            <div class="col align-center">
                It seems that you have not made any bookings. <br>
                Please head on to Reserve Now Button to make a booking. <br> <br>
                <small class='text-danger'>Contact us immediately if you think this is an error.</small>
            </div>`
        });
    }
}