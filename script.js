// Function to position paragraphs based on data attributes
function positionParagraphs() {
    const paragraphs = document.querySelectorAll('.paragraph');
    
    paragraphs.forEach(paragraph => {
        const x = paragraph.dataset.x || 0;
        const width = paragraph.dataset.width || 25;
        const y = paragraph.dataset.y || 0;
        
        paragraph.style.left = `${x}%`;
        paragraph.style.width = `${width}%`;
        paragraph.style.top = `${y}%`;
    });
}

// Function to draw connection line between paragraphs
function drawConnectionLine(sourceElement, targetElement) {
    const svg = document.getElementById('connection-lines');
    
    // Get positions of both paragraphs relative to the document
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    
    // Calculate center points relative to the document (accounting for scroll)
    const sourceX = sourceRect.left + sourceRect.width / 2 + window.scrollX;
    const sourceY = sourceRect.top + sourceRect.height / 2 + window.scrollY;
    const targetX = targetRect.left + targetRect.width / 2 + window.scrollX;
    const targetY = targetRect.top + targetRect.height / 2 + window.scrollY;
    
    // Create line element
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', sourceX);
    line.setAttribute('y1', sourceY);
    line.setAttribute('x2', targetX);
    line.setAttribute('y2', targetY);
    line.setAttribute('class', 'connection-line');
    
    // Add to SVG
    svg.appendChild(line);
}

// Function to handle internal link clicks with smooth scrolling
function setupInternalLinks() {
    const internalLinks = document.querySelectorAll('.internal-link');
    console.log(`Found ${internalLinks.length} internal links`);
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            const sourceElement = this.closest('.paragraph');
            
            console.log(`Clicked link to: ${targetId}`);
            
            if (targetElement && sourceElement) {
                console.log(`Drawing line from ${sourceElement.id} to ${targetId}`);
                // Draw connection line
                drawConnectionLine(sourceElement, targetElement);
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            } else {
                console.error(`Missing elements - source: ${sourceElement?.id}, target: ${targetId}`);
            }
        });
    });
}

// Function to update paragraph position (can be called from console or other scripts)
function updateParagraphPosition(paragraphId, x, width, y) {
    const paragraph = document.getElementById(paragraphId);
    if (paragraph) {
        paragraph.style.left = `${x}%`;
        paragraph.style.width = `${width}%`;
        paragraph.style.top = `${y}%`;
        
        // Update data attributes
        paragraph.dataset.x = x;
        paragraph.dataset.width = width;
        paragraph.dataset.y = y;
        
        console.log(`Updated ${paragraphId}: x=${x}%, width=${width}%, y=${y}%`);
    } else {
        console.error(`Paragraph ${paragraphId} not found`);
    }
}

// Function to get current paragraph positions (useful for debugging)
function getParagraphPositions() {
    const positions = {};
    const paragraphs = document.querySelectorAll('.paragraph');
    
    paragraphs.forEach(paragraph => {
        const id = paragraph.id;
        const rect = paragraph.getBoundingClientRect();
        const containerRect = document.querySelector('.container').getBoundingClientRect();
        
        positions[id] = {
            x: ((rect.left - containerRect.left) / containerRect.width * 100).toFixed(1),
            y: ((rect.top - containerRect.top) / containerRect.height * 100).toFixed(1),
            width: (rect.width / containerRect.width * 100).toFixed(1)
        };
    });
    
    return positions;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    positionParagraphs();
    setupInternalLinks();
    
    // Make utility functions available globally for console use
    window.updateParagraphPosition = updateParagraphPosition;
    window.getParagraphPositions = getParagraphPositions;
    
    console.log('Hypertext essay initialized. Use updateParagraphPosition(id, x, width, y) to reposition paragraphs.');
});

// Handle window resize
window.addEventListener('resize', function() {
    // Paragraphs use percentage positioning, so they should adjust automatically
    // But we can trigger a reposition if needed
    positionParagraphs();
});