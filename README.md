# Slam - Anonymous Feedback Web App

Slam is an anonymous feedback platform where users receive ratings and short feedback from friends without requiring signup.

## Features

- **No Signup Required**: Users simply enter their name and generate a unique Slam link.
- **Rating System**: Anonymous 5-star ratings across multiple categories (Reliability, Trustworthiness, Honesty, Intelligence, Fun Factor).
- **Anonymous Short Feedback**: Short anonymous comments (max 50 characters).
- **Anti-Trolling Mechanism**: Results are only viewable after receiving at least 5 responses.
- **Password Protection**: Results are protected with a randomly generated password.
- **Social Sharing**: Generate shareable graphics for social media.

## Tech Stack

- **Frontend**: React (Vite) with TypeScript
- **Styling**: Pure CSS (No Tailwind)
- **State Management**: React Context API
- **Backend**: Node.js & Express (TypeScript)
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/slam.git
   cd slam
   ```

2. Install dependencies:
   ```
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the server directory with the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/slam
     JWT_SECRET=your_jwt_secret_key_here
     NODE_ENV=development
     ```

4. Start the development servers:
   ```
   # Start the server
   cd server
   npm run dev
   
   # In a separate terminal, start the client
   cd client
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to view the application.

## Project Structure

```
slam/
├── client/                 # Frontend React application
│   ├── public/             # Public assets
│   └── src/                # Source files
│       ├── assets/         # Static assets
│       ├── components/     # Reusable components
│       ├── context/        # React Context API
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── styles/         # CSS styles
│       ├── types/          # TypeScript types
│       ├── utils/          # Utility functions
│       ├── App.tsx         # Main App component
│       └── main.tsx        # Entry point
├── server/                 # Backend Node.js application
│   ├── src/                # Source files
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   └── index.ts        # Entry point
│   └── tsconfig.json       # TypeScript configuration
└── README.md               # Project documentation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) 