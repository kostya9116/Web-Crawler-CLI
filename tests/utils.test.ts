import { isValidUrl } from '../src/utils';

describe('isValidUrl', () => {
    it('should return true for a valid URL', () => {
        const validUrl = 'https://example.com';
        expect(isValidUrl(validUrl)).toBe(true);
    });

    it('should return false for an invalid URL', () => {
        const invalidUrl = 'example.com';
        expect(isValidUrl(invalidUrl)).toBe(false);
    });

    it('should return false for a URL without http or https protocol', () => {
        const invalidProtocolUrl = 'ftp://example.com';
        expect(isValidUrl(invalidProtocolUrl)).toBe(false);
    });

    it('should return false for an empty URL', () => {
        const emptyUrl = '';
        expect(isValidUrl(emptyUrl)).toBe(false);
    });
});
