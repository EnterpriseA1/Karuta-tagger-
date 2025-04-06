/**
 * Card tagging functionality
 */
const tagManager = {
    /**
     * Tags the currently selected card with the specified tag
     * @param {string} tag - The tag to apply
     */
    tagCurrentCard(tag) {
        if (!karutaDataStore.selectedCard) {
            alert('Please select a card first');
            return;
        }
        
        const code = karutaDataStore.selectedCard.code;
        karutaDataStore.addTagToCard(tag, code);
        
        ui.updateTagStatus();
        ui.updateCurrentCardTags();
        ui.updateStatus(`Card ${code} tagged as '${tag}'`);
    },
    
    /**
     * Adds a custom tag to the currently selected card
     */
    addCustomTag() {
        if (!karutaDataStore.selectedCard) {
            alert('Please select a card first');
            return;
        }
        
        const customTag = ui.elements.customTagInput.value.trim().toLowerCase();
        
        if (!customTag) {
            alert('Please enter a custom tag name');
            return;
        }
        
        const code = karutaDataStore.selectedCard.code;
        karutaDataStore.addTagToCard(customTag, code, true);
        
        ui.elements.customTagInput.value = '';
        ui.updateTagStatus();
        ui.updateCurrentCardTags();
        ui.updateStatus(`Card ${code} tagged as '${customTag}'`);
    },
    
    /**
     * Shows the tag selection modal for command generation
     */
    showTagSelectionModal() {
        // Populate the tag list
        ui.elements.tagList.innerHTML = '';
        
        const tags = karutaDataStore.getAllTags();
        
        if (tags.length === 0) {
            alert('No tags available. Please tag some cards first.');
            return;
        }
        
        // Add tag options to the list
        tags.forEach(tag => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';
            item.textContent = `${tag.name.replace('_', ' ').toUpperCase()} (${tag.count} cards)`;
            item.dataset.tag = tag.name;
            item.dataset.isCustom = tag.type === 'custom' ? 'true' : 'false';
            ui.elements.tagList.appendChild(item);
        });
        
        // Select the first item by default
        if (ui.elements.tagList.children.length > 0) {
            ui.elements.tagList.children[0].classList.add('active');
        }
        
        // Handle item selection
        ui.elements.tagList.querySelectorAll('.list-group-item').forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                ui.elements.tagList.querySelectorAll('.list-group-item').forEach(i => {
                    i.classList.remove('active');
                });
                
                // Add active class to this item
                item.classList.add('active');
            });
        });
        
        // Show the modal
        ui.tagModal.show();
    },
    
    /**
     * Generates a Karuta command for the selected tag
     */
    generateCommand() {
        const activeItem = ui.elements.tagList.querySelector('.list-group-item.active');
        if (!activeItem) {
            alert('Please select a tag');
            return;
        }
        
        const tag = activeItem.dataset.tag;
        const isCustom = activeItem.dataset.isCustom === 'true';
        
        // Get the cards for this tag
        const cards = karutaDataStore.getCardsByTag(tag, isCustom);
        
        if (cards.size === 0) {
            alert(`No cards tagged as '${tag}'`);
            return;
        }
        
        // Generate the command
        const cardCodes = Array.from(cards).sort().join(',');
        const command = `kt ${tag} ${cardCodes}`;
        ui.elements.commandOutput.value = command;
        
        // Close the modal
        ui.tagModal.hide();
        
        // Show confirmation
        ui.updateStatus(`Generated command for ${cards.size} cards tagged as '${tag}'`);
    },
    
    /**
     * Copies the generated command to clipboard
     */
    copyCommand() {
        const command = ui.elements.commandOutput.value;
        if (!command) {
            alert('No command generated yet');
            return;
        }
        
        // Copy to clipboard
        navigator.clipboard.writeText(command)
            .then(() => {
                ui.updateStatus('Command copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard. Please select and copy the text manually.');
                ui.elements.commandOutput.select();
            });
    },
    
    /**
     * Clears all tags from all cards
     */
    clearAllTags() {
        if (!confirm('Clear all tagged cards?')) {
            return;
        }
        
        karutaDataStore.clearAllTags();
        
        ui.updateTagStatus();
        ui.updateCurrentCardTags();
        ui.elements.commandOutput.value = '';
        ui.updateStatus('All tags cleared');
    },
    
    /**
     * Exports tags to JSON file for download
     */
    exportTagsToJson() {
        const exportData = karutaDataStore.exportTags();
        
        // Create download link
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'karuta_tags.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        ui.updateStatus('Tags exported to JSON file');
    },
    
    /**
     * Imports tags from JSON file
     * @param {File} file - The JSON file to import
     */
    importTagsFromJson(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importData = JSON.parse(e.target.result);
                karutaDataStore.importTags(importData);
                
                ui.updateTagStatus();
                ui.updateCurrentCardTags();
                ui.updateStatus('Tags imported successfully');
            } catch (error) {
                console.error('Error importing tags:', error);
                alert('Error importing tags. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
};