# CV Builder Assessment

A full-stack CV/resume builder application with React frontend and Node.js/Express backend.

## Project Structure

```
.
├── backend/          # Node.js/Express server
└── frontend/         # React client application
```

## Features

- User authentication (registration, login, logout)
- Create, edit, and manage multiple resumes
- Professional resume templates
- Export resumes as PDF
- Stripe payment integration for premium features

## Tech Stack

### Frontend

- React.js
- Redux for state management
- Material-UI for UI components
- Axios for HTTP requests
- Formik & Yup for form validation

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payment processing
- Swagger for API documentation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- pnpm (recommended) or npm or yarn

## Installation

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or with pnpm:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLIENT_URL=http://localhost:3000
   ```

4. Start the server:

   ```bash
   npm start
   ```

   or for development with nodemon:

   ```bash
   npm run dev
   ```

   With pnpm:

   ```bash
   pnpm start
   ```

   or for development:

   ```bash
   pnpm run dev
   ```

   To build for production:

   ```bash
   pnpm run build
   ```

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or with pnpm:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:

   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Start the development server:

   ```bash
   npm start
   ```

   With pnpm:

   ```bash
   pnpm start
   ```

   or for development:

   ```bash
   pnpm run dev
   ```

   To build for production:

   ```bash
   pnpm run build
   ```

## Usage

1. Start both the backend and frontend servers
2. Open your browser and navigate to `http://localhost:3000`
3. Register a new account or login with existing credentials
4. Create and customize your resume using the intuitive editor
5. Preview and export your resume as PDF

## API Documentation

The backend API is documented with Swagger. When the server is running, visit:

```
http://localhost:5000/api-docs
```

## Environment Variables

### Backend `.env` file

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `STRIPE_SECRET_KEY`: Stripe secret key for payment processing
- `CLIENT_URL`: Frontend application URL

### Frontend `.env` file

- `REACT_APP_API_URL`: Backend API base URL
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

## Folder Structure

### Backend

```
backend/
├── controllers/     # Request handlers
├── middlewares/     # Custom middleware functions
├── models/          # Mongoose models
├── routes/          # API route definitions
├── utils/           # Utility functions
├── validations/     # Input validation schemas
├── app.js          # Express application setup
└── server.js       # Server entry point
```

### Frontend

```
frontend/
├── public/         # Static assets
├── src/
│   ├── components/ # Reusable UI components
│   ├── layout/     # Page layouts
│   ├── pages/      # Page components
│   ├── redux/      # Redux store and slices
│   ├── routes/     # Application routing
│   ├── services/   # API service functions
│   ├── utils/      # Utility functions
│   ├── App.js      # Root component
│   └── index.js    # Entry point
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support or queries, please contact the project maintainers.
