# GigFlow - Freelance Marketplace Platform

A full-stack MERN application that connects clients with freelancers. Clients can post job opportunities (gigs), and freelancers can submit competitive bids. The platform features real-time notifications and secure transaction handling.

## Features Implemented

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with HttpOnly cookies
- **Fluid User Roles**: Users can act as both clients (posting jobs) and freelancers (bidding)
- **Gig Management**: Full CRUD operations for job postings
- **Search & Filter**: Find gigs by title with real-time search
- **Bidding System**: Freelancers can submit proposals with custom pricing
- **Dashboard**: Separate views for managing posted jobs and submitted bids
- **Hiring Workflow**: Complete hire process with automatic status updates

### Advanced Features
- **Transaction Integrity**: MongoDB transactions prevent race conditions during hiring
- **Real-time Notifications**: Socket.io integration for instant hire notifications
- **Security**: Password hashing, JWT tokens, HttpOnly cookies, CORS protection
- **Performance**: Database indexes for optimized queries

## Tech Stack

**Frontend**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Context API for state management

**Backend**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Socket.io for real-time features
- bcryptjs for password encryption

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
node server.js
```

The server will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: token=<jwt_token>
```

#### Logout
```http
POST /api/auth/logout
```

### Gig Endpoints

#### Get All Gigs
```http
GET /api/gigs?search=react&ownerId=<userId>
```
Query Parameters:
- `search` (optional): Filter gigs by title
- `ownerId` (optional): Get gigs by specific owner

#### Get Single Gig
```http
GET /api/gigs/:id
```

#### Create Gig (Protected)
```http
POST /api/gigs
Cookie: token=<jwt_token>
Content-Type: application/json

{
  "title": "Build a React Website",
  "description": "Need a responsive website with React",
  "budget": 1500,
  "deadline": "2026-02-15"
}
```

### Bid Endpoints

#### Submit Bid (Protected)
```http
POST /api/bids
Cookie: token=<jwt_token>
Content-Type: application/json

{
  "gigId": "gig_id_here",
  "price": 1200,
  "message": "I can complete this project in 2 weeks"
}
```

#### Get Bids for Gig (Owner Only)
```http
GET /api/bids/:gigId
Cookie: token=<jwt_token>
```

#### Hire Freelancer (Owner Only)
```http
PATCH /api/bids/:bidId/hire
Cookie: token=<jwt_token>
```

This endpoint implements the core hiring logic:
- Changes gig status from `open` to `assigned`
- Updates hired bid status to `hired`
- Automatically marks all other bids as `rejected`
- Sends real-time notification to hired freelancer
- Uses MongoDB transactions for data consistency

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Gig Model
```javascript
{
  title: String,
  description: String,
  budget: Number,
  deadline: Date,
  owner: ObjectId (ref: User, indexed),
  status: String (enum: ['open', 'assigned'], indexed),
  createdAt: Date,
  updatedAt: Date
}
```

### Bid Model
```javascript
{
  gigId: ObjectId (ref: Gig, indexed),
  freelancerId: ObjectId (ref: User, indexed),
  price: Number,
  message: String,
  status: String (enum: ['pending', 'hired', 'rejected'], indexed),
  createdAt: Date,
  updatedAt: Date
}
```

## User Flow

### As a Client (Job Poster)

1. **Register/Login** to your account
2. **Post a Gig**: Navigate to "+ Post Gig" and fill in job details
3. **View Dashboard**: Go to "My Dashboard" to see your posted jobs
4. **Review Bids**: Click on any job to see freelancer proposals
5. **Hire**: Click "HIRE NOW" on your preferred bid
   - The gig status changes to "ASSIGNED"
   - Selected bid is marked as "HIRED"
   - Other bids are automatically marked as "REJECTED"
   - Freelancer receives instant notification

### As a Freelancer (Bidder)

1. **Register/Login** to your account
2. **Browse Gigs**: View available jobs on the home page
3. **Search**: Use the search bar to find specific opportunities
4. **View Details**: Click "View Details" to see full job description
5. **Place Bid**: Submit your proposal with price and cover letter
6. **Get Notified**: Receive real-time notification if you're hired

## Key Implementation Details

### Transaction Integrity (Bonus 1)
The hire functionality uses MongoDB transactions to handle race conditions:

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Update bid status
  bid.status = 'hired';
  await bid.save({ session });
  
  // Update gig status
  gig.status = 'assigned';
  await gig.save({ session });
  
  // Reject other bids
  await Bid.updateMany(
    { gigId: gig._id, _id: { $ne: bidId } },
    { status: 'rejected' },
    { session }
  );
  
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
}
```

This ensures that if two clients try to hire different freelancers simultaneously, only one transaction succeeds.

### Real-time Notifications (Bonus 2)
Socket.io implementation for instant updates:

**Server Side:**
```javascript
io.on("connection", (socket) => {
  socket.on("addNewUser", (userId) => {
    global.onlineUsers[userId] = socket.id;
  });
});

// When hiring
io.to(socketId).emit("hireNotification", {
  message: `Congratulations! You have been hired for "${gigTitle}"`,
  gigId: gigId
});
```

**Client Side:**
```javascript
useEffect(() => {
  if (user) {
    socket.emit("addNewUser", user.id);
    socket.on("hireNotification", (data) => {
      alert(data.message);
    });
  }
}, [user]);
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication with 1-day expiry
- **HttpOnly Cookies**: Prevents XSS attacks
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Server-side validation for all inputs
- **Unique Constraints**: Prevents duplicate bids via compound index

## Project Structure

```
ServiceHire_Assessment/
├── client/                     # Frontend application
│   ├── src/
│   │   ├── api/               # Axios configuration
│   │   ├── components/        # Reusable UI components
│   │   │   ├── GigCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── NotificationHandler.jsx
│   │   ├── context/           # React Context for auth
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── AddGig.jsx
│   │   │   ├── GigDetails.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyGigs.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend application
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── bidController.js   # Bid management
│   │   └── gigController.js   # Gig management
│   ├── middleware/
│   │   └── verifyToken.js     # JWT verification
│   ├── models/
│   │   ├── Bid.js             # Bid schema
│   │   ├── Gig.js             # Gig schema
│   │   └── User.js            # User schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── bidRoutes.js       # Bid endpoints
│   │   └── gigRoutes.js       # Gig endpoints
│   ├── .env.example           # Environment template
│   ├── package.json
│   └── server.js              # Entry point
│
└── README.md
```

## Testing the Application

### Test Scenario 1: Complete User Journey

1. Register as User A (Client)
2. Login as User A
3. Post a new gig with title "Build Mobile App"
4. Logout

5. Register as User B (Freelancer)
6. Login as User B
7. Browse gigs and find "Build Mobile App"
8. Submit a bid with your proposed price
9. Keep browser open to receive notification

10. Login as User A in another browser/incognito
11. Go to "My Dashboard"
12. Click on "Build Mobile App" gig
13. Review User B's bid
14. Click "HIRE NOW"

**Expected Results:**
- User B receives instant notification
- Gig status changes to "ASSIGNED"
- User B's bid shows "HIRED"
- Any other bids are marked "REJECTED"

### Test Scenario 2: Race Condition Prevention

1. Create a gig with multiple bids
2. Open two client sessions simultaneously
3. Try to hire different freelancers at the exact same time
4. Only one hire should succeed, the other should fail

## Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gigflow?retryWrites=true&w=majority

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_super_secure_random_secret_key_here

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

## Deployment Notes

### Production Checklist

- [ ] Change `NODE_ENV` to `production`
- [ ] Use strong `JWT_SECRET` (32+ random characters)
- [ ] Update `CLIENT_URL` to production frontend URL
- [ ] Enable HTTPS
- [ ] Use MongoDB Atlas for database
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add monitoring and logging

### Recommended Platforms

**Backend**: Railway, Render, Heroku, AWS EC2  
**Frontend**: Vercel, Netlify, AWS S3 + CloudFront  
**Database**: MongoDB Atlas

## Known Limitations

- Email verification not implemented
- Password reset functionality not included
- File upload for gig attachments not supported
- Payment integration not implemented
- Review/rating system not included

These features were excluded to focus on the core requirements and bonus features specified in the assignment.

## Development Notes

This project was built as a full-stack internship assignment focusing on:
- Complex database relationships and transactions
- Secure authentication patterns
- Real-time communication with WebSockets
- Race condition handling
- Clean code architecture

The codebase follows best practices including:
- Separation of concerns (MVC pattern)
- Environment-based configuration
- Input validation and error handling
- Database indexing for performance
- Security-first approach

## Support

For questions or issues, please refer to the code comments or contact the development team.

## License

This project is part of an internship assignment for ServiceHive.
