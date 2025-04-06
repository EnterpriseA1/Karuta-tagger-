/**
 * Utility functions for the Karuta application
 */
const karutaUtils = {
    /**
     * Formats a number to display as currency
     * @param {number} value - The number to format
     * @returns {string} Formatted number with $ symbol
     */
    formatCurrency(value) {
        const number = parseFloat(value);
        if (isNaN(number)) return '0 $';
        return `${Math.floor(number)} $`;
    },
    
    /**
     * Generates a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Creates a simple hash value from a string
     * @param {string} str - The string to hash
     * @returns {number} A numeric hash value
     */
    hashString(str) {
        return str.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    },
    
    /**
     * Debounces a function to limit how often it can be called
     * @param {Function} func - The function to debounce
     * @param {number} wait - Milliseconds to wait
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },
    
    /**
     * Creates a downloadable file from content
     * @param {string} content - Content to download
     * @param {string} fileName - Name for the downloaded file
     * @param {string} contentType - MIME type of the content
     */
    downloadContent(content, fileName, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }
};