// --- CMDLine Notepad App ---
(function() {
    // notepad.js
(function() {
    const CMDLine = window.CMDLine;
    if(!CMDLine) {
        console.error("CMDLine not detected");
        return;
    }

    // Example: register a command
    CMDLine.commands['notepad'] = {
        run: async (_, args) => {
            const filename = args[1];
            if(!filename) return 'usage: notepad <file>';
            CMDLine.editor.open(filename);
            return '';
        },
        desc: 'Open a file in Notepad'
    };
})();


    const host = document.getElementById('cmdline-modal');
    if(!host) return;
    const shadow = host.shadowRoot;

    // Create notepad container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.inset = '10% 10% 10% 10%';
    container.style.background = '#1e1e1e';
    container.style.color = '#ddd';
    container.style.borderRadius = '6px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.zIndex = '9999';
    container.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    container.style.fontFamily = 'monospace';

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.style.display = 'flex';
    toolbar.style.padding = '5px';
    toolbar.style.gap = '5px';
    toolbar.style.background = '#333';
    toolbar.style.alignItems = 'center';

    const newBtn = document.createElement('button'); newBtn.textContent = 'New';
    const saveBtn = document.createElement('button'); saveBtn.textContent = 'Save';
    const loadBtn = document.createElement('button'); loadBtn.textContent = 'Load';
    const deleteBtn = document.createElement('button'); deleteBtn.textContent = 'Delete';
    const searchInput = document.createElement('input'); searchInput.placeholder = 'Search...';
    const replaceInput = document.createElement('input'); replaceInput.placeholder = 'Replace...';
    const replaceBtn = document.createElement('button'); replaceBtn.textContent = 'Replace';
    const darkBtn = document.createElement('button'); darkBtn.textContent = 'Dark';

    [newBtn, saveBtn, loadBtn, deleteBtn, searchInput, replaceInput, replaceBtn, darkBtn].forEach(b => toolbar.appendChild(b));
    container.appendChild(toolbar);

    // Content
    const content = document.createElement('div');
    content.style.display = 'flex';
    content.style.flex = '1';

    const lineNumbers = document.createElement('div');
    lineNumbers.style.width = '40px';
    lineNumbers.style.background = '#2e2e2e';
    lineNumbers.style.padding = '5px';
    lineNumbers.style.textAlign = 'right';
    lineNumbers.style.userSelect = 'none';
    lineNumbers.style.overflow = 'hidden';

    const textarea = document.createElement('textarea');
    textarea.style.flex = '1';
    textarea.style.background = 'transparent';
    textarea.style.color = 'inherit';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.padding = '5px';
    textarea.style.fontFamily = 'monospace';
    textarea.style.fontSize = '14px';
    textarea.style.lineHeight = '1.2em';

    content.appendChild(lineNumbers);
    content.appendChild(textarea);
    container.appendChild(content);

    shadow.appendChild(container);

    // State
    let darkMode = true;
    let currentFile = null;

    const updateLines = () => {
        const lines = textarea.value.split('\n').length;
        lineNumbers.textContent = Array.from({length: lines}, (_, i) => i + 1).join('\n');
    };

    const saveFile = (name) => {
        if(!name) name = prompt('File name:');
        if(name) {
            localStorage.setItem('notepad_' + name, textarea.value);
            currentFile = name;
            alert('Saved!');
        }
    };

    const loadFile = () => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('notepad_'));
        if(keys.length === 0) return alert('No files!');
        const name = prompt('Choose file:\n' + keys.map(k => k.replace('notepad_', '')).join('\n'));
        if(name && localStorage.getItem('notepad_' + name)) {
            textarea.value = localStorage.getItem('notepad_' + name);
            currentFile = name;
            updateLines();
        }
    };

    const deleteFile = () => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('notepad_'));
        if(keys.length === 0) return alert('No files!');
        const name = prompt('Delete file:\n' + keys.map(k => k.replace('notepad_', '')).join('\n'));
        if(name && localStorage.getItem('notepad_' + name)) {
            localStorage.removeItem('notepad_' + name);
            if(currentFile === name) currentFile = null;
            alert('Deleted!');
        }
    };

    const searchReplace = () => {
        const search = searchInput.value;
        const replace = replaceInput.value;
        if(search) {
            textarea.value = textarea.value.split(search).join(replace);
            updateLines();
        }
    };

    textarea.addEventListener('input', () => {
        updateLines();
        if(currentFile) localStorage.setItem('notepad_' + currentFile, textarea.value);
    });

    newBtn.addEventListener('click', () => { textarea.value=''; currentFile=null; updateLines(); });
    saveBtn.addEventListener('click', () => saveFile(currentFile));
    loadBtn.addEventListener('click', loadFile);
    deleteBtn.addEventListener('click', deleteFile);
    replaceBtn.addEventListener('click', searchReplace);
    darkBtn.addEventListener('click', () => {
        darkMode = !darkMode;
        if(darkMode){
            container.style.background = '#1e1e1e';
            container.style.color = '#ddd';
            lineNumbers.style.background = '#2e2e2e';
            toolbar.style.background = '#333';
        } else {
            container.style.background = '#fff';
            container.style.color = '#000';
            lineNumbers.style.background = '#eee';
            toolbar.style.background = '#ddd';
        }
    });

    textarea.addEventListener('scroll', () => { lineNumbers.scrollTop = textarea.scrollTop; });

    updateLines();
})();
