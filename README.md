# Winku Social Networking Server

## Overview

Welcome to the Winku Social Networking Server! This Node.js project utilizes Express.js to create a robust server-side application for managing the backend functionalities of the Winku social networking platform.

## Features

- User authentication and authorization
- Profile management
- Post creation, editing, and deletion
- Commenting and liking on posts
- Real-time notifications
- Messaging system
- Search functionality

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ArnoSahakyan/winkuback.git
    ```

2. Navigate to the project directory:

    ```bash
    cd winku-server
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:

    Create a `.env` file in the root directory and define the following variables:

    ```
    PORT=3000
    DB_URI=<your_database_connection_string>
    SECRET_KEY=<your_secret_key_for_jwt>
    ```

5. Start the server:

    ```bash
    npm start
    ```

6. The server will start running on `http://localhost:3000` by default.

## API Endpoints

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Login user and generate JWT token.
- **GET /api/profile/me**: Get current user's profile.
- **PUT /api/profile**: Update current user's profile.
- **GET /api/profile/user/:user_id**: Get profile by user ID.
- **DELETE /api/profile**: Delete current user's account.
- **POST /api/posts**: Create a new post.
- **GET /api/posts**: Get all posts.
- **GET /api/posts/:post_id**: Get post by ID.
- **PUT /api/posts/:post_id**: Update post by ID.
- **DELETE /api/posts/:post_id**: Delete post by ID.
- **POST /api/posts/comment/:post_id**: Comment on a post.
- **DELETE /api/posts/comment/:post_id/:comment_id**: Delete a comment on a post.
- **POST /api/posts/like/:post_id**: Like a post.
- **POST /api/posts/unlike/:post_id**: Unlike a post.
- **GET /api/notifications**: Get current user's notifications.
- **PUT /api/notifications/:notification_id**: Mark notification as read.
- **POST /api/messages**: Send a message to another user.
- **GET /api/messages**: Get current user's messages.
- **GET /api/messages/:user_id**: Get messages with a specific user.
- **DELETE /api/messages/:message_id**: Delete a message by ID.
- **GET /api/search/users/:query**: Search for users by username.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- JWT for authentication
- Socket.io for real-time notifications

## Contributing

Contributions are welcome! If you have any ideas for improvements or new features, feel free to open an issue or submit a pull request.

## Acknowledgements

Special thanks to the developers of Node.js, Express.js, MongoDB, and all the other open-source libraries and tools used in this project.
