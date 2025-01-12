# CertifyChain - Blockchain-Based Certificate Management System

A secure and efficient certificate management system built with React, Node.js, and SQLite.

## Features

- User Authentication (Login/Register)
- Certificate Issuance
- Certificate Verification
- Certificate Management
- Admin Dashboard
- User Dashboard
- QR Code Generation for Certificates

## Tech Stack

- Frontend:
  - React.js
  - Tailwind CSS
  - Axios
  - React Router
  - QR Code Generation

- Backend:
  - Node.js
  - Express.js
  - SQLite3
  - JWT Authentication
  - bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/certifychain.git
cd certifychain
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Create environment files:

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000
PORT=3000
```

Backend (backend/.env):
```
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

5. Start the backend server:
```bash
cd backend
npm start
```

6. Start the frontend server (in a new terminal):
```bash
npm start
```

The application will be available at http://localhost:3000

## Project Structure

```
certifychain/
├── src/                    # Frontend source files
│   ├── components/         # React components
│   ├── context/           # React context providers
│   └── App.js             # Main App component
├── backend/               # Backend source files
│   ├── config/           # Configuration files
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── server.js         # Express server setup
└── README.md             # Project documentation
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout

### Certificates
- POST `/api/certificates` - Issue new certificate
- GET `/api/certificates/all` - Get all certificates (admin)
- GET `/api/certificates/my-certificates` - Get user's certificates
- GET `/api/certificates/verify/:certificateId` - Verify certificate
- POST `/api/certificates/revoke/:certificateId` - Revoke certificate (admin)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 