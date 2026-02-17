# Color Palette - NoMoreHieroglyphics

## Official Color Palette

### Primary Colors

| Name | Hex | RGB | CMYK | HSB | HSL | Lab |
|------|-----|-----|------|-----|-----|-----|
| Fresh Sky | #00B0FF | [0,176,255] | [100,31,0,0] | [199,100,100] | [199,100,50] | [68,-10,-49] |
| Gold | #FFD600 | [255,214,0] | [0,16,100,0] | [50,100,100] | [50,100,50] | [87,-1,87] |
| Vivid Tangerine | #F57C00 | [245,124,0] | [0,49,100,4] | [30,100,96] | [30,100,48] | [65,41,72] |
| Dusk Blue | #215089 | [33,80,137] | [76,42,0,46] | [213,76,54] | [213,61,33] | [34,5,-36] |
| Carbon Black | #1A1A1B | [26,26,27] | [4,4,0,89] | [240,4,11] | [240,2,10] | [9,0,-1] |

## Usage Guidelines

### Fresh Sky (#00B0FF)
**Primary Background Color**
- Use for main application background
- Creates energetic, modern feel
- High contrast with text colors

### Gold (#FFD600)
**Highlight & Accent Color**
- Use for pill-shaped term highlights
- Attention-grabbing elements
- Warning or important notices

### Vivid Tangerine (#F57C00)
**Primary Action Color**
- Use for main CTA buttons (Decode, Search, Sanitize)
- Active states
- Important interactive elements

### Dusk Blue (#215089)
**Secondary Action & Headers**
- Use for navigation active states
- Section headers
- Secondary buttons
- Links

### Carbon Black (#1A1A1B)
**Text & Borders**
- Primary text color
- All borders (3px width)
- Strong contrast elements

## Data Formats

### CSV
```csv
00B0FF,FFD600,F57C00,215089,1A1A1B
```

### With Hash Symbols
```
#00B0FF, #FFD600, #F57C00, #215089, #1A1A1B
```

### JavaScript Array
```javascript
["00B0FF","FFD600","F57C00","215089","1A1A1B"]
```

### JavaScript Object
```javascript
{
  "Fresh Sky": "00B0FF",
  "Gold": "FFD600",
  "Vivid Tangerine": "F57C00",
  "Dusk Blue": "215089",
  "Carbon Black": "1A1A1B"
}
```

### Extended Array (Full Data)
```javascript
[
  {
    "name": "Fresh Sky",
    "hex": "00B0FF",
    "rgb": [0,176,255],
    "cmyk": [100,31,0,0],
    "hsb": [199,100,100],
    "hsl": [199,100,50],
    "lab": [68,-10,-49]
  },
  {
    "name": "Gold",
    "hex": "FFD600",
    "rgb": [255,214,0],
    "cmyk": [0,16,100,0],
    "hsb": [50,100,100],
    "hsl": [50,100,50],
    "lab": [87,-1,87]
  },
  {
    "name": "Vivid Tangerine",
    "hex": "F57C00",
    "rgb": [245,124,0],
    "cmyk": [0,49,100,4],
    "hsb": [30,100,96],
    "hsl": [30,100,48],
    "lab": [65,41,72]
  },
  {
    "name": "Dusk Blue",
    "hex": "215089",
    "rgb": [33,80,137],
    "cmyk": [76,42,0,46],
    "hsb": [213,76,54],
    "hsl": [213,61,33],
    "lab": [34,5,-36]
  },
  {
    "name": "Carbon Black",
    "hex": "1A1A1B",
    "rgb": [26,26,27],
    "cmyk": [4,4,0,89],
    "hsb": [240,4,11],
    "hsl": [240,2,10],
    "lab": [9,0,-1]
  }
]
```

### XML Format
```xml
<palette>
  <color>
    <name>Fresh Sky</name>
    <hex>00B0FF</hex>
    <rgb>
      <r>0</r>
      <g>176</g>
      <b>255</b>
    </rgb>
  </color>
  <color>
    <name>Gold</name>
    <hex>FFD600</hex>
    <rgb>
      <r>255</r>
      <g>214</g>
      <b>0</b>
    </rgb>
  </color>
  <color>
    <name>Vivid Tangerine</name>
    <hex>F57C00</hex>
    <rgb>
      <r>245</r>
      <g>124</g>
      <b>0</b>
    </rgb>
  </color>
  <color>
    <name>Dusk Blue</name>
    <hex>215089</hex>
    <rgb>
      <r>33</r>
      <g>80</g>
      <b>137</b>
    </rgb>
  </color>
  <color>
    <name>Carbon Black</name>
    <hex>1A1A1B</hex>
    <rgb>
      <r>26</r>
      <g>26</g>
      <b>27</b>
    </rgb>
  </color>
</palette>
```

## CSS Variables

```css
:root {
    /* Primary Colors */
    --fresh-sky: #00B0FF;
    --carbon-black: #1A1A1B;
    
    /* Accent Colors */
    --dusk-blue: #215089;
    --vivid-tangerine: #F57C00;
    --gold: #FFD600;
}
```

## Color Contrast Ratios

### Text on Fresh Sky Background
- Carbon Black on Fresh Sky: 4.8:1 (AA compliant)
- Dusk Blue on Fresh Sky: 3.2:1 (AA Large Text)

### Text on White Background
- Carbon Black on White: 15.3:1 (AAA compliant)
- Dusk Blue on White: 6.8:1 (AAA compliant)

## Accessibility Notes

- Fresh Sky provides adequate contrast for Carbon Black text
- For small text, use Carbon Black (#1A1A1B) as primary color
- For buttons and interactive elements, use Vivid Tangerine with white text
- Ensure all interactive elements have sufficient color contrast

## Brand Consistency

All official NoMoreHieroglyphics materials should use these exact hex values. No variations or approximations should be used to maintain brand consistency across all platforms and media.
