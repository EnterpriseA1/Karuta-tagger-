/**
 * UI elements and basic UI functionality
 */
const ui = {
    elements: {},
    tagButtons: {},
    tagModal: null,
    
    /**
     * Initialize UI elements
     */
    init() {
        // Main UI elements
        this.elements = {
            csvFile: document.getElementById('csvFile'),
            sortCheck: document.getElementById('sortCheck'),
            sortDesc: document.getElementById('sortDesc'),
            sortAsc: document.getElementById('sortAsc'),
            searchInput: document.getElementById('searchInput'),
            cardList: document.getElementById('cardList'),
            cardCounter: document.getElementById('cardCounter'),
            characterName: document.getElementById('characterName'),
            seriesName: document.getElementById('seriesName'),
            cardCode: document.getElementById('cardCode'),
            burnValue: document.getElementById('burnValue'),
            generateImageBtn: document.getElementById('generateImageBtn'),
            nextImageBtn: document.getElementById('nextImageBtn'),
            imageContainer: document.getElementById('imageContainer'),
            commandOutput: document.getElementById('commandOutput'),
            generateBtn: document.getElementById('generateBtn'),
            copyBtn: document.getElementById('copyBtn'),
            clearTagsBtn: document.getElementById('clearTagsBtn'),
            tagStatus: document.getElementById('tagStatus'),
            statusBar: document.getElementById('statusBar'),
            tagList: document.getElementById('tagList'),
            selectTagBtn: document.getElementById('selectTagBtn'),
            customTagInput: document.getElementById('customTagInput'),
            addCustomTagBtn: document.getElementById('addCustomTagBtn'),
            currentCardTags: document.getElementById('currentCardTags'),
            hideTaggedCheck: document.getElementById('hideTaggedCheck')
        };
        
        // Tag buttons
        this.tagButtons = {
            waifus: document.getElementById('waifusBtn'),
            collected_series: document.getElementById('collectedSeriesBtn'),
            slidetrade: document.getElementById('slidetradeBtn'),
            worker: document.getElementById('workerBtn'),
            burnburn: document.getElementById('burnburnBtn')
        };
        
        // Bootstrap modal
        this.tagModal = new bootstrap.Modal(document.getElementById('tagModal'));
        
        // Add export button to UI
        this.createExportButton();
    },
    
    /**
     * Setup event listeners for UI elements
     */
    setupEventListeners() {
        // File upload
        this.elements.csvFile.addEventListener('change', (e) => csvParser.handleFileUpload(e));
        
        // Search and filter
        this.elements.searchInput.addEventListener('input', cardHandler.filterCards);
        this.elements.hideTaggedCheck.addEventListener('change', cardHandler.filterCards);
        
        // Sorting
        this.elements.sortCheck.addEventListener('change', cardHandler.applySort);
        this.elements.sortAsc.addEventListener('change', cardHandler.applySort);
        this.elements.sortDesc.addEventListener('change', cardHandler.applySort);
        
        // Image handling
        this.elements.generateImageBtn.addEventListener('click', () => imageHandler.generateImage());
        this.elements.nextImageBtn.addEventListener('click', () => imageHandler.showNextImage());
        
        // Tagging
        for (const [tag, button] of Object.entries(this.tagButtons)) {
            button.addEventListener('click', () => {
                tagManager.tagCurrentCard(tag);
                // Refresh the card list after adding a tag
                cardHandler.filterCards();
            });
        }
        this.elements.addCustomTagBtn.addEventListener('click', () => {
            tagManager.addCustomTag();
            // Refresh the card list after adding a tag
            cardHandler.filterCards();
        });
        
        // Command generation
        this.elements.generateBtn.addEventListener('click', () => tagManager.showTagSelectionModal());
        this.elements.copyBtn.addEventListener('click', () => tagManager.copyCommand());
        this.elements.clearTagsBtn.addEventListener('click', () => {
            tagManager.clearAllTags();
            // Refresh the card list after clearing tags
            cardHandler.filterCards();
        });
        this.elements.selectTagBtn.addEventListener('click', () => tagManager.generateCommand());
    },
    
    /**
     * Creates the export button for tags
     */
    createExportButton() {
        const exportButton = document.createElement('button');
        exportButton.className = 'btn btn-sm btn-info position-fixed';
        exportButton.style.right = '10px';
        exportButton.style.top = '10px';
        exportButton.innerHTML = '<i class="bi bi-download"></i> Export Tags';
        exportButton.addEventListener('click', () => tagManager.exportTagsToJson());
        document.body.appendChild(exportButton);
    },
    
    /**
     * Updates the status bar message
     * @param {string} message - The message to display
     */
    updateStatus(message) {
        this.elements.statusBar.textContent = message;
        console.log(message);
    },
    
    /**
     * Updates the card counter display
     * @param {number} count - The number of cards
     */
    updateCardCounter(count) {
        this.elements.cardCounter.textContent = `${count} cards`;
    },
    
    /**
     * Updates the current card tags display
     */
    updateCurrentCardTags() {
        if (!karutaDataStore.selectedCard) {
            this.elements.currentCardTags.innerHTML = 'None';
            return;
        }
        
        const code = karutaDataStore.selectedCard.code;
        const cardTags = karutaDataStore.getCardTags(code);
        
        if (cardTags.length > 0) {
            const tagHtml = cardTags.map(tag => {
                const className = tag.type === 'standard' ? tag.name : 'custom';
                return `<span class="tag-badge ${className}">${tag.name.replace('_', ' ').toUpperCase()}</span>`;
            }).join('');
            
            this.elements.currentCardTags.innerHTML = tagHtml;
        } else {
            this.elements.currentCardTags.innerHTML = 'None';
        }
    },
    
    /**
     * Updates the tag status display showing all tagged cards
     */
    updateTagStatus() {
        const tags = karutaDataStore.getAllTags();
        
        if (tags.length > 0) {
            const tagHtml = tags.map(tag => {
                const className = tag.type === 'standard' ? tag.name : 'custom';
                return `<span class="tag-badge ${className}">${tag.name.replace('_', ' ').toUpperCase()}: ${tag.count}</span>`;
            }).join('');
            
            this.elements.tagStatus.innerHTML = tagHtml;
        } else {
            this.elements.tagStatus.innerHTML = 'None';
        }
    }
};