# No More Hieroglyphics

> Technical Dictionary - Direct, Professional, No Fluff

A desktop-first web application that translates complex technical jargon into precise, professional English without condescending analogies or emotional coaching.

## Overview

No More Hieroglyphics provides a neutral, high-accuracy technical dictionary and communication sanitizer for global professionals and non-technical stakeholders who interact with specialized technical teams.

### Core Features

- **Direct Decode** - Split-pane translation of technical jargon with dual-view results (Technical Definition + Practical Application)
- **Tone Sanitizer** - Removes emotional triggers, patronizing analogies, and culturally specific language from communications
- **Jargon Dictionary** - Searchable database of technical terms with strictly technical definitions

### Design Principles

- **Utility-First**: Minimalist professional aesthetic with zero decorative fluff
- **Business Professional**: Strictly neutral tone without emotional UI components
- **Desktop-Optimized**: 1440px width, 12-column grid layout
- **High-Precision**: Dictionary-style responses with no conversational filler

## Target Audience

Global professionals and non-technical stakeholders frustrated by tech jargon and patronizing communication styles in technical environments.

## Technical Specifications

### Platform
- Desktop-first web application
- Optimized for 1440px width
- Responsive down to 1024px

### Platform
- Desktop-first web application
- Optimized for 1440px width
- Responsive down to 1024px

### Design System

**Color Palette:**
- Background: `#F9F9F9` (Bright Snow)
- Borders: `#1A1A1B` (Tech Charcoal) - 3px width
- Primary Text: `#263238`
- Primary Actions: `#F57C00` (Tabby Gold)
- Secondary Actions: `#215089` (Hoodie Cobalt)
- Highlights: `#FFD600` (Lively Yellow)

**Typography:**
- Font Family: Raleway
- Headers: 900 weight (Black)
- Body: 400-600 weight
- Numbers: Old-style numerals enabled
- High-legibility sans-serif design

**Layout:**
- 12-column grid system
- Split-pane comparison views
- 3-5px borders for "hand-drawn" aesthetic
- Pill-shaped highlights for jargon terms

## Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/flatfinderai-cyber/No-more-hieroglyphics.git
cd No-more-hieroglyphics
```

2. Open `index.html` in a web browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Or use a local server:
```bash
# Python 3
python3 -m http.server 8000

# Node.js (using npx)
npx http-server -p 8000

# Then visit http://localhost:8000
```

### Usage

1. **Direct Decode**: Paste technical text → Click "Decode" → View technical and practical definitions
2. **Tone Sanitizer**: Paste communication → Click "Sanitize" → Receive professionally neutral version
3. **Jargon Dictionary**: Enter term → Click "Search" → View comprehensive definition

## Project Structure

```
No-more-hieroglyphics/
├── index.html          # Main application HTML
├── styles.css          # Design system and styling
├── app.js              # Application logic and dictionary
├── README.md           # This file
├── .gitignore          # Git exclusions
└── docs/               # Additional documentation
    ├── README.md       # Documentation index
    ├── database/       # Database documentation
    ├── api/            # API documentation
    └── legal/          # Legal templates
```

## Features Detail

### Direct Decode
- Split-pane interface with source on left, translation on right
- Dual-view results: Technical Definition + Practical Application
- Extracts and defines all recognized technical terms
- No conversational filler or meta-language

### Tone Sanitizer
- Removes emotional coaching phrases ("breathe", "calm down")
- Eliminates patronizing analogies ("think of it like...")
- Strips culturally specific language
- Maintains technical accuracy while improving professionalism

### Jargon Dictionary
- Searchable technical term database
- Category-based organization (Programming, DevOps, Database, etc.)
- Strict technical definitions from authoritative sources
- Practical application context without oversimplification

## Design Philosophy

### What We Avoid
- ❌ Condescending analogies
- ❌ Emotional coaching or "soft" language
- ❌ Decorative fluff or unnecessary visual elements
- ❌ "Friendly" illustrations that add no value
- ❌ Meta-descriptors like "Plain Natural Language Engine"
- ❌ Bright emotional colors (reds, pastels)

### What We Provide
- ✅ Direct, dictionary-style definitions
- ✅ Technical accuracy without oversimplification
- ✅ Culturally neutral language
- ✅ Professional, business-appropriate tone
- ✅ Efficient information architecture
- ✅ High-legibility typography

## Expanding the Dictionary

The technical terms database is located in `app.js`. To add new terms:

```javascript
'newterm': {
    term: 'Display Name',
    category: 'Category Name',
    technical: 'Precise technical definition...',
    practical: 'Real-world application...',
    examples: ['Example 1', 'Example 2']
}
```

Categories: Programming, Database, DevOps, Architecture, Networking, Security, Cloud

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Contributions should maintain the strict professional tone and utility-first design philosophy. All submissions must:

1. Provide technically accurate definitions sourced from official documentation
2. Avoid analogies, emotional language, or conversational filler
3. Maintain cultural neutrality
4. Follow the established design system
5. Include no decorative or "friendly" elements

## License

MIT License - See LICENSE file for details

## Support

For technical issues or dictionary additions:
- **Issues**: [GitHub Issues](https://github.com/flatfinderai-cyber/No-more-hieroglyphics/issues)
- **Documentation**: See `/docs` directory

## Philosophy

This tool exists because technical communication should be:
- **Direct**: No unnecessary steps or psychological interventions
- **Neutral**: Free from cultural biases and emotional manipulation
- **Accurate**: Preserving technical detail without oversimplification
- **Professional**: Appropriate for global business contexts

No breathing exercises. No calming down. Just definitions.

---

**Built for professionals who value precision over patronization.**
