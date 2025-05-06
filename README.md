
Built by https://www.blackbox.ai

---

# Contest Management System

## Project Overview
The Contest Management System is a web application designed to facilitate the management of contests, including contestants, supervisors, competitions, and scores. It provides a RESTful API that allows for adding, retrieving, and managing these entities seamlessly.

## Installation

To set up the project locally, follow the steps below:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/contest-management.git
   cd contest-management
   ```

2. **Set up the MySQL database**
   - Create a MySQL database named `contest_management`.
   - Update the `db.js` file to include your MySQL root password.

3. **Install backend dependencies**
   - Navigate to the server directory and run:
   ```bash
   npm install
   ```

4. **Run the Server**
   ```bash
   node server.js
   ```

5. **Set up the frontend (if applicable)**
   - Navigate to the frontend directory and run:
   ```bash
   npm install
   npm start
   ```

## Usage
Once the server is running, it will be accessible at `http://localhost:3001`. You can interact with the available API routes using a tool like Postman or any frontend application.

### API Endpoints
- **Contestants**
  - `GET /api/contestants` - Retrieve all contestants
  - `POST /api/contestants` - Add a new contestant

- **Supervisors**
  - `GET /api/supervisors` - Retrieve all supervisors
  - `POST /api/supervisors` - Add a new supervisor

- **Competitions**
  - `GET /api/competitions` - Retrieve all competitions
  - `POST /api/competitions` - Add a new competition

- **Scores**
  - `GET /api/scores` - Retrieve all scores
  - `POST /api/scores` - Add a new score
  - `POST /api/competitions/:competitionId/add-contestants` - Batch add contestants to competition with scores

## Features
- Create and manage contestants and their associated data.
- Create and manage supervisors for contests.
- Manage competitions, including details and dates.
- Record and retrieve scores assigned to contestants by supervisors.

## Dependencies
The following dependencies are included in the project:

- **Backend:**
  - `express`: Node.js web application framework
  - `cors`: Middleware to enable Cross-Origin Resource Sharing
  - `body-parser`: Middleware for parsing incoming request bodies
  - `mysql2`: MySQL database driver for Node.js

- **Frontend:**
  - `react`: JavaScript library for building user interfaces
  - `react-dom`: Provides DOM-specific methods
  - `react-router-dom`: DOM bindings for React Router
  - `axios`: Promise-based HTTP client for the browser and Node.js

## Project Structure
```
/contest-management
├── db.js                # Database connection setting
├── package.json         # Project dependencies and scripts
├── server.js            # Main application and API routes
└── [frontend-directory]  # Frontend application (if applicable)
```

### Additional Directories
- The frontend is structured according to standard React conventions (e.g., components, pages).

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.