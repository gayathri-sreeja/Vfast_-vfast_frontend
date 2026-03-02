class UserManager {
    constructor() {
        this.user = null;
        this.initializeGoogle();
    }

    // ============ INITIALIZE GOOGLE SIGN-IN ============
    initializeGoogle() {
        // Load Google Sign-In library
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            google.accounts.id.initialize({
                client_id: "464794475879-742k1rji25rb0bg25lp0cv0c9l5n1ljj.apps.googleusercontent.com",
                callback: (response) => this.handleGoogleSignIn(response)
            });
        };
    }

    // ============ HANDLE GOOGLE SIGN-IN ============
    async handleGoogleSignIn(response) {
        try {
            // Decode JWT token from Google
            const token = response.credential;
            const decoded = this.parseJwt(token);

            console.log("Google user data:", decoded);

            // Send to backend
            const backendResponse = await fetch(
                "http://localhost:8000/api/v1/auth/user/google-signin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        google_id: decoded.sub,
                        email: decoded.email,
                        name: decoded.name,
                        phone_number: "",
                        institution_id: this.extractBitsId(decoded.email),
                        department: ""
                    })
                }
            );

            const data = await backendResponse.json();

            if (data.status === "success") {
                // Save token and user info
                const accessToken = data.data.access_token;
                const user = data.data.user;

                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("user", JSON.stringify(user));

                // Set token in API client
                apiClient.setToken(accessToken);

                this.showSuccess("✅ Login successful!");

                // Redirect to booking page
                setTimeout(() => {
                    window.location.href = "booking.html";
                }, 1000);
            } else {
                this.showError("Login failed: " + data.detail);
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
            this.showError("Sign-in failed: " + error.message);
        }
    }

    // ============ PARSE JWT TOKEN ============
    parseJwt(token) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    }

    // ============ EXTRACT BITS ID FROM EMAIL ============
    extractBitsId(email) {
        // Example: "f20210123@hyderabad.bits-pilani.ac.in" -> "f20210123"
        const match = email.match(/^([a-z0-9.]+)@/);
        return match ? match[1] : "";
    }

    // ============ CHECK LOGIN STATUS ============
    checkLoginStatus() {
        const token = localStorage.getItem("access_token");
        const user = localStorage.getItem("user");

        if (token && user) {
            this.user = JSON.parse(user);
            return true;
        }
        return false;
    }

    // ============ LOGOUT ============
    logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "index.html";
    }

    // ============ UI HELPERS ============
    showSuccess(message) {
        alert(message); // Or use a toast/modal
    }

    showError(message) {
        alert(message);
    }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
    window.userManager = new UserManager();
    
    // Check if logged in on booking pages
    if (document.body.id === "bookingPage" || document.body.id === "dashboardPage") {
        if (!userManager.checkLoginStatus()) {
            window.location.href = "login.html";
        }
    }
});