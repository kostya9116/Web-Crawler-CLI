# Web Crawler CLI - Konstantin Harutyunyan

The Web Crawler CLI is a command-line application built with Node.js and TypeScript that allows you to crawl webpages,
extract image URLs, and traverse child pages up to a specified depth.

## Features

- Crawls a given URL and its child pages up to a specified depth.
- Extracts image URLs from HTML data.
- Handles relative paths and combines them with the start URL.
- Saves the crawled results to a JSON file.

## Installation

1. Clone the repository:

   ```bash
    git clone git@github.com:kostya9116/dataloop-home-assignment.git
    ```


2. Navigate to the project directory:

   ```bash
   cd dataloop-home-assignment
    ```

3. Install the dependencies using yarn:

   ```bash
   yarn install
    ```

   Alternatively, you can use npm:

   ```bash
    npm install
    ```

## Usage

The CLI can be run using the following command:

``` bash
yarn start <start_url> <depth>
```

Replace <start_url> with the URL you want to start crawling from, and <depth> with the maximum depth you want to crawl. For example:

``` bash
yarn start https://example.com 2
```

The results of the crawling process will be saved in a results.json file in the current directory.

## Running Tests

The project includes tests to ensure the correctness of the web crawler functionality. Follow the steps below to run the tests:

1. Run the tests using the following command:

   ```bash
   yarn test
   ```

   This command will execute the test suite and provide feedback on the test results.
   
   Alternatively, you can use npm:

    ```bash
   npm test
   ```
   
2. After running the tests, the test results will be displayed in the console, indicating which tests passed or failed.

   If any tests fail, you will see detailed information about the failures, including the location of the failing test and any error messages.

   If all tests pass, you will see a summary indicating the number of tests that passed.