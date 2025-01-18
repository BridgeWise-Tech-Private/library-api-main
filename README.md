# Library API v3

## Overview

Library API v3 is a RESTful API designed for managing a collection of books. It provides endpoints for creating, retrieving, updating, and deleting books in the library. The API is built using Node.js, Fastify, and TypeScript, and it leverages PostgreSQL for data storage.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Debugging](#debugging)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- PostgreSQL (version 12 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/library-api-v3.git
   cd library-api-v3
2. Install the dependencies:

    ```bash
    npm install
3. Initialize the database:
    ```bash
    npm run db:init
    npm run db:dev:pristine
## Configuration
1. Copy the example environment variables file to .env:
    ```bash
    cp .env.example .env
2. Update the .env file with your database credentials and any other necessary configuration.

## Running your application
To start the development server, run:
```bash 
npm run dev
```
The API will be available at http://localhost:4000 by default.

## API Endpoints
### Health Check
> GET /Returns a simple health check message.

### Books
> GET /booksRetrieve a list of all books. Supports filtering by genre, checked out status, and search terms. 

> POST /booksAdd a new book to the library. Requires an API key for authentication.

> GET /books/{id}Retrieve a specific book by its ID.

> PATCH /books/{id}Update a book's details by its ID. Requires an API key for authentication.

> DELETE /books/{id} Delete a book by its ID.
 Requires an API key for authentication.
 
## Testing
To run the test suite, execute:
```bash
    npm test
```

For continuous testing during development, use:
```bash
npm test:watch
```

## Debugging
To debug the application in Visual Studio Code:Open the debugger tab.Select launch dev server as the task.Press the "play" button to start debugging.
