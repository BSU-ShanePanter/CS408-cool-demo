# Full Stack Web Application Starter

This is a starter template for a full stack web application built with Node.js,
Express, and SQLite. It includes scripts to help set up and configure the
application on an AWS EC2 instance.

## Technology Stack

- Backend technology stack
    - Web Server: [nginx](https://www.nginx.com/) as a reverse proxy server
    - Backend Runtime: [Node.js](https://nodejs.org/)
    - Backend Framework: [Express](https://expressjs.com/)
    - Database: [SQLite](https://www.sqlite.org/index.html) for lightweight data storage
- Frontend technology stack
    - Templating: [EJS](https://ejs.co/) for server-side rendering
    - UX/UI: [Bootstrap](https://getbootstrap.com/) for responsive design
- Testing Frameworks
    - Backend Testing: [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/)
    - End-to-End Testing: [Playwright](https://playwright.dev/)

## Features

- Virtually no error handling, input validation, or security features (for educational purposes only)
- Basic CRUD operations showing how to create, read, and delete items in a
  SQLite database, updating is left as an exercise for the reader
- Simple game showing integration of frontend JavaScript with the backend
  application

## Local Development

This project has been fully tested and is supported on GitHub CodeSpaces. Your
instructor will not support any issues running this project on your local machine,
but if you wish to try, ensure you have the following installed:

- Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Install [VS Code](https://code.visualstudio.com/download)
- Install [Node.js](https://nodejs.org/en/download) version 24 or higher

To develop locally, clone the repository and install the necessary packages.

```bash
npm install
npx playwright install
```

To start the development server, run:

```bash
npm start
```

This will start the application on `http://localhost:3000`.

## Production Setup

To set up the production environment on an EC2 instance, follow the instructions
in the [`README`](docs/README) in the docs directory. This file contains detailed steps
for configuring the server, installing dependencies, and deploying the
application.
