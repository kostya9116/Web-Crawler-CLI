import axios from 'axios';
import * as url from 'url';
import * as fs from 'fs';
import { isValidUrl } from './utils';

interface Result {
    imageUrl: string;
    sourceUrl: string;
    depth: number;
}

export default class Crawler {
    maxDepth: number = 1;
    results: Result[] = [];
    scannedUrls: Set<string> = new Set();

    constructor(maxDepth: number) {
        this.setMaxDepth(maxDepth);
    }

    /**
     * Sets the maximum depth for crawling.
     * @param maxDepth The maximum depth to crawl.
     */
    setMaxDepth(maxDepth: number): void {
        if (!isNaN(maxDepth) && maxDepth > 0) {
            this.maxDepth = maxDepth;
        }
    }

    /**
     * Performs an HTTP GET request to the specified URL.
     * @param url The URL to fetch.
     * @returns The response data if successful, or null if an error occurred.
     */
    async get(url: string): Promise<string | null> {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(`Error: ${error}`);
            return null;
        }
    }

    /**
     * Extracts attribute values from HTML data.
     * @param data The HTML data to search.
     * @param tag The HTML tag name.
     * @param attr The attribute name.
     * @returns An array of attribute values matching the tag and attribute.
     */
    extractAttr(data: string, tag: string, attr: string): string[] {
        const regex = new RegExp(`<${tag}[^>]* ${attr}=['"]([^'"]*)['"][^>]*>`, 'gi');
        let match;
        const matches: string[] = [];
        while ((match = regex.exec(data))) {
            matches.push(match[1]);
        }
        return matches;
    }

    /**
     * Crawls the specified URL and its child pages up to the specified depth.
     * @param startUrl The URL to start crawling from.
     * @param depth The maximum depth to crawl.
     */
    private async prepareResults(startUrl: string, depth: number): Promise<void> {
        if (depth > this.maxDepth || this.scannedUrls.has(startUrl)) {
            return;
        }

        this.scannedUrls.add(startUrl);

        const data = await this.get(startUrl);

        if (!data) {
            return;
        }

        const baseUrl = url.parse(startUrl);
        const baseProtocol = baseUrl.protocol ? baseUrl.protocol : 'http:';
        const baseHost = baseUrl.host ? baseUrl.host : '';

        this.extractAttr(data, 'img', 'src').forEach((src) => {
            const imageUrl = url.resolve(startUrl, src);
            this.results.push({ imageUrl, sourceUrl: startUrl, depth });
        });

        for (const href of this.extractAttr(data, 'a', 'href')) {
            const resolvedUrl = url.resolve(startUrl, href);

            // Check if href is a relative path
            if (!isValidUrl(resolvedUrl)) {
                const combinedUrl = url.resolve(
                    `${baseProtocol}//${baseHost}`,
                    resolvedUrl.startsWith('/') ? resolvedUrl.substring(1) : resolvedUrl
                );
                if (isValidUrl(combinedUrl)) {
                    await this.prepareResults(combinedUrl, depth + 1);
                }
            } else {
                if (isValidUrl(resolvedUrl)) {
                    await this.prepareResults(resolvedUrl, depth + 1);
                }
            }
        }
    }

    /**
     * Initiates the crawling process.
     * @param startUrl The URL to start crawling from.
     * @param depth The maximum depth to crawl.
     */
    async crawl(startUrl: string, depth: number = 1): Promise<void> {
        if (!isValidUrl(startUrl)) {
            console.error('Invalid URL provided.', startUrl);
            return;
        }

        if (isNaN(depth) || depth <= 0) {
            console.error('Invalid depth provided. It should be a number greater than 0.');
            return;
        }

        if (depth > this.maxDepth) {
            return
        }

        console.log('Crawling started, please wait...');
        await this.prepareResults(startUrl, 1);

        if (this.results.length) {
            fs.writeFileSync('results.json', JSON.stringify({ results: this.results }));
        }

        this.results = [];
        this.scannedUrls.clear();
    }
}
