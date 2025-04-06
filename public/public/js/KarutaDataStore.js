/**
 * Data store for Karuta card information
 */
const karutaDataStore = {
    cardsData: [],
    filteredCards: [],
    selectedCard: null,
    
    // Standard tags
    tagCards: {
        waifus: new Set(),
        collected_series: new Set(),
        slidetrade: new Set(),
        worker: new Set(),
        burnburn: new Set()
    },
    
    // Custom tags (structure: { tagName: Set of card codes })
    customTags: {},
    
    /**
     * Loads card data from CSV
     * @param {Array} data - Array of card objects
     */
    loadData(data) {
        this.cardsData = data.map(card => {
            return {
                code: card.code || '',
                character: card.character || 'Unknown',
                series: card.series || 'Unknown',
                burnValue: card.burnValue || 0,
                edition: card.edition || 0,
                quality: card.quality || 0,
                dye: card['dye.name'] || '',
                frame: card.frame || '',
                tag: card.tag || '',
                alias: card.alias || '',
                wishlists: card.wishlists || 0,
                worker: {
                    effort: card['worker.effort'] || 0,
                    style: card['worker.style'] || '',
                    purity: card['worker.purity'] || '',
                    grabber: card['worker.grabber'] || '',
                    dropper: card['worker.dropper'] || '',
                    quickness: card['worker.quickness'] || '',
                    toughness: card['worker.toughness'] || '',
                    vanity: card['worker.vanity'] || ''
                }
            };
        });
        
        this.filteredCards = [...this.cardsData];
    },
    
    /**
     * Tags a card with a standard tag
     * @param {string} cardCode - The card code
     * @param {string} tag - The tag to apply
     */
    tagCard(cardCode, tag) {
        if (!cardCode || !tag) return;
        
        // Validate tag name
        if (!this.tagCards.hasOwnProperty(tag)) {
            ui.updateStatus(`Invalid tag: ${tag}`);
            return;
        }
        
        // Add card to tag set
        this.tagCards[tag].add(cardCode);
        
        // Update UI
        ui.updateCurrentCardTags();
        ui.updateTagStatus();
        ui.updateStatus(`Card ${cardCode} tagged as ${tag}`);
    },
    
    /**
     * Adds a custom tag to a card
     * @param {string} cardCode - The card code
     * @param {string} customTag - The custom tag to apply
     */
    addCustomTag(cardCode, customTag) {
        if (!cardCode || !customTag) return;
        
        // Create the custom tag set if it doesn't exist
        if (!this.customTags[customTag]) {
            this.customTags[customTag] = new Set();
        }
        
        // Add card to custom tag set
        this.customTags[customTag].add(cardCode);
        
        // Update UI
        ui.updateCurrentCardTags();
        ui.updateTagStatus();
        ui.updateStatus(`Card ${cardCode} tagged as ${customTag}`);
    },
    
    /**
     * Removes all tags from a card
     * @param {string} cardCode - The card code
     */
    clearCardTags(cardCode) {
        if (!cardCode) return;
        
        // Remove from standard tags
        for (const tag in this.tagCards) {
            this.tagCards[tag].delete(cardCode);
        }
        
        // Remove from custom tags
        for (const tag in this.customTags) {
            this.customTags[tag].delete(cardCode);
            
            // Remove empty custom tag sets
            if (this.customTags[tag].size === 0) {
                delete this.customTags[tag];
            }
        }
        
        // Update UI
        ui.updateCurrentCardTags();
        ui.updateTagStatus();
        ui.updateStatus(`Cleared all tags from card ${cardCode}`);
    },
    
    /**
     * Gets all tags for a specific card
     * @param {string} cardCode - The card code
     * @returns {Array} Array of tag objects with name and type
     */
    getCardTags(cardCode) {
        if (!cardCode) return [];
        
        const tags = [];
        
        // Add standard tags
        for (const tag in this.tagCards) {
            if (this.tagCards[tag].has(cardCode)) {
                tags.push({
                    name: tag,
                    type: 'standard'
                });
            }
        }
        
        // Add custom tags
        for (const tag in this.customTags) {
            if (this.customTags[tag].has(cardCode)) {
                tags.push({
                    name: tag,
                    type: 'custom'
                });
            }
        }
        
        return tags;
    },
    
    /**
     * Gets all tags with their card counts
     * @returns {Array} Array of tag objects with name, type, and count
     */
    getAllTags() {
        const tags = [];
        
        // Add standard tags
        for (const tag in this.tagCards) {
            if (this.tagCards[tag].size > 0) {
                tags.push({
                    name: tag,
                    type: 'standard',
                    count: this.tagCards[tag].size
                });
            }
        }
        
        // Add custom tags
        for (const tag in this.customTags) {
            tags.push({
                name: tag,
                type: 'custom',
                count: this.customTags[tag].size
            });
        }
        
        return tags;
    },
    
    /**
     * Exports tag data to JSON
     * @returns {Object} Tag data JSON object
     */
    exportTags() {
        const exportData = {
            tagCards: {},
            customTags: {}
        };
        
        // Convert standard tag sets to arrays
        for (const tag in this.tagCards) {
            exportData.tagCards[tag] = Array.from(this.tagCards[tag]);
        }
        
        // Convert custom tag sets to arrays
        for (const tag in this.customTags) {
            exportData.customTags[tag] = Array.from(this.customTags[tag]);
        }
        
        return exportData;
    },
    
    /**
     * Imports tag data from JSON
     * @param {Object} data - Tag data JSON object
     */
    importTags(data) {
        if (!data || !data.tagCards || !data.customTags) {
            ui.updateStatus('Invalid tag data format');
            return;
        }
        
        // Clear existing tags
        for (const tag in this.tagCards) {
            this.tagCards[tag].clear();
        }
        this.customTags = {};
        
        // Import standard tags
        for (const tag in data.tagCards) {
            if (this.tagCards.hasOwnProperty(tag)) {
                this.tagCards[tag] = new Set(data.tagCards[tag]);
            }
        }
        
        // Import custom tags
        for (const tag in data.customTags) {
            this.customTags[tag] = new Set(data.customTags[tag]);
        }
        
        // Update UI
        ui.updateCurrentCardTags();
        ui.updateTagStatus();
        ui.updateStatus('Tags imported successfully');
    }
};