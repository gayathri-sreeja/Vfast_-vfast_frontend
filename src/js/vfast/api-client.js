const API_BASE_URL = "http://localhost:8000/api/v1";

class APIClient {
    constructor() {
        this.token = localStorage.getItem("access_token") || null;
    }

    // ============ SET TOKEN AFTER LOGIN ============
    setToken(token) {
        this.token = token;
        localStorage.setItem("access_token", token);
    }

    // ============ GET HEADERS ============
    getHeaders() {
        return {
            "Content-Type": "application/json",
            ...(this.token && { "Authorization": `Bearer ${this.token}` })
        };
    }

    // ============ BOOKING: CHECK AVAILABILITY ============
    async checkAvailability(checkIn, checkOut, roomTypeId = null) {
        try {
            const params = new URLSearchParams({
                check_in: checkIn,    // Format: "2024-12-15"
                check_out: checkOut
            });
            
            if (roomTypeId) params.append("room_type_id", roomTypeId);

            const response = await fetch(
                `${API_BASE_URL}/booking/availability?${params}`,
                {
                    method: "GET",
                    headers: this.getHeaders()
                }
            );

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || "Failed to check availability");
            }

            return data;
        } catch (error) {
            console.error("Availability check error:", error);
            throw error;
        }
    }

    // ============ BOOKING: SUBMIT RESERVATION ============
    async submitBooking(bookingData) {
        try {
            const payload = {
                first_name: bookingData.first_name,
                last_name: bookingData.last_name || "",
                email: bookingData.email,
                phone_number: bookingData.phone_number,
                check_in: bookingData.check_in,        // Format: "2024-12-15"
                check_out: bookingData.check_out,
                pax: bookingData.pax,
                room_type_id: bookingData.room_type_id,
                booking_type: bookingData.booking_type || "STUDENT",
                is_international: bookingData.is_international || false,
                is_bulk: bookingData.is_bulk || false,
                purpose_of_visit: bookingData.purpose_of_visit || "",
                special_requirements: bookingData.special_requirements || "",
                gst_number: bookingData.gst_number || "",
                relation_to_campus: bookingData.relation_to_campus || ""
            };

            const response = await fetch(
                `${API_BASE_URL}/booking/submit-booking`,
                {
                    method: "POST",
                    headers: this.getHeaders(),
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to submit booking");
            }

            return data;
        } catch (error) {
            console.error("Booking submission error:", error);
            throw error;
        }
    }

    // ============ BOOKING: GET MY BOOKINGS ============
    async getMyBookings() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/booking/my-bookings`,
                {
                    method: "GET",
                    headers: this.getHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to fetch bookings");
            }

            return data;
        } catch (error) {
            console.error("Get bookings error:", error);
            throw error;
        }
    }

    // ============ ROOM TYPES: GET ALL ============
    async getRoomTypes() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/booking/room-types`,
                {
                    method: "GET",
                    headers: this.getHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to fetch room types");
            }

            return data;
        } catch (error) {
            console.error("Get room types error:", error);
            throw error;
        }
    }
}

// Export for use
const apiClient = new APIClient();