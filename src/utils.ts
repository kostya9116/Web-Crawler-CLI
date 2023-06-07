/**
 * Checks if a given URL is valid.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
export const isValidUrl = (url: string): boolean => {
    try {
        if (url.toLowerCase().startsWith('http')) {
            new URL(url);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};
