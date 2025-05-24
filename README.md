# billeasy_assesment

This is a RESTful API for managing books, users, and reviews. It allows users to register, create books, add reviews, and manage book-related data using MongoDB and Mongoose.
Project Setup Instructions

Prerequisites:

Node.js (v18 or higher)
MongoDB (local or cloud instance, e.g., MongoDB Atlas)
Git (for cloning the repository)


Clone the Repository:
git clone <https://github.com/Akshataparghane/billeasy_assesment.git>
cd BOOKREVIEW


Install Dependencies:
npm install

Key dependencies include:

mongoose: For MongoDB object modeling
express: For building the REST API
dotenv: For environment variable management


Set Up Environment Variables:Create a .env file in the root directory and add the following:
MONGODB_URL=mongodb://localhost:27017/BOOKREVIEW
PORT=3001
SECRETKEY = Scretekeyforlogin

Replace MONGODB_URL with your MongoDB connection string if using a cloud instance.

How to Run Locally

Start MongoDB:Ensure MongoDB is running locally or accessible via your MONGO_URL.

Run the Application:
npm run start

The server will start on http://localhost:3001 (or the port specified in .env).

Test the API:Use tools like Postman, curl, or a browser to interact with the API endpoints.


Example API Requests
Below are example API requests using curl. Ensure the server is running before testing.
1. Create a User
curl -X POST http://localhost:3001/users \
-H "Content-Type: application/json" \
-d '{
  "title": "Mr",
  "name": "John Doe",
  "phone": "1234567890",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "pincode": "10001"
  }
}'

2. Create a Book
curl -X POST http://localhost:3000/books \
-H "Content-Type: application/json" \
-d '{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "excerpt": "A story of the fabulously wealthy Jay Gatsby.",
  "userId": "<valid-user-id>",
  "ISBN": "978-0743273565",
  "genre": "Fiction",
  "releasedAt": "1925-04-10"
}'

3. Add a Review
curl -X POST http://localhost:3000/reviews \
-H "Content-Type: application/json" \
-d '{
  "bookId": "<valid-book-id>",
  "userId": "<valid-user-id>",
  "reviewedAt": "2025-05-24",
  "rating": 4,
  "review": "A captivating read!"
}'

4. Get All Books
curl -X GET http://localhost:3000/books

Notes:

Replace <valid-user-id> and <valid-book-id> with actual MongoDB ObjectIDs.
Use Postman for a GUI-based alternative to test these endpoints.


