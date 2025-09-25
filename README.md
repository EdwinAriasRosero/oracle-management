# Server Communication Project

## Overview

This project is a full-stack solution designed to provide a secure, web-based interface for interacting with a remote Oracle database. It features a three-tiered architecture:

1.  **Angular Client**: A rich user interface for database connection, query execution, and file sharing.
2.  **NestJS Server**: A central backend API that manages communication between the client and the proxy using WebSockets and provides REST endpoints for file sharing.
3.  **Node.js Proxy**: A lightweight service that connects directly to the Oracle database, executes queries, and relays results back to the server. It is designed to be deployed on a machine that has direct access to the database.

The entire system is orchestrated with scripts in the root `package.json` for easy installation, development, and building.

## Global Architecture

The application's architecture is designed to securely separate the user-facing client from the database. The NestJS server acts as a central message broker and API gateway.

```mermaid
graph TD
    subgraph User's Machine
        A[Angular Client]
    end

    subgraph Public Web Server
        B[NestJS Server]
    end

    subgraph Internal Network (with DB access)
        C[Node.js Proxy]
        D[Oracle DB]
    end

    A -- "1. REST: File Upload/Download" --> B
    A -- "2. WebSocket: Encrypted DB Connection JSON" --> B
    B -- "3. WebSocket: Forward Encrypted JSON" --> C
    C -- "4. Decrypt & Connect" --> D
    C -- "5. Execute Query" --> D
    D -- "6. Return Results" --> C
    C -- "7. WebSocket: Forward Results" --> B
    B -- "8. WebSocket: Forward Results" --> A

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ccf,stroke:#333,stroke-width:2px
    style C fill:#cfc,stroke:#333,stroke-width:2px
    style D fill:#f99,stroke:#333,stroke-width:2px
```

> **Important**: Database queries will not work if the **Node.js Proxy** is not running and connected to the server.

## Technology Stack & Project Architecture

### `client` (Angular)
The frontend is a single-page application built with Angular.
- **UI**: Built with **Angular Material** for a modern and responsive user experience.
- **SQL Editor**: Integrates the **Monaco Editor**, the code editor that powers VS Code, to provide a rich environment for writing SQL queries.
- **Security & Data Format**:
    - Before transmission, the client must create a JSON object for the database connection that matches the `node-oracledb` library's format.
    - **Example Connection Object:**
      ```json
      {
        "user": "your_username",
        "password": "your_password",
        "connectString": "hostname:port/service_name"
      }
      ```
    - This object is then encrypted using **`node-forge`** (RSA-OAEP) before being sent to the server.
- **Communication**: Communicates with the server via **`socket.io-client`** for real-time database interactions and standard `HttpClient` for file sharing.

### `server` (NestJS)
The backend is a robust API built on the NestJS framework.
- **Framework**: **NestJS** provides a modular architecture. It is configured with `@nestjs/serve-static` to serve the Angular client's static files from the `dist/client` directory.
- **Communication**:
    - **`@nestjs/platform-socket.io`** and **`socket.io`** are used to create a WebSocket gateway (`EventsGateway`) that acts as a message broker between the client and the proxy.
    - **`@nestjs/platform-express`** is used for the REST API.
- **Controllers**: The `FileController` defines the endpoints for the file sharing feature (`/files/upload`, `/files/download/:fileName`, etc.).
- **File Handling**: Uses **`multer`** for parsing `multipart/form-data` in file uploads.

### `server-proxy` (Node.js)
A minimal Node.js application with a single responsibility: execute database queries.
- **Database Driver**: Uses the **`oracledb`** package to connect to and query the Oracle database using the decrypted connection object.
- **Security**: Contains the private key (`private.pem`) and uses Node.js's built-in **`crypto`** module to decrypt the incoming connection string from the server.
- **Communication**: Uses **`socket.io-client`** to maintain a persistent WebSocket connection to the NestJS server. It can also be configured to use an **`https-proxy-agent`** if it needs to traverse a proxy to reach the server.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   npm (comes with Node.js)

## Installation

From the root directory (`server-communication`), run:
```bash
npm run install:all
```

## Running for Development

To run all parts of the application concurrently, use the following command from the root directory:
```bash
npm run start:app
```

## Deployment and Configuration

The `npm run build` command creates a `dist` directory, which contains the entire production-ready application.

### Configuration Steps
1.  **Configure the Client**: Before building, you must edit **`client/public/config.json`**. The `backendUrl` key must be updated to point to the public URL of your NestJS server.
    ```json
    {
      "backendUrl": "https://your-production-server-url.com"
    }
    ```
2.  **Build the Application**:
    ```bash
    npm run build
    ```
3.  **Deploy the Application**:
    -   Deploy the **entire contents** of the `dist` folder to your web server.
    -   The NestJS server is pre-configured to serve the Angular client from the `dist/client` sub-directory.
    -   Users can access the application by navigating to your server's root URL: `http://your-production-server-url.com`.

4.  **Deploy and Run the Proxy**:
    -   The `proxy.zip` file (located in `dist/server/uploads` after the build) must be manually transferred to the machine that has direct network access to your Oracle database.
    -   Unzip it, run `npm install` inside the unzipped folder, and then start it from the command line.
    -   The start command requires the server URL and accepts an optional URL for an HTTP proxy if one is needed to reach the server.
        ```bash
        # Command format: node index.js <server_url> [proxy_url]

        # Example without a proxy:
        node index.js https://your-production-server-url.com

        # Example with a proxy:
        node index.js https://your-production-server-url.com http://proxy.example.com:8080
        ```

## Build Script Deep Dive

The `npm run build` command orchestrates a series of steps:
1.  **`build:client`**: Compiles the Angular app.
2.  **`build:server`**: Compiles the NestJS app.
3.  **`copy:all`**: Uses **`copyfiles`** to move build artifacts into the final `dist` directory.
4.  **`zip:proxy`**: Executes `zip-script.js`, which uses the **`archiver`** library to package the `server-proxy` directory into `proxy.zip`. This zip is placed inside the server's build output so it can potentially be downloaded from the running server itself.
