# Library API

## Table of Contents

- [Library API](#library-api)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Running with Docker](#running-with-docker)
  - [API Endpoints](#api-endpoints)
    - [Health Check](#health-check)
    - [Books](#books)
  - [Testing](#testing)
  - [Error Handling](#error-handling)
  - [Key Code Components](#key-code-components)
  - [License](#license)

## Project Overview

The Library API is a backend service built using AdonisJS, designed to manage a collection of books. It provides endpoints for creating, retrieving, updating, and deleting book records. The API is structured to handle various operations efficiently and includes features like request validation, error handling, and scheduled tasks.

## Tech Stack

- **AdonisJS**: A Node.js framework used for building scalable server-side applications.
- **TypeScript**: Provides static typing for JavaScript, enhancing code quality and maintainability.
- **PostgreSQL**: A robust relational database used for storing book data.
- **Luxon**: A library for handling dates and times.
- **VineJS**: Used for request validation.
- **Cron**: For scheduling tasks like deleting old entries.
- **Docker**: Used for containerizing the application.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 22 or higher)
- npm (version 11 or higher)
- PostgreSQL (version 16 or higher)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/{yourusername}/library-api.git
   cd library-api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:** Copy the example environment file and update it with your configuration.

   ```bash
   cp .env.example .env
   ```

   Ensure you set the correct values for database connection, API keys, and other configurations.

4. **Database Setup:** Initialize the database and run migrations

   ```bash
   node ace migration:fresh
   node ace db:seed -f ./database/seeders/book_seeder.ts
   ```

5. **Run the Application:** Start the development server

   ```bash
    npm run dev
   ```

   The API will be available at <http://localhost:3333> by default or else at <http://localhost:{PORT}> PORT declared in env variable.

## Running with Docker

To run the application using Docker, ensure Docker is installed and running on your machine. Then, execute:

   ```bash
   docker-compose up
   ```

## API Endpoints

### Health Check

> GET /health
>
>`x-monitoring-secret` key with value same as value of `HEALTH_CHECK_API_KEY` env variable is required in headers

Returns a simple health check message.

### Books

> GET /**books**

Retrieve a list of all books. Supports filtering by genre, checked out status, and search terms.

> POST /books

Add a new book to the library. Requires an API key for authentication.

> GET /books/{id}

Retrieve a specific book by its ID.

> PATCH /books/{id}

Update a book's details by its ID. Requires an API key for authentication.

> DELETE /books/{id}

Delete a book by its ID.
 Requires an API key for authentication.

## Testing

To run the test suite, execute:

   ```bash
   npm run test
   ```

For continuous testing during development, use:

   ```bash
   npm run test:watch
   ```

## Error Handling

The application uses a centralized error handling mechanism to manage exceptions and provide meaningful error responses. Key components include:

- **Exception Handler**: Located in app/exceptions/handler.ts, it captures and processes exceptions, returning appropriate HTTP responses.
- **Custom Exceptions**: Defined in app/exceptions, such as UnProcessableException, to handle specific error scenarios.
- **`{"name":"KnexTimeoutError"}`**: If this is the response, then the error is due to application is unable to either connect to database, or else DBMS is not responding. Give it 2-5 mins on Replit and it auto-starts DB service, or else re-deploy your code to fix it immediately

## Key Code Components

- **Controllers:** Located in app/controllers, these handle incoming requests and return responses. For example, books_controller.ts manages book-related operations.
- **Services:** Found in app/services, these contain business logic. book_service.ts is responsible for operations like fetching and updating books.
- **Models:** Defined in app/models, these represent database entities. book.ts is the model for book records.
- **Middleware:** Located in app/middleware, these are used for request processing, such as api_key_required_middleware.ts for API key validation.
- **Validators:** Found in app/validators, these ensure request data is valid before processing. For instance, book_create_request_validator.ts validates book creation requests.
- **Scheduled Tasks:** Managed by scheduler_service.ts in app/services, which schedules jobs like delete_entries_job.ts to clean up old data.

## License

This project is licensed under the ISC License. See the LICENSE.md file for more details.
