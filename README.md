
# MeaTube Client Web Project

This README explains how to set up and run the MeaTube client web project.

## Prerequisites

- Git
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/Oran-Zafrani/FooTube-Web.git
   cd FooTube-Web
   ```

2. Install dependencies:
   - npm node modules
   ```
   npm install
   ```
   - bootstrap icons
   ```
   npm install bootstrap-icons
   ```

## Running the Project

Start the React development server:
```
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Work Process
1. Planning: We started by planning the project, defining requirements, and creating a basic interface design.
2. Task Management - We used Jira to manage tasks and track progress:
  - Tasks were divided into sprints.
  - Jira boards were utilized to visualize the workflow and status of each task.
  - This ensured transparency and effective collaboration.
3. Project Setup: We created the project using Create React App and added the necessary dependencies.
4. Development:
  - Created basic components.
  - Added state management using React Hooks.
  - Integrated Bootstrap Icons to enhance the interface.
  - Maintained data representation consistency between android and web, for making the following work on server much fluent.
  - Added mock data to simulate representation on the website and android.
5. Data Storage:
  - Initially used local storage.
  - Faced limitations due to its 5 MB capacity.
  - Refactored the code to use IndexedDB for more robust and scalable data storage.
6. Testing: We performed manual tests to ensure functionality.

## Troubleshooting

If you encounter issues:
1. Ensure all prerequisites are installed and up-to-date
2. Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
3. Clear your browser cache and restart the development server

For more information, refer to the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

