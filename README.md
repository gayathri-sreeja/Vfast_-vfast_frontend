# VFAST - Frontend

### Technology Stack:
- Pure HTML, CSS, JavaScript (no build tools like npm, webpack, etc.)
- Bootstrap 5.3.2 (CDN)
- jQuery 3.3.1 and jQuery UI
- Various jQuery plugins (owl carousel, nice select, magnific popup, etc.)
- Custom VFAST JavaScript modules for API integration


### Architecture:
- Static website with multiple HTML pages (index, booking, dashboard, contact, gallery, login, etc.)
- Frontend-only project that communicates with a backend API
- No build process - can be served directly with any HTTP server
- Custom CSS and JavaScript in src/ directory
- OpenAPI specification file included for backend API reference


### Key Features:
- Hotel room booking system
- User authentication (Google OAuth integration)
- Dashboard for viewing reservations
- Gallery, contact forms
- Responsive design (though note: explicitly unsupported for small screens)


### Project Structure:
- Root: HTML pages (8 main pages)
- src/css/: Stylesheets including custom vfast-style.css
- src/js/: JavaScript files including custom VFAST modules
- src/fonts/: Font files
- src/img/: Images
- VFAST_openapi_specifications.json: API documentation


### Build Instructions
No Build System: There's no package.json, no npm scripts, no webpack, no build tools. It's a traditional static website


## Directory Structure
```
/
├── *.html                     # 8 main pages (index, booking, dashboard, etc.)
├── VFAST_openapi_specifications.json  # Backend API documentation
├── favicon.ico
├── .gitignore
└── src/
   ├── css/                   # Stylesheets
   │   ├── style.css         # Main theme styles
   │   ├── vfast-style.css   # Custom VFAST styles
   │   └── *.css             # Third-party CSS files
   ├── js/                    # JavaScript files
   │   ├── main.js           # Main UI interactions
   │   ├── jquery-*.js       # jQuery and plugins
   │   └── vfast/            # Custom VFAST modules
   │       ├── api-client.js # API communication layer
   │       ├── user.js       # User authentication
   │       ├── reservations.js # Booking management
   │       └── gallery.js    # Gallery functionality
   ├── fonts/                # Font files
   └── img/                  # Images and assets
```

## Critical Custom JavaScript Modules (src/js/vfast/)

### `api-client.js`:
- Base URL configuration: const BASE_URL = '/api/v1';
- JWT token handling: setAuthToken(), getAuthToken()
- API request functions: makeApiRequest()
- Important: Contains commented alternative backend URLs for different environments

### `user.js`:
- User authentication state management
- Google OAuth integration
- User data storage and retrieval

### `reservations.js`:
- Booking data display and management
- Reservation status handling
- User booking dashboard functionality

### `gallery.js` :
- Image gallery management
- Room availability calendar
- Interactive gallery features


## Dependencies and External Resources
- Bootstrap 5.3.2: Loaded via CDN
- jQuery 3.3.1: Local file (src/js/jquery-3.3.1.min.js)
- jQuery UI: Local file for date pickers
- Font Awesome: Local CSS/fonts
- Owl Carousel: For image sliders
- Google APIs: For OAuth authentication
