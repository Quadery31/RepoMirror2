RepoMirror Backend

This folder contains the backend of RepoMirror. The backend is responsible for handling all core logic, data processing, and communication with external services.
It validates input from the frontend, fetches repository data from the GitHub API, analyzes the data, calculates quality metrics, and returns structured results to the frontend.

What the backend does?
Validates incoming repository URLs
Communicates with the GitHub REST API
Fetches repository metadata, files, and commit history
Processes data to evaluate repository quality
Calculates a repository score based on defined rules
Generates summaries and improvement suggestions
Stores analysis history in the database
Handles errors such as invalid repositories and API limits

Backend tech stack:
Node.js
Express.js
MongoDB (Atlas)
GitHub REST API
API responsibilities

The backend exposes REST APIs that are consumed by the frontend. It acts as a middle layer between the frontend and GitHub, ensuring:
Secure handling of GitHub tokens
Centralized analysis and scoring logic
Clean and consistent API responses
Separation of concerns between UI and business logic

Project structure
routes: API route definitions
controllers: Request handling and response logic
services: GitHub API interaction and analysis logic
models: Database schemas
config: Environment and database configuration

Running the backend locally
Navigate to the backend folder
Install dependencies using npm install
Create a .env file and add required environment variables
Start the server using node index.js
The backend runs on port 5000 by default unless configured otherwise.

Environment variables
The backend requires the following environment variables:
PORT: Server port number
MONGO_URI: MongoDB connection string
GITHUB_TOKEN: GitHub personal access token
These values are required for the backend to function correctly.

Notes
All analysis and scoring logic lives in the backend
The frontend does not directly call the GitHub API
This folder is part of a larger full stack MERN application
