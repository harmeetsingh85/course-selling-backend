# Course Selling Backend

Backend API for a course selling platform with user/admin roles, authentication, and course management.

## Features

* Admin: Course management.
* User: Course viewing, purchasing, authentication.
* JWT authentication (separate user/admin tokens).
* Input validation (Zod).
* Password hashing (Bcryptjs).

## Technologies

Node.js, Express.js, MongoDB, Mongoose, JWT, Bcryptjs, Zod.

## Setup

1. `git clone <repo_url>`
2. `cd course-selling-backend`
3. `npm install`
4. `.env`: `MONGO_URL`, `JWT_ADMIN_SECRET`, `JWT_USER_SECRET` (use strong secrets!)
5. `npm start` (`http://localhost:3000`)

## API

### Auth

* `POST /admin/signUp`: Register a new admin.
* `POST /admin/signIn`: Admin login (returns JWT).
* `POST /user/signUp`: Register a new user.
* `POST /user/signIn`: User login (returns JWT).

### Admin (requires Admin JWT)

* `POST /admin/createCourse`: Create a new course.
* `GET /admin/createdcourses`: View courses created by the logged-in admin.

### User (requires User JWT)

* `GET /user/allCourses`: View all available courses.
* `GET /user/myCourses`: View the logged-in user's purchased courses.
* `POST /user/purchase-course/:id`: Purchase a specific course by ID.

## Notes

* MongoDB required.
* For production, configure environment variables and server.
* Payment integration will be added in future.
