/**
 * Card management functionality
 */
const cardHandler = {
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
     * Filters cards based on search input
     */
    filterCards() {
        const searchTerm = ui.elements.searchInput.value.toLowerCase();
        
        if (searchTerm === '') {
            karutaDataStore.filteredCards = [...karutaDataStore.cardsData];
        } else {
            karutaDataStore.filteredCards = karutaDataStore.cardsData.filter(card => 
                (card.character && card.character.toLowerCase().includes(searchTerm)) || 
                (card.series && card.series.toLowerCase().includes(searchTerm))
            );
        }
        
        cardHandler.applySort();
        ui.updateStatus(`Found ${karutaDataStore.filteredCards.length} cards matching '${searchTerm}'`);
        ui.updateCardCounter(karutaDataStore.filteredCards.length);
    },
    
    /**
     * Filters cards based on tag filter checkboxes
     */
    filterCardsByTag() {
        const hiddenTags = Array.from(ui.elements.filterTags)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        document.querySelectorAll('.card-item').forEach(card => {
            const cardCode = card.dataset.code;
            const hasHiddenTag = hiddenTags.some(tag => 
                karutaDataStore.tagCards[tag]?.has(cardCode)
            );
            card.style.display = hasHiddenTag ? 'none' : '';
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
        
        this.filterCardsByTag();
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