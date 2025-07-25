# hospital-app

Hospital Record Management System (HRMS)

Overview

The Hospital Record Management System (HRMS) is a secure, PKI-based application designed to manage electronic Protected Health Information (ePHI) with robust security features. Built to comply with HIPAA standards, it enables administrators to authenticate using digital certificates, sign patient records with RSA signatures, and encrypt data with AES-256. Patients access their records via QR codes with a three-attempt lockout mechanism. This project was developed locally on a Mac using VSCode and is containerized with Docker for consistent deployment.

Features





Certificate-Based Authentication: Admins log in using X.509 certificates verified against a trusted CA.



RSA Signatures: Ensures record integrity and non-repudiation.



AES-256 Encryption: Secures patient records stored in MongoDB.



QR Code Access with Lockout: Patients scan QR codes to access records, with a three-attempt limit.



HIPAA Compliance: Protects ePHI with encryption and access controls.

Technologies Used





Backend: Node.js v18.20.8, Express



Frontend: React v18.2.0, Tailwind CSS



Database: MongoDB 8.0



Security: node-forge (for PKI), crypto (for AES-256)



Utilities: jsqr (QR scanning), Docker (deployment)

Prerequisites





Node.js v18.20.8



MongoDB 8.0



Docker Desktop



Git



VSCode (recommended)

Installation





Clone the Repository:

git clone https://github.com/your-username/hrms.git
cd hrms



Install Dependencies:





Backend: cd backend && npm install



Frontend: cd frontend && npm install



Set Up Environment Variables:





Create a .env file in the backend directory with:

MONGODB_URI=mongodb://localhost:27017/hrs_db
CA_CERT_PATH=/path/to/ca.crt



Update paths as needed.



Install MongoDB and Start Service:

brew tap mongodb/brew
brew install mongodb-community@8.0
brew services start mongodb/brew/mongodb-community



Run with Docker:

docker-compose up --build

Usage





Admin Access: Open http://localhost:3000/admin in your browser, upload your X.509 certificate and key, and log in to manage records.



Patient Access: Open http://localhost:3000/patient, scan the QR code provided by the admin, and enter the ticket ID to view records.



Security Note: Ensure your CA certificate is trusted and stored securely.

Development





Developed locally on a Mac using VSCode.



Follows an iterative methodology with phases: Setup, Backend, Frontend, Integration, Testing.



Git is used for version control; issues are tracked via GitHub Issues.

Contributing





Fork the repository.



Create a feature branch: git checkout -b feature-name.



Commit changes: git commit -m "Add feature-name".



Push to the branch: git push origin feature-name.



Submit a pull request.

License

This project is licensed under the MIT License - see the LICENSE file for details.

Contact

For questions or support, contact [Your Name] at [your-email@example.com].

Acknowledgments





Thanks to the open-source communities for Node.js, React, MongoDB, and Docker.



Special appreciation to xAI for supporting this development journey.
