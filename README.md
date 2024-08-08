**xlsx-express-operations** is a Node.js library designed to generate and stream Excel files through various methods using Express. It demonstrates different techniques for creating and serving Excel files using `ExcelJS` and `XLSX` libraries.

## Features

- **Multiple Endpoints**: Offers various endpoints to showcase different ways to generate and stream Excel files.
- **ExcelJS and XLSX Support**: Supports both `ExcelJS` and `XLSX` libraries for Excel file generation.
- **Streamlined with Express**: Integrated seamlessly with Express for easy handling of HTTP requests and responses.

## Endpoints

- **/download-exceljs-1**: `Buffer` Generates an Excel file using `ExcelJS` with a `workbook.xlsx.write`.
- **/download-exceljs-2**: `Stream` Generates an Excel file using `ExcelJS` with a `WorkbookWriter` and streams it through a `PassThrough` stream (`highWaterMark: 1024`).
- **/download-exceljs-3**: `Stream` Generates an Excel file using `ExcelJS` with a `WorkbookWriter` and streams it through a `PassThrough` stream (`highWaterMark: 16 * 1024`).
- **/download-exceljs-4**: `Stream` Generates an Excel file using `ExcelJS` with a `WorkbookWriter` and streams it to response.
- **/download-xlsx-1**: `Buffer` Generates an Excel file using `XLSX` with a `write` method.

## Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine.
- **Docker**: Docker and Docker Compose installed.

### Local Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/xlsx-express-operations.git
    cd xlsx-express-operations
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the server:

    ```bash
    npm start
    ```

4. Access the endpoints via your browser or tools like `curl`:

    ```bash
    curl http://localhost:3000/download-exceljs-2
    ```

### Docker Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/xlsx-express-operations.git
    cd xlsx-express-operations
    ```

2. Build and start the container using Docker Compose:

    ```bash
    docker-compose up -d
    ```

3. The service will be available at `http://localhost:3000`. You can access the endpoints using your browser or tools like `curl`:

    ```bash
    curl http://localhost:3000/download-exceljs-2
    ```
