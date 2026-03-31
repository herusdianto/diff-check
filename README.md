# Diff Check

A client-side web tool for comparing two texts and finding the differences between them.

**100% Client-side - No data sent to server!**

## Features

- ✅ Compare two text inputs side by side
- ✅ Upload text files for comparison (.txt, .csv, .log, .json, .xml, .md, .html)
- ✅ Drag & drop file support
- ✅ Visual diff output with color highlighting (additions in green, deletions in red)
- ✅ Line numbers display
- ✅ Ignore case option
- ✅ Ignore whitespace option
- ✅ Ignore blank lines option
- ✅ Statistics (additions, deletions, changes, unchanged)
- ✅ Copy diff to clipboard
- ✅ Download diff as .txt file
- ✅ Swap texts between panels
- ✅ Clear all inputs
- ✅ Dark/Light mode toggle
- ✅ Responsive design

## Options

| Option | Description |
|--------|-------------|
| Ignore Case | Treat "Apple" and "apple" as the same |
| Ignore Whitespace | Ignore differences in whitespace |
| Ignore Blank Lines | Skip empty lines when comparing |
| Show Line Numbers | Display line numbers in the diff output |

## Usage

### Option 1: Open directly in browser

Simply open `public/index.html` in your web browser.

### Option 2: Use a local server

```bash
# Using Python
cd public
python -m http.server 8000

# Using Node.js
npx serve public

# Using PHP
php -S localhost:8000 -t public
```

Then open `http://localhost:8000` in your browser.

## How It Works

1. Paste or upload text in both "Original Text" and "Modified Text" panels
2. Configure comparison options if needed
3. Click "Compare Texts" to see the differences
4. Results show:
   - **Green (+)**: Lines added in the modified text
   - **Red (-)**: Lines removed from the original text
   - **No highlight**: Unchanged lines
5. Use action buttons to copy, download, swap, or clear

## Algorithm

The diff comparison uses the Longest Common Subsequence (LCS) algorithm to find the optimal alignment between two texts, providing accurate and meaningful diff results.

## Project Structure

```
diff-check/
├── public/
│   ├── index.html      # Main HTML file
│   ├── 404.html        # 404 error page
│   ├── favicon.svg     # Site favicon
│   ├── css/
│   │   └── style.css   # Styles
│   └── js/
│       └── app.js      # Main application logic
└── README.md           # This file
```

## Technologies Used

- Pure HTML5, CSS3, and JavaScript (ES6+)
- No external dependencies
- LCS (Longest Common Subsequence) algorithm for diff computation

## Privacy

All text processing is done entirely in your browser. No data is ever sent to any server. Your texts remain completely private.

## License

MIT License

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## Demo

[https://herusdianto.github.io/diff-check/](https://herusdianto.github.io/diff-check/)