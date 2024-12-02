# Image Processor

#Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [What was done and why](#what-was-done-and-why)
4. [Installation](#installation)
5. [Project structure](#project-structure)
6. [Recommendations for further improvements](#recommendations-for-further-improvement)

## Overview

The Image Processor is a Node.js application that processes images by generating thumbnails from URLs provided in a CSV file. The processed thumbnails are stored in a MongoDB database. The project uses modular architecture, environment-based configuration, and robust error handling.

## Features

1. Generates thumbnails from image URLs.
2. Processes data in configurable batch sizes.
3. Reads data from a CSV file and converts it into structured objects.
4. Stores processed thumbnails in a MongoDB database.
5. Uses structured logging with `pino`.
6. Gracefully handles errors during processing.

## What Was Done and Why

### **1. Refactored Code into Modular Architecture**
- **What**: Separated responsibilities into individual services:
   - `CsvParserService` for parsing CSV files.
   - `ThumbnailService` for creating image thumbnails.
   - `DatabaseService` for database operations.
- **Why**: Improves maintainability, readability, and testability by adhering to the Single Responsibility Principle (SRP).

### **2. Replaced Hardcoded Values with Configurable Options**
- **What**: Removed hardcoded thumbnail dimensions and batch sizes. Added configuration options via environment variables (`.env`).
- **Why**: Enables flexibility to adapt the application to different environments and use cases without modifying the source code.

### **3. Improved Error Handling**
- **What**: Enhanced error handling by:
   - Using `Promise.allSettled` for batch processing to handle partial failures.
   - Checking for file existence before processing.
   - Adding detailed error logs.
- **Why**: Ensures the application is resilient to failures and provides meaningful logs for debugging.

### **4. Enhanced Logging**
- **What**: Replaced `console` logging with `pino` for structured, production-ready logs.
- **Why**: Structured logging makes it easier to analyze logs in production environments and integrates well with logging tools.

### **5. Checked File Path Dynamically**
- **What**: Added logic to resolve and verify the `DATA_FILE_PATH` dynamically, ensuring the CSV file exists before parsing.
- **Why**: Prevents runtime errors (`ENOENT`) when the file path is incorrect or the file is missing.

### **6. TypeScript Improvements**
- **What**: Introduced strong typing for parsed rows and raw entities using TypeScript interfaces (`ParsedRow`, `RawEntity`).
- **Why**: Improves code reliability and prevents runtime type errors by enforcing compile-time checks.

### **7. Recommendations for Further Improvement**
- [Further improvement](#recommendations-for-further-improvement)


---

## Installation

1. Clone the repository:
```
git clone <repository_url> cd image-processor
```

2. Install dependencies:\
   ```bash
   npm install
   ```
3. Set up the environment variables:\
   Create a `.env` file in the root directory and add the following variables:
   ```
   DEFAULT_BATCH_SIZE=100
   DATA_FILE_PATH=./files/data.csv
   LOG_LEVEL=info
   NODE_ENV=development
   MONGO_INITDB_ROOT_USERNAME=root
   MONGO_INITDB_ROOT_PASSWORD=changeMe
   MONGO_URI=mongodb://root:changeMe@localhost:27017/restaurant-system?authSource=admin
   ```

4. Prepare the CSV file:
- Create a `files` directory in the project root.
- Add a `data.csv` file in the `files` directory.
- The file should have a structure like:
  ```
  index,id,url
  1,12345,http://example.com/image1.jpg
  2,67890,http://example.com/image2.jpg
  ```

5. Build the application:\
   ```bash 
   npm run build
   ```

6. Run test db:\
   ```bash
   docker compose up
   ```

7. Start the application:\
   ```bash
   npm start
   ```


## Project Structure

- `src/config`: Manages environment variable configuration and validation.
- `src/models`: Contains the MongoDB model for storing image data.
- `src/services`: Core logic for CSV parsing, database operations, and thumbnail creation.
- `src/utils`: Utility functions and logger setup.
- `image.processor.ts`: Main processing logic for handling batches.
- `index.ts`: Entry point for the application.

## Error Handling

- If the CSV file is not found at the specified path, the application logs an error and terminates gracefully.
- All unexpected errors during processing are logged for debugging purposes.

## Recommendations for Further Improvement

1. **Store Thumbnails in Object Storage:**
- Move binary data to object storage (e.g., S3, GCS) and save only metadata like file URLs in MongoDB.

2. **Use a Third-Party CSV Parser:**
- Replace the custom CSV parsing logic with a library like `csv-parser` or `papaparse` for better handling of edge cases.

3. **Process Large Files Asynchronously:**
   - For very large CSV files, process them asynchronously to avoid memory overload and improve scalability.
   - Use a job queue system like [Bull](https://www.npmjs.com/package/bull) or [Bee-Queue](https://www.npmjs.com/package/bee-queue) to handle file processing in separate workers.
   - Alternatively, adopt an event-driven architecture with tools like [RabbitMQ](https://www.rabbitmq.com/) or [AWS SQS](https://aws.amazon.com/sqs/) for distributing file processing tasks.

4. **Retry Logic for Thumbnail Generation:**
- Implement a retry mechanism to handle transient network errors or processing failures during thumbnail generation.

5. **Dynamic Configuration:**
- Make thumbnail dimensions, batch size, and other key parameters configurable via environment variables or a configuration file.

6. **Data Validation:**
- Validate parsed CSV rows to ensure required fields (e.g., `id`, `url`) are present and formatted correctly.

7. **Add Tests:**
- Implement unit tests for individual services and integration tests for the entire workflow.

8. **Use Asynchronous Queues:**
- Replace in-memory processing with message queues (e.g., RabbitMQ, AWS SQS) for batch processing to enable horizontal scalability.

9. **Performance Monitoring:**
- Integrate tools like Prometheus or AWS CloudWatch to track metrics such as processing times, errors, and resource utilization.

10. **Dockerization:**
- Containerize the application with Docker to ensure consistent deployment across environments.



   




