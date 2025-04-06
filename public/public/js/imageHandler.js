/**
 * Image generation and display functionality
 */
const imageHandler = {
    // Binding the methods to this object to maintain context
    init() {
        this.generateImage = this.generateImage.bind(this);
        this.showNextImage = this.showNextImage.bind(this);
        this.displayImage = this.displayImage.bind(this);
    },
    
    /**
     * Generates images for the selected card
     */
    generateImage() {
        if (!karutaDataStore.selectedCard) {
            alert('Please select a card first');
            return;
        }
        
        const card = karutaDataStore.selectedCard;
        const searchKey = `${card.character}|${card.series}`;
        
        // Clear the image container and show loading message
        ui.elements.imageContainer.innerHTML = '<div class="text-center">Generating images...<br>Please wait...</div>';
        ui.updateStatus(`Generating images for ${card.character} from ${card.series}...`);
        
        // Check cache first
        if (karutaDataStore.searchResults[searchKey] && karutaDataStore.searchResults[searchKey].length > 0) {
            karutaDataStore.currentResultIndex = 0;
            this.displayImage(karutaDataStore.searchResults[searchKey][0]);
            ui.updateStatus(`Showing image 1 of ${karutaDataStore.searchResults[searchKey].length}`);
            return;
        }
        
        // Generate placeholder images
        setTimeout(() => {
            const placeholderImages = this.generatePlaceholderImages(card.character, card.series);
            karutaDataStore.searchResults[searchKey] = placeholderImages;
            karutaDataStore.currentResultIndex = 0;
            
            if (placeholderImages.length > 0) {
                this.displayImage(placeholderImages[0]);
                ui.updateStatus(`Showing image 1 of ${placeholderImages.length}`);
            } else {
                ui.elements.imageContainer.innerHTML = '<div class="placeholder-img">No images could be generated</div>';
                ui.updateStatus('No images generated');
            }
        }, 500);  // Small delay to simulate processing
    },
    
    /**
     * Displays the next image for the current card
     */
    showNextImage() {
        if (!karutaDataStore.selectedCard) return;
        
        const searchKey = `${karutaDataStore.selectedCard.character}|${karutaDataStore.selectedCard.series}`;
        if (!karutaDataStore.searchResults[searchKey] || karutaDataStore.searchResults[searchKey].length === 0) {
            this.generateImage();
            return;
        }
        
        const images = karutaDataStore.searchResults[searchKey];
        karutaDataStore.currentResultIndex = (karutaDataStore.currentResultIndex + 1) % images.length;
        this.displayImage(images[karutaDataStore.currentResultIndex]);
        
        // Update status with current image index
        ui.updateStatus(`Showing image ${karutaDataStore.currentResultIndex + 1} of ${images.length}`);
    },
    
    /**
     * Displays an image in the image container
     * @param {string} imageHTML - The HTML content for the image
     */
    displayImage(imageHTML) {
        // Set the image HTML directly
        ui.elements.imageContainer.innerHTML = imageHTML;
        
        // Update status
        const resultIndex = karutaDataStore.currentResultIndex + 1;
        const searchKey = `${karutaDataStore.selectedCard.character}|${karutaDataStore.selectedCard.series}`;
        const totalResults = karutaDataStore.searchResults[searchKey].length;
        ui.updateStatus(`Showing image ${resultIndex} of ${totalResults}`);
    },
    
    /**
     * Generates placeholder images for a character and series
     * @param {string} character - The character name
     * @param {string} series - The series name
     * @returns {Array} Array of image HTML strings
     */
    generatePlaceholderImages(character, series) {
        // Create deterministic number of images based on character/series
        const characterSeed = character.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const seriesSeed = series.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const combinedSeed = (characterSeed + seriesSeed) % 100;
        
        // Generate 3-7 images based on the seed
        const numImages = 3 + (combinedSeed % 5);
        const images = [];
        
        for (let i = 0; i < numImages; i++) {
            // Create HTML for a colored placeholder with character/series info
            const hue = (combinedSeed * (i + 1)) % 360;
            const image = this.createColorPlaceholder(character, series, i, hue);
            images.push(image);
        }
        
        return images;
    },
    
    /**
     * Creates a colored placeholder with character and series info
     * @param {string} character - The character name
     * @param {string} series - The series name
     * @param {number} index - The image index
     * @param {number} hue - The color hue value
     * @returns {string} HTML for the placeholder
     */
    createColorPlaceholder(character, series, index, hue) {
        // Create a colored div with character and series info
        const saturation = 70 + (index * 5);
        const lightness = 65 - (index * 5);
        
        return `
            <div style="width:100%;height:100%;background-color:hsl(${hue},${saturation}%,${lightness}%);
                display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px;text-align:center;color:white;">
                <div style="font-size:1.4rem;font-weight:bold;text-shadow:1px 1px 3px rgba(0,0,0,0.5);margin-bottom:10px;">
                    ${character}
                </div>
                <div style="font-size:1.1rem;text-shadow:1px 1px 3px rgba(0,0,0,0.5);">
                    ${series}
                </div>
                <div style="margin-top:20px;font-size:0.9rem;opacity:0.8;">
                    Image ${index + 1} - No actual image search in frontend-only version
                </div>
            </div>
        `;
    }
};