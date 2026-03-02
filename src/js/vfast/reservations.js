class ReservationManager {
    constructor() {
        this.bookingData = {};
        this.selectedRoomType = null;
        this.initializeForm();
    }

    // ============ INITIALIZE FORM ============
    initializeForm() {
        this.setupEventListeners();
        this.loadRoomTypes();
    }

    // ============ SETUP EVENT LISTENERS ============
    setupEventListeners() {
        // Check Availability Button
        const checkAvailBtn = document.getElementById("checkAvailability");
        if (checkAvailBtn) {
            checkAvailBtn.addEventListener("click", () => this.checkAvailability());
        }

        // Submit Booking Button
        const submitBtn = document.getElementById("submitBooking");
        if (submitBtn) {
            submitBtn.addEventListener("click", () => this.submitBooking());
        }

        // Date inputs - validate
        const checkInInput = document.getElementById("checkIn");
        const checkOutInput = document.getElementById("checkOut");
        
        if (checkInInput) {
            checkInInput.addEventListener("change", () => this.validateDates());
        }
        if (checkOutInput) {
            checkOutInput.addEventListener("change", () => this.validateDates());
        }
    }

    // ============ LOAD ROOM TYPES ============
    async loadRoomTypes() {
        try {
            const response = await apiClient.getRoomTypes();
            
            if (response.status === "success") {
                const roomTypeSelect = document.getElementById("roomType");
                const roomTypesData = response.data.room_types || [];
                
                roomTypeSelect.innerHTML = '<option value="">Select Room Type</option>';
                
                roomTypesData.forEach(roomType => {
                    const option = document.createElement("option");
                    option.value = roomType.id;
                    option.textContent = `${roomType.name} (Capacity: ${roomType.capacity}, Price: ₹${roomType.base_price}/night)`;
                    roomTypeSelect.appendChild(option);
                });

                roomTypeSelect.addEventListener("change", (e) => {
                    this.selectedRoomType = e.target.value;
                    this.updateRoomCapacity();
                });
            }
        } catch (error) {
            console.error("Error loading room types:", error);
            this.showError("Failed to load room types");
        }
    }

    // ============ UPDATE ROOM CAPACITY INFO ============
    updateRoomCapacity() {
        const roomTypeSelect = document.getElementById("roomType");
        const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
        const capacityDisplay = document.getElementById("roomCapacityInfo");
        
        if (capacityDisplay && selectedOption.value) {
            capacityDisplay.textContent = selectedOption.text;
        }
    }

    // ============ VALIDATE DATES ============
    validateDates() {
        const checkInInput = document.getElementById("checkIn");
        const checkOutInput = document.getElementById("checkOut");
        
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        
        if (checkOut <= checkIn) {
            this.showError("Check-out date must be after check-in date");
            checkOutInput.value = "";
            return false;
        }

        const days = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        if (days > 7) {
            this.showError("Maximum stay is 7 days");
            checkOutInput.value = "";
            return false;
        }

        return true;
    }

    // ============ CHECK AVAILABILITY ============
    async checkAvailability() {
        try {
            const checkInInput = document.getElementById("checkIn");
            const checkOutInput = document.getElementById("checkOut");
            const roomTypeSelect = document.getElementById("roomType");

            if (!checkInInput.value || !checkOutInput.value) {
                this.showError("Please select check-in and check-out dates");
                return;
            }

            if (!roomTypeSelect.value) {
                this.showError("Please select a room type");
                return;
            }

            if (!this.validateDates()) {
                return;
            }

            this.showLoading("Checking availability...");

            const response = await apiClient.checkAvailability(
                checkInInput.value,
                checkOutInput.value,
                roomTypeSelect.value
            );

            if (response.status === "success") {
                const availabilityData = response.data.availability || [];
                
                // Find the selected room type availability
                const selectedRoom = availabilityData.find(
                    r => r.room_type_id == roomTypeSelect.value
                );

                if (selectedRoom && selectedRoom.available_rooms > 0) {
                    this.showSuccess(
                        `✅ ${selectedRoom.available_rooms} room(s) available for ${selectedRoom.room_type_name}`
                    );
                    
                    // Show booking form
                    document.getElementById("bookingFormSection").style.display = "block";
                    this.prefillBookingForm();
                } else {
                    this.showError("❌ No rooms available for selected dates");
                }
            }
        } catch (error) {
            console.error("Availability check error:", error);
            this.showError(error.message || "Failed to check availability");
        }
    }

    // ============ PREFILL BOOKING FORM ============
    prefillBookingForm() {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        
        document.getElementById("firstName").value = currentUser.name?.split(" ")[0] || "";
        document.getElementById("lastName").value = currentUser.name?.split(" ")[1] || "";
        document.getElementById("email").value = currentUser.email || "";
        // Phone number from user profile if available
    }

    // ============ SUBMIT BOOKING ============
    async submitBooking() {
        try {
            const checkIn    = document.getElementById("checkIn").value;
            const checkOut   = document.getElementById("checkOut").value;
            const email      = document.getElementById("email").value.trim();
            const pax        = parseInt(document.getElementById("pax").value);
            const roomTypeId = document.getElementById("roomType").value;
            const purposeOfVisit      = document.getElementById("purposeOfVisit").value.trim();
            const specialRequirements = document.getElementById("specialRequirements")?.value.trim() || "";
            const agreeTerms = document.getElementById("agreeTerms")?.checked;

            // Detect faculty professional mode (currentMode set by booking.html toggle)
            const isFacultyProfessional = (window.currentMode === "professional");

            let firstName, lastName, phoneNumber, relationToCampus, bookingType;

            if (isFacultyProfessional) {
                const eventName  = document.getElementById("eventName")?.value.trim() || "";
                const department = document.getElementById("department")?.value.trim() || "";
                phoneNumber      = document.getElementById("phoneNumber2")?.value.trim() || "";
                // Store event/dept in first_name / last_name columns
                firstName        = eventName;
                lastName         = department;
                relationToCampus = "Faculty Professional";
                bookingType      = "FACULTY_PROFESSIONAL";
                if (!eventName || !department) {
                    this.showError("Please fill in Event Name and Department.");
                    return;
                }
            } else {
                firstName        = document.getElementById("firstName")?.value.trim() || "";
                lastName         = document.getElementById("lastName")?.value.trim() || "";
                phoneNumber      = document.getElementById("phoneNumber")?.value.trim() || "";
                relationToCampus = document.getElementById("relation_to_user")?.value.trim() || "Student";
                const user       = JSON.parse(localStorage.getItem("user") || "{}");
                const utype      = (user.user_type || "STUDENT").toUpperCase();
                bookingType      = utype === "FACULTY" ? "FACULTY_PERSONAL" : utype;
                if (!firstName) {
                    this.showError("Please enter your first name.");
                    return;
                }
            }

            if (!checkIn || !checkOut || !email || !pax || !roomTypeId) {
                this.showError("Please fill in all required fields.");
                return;
            }
            if (!agreeTerms) {
                this.showError("Please agree to the Terms and Conditions.");
                return;
            }
            if (pax < 1 || pax > 500) {
                this.showError("Invalid number of persons.");
                return;
            }
            if (!this.validateDates()) return;

            const token = localStorage.getItem("access_token");
            if (!token) {
                this.showError("Please login to make a reservation");
                return;
            }

            this.showLoading("Submitting reservation...");

            const bookingData = {
                first_name:           firstName,
                last_name:            lastName,
                email:                email,
                phone_number:         phoneNumber,
                check_in:             checkIn,
                check_out:            checkOut,
                pax:                  pax,
                room_type_id:         parseInt(roomTypeId),
                booking_type:         bookingType,
                is_international:     false,
                is_bulk:              false,
                purpose_of_visit:     purposeOfVisit,
                special_requirements: specialRequirements,
                gst_number:           "",
                relation_to_campus:   relationToCampus
            };

            const response = await apiClient.submitBooking(bookingData);

            if (response.status === "success") {
                const bookingId = response.data.booking_id;
                this.showSuccess(
                    `✅ Reservation submitted!<br>Booking ID: <strong>${bookingId}</strong><br>You will receive confirmation shortly.`
                );
                this.clearForm();
                setTimeout(() => { window.location.href = "dashboard.html"; }, 2500);
            } else {
                this.showError(response.data?.message || "Failed to submit reservation");
            }

        } catch (error) {
            console.error("Booking submission error:", error);
            this.showError(error.message || "Failed to submit reservation");
        }
    }

    // ============ CLEAR FORM ============
    clearForm() {
        [
            "checkIn","checkOut","email","purposeOfVisit","specialRequirements",
            "firstName","lastName","phoneNumber","relation_to_user",
            "eventName","department","phoneNumber2"
        ].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
        const paxEl = document.getElementById("pax");
        if (paxEl) paxEl.value = "1";
        const rtEl = document.getElementById("roomType");
        if (rtEl) rtEl.value = "";
        const ag = document.getElementById("agreeTerms");
        if (ag) ag.checked = false;
    }

    // ============ UI HELPERS ============
    showLoading(message) {
        const alertBox = document.getElementById("alertBox");
        if (alertBox) {
            alertBox.innerHTML = `<div class="alert alert-info" role="alert">⏳ ${message}</div>`;
            alertBox.style.display = "block";
        }
    }

    showSuccess(message) {
        const alertBox = document.getElementById("alertBox");
        if (alertBox) {
            alertBox.innerHTML = `<div class="alert alert-success" role="alert">${message}</div>`;
            alertBox.style.display = "block";
        }
    }

    showError(message) {
        const alertBox = document.getElementById("alertBox");
        if (alertBox) {
            alertBox.innerHTML = `<div class="alert alert-danger" role="alert">❌ ${message}</div>`;
            alertBox.style.display = "block";
        }
    }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
    window.reservationManager = new ReservationManager();
});