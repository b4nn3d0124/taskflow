# Taskflow — Task Management System (Project Summary)

Taskflow is a modern full-stack task management application built to streamline daily productivity through a clean interface and a scalable, cloud-based backend.

The frontend is developed using TypeScript, HTML, and Tailwind CSS, delivering a responsive and user-friendly experience. The system follows a structured and maintainable design approach, ensuring clarity between UI components, logic handling, and data interaction.

Instead of a traditional backend using Express.js, Taskflow leverages Firebase as its Backend-as-a-Service (BaaS), simplifying infrastructure while providing powerful real-time capabilities.

## Core Features

### Authentication System
Taskflow uses Firebase Authentication to handle secure user login and registration. Each user has isolated access to their own tasks, ensuring privacy and data integrity.

### Task Management (CRUD Operations)
Users can:

* Create tasks with titles, descriptions, deadlines, and priority levels
* View all tasks in a structured layout
* Edit and update task details in real-time
* Delete tasks when no longer needed

### Task Status Tracking
Each task includes a status system:

* Pending
* In Progress
* Completed

This allows users to easily monitor progress and workflow.

### Real-Time Database Integration
Taskflow uses Firebase Firestore to store and sync data instantly. Any changes made by the user reflect immediately without requiring page reloads.

### Filtering and Organization
Users can:

* Filter tasks by status or priority
* Sort tasks by date or urgency
* Quickly locate tasks using a search function

### Clean UI/UX Design
The interface is built with Tailwind CSS, focusing on:

* Minimalist layout
* Clear task visibility
* Smooth interaction (modals, buttons, inline edits)

## Architecture & Design Approach

Taskflow follows a clean and modular structure:

* UI Layer – Handles rendering and user interaction
* Logic Layer – Manages task operations and state
* Service Layer – Communicates with Firebase (Auth + Firestore)

This separation improves scalability, readability, and long-term maintainability.

## Tech Stack

* Frontend: TypeScript, HTML, Tailwind CSS
* Backend (BaaS): Firebase
  * Firebase Authentication
  * Cloud Firestore
* Architecture: Modular / Clean Architecture (Frontend-focused)

## Advanced Features (included)

* Real-time task updates across devices
* Task history or activity logs
* Notifications and deadline reminders
* Role-based access (e.g., admin panel)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A Firebase project

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/b4nn3d0124/taskflow.git
   cd taskflow
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Authentication with Email/Password provider
   - Enable Firestore Database
   - Get your Firebase config from Project Settings > General > Your apps

4. Update the Firebase config in `src/index.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

5. Build the project:
   ```
   npm run build
   ```

6. Start the development server:
   ```
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Register a new account or login with existing credentials.
2. Add new tasks using the "Add Task" button.
3. Edit or delete tasks using the respective buttons.
4. Use filters and search to organize your tasks.
5. Tasks update in real-time across all your devices.

## Project Structure

```
taskflow/
├── src/
│   ├── app/
│   │   └── App.ts          # Main application class
│   ├── models/
│   │   └── Task.ts         # Task data model
│   ├── services/
│   │   ├── AuthService.ts  # Firebase Authentication service
│   │   └── TaskService.ts  # Firestore task operations
│   ├── ui/
│   │   ├── AuthUI.ts       # Authentication UI components
│   │   └── TaskUI.ts       # Task management UI components
│   └── index.ts            # Application entry point
├── dist/                   # Compiled output
├── index.html              # Main HTML file
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```