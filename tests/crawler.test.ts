import axios from 'axios';
import * as fs from 'fs';
import Crawler from '../src/crawler';

// Mock fs.writeFileSync
jest.mock('fs');
// Mock axios.get to return a mocked response
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedResponseData = `
  <html>
    <body>
      <img src="image1.jpg">
      <a href="https://example.com/page2">Page 2</a>
      <a href="https://example.com/page3">Page 3</a>
      <a href="https://example.com/page4">Page 4</a>
    </body>
  </html>
`;

describe('Crawler', () => {
    let writeFileSyncMock: jest.SpyInstance;

    beforeEach(() => {
        // Clear the mock implementation and calls for fs.writeFileSync
        jest.clearAllMocks();

        // Create a custom mock implementation for fs.writeFileSync
        writeFileSyncMock = jest.spyOn(fs, 'writeFileSync').mockImplementation();

        mockedAxios.get.mockResolvedValue({data: mockedResponseData});
    });

    afterEach(() => {
        // Restore the original implementation of fs.writeFileSync
        writeFileSyncMock.mockRestore();
    });

   /* it('should crawl the given URL and extract image URLs', async () => {
        const startUrl = 'https://example.com';
        const depth = 2;
        const crawler = new Crawler(depth);

        await crawler.crawl(startUrl, depth);

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(startUrl);

        expect(writeFileSyncMock).toHaveBeenCalled();
        expect(writeFileSyncMock.mock.calls.length).toBe(1);
        expect(writeFileSyncMock.mock.calls[0][0]).toBe('results.json');
        expect(writeFileSyncMock.mock.calls[0][1]).toEqual(
            JSON.stringify({results: [{imageUrl: 'https://example.com/image1.jpg', sourceUrl: startUrl, depth: 2}]})
        );
    });

    it('should not crawl URLs beyond the specified depth', async () => {
        const startUrl = 'https://example.com';
        const depth = 1;
        const crawler = new Crawler(depth);

        await crawler.crawl(startUrl, depth + 1);

        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(writeFileSyncMock).toHaveBeenCalledTimes(0);
    });

     it('should handle invalid URLs gracefully', async () => {
         const startUrl = 'invalid-url';
         const depth = 1;
         const crawler = new Crawler(depth);

         await crawler.crawl(startUrl, depth);

         expect(mockedAxios.get).toHaveBeenCalledTimes(0);
         expect(fs.writeFileSync).toHaveBeenCalledTimes(0);
     });*/

    it('should try crawling until maxDepth is reached', async () => {
        const startUrl = 'https://example.com';
        const depth = 2;
        const crawler = new Crawler(depth);

        await crawler.crawl(startUrl, depth);

        expect(mockedAxios.get).toHaveBeenCalledTimes(4);
        expect(mockedAxios.get).toHaveBeenNthCalledWith(1, startUrl);
        expect(mockedAxios.get).toHaveBeenNthCalledWith(2, 'https://example.com/page2');

        expect(writeFileSyncMock).toHaveBeenCalled();
        expect(writeFileSyncMock.mock.calls.length).toBe(1);
        expect(writeFileSyncMock.mock.calls[0][0]).toBe('results.json');
        expect(writeFileSyncMock.mock.calls[0][1]).toEqual(
            JSON.stringify({
                results: [
                    { imageUrl: 'https://example.com/image1.jpg', sourceUrl: startUrl, depth: 1 },
                    { imageUrl: 'https://example.com/image1.jpg', sourceUrl: 'https://example.com/page2', depth: 2 },
                    { imageUrl: 'https://example.com/image1.jpg', sourceUrl: 'https://example.com/page3', depth: 2 },
                    { imageUrl: 'https://example.com/image1.jpg', sourceUrl: 'https://example.com/page4', depth: 2 },
                ],
            })
        );
    });
});
