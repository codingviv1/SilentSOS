# SilentSOS Emergency Alert System

SilentSOS is a web-based emergency alert system designed to provide quick and discreet assistance in emergency situations. The application features a simple interface with an SOS button that, when activated, sends alerts to pre-configured emergency contacts along with the user's current location.

## Features

- **Quick SOS Alert**: Send emergency alerts with a simple button press
- **Location Tracking**: Automatically includes current location with alerts
- **Emergency Contacts Management**: Add and manage emergency contacts
- **User Authentication**: Secure login and registration system
- **Profile Management**: Update personal information and preferences
- **Settings Configuration**: Customize alert preferences and notification settings

## Tech Stack

### Frontend
- React
- TypeScript
- Redux Toolkit
- React Router
- Material-UI
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/silentsos.git
cd silentsos
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
Create `.env` files in both backend and frontend directories with the necessary environment variables.

4. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape SilentSOS
- Special thanks to the open-source community for the tools and libraries used in this project 