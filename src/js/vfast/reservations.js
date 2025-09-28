$("#bookingForm").on('submit', async function(e) {
    e.preventDefault();

    if (!$('#agreeTerms').is(':checked')) {
        alert("Please agree to the Terms and Conditions.");
        return;
    }

    const booking_data = {
        guest: {
            first_name: $("#firstName").val(),
            last_name: $("#lastName").val(),
            name: $("#firstName").val() + " " + $("#lastName").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
            gender: $("#gender").val(),
            relation_to_referrer: $("#relation_to_user").val()
        },
        room_type: $("#roomType").val(),
        checkin: new Date($("#startDate").val()).toISOString(),
        checkout: new Date($("#endDate").val()).toISOString(),
        purpose_of_visit: $("#purpose").val(),
        relation_to_user: $("#relation_to_user").val(),
        remarks: '',
        num_guests: parseInt($("#guestCount").val(), 10),
        num_rooms: parseInt($("#roomCount").val(), 10)
    };

    try {
        await apiRequest('/user/reservation-requests', {
            method: 'POST',
            body: booking_data,
        }, true);
        alert("Your booking request has been submitted successfully.");
        e.target.reset();
        window.location.href = "./dashboard.html";
    } catch (error) {
        console.error("Booking Error:", error);
        alert("There was an error submitting your booking request: " + error.message);
    }
});