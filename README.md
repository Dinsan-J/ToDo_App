To-Do App

Overview

The **To-Do App** is a simple web application that allows users to manage their tasks efficiently. Users can add, edit, delete, and mark tasks as complete or incomplete. This app helps to stay organized and track daily tasks, making it easier to manage time and prioritize activities.

---

## Features

- **Task Management**: Add, edit, delete tasks.
- **Mark Tasks as Complete/Incomplete**: Users can check off tasks when they are done.
- **Persistent Data**: Tasks are saved even when the app is closed or reloaded.
- **User-friendly Interface**: Simple, intuitive design for managing tasks.
- **Responsive Design**: The app is responsive and works across various screen sizes.

---

## Technologies Used

- **Frontend**: React.js, TaiwindCss, pagination
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) for user authentication
- **State Management**: Redux Toolkit,   React's built-in state (useState, useEffect)
---

## Installation

To set up the project locally, follow these steps:

 1. Clone the repository:


git clone https://github.com/yourusername/todo-app.git
cd todo-app




2.Install Backend Dependencies:
cd backend
npm install


3.Install Frontend Dependencies:
cd frontend
npm install



4.Set up environment variables:
Create a .env file in the backend directory and add the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development


5.Start the Backend:

cd backend
npm start


6.Start the Frontend:

cd frontend
npm start

