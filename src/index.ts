import { isValidUrl } from './utils';
import Crawler from './crawler';

async function main(): Promise<void> {
    // Parse the depth argument from the command line
    const depth = parseInt(process.argv[3], 10);

    // Validate the depth argument
    if (isNaN(depth) || depth <= 0) {
        console.log('Invalid depth provided. It should be a number greater than 0.');
        return;
    }

    // Retrieve the start URL argument from the command line
    const startUrl = process.argv[2];

    // Validate the start URL
    if (!isValidUrl(startUrl)) {
        console.log('Invalid URL provided.');
        return;
    }

    // Create a new instance of the Crawler class
    const crawler = new Crawler(depth);

    // Start crawling
    await crawler.crawl(startUrl);
}

// Invoke the main function
main();
