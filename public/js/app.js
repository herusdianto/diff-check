/**
 * Diff Check - Compare Text Differences
 * Find differences between two texts
 */

// Default example data
const DEFAULT_LEFT = `Hello World
This is line 2
This is line 3
Line to be removed
Common line here`;

const DEFAULT_RIGHT = `Hello World
This is line 2 modified
This is line 3
New line added
Common line here`;

class DiffCheck {
    constructor() {
        this.diffResult = null;
        this.init();
        this.setDefaultExample();
    }

    init() {
        this.bindInputTypeToggle();
        this.bindFileEvents();
        this.bindCompareButton();
        this.bindCopyButton();
        this.bindDownloadButton();
        this.bindSwapButton();
        this.bindClearButton();
        this.initThemeToggle();
    }

    setDefaultExample() {
        const leftText = document.getElementById('input-text-left');
        const rightText = document.getElementById('input-text-right');
        if (leftText && !leftText.value.trim()) {
            leftText.value = DEFAULT_LEFT;
        }
        if (rightText && !rightText.value.trim()) {
            rightText.value = DEFAULT_RIGHT;
        }
        this.compare();
    }

    // ==================== Theme Toggle ====================
    initThemeToggle() {
        const themeSwitch = document.getElementById('theme-switch');
        const themeIcon = document.getElementById('theme-icon');

        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        this.updateThemeIcon(themeIcon, savedTheme);

        themeSwitch.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(themeIcon, newTheme);
        });
    }

    updateThemeIcon(iconElement, theme) {
        iconElement.innerHTML = theme === 'dark'
            ? `<svg class="sun-icon" viewBox="0 0 24 24" width="28" height="28"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 100-2H2a1 1 0 100 2zm18 0h2a1 1 0 100-2h-2a1 1 0 100 2zM11 2v2a1 1 0 102 0V2a1 1 0 10-2 0zm0 18v2a1 1 0 102 0v-2a1 1 0 10-2 0zM5.99 4.58a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 101.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 101.41-1.41l-1.06-1.06zm1.06-10.96a1 1 0 10-1.41-1.41l-1.06 1.06a1 1 0 101.41 1.41l1.06-1.06zM7.05 18.36a1 1 0 10-1.41-1.41l-1.06 1.06a1 1 0 101.41 1.41l1.06-1.06z"></path></svg>`
            : `<svg class="moon-icon" viewBox="0 0 24 24" width="28" height="28"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"></path></svg>`;
    }

    // ==================== Input Type Toggle ====================
    bindInputTypeToggle() {
        // Left panel
        const leftRadios = document.querySelectorAll('input[name="input-type-left"]');
        leftRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                document.getElementById('text-input-left').classList.toggle('hidden', radio.value !== 'text');
                document.getElementById('file-input-left').classList.toggle('hidden', radio.value !== 'file');
            });
        });

        // Right panel
        const rightRadios = document.querySelectorAll('input[name="input-type-right"]');
        rightRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                document.getElementById('text-input-right').classList.toggle('hidden', radio.value !== 'text');
                document.getElementById('file-input-right').classList.toggle('hidden', radio.value !== 'file');
            });
        });
    }

    // ==================== File Events ====================
    bindFileEvents() {
        this.setupDropZone('drop-zone-left', 'input-file-left', 'file-preview-left', 'input-text-left');
        this.setupDropZone('drop-zone-right', 'input-file-right', 'file-preview-right', 'input-text-right');
    }

    setupDropZone(dropZoneId, fileInputId, previewId, textAreaId) {
        const dropZone = document.getElementById(dropZoneId);
        const fileInput = document.getElementById(fileInputId);

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                this.handleFile(e.dataTransfer.files[0], previewId, textAreaId);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.handleFile(e.target.files[0], previewId, textAreaId);
            }
        });
    }

    handleFile(file, previewId, textAreaId) {
        const preview = document.getElementById(previewId);
        preview.classList.remove('hidden');

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lineCount = content.split('\n').length;

            preview.innerHTML = `
                <div class="file-details">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.formatFileSize(file.size)} • ${lineCount} lines</span>
                    <button class="remove-file" data-preview="${previewId}" data-file="${textAreaId.replace('input-text', 'input-file')}">✕ Remove</button>
                </div>
            `;
            preview.querySelector('.remove-file').addEventListener('click', (e) => {
                this.removeFile(e.target.dataset.preview, e.target.dataset.file);
            });

            document.getElementById(textAreaId).value = content;
        };
        reader.readAsText(file);
    }

    removeFile(previewId, fileInputId) {
        document.getElementById(fileInputId).value = '';
        document.getElementById(previewId).classList.add('hidden');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // ==================== Compare Button ====================
    bindCompareButton() {
        document.getElementById('compare-btn').addEventListener('click', () => this.compare());
    }

    compare() {
        const leftText = document.getElementById('input-text-left').value;
        const rightText = document.getElementById('input-text-right').value;

        if (!leftText.trim() && !rightText.trim()) {
            this.showStatus('Please enter text in at least one panel', 'error');
            return;
        }

        // Get options
        const ignoreCase = document.getElementById('ignore-case').checked;
        const ignoreWhitespace = document.getElementById('ignore-whitespace').checked;
        const ignoreBlankLines = document.getElementById('ignore-blank-lines').checked;
        const showLineNumbers = document.getElementById('show-line-numbers').checked;

        // Process lines
        let leftLines = leftText.split('\n');
        let rightLines = rightText.split('\n');

        // Apply options for comparison
        const processLine = (line) => {
            let processed = line;
            if (ignoreWhitespace) {
                processed = processed.replace(/\s+/g, ' ').trim();
            }
            if (ignoreCase) {
                processed = processed.toLowerCase();
            }
            return processed;
        };

        // Filter blank lines if needed
        if (ignoreBlankLines) {
            leftLines = leftLines.filter(line => line.trim() !== '');
            rightLines = rightLines.filter(line => line.trim() !== '');
        }

        // Compute diff using LCS algorithm
        const diff = this.computeDiff(leftLines, rightLines, processLine);
        this.diffResult = diff;

        // Render diff
        this.renderDiff(diff, showLineNumbers);

        // Update stats
        this.updateStats(diff);

        this.showStatus('Comparison completed!', 'success');
    }

    computeDiff(leftLines, rightLines, processLine) {
        const m = leftLines.length;
        const n = rightLines.length;

        // Build LCS table
        const lcs = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (processLine(leftLines[i - 1]) === processLine(rightLines[j - 1])) {
                    lcs[i][j] = lcs[i - 1][j - 1] + 1;
                } else {
                    lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
                }
            }
        }

        // Backtrack to find diff
        const diff = [];
        let i = m, j = n;

        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && processLine(leftLines[i - 1]) === processLine(rightLines[j - 1])) {
                diff.unshift({ type: 'unchanged', leftLine: i, rightLine: j, content: leftLines[i - 1] });
                i--;
                j--;
            } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
                diff.unshift({ type: 'added', leftLine: null, rightLine: j, content: rightLines[j - 1] });
                j--;
            } else {
                diff.unshift({ type: 'removed', leftLine: i, rightLine: null, content: leftLines[i - 1] });
                i--;
            }
        }

        return diff;
    }

    renderDiff(diff, showLineNumbers) {
        const output = document.getElementById('diff-output');

        if (diff.length === 0) {
            output.innerHTML = '<div class="diff-placeholder"><p>No differences found - texts are identical!</p></div>';
            return;
        }

        let html = '<div class="diff-lines">';

        for (const line of diff) {
            const lineNumLeft = showLineNumbers && line.leftLine ? `<span class="line-num">${line.leftLine}</span>` : '';
            const lineNumRight = showLineNumbers && line.rightLine ? `<span class="line-num">${line.rightLine}</span>` : '';
            const lineNums = showLineNumbers ? `<span class="line-nums">${lineNumLeft}${lineNumRight}</span>` : '';

            const escapedContent = this.escapeHtml(line.content || '');
            const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';

            html += `<div class="diff-line ${line.type}">
                ${lineNums}
                <span class="diff-prefix">${prefix}</span>
                <span class="diff-content">${escapedContent}</span>
            </div>`;
        }

        html += '</div>';
        output.innerHTML = html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats(diff) {
        const stats = {
            additions: 0,
            deletions: 0,
            unchanged: 0
        };

        for (const line of diff) {
            if (line.type === 'added') stats.additions++;
            else if (line.type === 'removed') stats.deletions++;
            else stats.unchanged++;
        }

        document.getElementById('stats').classList.remove('hidden');
        document.getElementById('additions-count').textContent = stats.additions;
        document.getElementById('deletions-count').textContent = stats.deletions;
        document.getElementById('changes-count').textContent = stats.additions + stats.deletions;
        document.getElementById('unchanged-count').textContent = stats.unchanged;
    }

    // ==================== Copy Button ====================
    bindCopyButton() {
        document.getElementById('copy-diff-btn').addEventListener('click', () => {
            if (!this.diffResult || this.diffResult.length === 0) {
                this.showStatus('Nothing to copy', 'error');
                return;
            }

            const diffText = this.diffResult.map(line => {
                const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
                return `${prefix} ${line.content}`;
            }).join('\n');

            navigator.clipboard.writeText(diffText).then(() => {
                const btn = document.getElementById('copy-diff-btn');
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                this.showStatus('Failed to copy to clipboard', 'error');
            });
        });
    }

    // ==================== Download Button ====================
    bindDownloadButton() {
        document.getElementById('download-diff-btn').addEventListener('click', () => {
            if (!this.diffResult || this.diffResult.length === 0) {
                this.showStatus('Nothing to download', 'error');
                return;
            }

            const diffText = this.diffResult.map(line => {
                const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
                return `${prefix} ${line.content}`;
            }).join('\n');

            const blob = new Blob([diffText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'diff_result.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showStatus('Diff file downloaded!', 'success');
        });
    }

    // ==================== Swap Button ====================
    bindSwapButton() {
        document.getElementById('swap-btn').addEventListener('click', () => {
            const leftText = document.getElementById('input-text-left');
            const rightText = document.getElementById('input-text-right');

            const temp = leftText.value;
            leftText.value = rightText.value;
            rightText.value = temp;

            this.showStatus('Texts swapped!', 'success');

            // Auto-trigger compare after swap
            this.compare();
        });
    }

    // ==================== Clear Button ====================
    bindClearButton() {
        document.getElementById('clear-btn').addEventListener('click', () => {
            document.getElementById('input-text-left').value = '';
            document.getElementById('input-text-right').value = '';
            document.getElementById('diff-output').innerHTML = '<div class="diff-placeholder"><p>Enter text in both panels and click "Compare Texts" to see the differences</p></div>';
            document.getElementById('stats').classList.add('hidden');
            this.diffResult = null;
            this.showStatus('All cleared!', 'success');
        });
    }

    // ==================== Status Messages ====================
    showStatus(message, type = 'info') {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${type}`;
        status.classList.remove('hidden');

        setTimeout(() => {
            status.classList.add('hidden');
        }, 3000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new DiffCheck();
});

document.getElementById('currentYear').textContent = new Date().getFullYear();
