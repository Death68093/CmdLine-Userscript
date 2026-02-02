// --- Advanced Notepad App ---
document.onload = () => {
    // Create HTML structure
    const body = document.body;
    body.style.margin = "0";
    body.style.fontFamily = "monospace";
    body.style.background = "#1e1e1e";
    body.style.color = "#ddd";
    
    // Top toolbar
    const toolbar = document.createElement("div");
    toolbar.style.display = "flex";
    toolbar.style.background = "#333";
    toolbar.style.padding = "5px";
    toolbar.style.gap = "5px";
    toolbar.style.alignItems = "center";

    const newBtn = document.createElement("button"); newBtn.textContent = "New";
    const saveBtn = document.createElement("button"); saveBtn.textContent = "Save";
    const loadBtn = document.createElement("button"); loadBtn.textContent = "Load";
    const deleteBtn = document.createElement("button"); deleteBtn.textContent = "Delete";
    const searchInput = document.createElement("input"); searchInput.placeholder = "Search...";
    const replaceInput = document.createElement("input"); replaceInput.placeholder = "Replace...";
    const replaceBtn = document.createElement("button"); replaceBtn.textContent = "Replace";
    const darkBtn = document.createElement("button"); darkBtn.textContent = "Toggle Dark";

    [newBtn, saveBtn, loadBtn, deleteBtn, searchInput, replaceInput, replaceBtn, darkBtn].forEach(b => toolbar.appendChild(b));
    body.appendChild(toolbar);

    // Line numbers
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.height = "calc(100vh - 40px)";
    
    const lineNumbers = document.createElement("div");
    lineNumbers.style.width = "40px";
    lineNumbers.style.background = "#2e2e2e";
    lineNumbers.style.padding = "5px";
    lineNumbers.style.textAlign = "right";
    lineNumbers.style.userSelect = "none";
    lineNumbers.style.overflow = "hidden";
    container.appendChild(lineNumbers);

    // Text area
    const textarea = document.createElement("textarea");
    textarea.style.flex = "1";
    textarea.style.background = "transparent";
    textarea.style.color = "inherit";
    textarea.style.border = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.padding = "5px";
    textarea.style.fontFamily = "monospace";
    textarea.style.fontSize = "14px";
    textarea.style.lineHeight = "1.2em";
    container.appendChild(textarea);

    body.appendChild(container);

    // Helper functions
    let darkMode = true;
    const updateLineNumbers = () => {
        const lines = textarea.value.split("\n").length;
        lineNumbers.textContent = Array.from({length: lines}, (_, i) => i + 1).join("\n");
    };

    const saveFile = (name) => {
        if(!name) name = prompt("File name:");
        if(name) localStorage.setItem("notepad_" + name, textarea.value);
        alert("Saved!");
    };

    const loadFile = () => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith("notepad_"));
        if(keys.length === 0) return alert("No saved files!");
        const name = prompt("Choose file:\n" + keys.map(k => k.replace("notepad_", "")).join("\n"));
        if(name && localStorage.getItem("notepad_" + name)) {
            textarea.value = localStorage.getItem("notepad_" + name);
            updateLineNumbers();
        }
    };

    const deleteFile = () => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith("notepad_"));
        if(keys.length === 0) return alert("No saved files!");
        const name = prompt("Delete file:\n" + keys.map(k => k.replace("notepad_", "")).join("\n"));
        if(name && localStorage.getItem("notepad_" + name)) {
            localStorage.removeItem("notepad_" + name);
            alert("Deleted!");
        }
    };

    const searchReplace = () => {
        const search = searchInput.value;
        const replace = replaceInput.value;
        if(search) {
            textarea.value = textarea.value.split(search).join(replace);
            updateLineNumbers();
        }
    };

    // Event listeners
    textarea.addEventListener("input", () => {
        updateLineNumbers();
        // Basic auto-save
        if(currentFile) localStorage.setItem("notepad_" + currentFile, textarea.value);
    });
    newBtn.addEventListener("click", () => {
        textarea.value = "";
        updateLineNumbers();
        currentFile = null;
    });
    saveBtn.addEventListener("click", () => saveFile(currentFile));
    loadBtn.addEventListener("click", loadFile);
    deleteBtn.addEventListener("click", deleteFile);
    replaceBtn.addEventListener("click", searchReplace);
    darkBtn.addEventListener("click", () => {
        darkMode = !darkMode;
        if(darkMode){
            body.style.background = "#1e1e1e";
            body.style.color = "#ddd";
            lineNumbers.style.background = "#2e2e2e";
            toolbar.style.background = "#333";
        } else {
            body.style.background = "#fff";
            body.style.color = "#000";
            lineNumbers.style.background = "#eee";
            toolbar.style.background = "#ddd";
        }
    });

    let currentFile = null;
    updateLineNumbers();

    // Resize line numbers dynamically
    textarea.addEventListener("scroll", () => {
        lineNumbers.scrollTop = textarea.scrollTop;
    });

};
