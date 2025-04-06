/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    ui.init();
    
    // Initialize data store
    karutaDataStore.init();
    
    // Initialize image handler
    imageHandler.init();
    
    // Initialize card handler
    cardHandler.init();
    
    // Initialize tag manager
    tagManager.init();
    
    // Initialize CSV parser
    csvParser.init();
    
    // Setup event listeners
    ui.setupEventListeners();
    
    // Create import tags button
    createImportTagsButton();
    
    // Update initial status
    ui.updateStatus('Ready - Please upload a CSV file to begin');
    
    /**
     * Creates an import tags button
     */
    function createImportTagsButton() {
        const importButton = document.createElement('button');
        importButton.className = 'btn btn-sm btn-secondary position-fixed';
        importButton.style.right = '120px';
        importButton.style.top = '10px';
        importButton.innerHTML = '<i class="bi bi-upload"></i> Import Tags';
        
        // Create hidden file input for import
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                tagManager.importTagsFromJson(file);
            }
        });
        
        document.body.appendChild(fileInput);
        
        importButton.addEventListener('click', () => {
            fileInput.click();
        });
        
        document.body.appendChild(importButton);
    }
});