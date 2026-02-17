// Technical Dictionary Database
const technicalTerms = {
    'api': {
        term: 'API',
        category: 'Programming',
        technical: 'Application Programming Interface. A set of protocols, routines, and tools for building software applications that specifies how software components should interact.',
        practical: 'A standardized method that allows different software systems to communicate with each other by sending and receiving data through defined endpoints.',
        examples: ['REST API for web services', 'Database API for data access', 'Operating system API for system calls']
    },
    'rest': {
        term: 'REST',
        category: 'Architecture',
        technical: 'Representational State Transfer. An architectural style for distributed hypermedia systems that uses HTTP methods to perform CRUD operations on resources identified by URLs.',
        practical: 'A design pattern for web services where data is accessed and manipulated using standard HTTP requests (GET, POST, PUT, DELETE) through URLs.',
        examples: ['GET /users/123 retrieves user data', 'POST /users creates new user', 'DELETE /users/123 removes user']
    },
    'crud': {
        term: 'CRUD',
        category: 'Database',
        technical: 'Create, Read, Update, Delete. The four basic operations of persistent storage.',
        practical: 'The fundamental database operations: adding new records, retrieving existing data, modifying records, and removing records.',
        examples: ['INSERT statement creates records', 'SELECT reads data', 'UPDATE modifies records', 'DELETE removes records']
    },
    'docker': {
        term: 'Docker',
        category: 'DevOps',
        technical: 'A platform for developing, shipping, and running applications in isolated containers that package code and dependencies together.',
        practical: 'Software that creates standardized, portable units (containers) containing an application and everything it needs to run, ensuring consistent behavior across different environments.',
        examples: ['Development container matches production', 'Microservices run in separate containers', 'Easy deployment to cloud platforms']
    },
    'kubernetes': {
        term: 'Kubernetes',
        category: 'DevOps',
        technical: 'An open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.',
        practical: 'A system that manages multiple Docker containers across multiple servers, handling scaling, updates, and failures automatically.',
        examples: ['Auto-scaling based on traffic', 'Zero-downtime deployments', 'Self-healing when containers fail']
    }
};

// Application State
const state = {
    currentView: 'decode',
    searchResults: [],
    isProcessing: false
};

// View Management
function switchView(viewName) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewName) {
            btn.classList.add('active');
        }
    });

    // Update content views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`).classList.add('active');

    state.currentView = viewName;
}

// Direct Decode Function
function decodeText() {
    const input = document.getElementById('decode-input').value.trim();
    const outputDiv = document.getElementById('decode-output');

    if (!input) {
        showError(outputDiv, 'Input required. Enter text to decode.');
        return;
    }

    // Extract technical terms from input
    const foundTerms = extractTerms(input);

    if (foundTerms.length === 0) {
        outputDiv.innerHTML = `
            <div class="output-section">
                <h3 class="output-label">Analysis</h3>
                <p class="output-text">No recognized technical terms found in input text. The dictionary is continuously expanding.</p>
            </div>
        `;
        return;
    }

    // Display results
    let technicalHtml = '<ul style="list-style: none; padding: 0;">';
    let practicalHtml = '<ul style="list-style: none; padding: 0;">';

    foundTerms.forEach(termKey => {
        const term = technicalTerms[termKey];
        technicalHtml += `
            <li style="margin-bottom: 16px;">
                <strong class="jargon-highlight">${term.term}</strong>: ${term.technical}
            </li>
        `;
        practicalHtml += `
            <li style="margin-bottom: 16px;">
                <strong class="jargon-highlight">${term.term}</strong>: ${term.practical}
            </li>
        `;
    });

    technicalHtml += '</ul>';
    practicalHtml += '</ul>';

    outputDiv.innerHTML = `
        <div class="output-section">
            <h3 class="output-label">Technical Definition</h3>
            <div class="output-text">${technicalHtml}</div>
        </div>
        <div class="output-section">
            <h3 class="output-label">Practical Application</h3>
            <div class="output-text">${practicalHtml}</div>
        </div>
    `;
}

// Tone Sanitizer Function
function sanitizeText() {
    const input = document.getElementById('sanitizer-input').value.trim();
    const outputDiv = document.getElementById('sanitizer-output');

    if (!input) {
        showError(outputDiv, 'Input required. Enter text to sanitize.');
        return;
    }

    // Patterns to remove/replace
    const emotionalPatterns = [
        { pattern: /take a (deep )?breath/gi, replacement: '' },
        { pattern: /calm down/gi, replacement: '' },
        { pattern: /don't worry/gi, replacement: '' },
        { pattern: /like (a|an) [^.,!?]+(,|\.|!|\?)/gi, replacement: '' }, // Remove analogies
        { pattern: /think of it (as|like)/gi, replacement: 'defined as' },
        { pattern: /imagine (that|if)/gi, replacement: 'consider' },
        { pattern: /you might (feel|think)/gi, replacement: 'the situation is' },
        { pattern: /😊|😃|😄|😁|🙂|😌|😎|🤗/g, replacement: '' }, // Remove emoji
        { pattern: /!{2,}/g, replacement: '.' }, // Multiple exclamations
        { pattern: /\s+/g, replacement: ' ' } // Clean up spaces
    ];

    let sanitized = input;
    emotionalPatterns.forEach(({ pattern, replacement }) => {
        sanitized = sanitized.replace(pattern, replacement);
    });

    sanitized = sanitized.trim();

    // Display result
    outputDiv.innerHTML = `
        <div class="output-section">
            <h3 class="output-label">Sanitized Output</h3>
            <p class="output-text">${sanitized || 'Text processed. No content remaining after sanitization.'}</p>
        </div>
        <div class="output-section">
            <h3 class="output-label">Removed Elements</h3>
            <p class="output-text">Emotional language, analogies, and non-professional elements have been removed.</p>
        </div>
    `;
}

// Dictionary Search Function
function searchDictionary() {
    const query = document.getElementById('dictionary-search').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('dictionary-results');

    if (!query) {
        resultsDiv.innerHTML = '<p class="placeholder-text">Enter a term to search the dictionary...</p>';
        return;
    }

    // Search for matching terms
    const matches = Object.keys(technicalTerms).filter(key => 
        key.includes(query) || 
        technicalTerms[key].term.toLowerCase().includes(query) ||
        technicalTerms[key].technical.toLowerCase().includes(query) ||
        technicalTerms[key].practical.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        resultsDiv.innerHTML = `
            <div class="term-result">
                <h3 class="term-title">No Results Found</h3>
                <p class="term-definition">The term "${query}" was not found in the dictionary. The database is continuously expanding.</p>
            </div>
        `;
        return;
    }

    // Display results
    let html = '';
    matches.forEach(key => {
        const term = technicalTerms[key];
        html += `
            <div class="term-result">
                <h3 class="term-title">${term.term}</h3>
                <span class="term-category">${term.category}</span>
                <div style="margin-top: 16px;">
                    <p class="term-definition"><strong>Technical:</strong> ${term.technical}</p>
                    <p class="term-definition"><strong>Practical:</strong> ${term.practical}</p>
                    ${term.examples ? `<p class="term-definition"><strong>Examples:</strong> ${term.examples.join(', ')}</p>` : ''}
                </div>
            </div>
        `;
    });

    resultsDiv.innerHTML = html;
}

// Helper Functions
function extractTerms(text) {
    const lowerText = text.toLowerCase();
    const found = [];
    
    Object.keys(technicalTerms).forEach(key => {
        if (lowerText.includes(key) || lowerText.includes(technicalTerms[key].term.toLowerCase())) {
            found.push(key);
        }
    });
    
    return found;
}

function showError(element, message) {
    element.innerHTML = `
        <div class="output-section">
            <p class="output-text" style="color: var(--primary-text);">${message}</p>
        </div>
    `;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView(btn.dataset.view);
        });
    });

    // Decode button
    document.getElementById('decode-btn').addEventListener('click', decodeText);
    
    // Enter key in decode input
    document.getElementById('decode-input').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            decodeText();
        }
    });

    // Sanitizer button
    document.getElementById('sanitizer-btn').addEventListener('click', sanitizeText);
    
    // Enter key in sanitizer input
    document.getElementById('sanitizer-input').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            sanitizeText();
        }
    });

    // Dictionary search button
    document.getElementById('search-btn').addEventListener('click', searchDictionary);
    
    // Enter key in dictionary search
    document.getElementById('dictionary-search').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchDictionary();
        }
    });
});
