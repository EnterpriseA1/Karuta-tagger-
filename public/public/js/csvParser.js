/**
 * CSV file parsing and processing functionality
 */
const csvParser = {
    /**
     * Initialize the CSV parser
     */
    init() {
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleParseCompletion = this.handleParseCompletion.bind(this);
        this.findColumn = this.findColumn.bind(this);
        this.createPreviewButton = this.createPreviewButton.bind(this);
        this.showDataPreview = this.showDataPreview.bind(this);
    },

    /**
     * Handles file upload and CSV parsing
     * @param {Event} e - The file input change event
     */
    handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        ui.updateStatus(`Loading file: ${file.name}`);
        
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Handle parse completion
                this.handleParseCompletion(results);
            }
        });
    },
    
    /**
     * Handles CSV parse results and processes data
     * @param {Object} results - The Papa Parse results
     */
    handleParseCompletion(results) {
        if (results.errors.length > 0) {
            alert(`Error parsing CSV: ${results.errors[0].message}`);
            ui.updateStatus('Error parsing CSV file');
            return;
        }
        
        // Format check and validation
        const data = results.data;
        
        // Check if the data has the expected structure
        if (data.length === 0) {
            alert('The CSV file is empty or has no valid data rows.');
            ui.updateStatus('Error: Empty CSV file');
            return;
        }
        
        // Get column names from the first row
        const firstRow = data[0];
        const columnNames = Object.keys(firstRow);
        
        // Try to identify necessary columns with different possible names
        let characterCol = this.findColumn(columnNames, ['character', 'name', 'char', 'char_name', 'charname']);
        let seriesCol = this.findColumn(columnNames, ['series', 'franchise', 'origin', 'anime']);
        let codeCol = this.findColumn(columnNames, ['code', 'id', 'cardid', 'card_id', 'print']);
        let burnValueCol = this.findColumn(columnNames, ['burnvalue', 'burn_value', 'burn', 'quality', 'value', 'price']);
        
        // Show column mapping to the user
        console.log('Column mapping detected:');
        console.log('Character:', characterCol);
        console.log('Series:', seriesCol);
        console.log('Code:', codeCol);
        console.log('Burn Value:', burnValueCol);
        
        // Validate required columns
        if (!characterCol || !seriesCol || !codeCol) {
            // Let user select columns manually
            let message = 'Could not identify all required columns in your CSV. Please check your file has these columns:\n\n';
            message += '- Character name (could be called "character", "name", etc.)\n';
            message += '- Series name (could be called "series", "franchise", etc.)\n';
            message += '- Card code (could be called "code", "id", etc.)\n';
            message += '- Burn value (could be called "burnValue", "quality", etc.)\n\n';
            message += 'Available columns in your file: ' + columnNames.join(', ');
            
            alert(message);
            ui.updateStatus('Error: Invalid CSV format - missing required columns');
            return;
        }
        
        // Process data to standardize column names
        const processedData = data.map(row => {
            return {
                character: row[characterCol] || 'Unknown',
                series: row[seriesCol] || 'Unknown', 
                code: row[codeCol] || 'Unknown',
                burnValue: burnValueCol ? parseFloat(row[burnValueCol]) || 0 : 0
            };
        });
        
        // Set the data in the application state
        karutaDataStore.setCardsData(processedData);
        
        // Apply default sort and display cards
        cardHandler.applySort();
        ui.updateStatus(`Loaded ${processedData.length} cards`);
        ui.updateCardCounter(processedData.length);
        
        // Create preview button if not already exists
        this.createPreviewButton(processedData);
    },
    
    /**
     * Find column name from possible options
     * @param {Array} columns - Available column names
     * @param {Array} possibleNames - Possible column name options
     * @returns {string|null} The matched column name or null
     */
    findColumn(columns, possibleNames) {
        for (const name of possibleNames) {
            // Try exact match
            if (columns.includes(name)) {
                return name;
            }
            
            // Try case-insensitive match
            const lowerCaseMatch = columns.find(col => 
                col.toLowerCase() === name.toLowerCase());
            if (lowerCaseMatch) {
                return lowerCaseMatch;
            }
            
            // Try partial match (column contains the name)
            const partialMatch = columns.find(col => 
                col.toLowerCase().includes(name.toLowerCase()));
            if (partialMatch) {
                return partialMatch;
            }
        }
        return null;
    },
    
    /**
     * Creates a preview button for checking the data
     * @param {Array} data - The processed data
     */
    createPreviewButton(data) {
        // Add a preview button for the user to check the data
        if (document.getElementById('preview-data-btn')) {
            return; // Button already exists
        }
        
        const previewBtn = document.createElement('button');
        previewBtn.className = 'btn btn-sm btn-outline-info mt-2';
        previewBtn.textContent = 'Preview Data';
        previewBtn.id = 'preview-data-btn';
        
        previewBtn.addEventListener('click', () => {
            this.showDataPreview(data.slice(0, 10));
        });
        
        // Add the button below the file input
        const fileInputParent = ui.elements.csvFile.parentElement;
        fileInputParent.appendChild(previewBtn);
    },
    
    /**
     * Shows a preview of the parsed data
     * @param {Array} sampleData - Sample data to preview
     */
    showDataPreview(sampleData) {
        let previewHTML = '<div class="table-responsive"><table class="table table-striped table-sm">';
        
        // Table header
        previewHTML += '<thead><tr>';
        const headers = ['Character', 'Series', 'Code', 'Burn Value'];
        headers.forEach(header => {
            previewHTML += `<th>${header}</th>`;
        });
        previewHTML += '</tr></thead>';
        
        // Table body
        previewHTML += '<tbody>';
        sampleData.forEach(card => {
            previewHTML += '<tr>';
            previewHTML += `<td>${card.character}</td>`;
            previewHTML += `<td>${card.series}</td>`;
            previewHTML += `<td>${card.code}</td>`;
            previewHTML += `<td>${card.burnValue}</td>`;
            previewHTML += '</tr>';
        });
        previewHTML += '</tbody></table></div>';
        
        // Create modal to show preview
        const previewModal = document.createElement('div');
        previewModal.className = 'modal fade';
        previewModal.id = 'previewModal';
        previewModal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Data Preview (First 10 rows)</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${previewHTML}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if it exists
        const existingModal = document.getElementById('previewModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to DOM and show it
        document.body.appendChild(previewModal);
        const modal = new bootstrap.Modal(previewModal);
        modal.show();
    }
};