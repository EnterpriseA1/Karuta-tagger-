/**
 * Karuta application data store
 */
const karutaDataStore = {
    // Card data
    cardsData: [],
    filteredCards: [],
    selectedCard: null,
    
    // Image search results
    searchResults: {},
    currentResultIndex: 0,
    
    // Tag collections
    tagCards: {
        waifus: new Set(),
        collected_series: new Set(),
        slidetrade: new Set(),
        worker: new Set(),
        burnburn: new Set()
    },
    
    // Custom tags storage
    customTags: {},  // Format: {tagName: Set([codes])}
    
    /**
     * Initializes the state
     */
    init() {
        this.cardsData = [];
        this.filteredCards = [];
        this.selectedCard = null;
        this.searchResults = {};
        this.currentResultIndex = 0;
        
        // Reset tag collections
        for (const tag in this.tagCards) {
            this.tagCards[tag] = new Set();
        }
        
        this.customTags = {};
    },
    
    /**
     * Sets cards data and initializes filtered cards
     * @param {Array} data - The card data to set
     */
    setCardsData(data) {
        this.cardsData = data;
        this.filteredCards = [...data];
    },
    
    /**
     * Adds a tag to a card
     * @param {string} tag - The tag to add
     * @param {string} cardCode - The card code to tag
     * @param {boolean} isCustom - Whether this is a custom tag
     */
    addTagToCard(tag, cardCode, isCustom = false) {
        if (isCustom) {
            // Initialize the custom tag if it doesn't exist
            if (!this.customTags[tag]) {
                this.customTags[tag] = new Set();
            }
            this.customTags[tag].add(cardCode);
        } else {
            // Add to standard tags
            if (this.tagCards[tag]) {
                this.tagCards[tag].add(cardCode);
            }
        }
    },
    
    /**
     * Gets all tags applied to a specific card
     * @param {string} cardCode - The card code to check
     * @returns {Array} Array of tag objects with {name, type}
     */
    getCardTags(cardCode) {
        const tags = [];
        
        // Check standard tags
        for (const [tag, cards] of Object.entries(this.tagCards)) {
            if (cards.has(cardCode)) {
                tags.push({ name: tag, type: 'standard' });
            }
        }
        
        // Check custom tags
        for (const [tag, cards] of Object.entries(this.customTags)) {
            if (cards.has(cardCode)) {
                tags.push({ name: tag, type: 'custom' });
            }
        }
        
        return tags;
    },
    
    /**
     * Gets all tags that have at least one card
     * @returns {Array} Array of tag objects with {name, type, count}
     */
    getAllTags() {
        const tags = [];
        
        // Add standard tags
        for (const [tag, cards] of Object.entries(this.tagCards)) {
            if (cards.size > 0) {
                tags.push({
                    name: tag,
                    type: 'standard',
                    count: cards.size
                });
            }
        }
        
        // Add custom tags
        for (const [tag, cards] of Object.entries(this.customTags)) {
            if (cards.size > 0) {
                tags.push({
                    name: tag,
                    type: 'custom',
                    count: cards.size
                });
            }
        }
        
        return tags;
    },
    
    /**
     * Gets all cards tagged with a specific tag
     * @param {string} tag - The tag to check
     * @param {boolean} isCustom - Whether this is a custom tag
     * @returns {Set} Set of card codes
     */
    getCardsByTag(tag, isCustom = false) {
        if (isCustom) {
            return this.customTags[tag] || new Set();
        } else {
            return this.tagCards[tag] || new Set();
        }
    },
    
    /**
     * Clears all tags from all cards
     */
    clearAllTags() {
        // Clear standard tags
        for (const tag in this.tagCards) {
            this.tagCards[tag].clear();
        }
        
        // Clear custom tags
        this.customTags = {};
    },
    
    /**
     * Exports tag data to JSON
     * @returns {Object} Export data object
     */
    exportTags() {
        const exportData = {
            standardTags: {},
            customTags: {}
        };
        
        // Export standard tags
        for (const [tag, cards] of Object.entries(this.tagCards)) {
            if (cards.size > 0) {
                exportData.standardTags[tag] = Array.from(cards);
            }
        }
        
        // Export custom tags
        for (const [tag, cards] of Object.entries(this.customTags)) {
            if (cards.size > 0) {
                exportData.customTags[tag] = Array.from(cards);
            }
        }
        
        return exportData;
    },
    
    /**
     * Imports tag data from JSON
     * @param {Object} importData - The data to import
     */
    importTags(importData) {
        // Import standard tags
        if (importData.standardTags) {
            for (const [tag, cards] of Object.entries(importData.standardTags)) {
                if (this.tagCards[tag]) {
                    this.tagCards[tag] = new Set(cards);
                }
            }
        }
        
        // Import custom tags
        if (importData.customTags) {
            for (const [tag, cards] of Object.entries(importData.customTags)) {
                this.customTags[tag] = new Set(cards);
            }
        }
    }
};