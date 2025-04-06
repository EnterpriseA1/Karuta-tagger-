/**
 * Card management functionality
 */
const cardHandler = {
    /**
     * Initialize the card handler
     */
    init() {
        this.applySort = this.applySort.bind(this);
        this.filterCards = this.filterCards.bind(this);
        this.filterCardsByTag = this.filterCardsByTag.bind(this);
        this.displayCardList = this.displayCardList.bind(this);
        this.displayCardDetails = this.displayCardDetails.bind(this);
    },
    
    /**
     * Applies sorting to card list
     */
    applySort() {
        if (karutaDataStore.cardsData.length === 0) return;
        
        if (ui.elements.sortCheck.checked) {
            const ascending = ui.elements.sortAsc.checked;
            karutaDataStore.filteredCards.sort((a, b) => {
                // Ensure burnValue is a number
                const burnA = typeof a.burnValue === 'number' ? a.burnValue : parseFloat(a.burnValue) || 0;
                const burnB = typeof b.burnValue === 'number' ? b.burnValue : parseFloat(b.burnValue) || 0;
                
                return ascending ? burnA - burnB : burnB - burnA;
            });
        }
        
        this.displayCardList();
    },
    
    /**
     * Filters cards based on search input and tag status
     */
    filterCards() {
        const searchTerm = ui.elements.searchInput.value.toLowerCase();
        
        // First filter by search term
        if (searchTerm === '') {
            karutaDataStore.filteredCards = [...karutaDataStore.cardsData];
        } else {
            karutaDataStore.filteredCards = karutaDataStore.cardsData.filter(card => 
                (card.character && card.character.toLowerCase().includes(searchTerm)) || 
                (card.series && card.series.toLowerCase().includes(searchTerm))
            );
        }
        
        // Then apply tag filtering if needed
        this.filterCardsByTag();
        
        // Now apply sorting
        this.applySort();
        
        ui.updateStatus(`Found ${karutaDataStore.filteredCards.length} cards matching criteria`);
        ui.updateCardCounter(karutaDataStore.filteredCards.length);
    },
    
    /**
     * Filters cards to hide those with any tags if checkbox is checked
     */
    filterCardsByTag() {
        // Get the state of the hide tagged checkbox
        const hideTagged = ui.elements.hideTaggedCheck.checked;
        
        if (!hideTagged) {
            // Don't apply additional filtering if checkbox is not checked
            return;
        }
        
        // Filter out cards that have any tags (standard or custom)
        karutaDataStore.filteredCards = karutaDataStore.filteredCards.filter(card => {
            const cardCode = card.code;
            
            // Check if the card has any tags (standard or custom)
            const hasStandardTags = Object.values(karutaDataStore.tagCards).some(cards => 
                cards.has(cardCode)
            );
            
            const hasCustomTags = Object.values(karutaDataStore.customTags).some(cards => 
                cards.has(cardCode)
            );
            
            // Keep card only if it has no tags
            return !(hasStandardTags || hasCustomTags);
        });
    },
    
    /**
     * Displays the card list in the UI
     */
    displayCardList() {
        ui.elements.cardList.innerHTML = '';
        
        if (karutaDataStore.filteredCards.length === 0) {
            ui.elements.cardList.innerHTML = '<div class="text-center p-4 text-muted">No cards found</div>';
            return;
        }
        
        karutaDataStore.filteredCards.forEach(card => {
            const cardItem = document.createElement('div');
            cardItem.className = 'card-item';
            
            // Format burn value 
            const burnValue = typeof card.burnValue === 'number' ? card.burnValue : parseFloat(card.burnValue) || 0;
            const formattedBurn = Math.floor(burnValue);
            
            cardItem.textContent = `${formattedBurn} $ | ${card.character} (${card.series})`;
            cardItem.dataset.code = card.code;
            
            cardItem.addEventListener('click', () => {
                // Remove selected class from all items
                document.querySelectorAll('.card-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Add selected class to this item
                cardItem.classList.add('selected');
                
                // Display card details
                this.displayCardDetails(card);
            });
            
            ui.elements.cardList.appendChild(cardItem);
        });
    },
    
    /**
     * Displays card details in the UI
     * @param {Object} card - The card to display
     */
    displayCardDetails(card) {
        karutaDataStore.selectedCard = card;
        
        ui.elements.characterName.textContent = card.character || 'Unknown';
        ui.elements.seriesName.textContent = card.series || 'Unknown';
        ui.elements.cardCode.textContent = card.code || 'Unknown';
        
        // Format burn value
        const burnValue = typeof card.burnValue === 'number' ? card.burnValue : parseFloat(card.burnValue) || 0;
        const formattedBurn = Math.floor(burnValue);
        ui.elements.burnValue.textContent = `${formattedBurn} $`;
        
        // Clear the image container
        ui.elements.imageContainer.innerHTML = '<div class="placeholder-img">Click "Generate Image" to see image options</div>';
        
        // Update current tags for this card
        ui.updateCurrentCardTags();
        
        ui.updateStatus(`Selected card: ${card.character} from ${card.series}`);
    }
};