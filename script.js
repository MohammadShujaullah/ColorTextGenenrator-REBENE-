document.addEventListener('DOMContentLoaded', function() {
    // Color 
    const colors = [
        { name: 'Default', code: '\x1b[0m', hex: '#555555' },
        { name: 'Black', code: '\x1b[30m', hex: '#000000' },
        { name: 'Red', code: '\x1b[31m', hex: '#ff0000' },
        { name: 'Green', code: '\x1b[32m', hex: '#00ff00' },
        { name: 'Yellow', code: '\x1b[33m', hex: '#ffff00' },
        { name: 'Blue', code: '\x1b[34m', hex: '#0000ff' },
        { name: 'Magenta', code: '\x1b[35m', hex: '#ff00ff' },
        { name: 'Cyan', code: '\x1b[36m', hex: '#00ffff' },
        { name: 'White', code: '\x1b[37m', hex: '#ffffff' },
        { name: 'Gray', code: '\x1b[30;1m', hex: '#888888' },
        { name: 'Bright Red', code: '\x1b[31;1m', hex: '#ff5555' },
        { name: 'Bright Green', code: '\x1b[32;1m', hex: '#55ff55' },
        { name: 'Bright Yellow', code: '\x1b[33;1m', hex: '#ffff55' },
        { name: 'Bright Blue', code: '\x1b[34;1m', hex: '#5555ff' },
        { name: 'Bright Magenta', code: '\x1b[35;1m', hex: '#ff55ff' },
        { name: 'Bright Cyan', code: '\x1b[36;1m', hex: '#55ffff' }
    ];

    // Elements
    const textInput = document.getElementById('textInput');
    const colorPalette = document.getElementById('colorPalette');
    const resetBtn = document.getElementById('reset');
    const copyBtn = document.getElementById('copy');
    const preview = document.getElementById('preview');
    const copiedNotice = document.getElementById('copiedNotice');

    let selectedColor = colors[0];

    
    colors.forEach(color => {
        const colorBtn = document.createElement('div');
        colorBtn.className = 'color';
        colorBtn.style.backgroundColor = color.hex;
        colorBtn.title = color.name;
        
        colorBtn.addEventListener('click', () => {
            selectedColor = color;
            applyColor();
        });
        
        colorPalette.appendChild(colorBtn);
    });

   
    function applyColor() {
        const start = textInput.selectionStart;
        const end = textInput.selectionEnd;
        const text = textInput.value;
        
        if (start === end) return;
        
        const selectedText = text.substring(start, end);
        const coloredText = selectedColor.code + selectedText + '\x1b[0m';
        
        textInput.value = text.substring(0, start) + coloredText + text.substring(end);
        updatePreview();
        
     
        const newPos = start + coloredText.length;
        textInput.setSelectionRange(newPos, newPos);
        textInput.focus();
    }

   
    function updatePreview() {
        let html = textInput.value;
        
        colors.forEach(color => {
            const regex = new RegExp(escapeRegExp(color.code), 'g');
            html = html.replace(regex, `<span style="color: ${color.hex}">`);
        });
        
        html = html.replace(/\x1b\[0m/g, '</span>');
        
        // Close         unclosed   spans
        const openSpans = (html.match(/<span/g) || []).length;
        const closeSpans = (html.match(/<\/span>/g) || []).length;
        for (let i = 0; i < openSpans - closeSpans; i++) {
            html += '</span>';
        }
        
        preview.innerHTML = html || 'Your colored text will appear here...';
    }

    // as   Helper 
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Event listeners  (just for understanding)
    resetBtn.addEventListener('click', () => {
        textInput.value = '';
        preview.textContent = 'Your colored text will appear here...';
        selectedColor = colors[0];
    });

    copyBtn.addEventListener('click', () => {
        textInput.select();
        document.execCommand('copy');
        
        copiedNotice.style.display = 'block';
        setTimeout(() => {
            copiedNotice.style.display = 'none';
        }, 2000);
    });

    textInput.addEventListener('input', updatePreview);
    updatePreview();
});