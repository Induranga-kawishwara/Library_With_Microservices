# Node.js Microservices Project

This project is an example of a system built using a microservices architecture with Node.js. Each core functionality is encapsulated within its own independent service, promoting scalability, maintainability, and resilience.

## Architecture

The system is decomposed into several microservices, each responsible for a specific business domain. An API Gateway serves as the single entry point for all client requests, routing them to the appropriate service.

- **API Gateway**: The single entry point for all client requests. It handles routing and can be extended for authentication, rate limiting, etc.
- **Book Service**: Manages the product catalog, including adding, updating, deleting, and searching for books.
- **Customer Service**: Handles customer registration and profile management.
- **Order Service**: Manages the process of creating and tracking orders.

## Features

- **Book Management**: CRUD operations for books.
- **Customer Management**: CRUD operations for customers.
- **Order Management**: Create and view orders.
- **Service Communication**: Services communicate with each other, typically over HTTP/REST or a message broker.

## Technologies Used

- **Backend**: Node.js, Express.js (or a similar framework)
- **Database**: MongoDB / PostgreSQL (or your database of choice)
- **API Gateway**: Can be built with Express.js or using a dedicated gateway like Ocelot or Express Gateway.
- **Package Manager**: npm or yarn

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js 16.x or later
- npm 8.x+ or yarn
- An IDE like VS Code

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/Induranga-kawishwara/Library_With_Microservices.git
    cd your-project-name
    ```

2.  **Install dependencies for all microservices:**
    You will need to run `npm install` in the directory of each service.

    ```sh
    # Example for Book Service
    cd book-service
    npm install
    cd ..
    # Repeat for customer-service and order-service
    ```

3.  **Run the services:**
    You can run each service individually by navigating to its directory:
    ```sh
    # Example for Book Service
    cd book-service
    npm start
    ```
    Alternatively, use Docker Compose to start all services at once (recommended).
    ```sh
    docker-compose up --build
    ```

## Services

| Service          | Port | Description                            |
| ---------------- | :--: | -------------------------------------- |
| API Gateway      | 8080 | Main entry point for all API requests. |
| Book Service     | 3001 | Manages books.                         |
| Customer Service | 3002 | Manages customers.                     |
| Order Service    | 3003 | Manages orders.                        |

## API Reference

All API requests should be made through the API Gateway at `http://localhost:8080`. The gateway will route requests to the appropriate service.

#### Book Service (`/api/books`)

- `GET /api/books`: Get a list of all books.
- `GET /api/books/{id}`: Get a book by its ID.
- `POST /api/books`: Add a new book.

#### Customer Service (`/api/customers`)

- `GET /api/customers`: Get a list of all customers.
- `POST /api/customers`: Register a new customer.

#### Order Service (`/api/orders`)

- `POST /api/orders`: Create a new order.
- `GET /api/orders/customer/{customerId}`: Get all orders for a specific customer.

## Configuration

Configuration for each service is typically managed using environment variables and `.env` files. Create a `.env` file in the root of each service's directory to store sensitive information like database connection strings and secret keys.

Example `.env` file:

```
PORT=3001
DATABASE_URL=mongodb://localhost:27017/books_db
```
