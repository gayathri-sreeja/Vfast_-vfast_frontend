# VFAST Frontend - Coding Agent Instructions

## Project Overview

This is the **VFAST Hotel Booking System Frontend** - a static HTML/CSS/JavaScript website that provides a hotel reservation interface. The project is a traditional static website with no build tools or compilation steps required.

**Key Facts:**
- **Project Type**: Static website (hotel booking system frontend)
- **Size**: ~2,845 lines of code across 8 HTML pages and 4 custom JS modules
- **Languages**: HTML, CSS, JavaScript (ES5/ES6)
- **Frameworks**: Bootstrap 5.3.2 (CDN), jQuery 3.3.1, jQuery UI
- **Runtime**: Any HTTP server (Python, Node.js, Apache, Nginx, etc.)

## Build and Development Workflow

### Critical: NO BUILD TOOLS REQUIRED
This project uses **NO package managers, bundlers, or build tools**. There is no package.json, webpack, npm scripts, or compilation step.

### Development Commands

**To serve the project locally:**
```bash
# Method 1: Python HTTP Server (recommended for testing)
cd /home/runner/work/vfast-frontend/vfast-frontend
python3 -m http.server 8000
# Access at http://localhost:8000

# Method 2: Node.js HTTP Server (if Node.js is available)
npx http-server . -p 8000

# Method 3: PHP built-in server
php -S localhost:8000
```

**Validation Steps:**
```bash
# Test server is working
curl -I http://localhost:8000/index.html
# Should return HTTP 200 OK

# Basic HTML syntax validation
python3 -c "
import html.parser
with open('index.html', 'r') as f:
    parser = html.parser.HTMLParser()
    parser.feed(f.read())
print('HTML syntax OK')
"
```

### No Build Steps Required
- **Bootstrap**: Always use file editing directly - no build or compilation
- **Test**: Serve with HTTP server and test in browser
- **Lint**: No formal linting setup - validate HTML/CSS/JS syntax manually
- **Deploy**: Copy files directly to web server

**Time Requirements:**
- Server startup: < 2 seconds
- File changes: Immediate (refresh browser to see changes)

## Project Architecture and Layout

### Directory Structure
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

### Key Configuration Files
- **No package.json**: This is not a Node.js project
- **No build configs**: No webpack, gulp, or other build tools
- **.gitignore**: Minimal file (only ignores .venv, .old, .vscode, .hintrc)
- **VFAST_openapi_specifications.json**: Backend API reference

### Main Application Pages
1. **index.html**: Homepage (432 lines)
2. **booking.html**: Room reservation form (335 lines)
3. **dashboard.html**: User booking dashboard (252 lines)
4. **login.html**: Authentication page (195 lines)
5. **gallery.html**: Hotel gallery (310 lines)
6. **contact.html**: Contact form (270 lines)
7. **404.html**: Error page (61 lines)
8. **old-admin.html**: Legacy admin interface (242 lines)

### Critical Custom JavaScript Modules (src/js/vfast/)

**api-client.js** (129 lines):
- Base URL configuration: `const BASE_URL = '/api/v1';`
- JWT token handling: `setAuthToken()`, `getAuthToken()`
- API request functions: `makeApiRequest()`
- **Important**: Contains commented alternative backend URLs for different environments

**user.js** (121 lines):
- User authentication state management
- Google OAuth integration
- User data storage and retrieval

**reservations.js** (139 lines):
- Booking data display and management
- Reservation status handling
- User booking dashboard functionality

**gallery.js** (359 lines):
- Image gallery management
- Room availability calendar
- Interactive gallery features

### Dependencies and External Resources
- **Bootstrap 5.3.2**: Loaded via CDN
- **jQuery 3.3.1**: Local file (src/js/jquery-3.3.1.min.js)
- **jQuery UI**: Local file for date pickers
- **Font Awesome**: Local CSS/fonts
- **Owl Carousel**: For image sliders
- **Google APIs**: For OAuth authentication

## Validation and Quality Checks

### Pre-Change Validation
Always run these commands before making changes:
```bash
# 1. Test current state
python3 -m http.server 8000 &
sleep 2
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/index.html
pkill -f "python3 -m http.server"
# Should return: 200

# 2. Check for JavaScript errors (if browser testing tools available)
# Open browser console and check for errors on each page
```

### Post-Change Validation
After making any changes:
```bash
# 1. Syntax validation for HTML files
python3 -c "
import html.parser
import glob
for file in glob.glob('*.html'):
    with open(file, 'r') as f:
        parser = html.parser.HTMLParser()
        parser.feed(f.read())
    print(f'{file}: OK')
"

# 2. Test server functionality
python3 -m http.server 8000 &
sleep 2
for page in index.html booking.html dashboard.html login.html; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/$page)
    echo "$page: $status"
done
pkill -f "python3 -m http.server"
```

### Common Issues and Workarounds
- **Mobile Responsiveness**: Project explicitly blocks small screens (see src/js/main.js lines 3-11)
- **API Endpoints**: Multiple backend URLs in api-client.js - ensure correct one is uncommented
- **Cross-Origin Issues**: Use proper HTTP server, not file:// protocol for testing
- **jQuery Dependencies**: Always ensure jQuery loads before jQuery UI and plugins

## Important Notes for Agents

### Always Do These:
- **Always use direct file editing** - no build commands exist
- **Always test with HTTP server** - never use file:// protocol
- **Always preserve existing jQuery plugin loading order** in HTML files
- **Always maintain Bootstrap CDN links** - no local Bootstrap files

### Never Do These:
- **Never run npm install** - no package.json exists
- **Never add build tools** unless specifically requested
- **Never modify the mobile screen detection** in main.js without explicit requirements
- **Never change API base URLs** without understanding deployment context

### File Modification Guidelines
- **HTML files**: Maintain existing structure, preserve Bootstrap classes
- **CSS files**: Add to vfast-style.css for custom styles
- **JavaScript**: Use existing module pattern in vfast/ directory
- **Images**: Add to src/img/ directory
- **Fonts**: Add to src/fonts/ directory

### Trust These Instructions
These instructions are comprehensive and tested. Only search or explore further if:
1. The instructions are incomplete for your specific task
2. You encounter errors not covered in the troubleshooting section
3. You need to understand implementation details of specific features

The project structure is simple and well-documented above - use this information to minimize exploration time and focus on your implementation task.