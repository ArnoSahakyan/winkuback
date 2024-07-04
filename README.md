Here is a README file for your backend with all the provided routes:

# Project Name

## Overview

This project is a backend server built with Node.js and Express. It provides authentication, user management, posting, commenting, liking, and messaging functionalities, along with image upload and compression features.

## Setup

### Prerequisites

- Node.js
- PostgreSQL
- Supabase account (for image storage)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables. Create a `.env` file in the root directory and add the following:

   ```env
   PORT=<your-port>
   USER_NAME=<your-database-username>
   HOST=<your-database-host>
   PASSWORD=<your-database-password>
   DB_NAME=<your-database-name>
   CORS=<your-cors-url>
   ACCESS_TOKEN_SECRET=<your-jwt-access-token-secret>
   REFRESH_TOKEN_SECRET=<your-jwt-refresh-token-secret>
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_KEY=<your-supabase-key>
   SUPABASE_IMAGE_URL=<your-supabase-image-url>
   ```

4. Run database migrations and seeders if necessary.

### Running the Server

To start the server in development mode:

```sh
npm run dev
```

To start the server in production mode:

```sh
npm start
```

## API Endpoints

### Authentication Routes

- **Signup:**
  ```http
  POST /api/auth/signup
  ```
  Middleware:
  - `verifySignUp.checkDuplicateUsernameOrEmail`
  - `verifySignUp.checkRolesExisted`
  - Controller: `controller.signup`

- **Signin:**
  ```http
  POST /api/auth/signin
  ```
  Controller: `controller.signin`

- **Refresh Token:**
  ```http
  POST /api/auth/refresh
  ```
  Controller: `controller.refreshToken`

- **Get User Info:**
  ```http
  GET /api/user/info
  ```
  Middleware: `verifyToken`
  Controller: `controller.userInfo`

- **Get User by ID:**
  ```http
  GET /api/user/:id
  ```
  Middleware: `verifyToken`
  Controller: `controller.getUserById`

### User Routes

- **All Access:**
  ```http
  GET /api/test/all
  ```
  Controller: `controller.allAccess`

- **User Board:**
  ```http
  GET /api/test/user
  ```
  Middleware: `authJwt.verifyToken`
  Controller: `controller.userBoard`

- **Moderator Board:**
  ```http
  GET /api/test/mod
  ```
  Middleware: `authJwt.verifyToken`, `authJwt.isModerator`
  Controller: `controller.moderatorBoard`

- **Admin Board:**
  ```http
  GET /api/test/admin
  ```
  Middleware: `authJwt.verifyToken`, `authJwt.isAdmin`
  Controller: `controller.adminBoard`

- **Update User Data:**
  ```http
  PATCH /api/user/update
  ```
  Middleware: `authJwt.verifyToken`
  Controller: `controller.updateUserData`

- **Update User Status:**
  ```http
  PATCH /api/user/status
  ```
  Middleware: `authJwt.verifyToken`
  Controller: `controller.updateUserStatus`

- **Search Users:**
  ```http
  GET /api/search-user
  ```
  Middleware: `authJwt.verifyToken`
  Controller: `controller.searchUsers`

### Post Routes

- **Create Post:**
  ```http
  POST /api/post
  ```
  Middleware: `verifyToken`, `uploadMiddleware.single('file')`, `compressImageMiddleware`
  Controller: `createPost`

- **Delete Post:**
  ```http
  DELETE /api/delete-post/:postId
  ```
  Middleware: `verifyToken`
  Controller: `deletePost`

- **Get All Posts by User:**
  ```http
  GET /api/user-posts
  ```
  Middleware: `verifyToken`
  Controller: `getAllPostsByUser`

- **Get Newsfeed:**
  ```http
  GET /api/posts
  ```
  Middleware: `verifyToken`
  Controller: `getNewsfeed`

- **Like Post:**
  ```http
  POST /api/like
  ```
  Middleware: `verifyToken`
  Controller: `likePost`

- **Unlike Post:**
  ```http
  POST /api/unlike
  ```
  Middleware: `verifyToken`
  Controller: `unlikePost`

- **Create Comment:**
  ```http
  POST /api/comment
  ```
  Middleware: `verifyToken`
  Controller: `createComment`

### Friend Routes

- **Get Friends:**
  ```http
  GET /api/friends
  ```
  Middleware: `verifyToken`
  Controller: `getFriends`

- **Get Unassociated Users:**
  ```http
  GET /api/unassociated-users
  ```
  Middleware: `verifyToken`
  Controller: `getUnassociatedUsers`

- **Delete Friend:**
  ```http
  DELETE /api/delete-friend/:friendId
  ```
  Middleware: `verifyToken`
  Controller: `deleteFriend`

### Friend Request Routes

- **Get Friend Requests:**
  ```http
  GET /api/requests
  ```
  Middleware: `verifyToken`
  Controller: `getRequests`

- **Send Friend Request:**
  ```http
  POST /api/send-request
  ```
  Middleware: `verifyToken`
  Controller: `sendFriendRequest`

- **Respond to Friend Request:**
  ```http
  POST /api/respond-request
  ```
  Middleware: `verifyToken`
  Controller: `respondToFriendRequest`

### Message Routes

- **Save Message:**
  ```http
  POST /api/messages
  ```
  Middleware: `verifyToken`
  Controller: `saveMessage`

- **Get Messages:**
  ```http
  GET /api/messages/:friendId
  ```
  Middleware: `verifyToken`
  Controller: `getMessages`

### Upload Routes

- **Upload User Images:**
  ```http
  POST /api/upload/user-images
  ```
  Middleware: `verifyToken`, `uploadMiddleware.single('file')`, `compressImageMiddleware`
  Controller: `controllerUserImages`

## Additional Middleware and Controllers

### Middleware

- **uploadMiddleware**: Handles file uploads using `multer`.
- **compressImageMiddleware**: Compresses uploaded images and converts them to `webp` format.

### Controllers

- **controller**: Handles various user-related operations.
- **createPost**: Handles creating posts.
- **deletePost**: Handles deleting posts.
- **getAllPostsByUser**: Retrieves all posts by a user.
- **getNewsfeed**: Retrieves the newsfeed.
- **likePost**: Handles liking a post.
- **unlikePost**: Handles unliking a post.
- **createComment**: Handles creating comments.
- **getFriends**: Retrieves the friends list.
- **getUnassociatedUsers**: Retrieves users not associated as friends.
- **deleteFriend**: Handles deleting a friend.
- **getRequests**: Retrieves friend requests.
- **sendFriendRequest**: Handles sending a friend request.
- **respondToFriendRequest**: Handles responding to a friend request.
- **saveMessage**: Handles saving messages.
- **getMessages**: Retrieves messages with a friend.
- **controllerUserImages**: Handles user image uploads and updates.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Supabase](https://supabase.io/)

Feel free to reach out if you have any questions or need further assistance!