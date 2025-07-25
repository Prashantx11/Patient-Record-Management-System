# Patient Record Management System

## Description

This repository contains a Patient Record Management System, a cryptographic application designed to securely manage patient data. The system utilizes JavaScript, Express.js, and Node.js to provide a backend for handling patient records with enhanced security measures. This includes cryptographic techniques for data encryption and secure storage.

## Key Features & Benefits

- **Secure Patient Data Management:** Employs cryptographic techniques to ensure the confidentiality and integrity of patient records.
- **Backend API:** Provides a robust backend API built with Express.js for handling patient record operations.
- **Node.js Environment:** Leverages the Node.js runtime for efficient and scalable server-side operations.
- **Database Integration:** Utilizes MongoDB (through Mongoose) for persistent storage of patient data.
- **File Uploads:** Supports the uploading and secure storage of patient-related documents.

## Prerequisites & Dependencies

Before you begin, ensure you have met the following requirements:

- **Node.js:**  Make sure Node.js is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
- **npm:** Node Package Manager, which comes with Node.js.
- **MongoDB:** A running instance of MongoDB for data storage.  You can download it from [mongodb.com](https://www.mongodb.com/).
- **Frontend Dependencies**: Have a modern browser such as Chrome or Firefox for running the frontend application.

**Backend Dependencies (install in the `backend` directory):**

```bash
npm install express mongoose cors multer dotenv qrcode bcrypt crypto-js
```

**Frontend Dependencies (install in the `frontend` directory):**

```bash
npm install axios qrcode.react react react-dom react-router-dom tailwindcss autoprefixer postcss jsqr
```

## Installation & Setup Instructions

Follow these steps to get the project running on your local machine:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/Prashantx11/Patient-Record-Management-System.git
    cd Patient-Record-Management-System
    ```

2.  **Backend Setup:**

    *   Navigate to the `backend` directory:

        ```bash
        cd backend
        ```

    *   Install the required Node.js packages:

        ```bash
        npm install
        ```

    *   Create a `.env` file in the `backend` directory and configure your environment variables.  Here is an example `.env` file:

        ```
        PORT=3001
        MONGODB_URI=mongodb://localhost:27017/hospitalDB
        ```

    *   Start the backend server:

        ```bash
        npm start
        ```

3.  **Frontend Setup:**

    *   Navigate to the `frontend` directory:

        ```bash
        cd ../frontend
        ```

    *   Install the required Node.js packages:

        ```bash
        npm install
        ```

    *   Start the frontend development server:

        ```bash
        npm start
        ```

        This will usually open the application in your default web browser at `http://localhost:3000`.

## Configuration Options

- **Backend Configuration:**
  - **Port:** The backend server port is configurable through the `PORT` environment variable in the `.env` file.
  - **MongoDB URI:** The MongoDB connection string can be set via the `MONGODB_URI` environment variable in the `.env` file.
- **Frontend Configuration:**
  - The frontend uses environment variables (prefixed with `REACT_APP_`) for configuration. These can be set in a `.env` file in the `frontend` directory.

## Project Structure

```
├── .gitattributes
├── README.md
├── backend
│   ├── .env
│   ├── initDB.js
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── uploads
│       └── [Example Uploaded File].png
└── frontend
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── public
    │   └── index.html
    ├── src
    │   ├── App.css
    │   ├── App.jsx
    │   └── index.js
    └── tailwind.config.js
```

## Important Files

### `README.md`

Provides project overview and setup instructions.

### `backend/initDB.js`

Script for initializing the database with default data.  It connects to MongoDB, defines a schema for a user, and creates new users (if they do not already exist).  This file is used for initial setup and seeding the database.

### `backend/package.json`

Contains project metadata and dependencies for the backend.  Key dependencies include `express`, `mongoose`, `multer`, `cors`, `dotenv`, `qrcode`, `bcrypt`, and `crypto-js`.

### `backend/server.js`

The main entry point for the backend server. It sets up the Express.js server, configures middleware, defines API endpoints for handling patient records, and integrates with MongoDB.

### `frontend/package.json`

Contains project metadata and dependencies for the frontend.  Key dependencies include `axios`, `qrcode.react`, `react`, `react-dom`, `react-router-dom`, `tailwindcss`, `autoprefixer`, `postcss`, and `jsqr`.

## Contributing Guidelines

Contributions are welcome! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and test thoroughly.
4.  Submit a pull request with a clear description of your changes.

## License Information

This project does not currently specify a license. All rights are reserved.

## Acknowledgments

*   This project utilizes the following open-source libraries and frameworks:
    *   Express.js
    *   Node.js
    *   MongoDB
    *   React
    *   Tailwind CSS
*   Special thanks to the contributors of these libraries for their valuable work.
