# No More Hieroglyphics - Documentation Index

Welcome to the documentation for the No More Hieroglyphics technical dictionary web application. This index will help you find everything you need to understand, extend, and deploy the application.

---

## 📋 Quick Links

- [Main README](../README.md) - Project overview and quick start
- [Technical Dictionary](../index.html) - Main application
- [Database Documentation](database/DATABASE_SETUP.md) - Dictionary database structure

---

## 🚀 Getting Started

New to the project? Start here:

1. **[README](../README.md)** - Understand the project philosophy and design principles
2. **Open `index.html`** - Launch the application in your browser
3. **[Database Documentation](database/DATABASE_SETUP.md)** - Learn about the term database structure
4. **[API Documentation](api/API_DOCUMENTATION.md)** - Backend API structure (if needed)

---

## 🌐 Web Application Components

### Core Features

#### [Database Setup](database/DATABASE_SETUP.md)
Technical terms database structure:
- Term schema and fields
- Category organization
- Search and indexing
- Data seeding examples
- Extensibility guidelines

#### [API Documentation](api/API_DOCUMENTATION.md)
Backend API structure (optional):
- RESTful endpoints for term lookup
- Search functionality
- Tone sanitization service
- Error handling
- Rate limiting guidelines

---

## ⚖️ Legal

#### [Privacy Policy](legal/PRIVACY_POLICY.md)
Privacy policy template covering:
- Data collection practices
- User rights (GDPR, CCPA)
- Third-party services
- Data retention
- Security measures

#### [Terms of Service](legal/TERMS_OF_SERVICE.md)
Terms of service template including:
- User eligibility
- Usage terms
- Content policies
- Intellectual property
- Disclaimers and liability
- Dispute resolution

---

## 🗂️ Documentation Structure

```
docs/
├── README.md                           # This file
├── DEVELOPMENT_SETUP.md                # Development guide (legacy)
│
├── api/
│   └── API_DOCUMENTATION.md            # Backend API structure
│
├── database/
│   └── DATABASE_SETUP.md               # Term database schema
│
└── legal/
    ├── PRIVACY_POLICY.md               # Privacy policy template
    └── TERMS_OF_SERVICE.md             # Terms of service template
```

---

## 🎯 Common Tasks

### For Developers

**Setting up for the first time?**
1. Clone the repository
2. Open `index.html` in a browser
3. Review the code in `app.js` and `styles.css`

**Adding new terms?**
- [Database Setup](database/DATABASE_SETUP.md) - Term schema and examples
- Edit the `technicalTerms` object in `app.js`

**Customizing the design?**
- Edit `styles.css` using the defined CSS variables
- Maintain the color palette and border specifications

### For Content Contributors

**Adding technical terms?**
1. Follow the term schema in `app.js`
2. Provide accurate technical definitions
3. Include practical applications
4. Add relevant examples
5. Maintain cultural neutrality

---

## 📝 Design Philosophy

### Core Principles

1. **Direct Communication**: No conversational filler or meta-language
2. **Technical Accuracy**: Definitions from authoritative sources
3. **Professional Tone**: Strictly business-appropriate language
4. **Cultural Neutrality**: Global accessibility without biases
5. **Utility-First Design**: Zero decorative fluff
6. **High Legibility**: Optimized typography for technical content

### What We Avoid

- ❌ Condescending analogies
- ❌ Emotional coaching language
- ❌ "Friendly" illustrations without purpose
- ❌ Meta-descriptors and redundant labeling
- ❌ Bright emotional colors
- ❌ Patronizing communication styles

### What We Provide

- ✅ Dictionary-style definitions
- ✅ Technical accuracy
- ✅ Practical applications
- ✅ Professional aesthetic
- ✅ Efficient information architecture
- ✅ Split-pane comparison views

---

## 💡 Design System

### Color Palette

- **Bright Snow** (#F9F9F9): Primary background
- **Tech Charcoal** (#1A1A1B): Borders and primary text
- **Primary Text** (#263238): Body text
- **Hoodie Cobalt** (#215089): Active states, headers
- **Tabby Gold** (#F57C00): Primary actions (buttons)
- **Lively Yellow** (#FFD600): Highlights and accents

### Typography

- **Font Family**: Raleway
- **Headers**: 900 weight (Black)
- **Body**: 400-600 weight
- **Numbers**: Old-style numerals enabled
- **Line Height**: 1.6 for body text

### Layout

- **Container Width**: 1440px maximum
- **Border Width**: 3px (hand-drawn aesthetic)
- **Border Radius**: 4px
- **Grid**: 12-column system
- **Spacing Scale**: 8px, 16px, 24px, 32px, 48px

---

## 📌 Quick Reference

### File Structure

```
No-more-hieroglyphics/
├── index.html          # Main application
├── styles.css          # Design system
├── app.js              # Logic and dictionary
├── demo.html           # Standalone demo
├── README.md           # Project overview
└── docs/               # Documentation
    ├── README.md       # This file
    ├── database/       # Database docs
    ├── api/            # API docs
    └── legal/          # Legal templates
```

### Key Features

1. **Direct Decode**: Split-pane jargon translation
2. **Tone Sanitizer**: Remove emotional language
3. **Jargon Dictionary**: Searchable term database

---

## 🤝 Contributing

Contributions must maintain:
- Technical accuracy from official documentation
- Professional, neutral tone
- Cultural neutrality
- Design system consistency
- Zero decorative elements

---

## 📞 Support

For issues or questions:
- **Issues**: [GitHub Issues](https://github.com/flatfinderai-cyber/No-more-hieroglyphics/issues)
- **Documentation**: This directory

---

**Built for professionals who value precision over patronization.**
