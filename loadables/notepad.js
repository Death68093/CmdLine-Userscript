// --- CMDLine Advanced Notepad ---
(function() {
    const initNotepad = (CMDLine) => {
        // Tabs state
        const tabs = [];
        let activeTab = null;

        const storageKey = (name) => 'notepad_' + name;

        const host = document.getElementById('cmdline-modal');
        if(!host) return;
        const shadow = host.shadowRoot;

        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.inset = '10% 10% 10% 10%';
        container.style.background = '#1e1e1e';
        container.style.color = '#ddd';
        container.style.borderRadius = '6px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.zIndex = '9999';
        container.style.fontFamily = 'monospace';
        container.style.boxShadow = '0 0 25px rgba(0,0,0,0.6)';

        // Toolbar
        const toolbar = document.createElement('div');
        toolbar.style.display='flex'; toolbar.style.gap='5px'; toolbar.style.background='#333'; toolbar.style.padding='5px'; toolbar.style.alignItems='center';
        const newBtn = document.createElement('button'); newBtn.textContent='New';
        const saveBtn = document.createElement('button'); saveBtn.textContent='Save';
        const loadBtn = document.createElement('button'); loadBtn.textContent='Load';
        const deleteBtn = document.createElement('button'); deleteBtn.textContent='Delete';
        const darkBtn = document.createElement('button'); darkBtn.textContent='Dark';
        const searchInput = document.createElement('input'); searchInput.placeholder='Search...';
        const replaceInput = document.createElement('input'); replaceInput.placeholder='Replace...';
        const replaceBtn = document.createElement('button'); replaceBtn.textContent='Replace';
        const tabBar = document.createElement('div'); tabBar.style.display='flex'; tabBar.style.gap='3px';

        [newBtn, saveBtn, loadBtn, deleteBtn, darkBtn, searchInput, replaceInput, replaceBtn].forEach(b=>toolbar.appendChild(b));
        container.appendChild(toolbar);
        container.appendChild(tabBar);

        const content = document.createElement('div');
        content.style.display='flex'; content.style.flex='1'; content.style.position='relative';
        const lineNumbers = document.createElement('div');
        lineNumbers.style.width='40px'; lineNumbers.style.background='#2e2e2e'; lineNumbers.style.padding='5px'; lineNumbers.style.textAlign='right'; lineNumbers.style.userSelect='none'; lineNumbers.style.overflow='hidden';
        const textarea = document.createElement('textarea');
        textarea.style.flex='1'; textarea.style.background='transparent'; textarea.style.color='inherit';
        textarea.style.border='none'; textarea.style.outline='none'; textarea.style.resize='none';
        textarea.style.padding='5px'; textarea.style.fontFamily='monospace'; textarea.style.fontSize='14px';
        textarea.style.lineHeight='1.2em';
        content.appendChild(lineNumbers); content.appendChild(textarea);
        container.appendChild(content);
        shadow.appendChild(container);

        let darkMode = true;
        const updateLines = () => {
            const lines = textarea.value.split('\n').length;
            lineNumbers.textContent = Array.from({length: lines},(_,i)=>i+1).join('\n');
        };

        const saveFile = (name) => {
            if(!name) name = prompt('File name:');
            if(name){
                localStorage.setItem(storageKey(name), textarea.value);
                if(!tabs.includes(name)) tabs.push(name);
                activeTab = name;
                updateTabs();
                alert('Saved!');
            }
        };
        const loadFile = () => {
            const keys = Object.keys(localStorage).filter(k=>k.startsWith('notepad_')).map(k=>k.replace('notepad_',''));
            if(keys.length===0) return alert('No files!');
            const name = prompt('Choose file:\n'+keys.join('\n'));
            if(name && localStorage.getItem(storageKey(name))){
                textarea.value = localStorage.getItem(storageKey(name));
                if(!tabs.includes(name)) tabs.push(name);
                activeTab = name;
                updateTabs();
                updateLines();
            }
        };
        const deleteFile = () => {
            const keys = Object.keys(localStorage).filter(k=>k.startsWith('notepad_')).map(k=>k.replace('notepad_',''));
            if(keys.length===0) return alert('No files!');
            const name = prompt('Delete file:\n'+keys.join('\n'));
            if(name && localStorage.getItem(storageKey(name))){
                localStorage.removeItem(storageKey(name));
                const idx = tabs.indexOf(name); if(idx>=0) tabs.splice(idx,1);
                if(activeTab===name) activeTab=null;
                updateTabs(); alert('Deleted!');
            }
        };

        const searchReplace = () => {
            const search = searchInput.value; const replace = replaceInput.value;
            if(!search) return;
            textarea.value = textarea.value.split(search).join(replace);
            updateLines();
        };

        const toggleDark = () => {
            darkMode = !darkMode;
            if(darkMode){ container.style.background='#1e1e1e'; container.style.color='#ddd'; lineNumbers.style.background='#2e2e2e'; toolbar.style.background='#333'; }
            else{ container.style.background='#fff'; container.style.color='#000'; lineNumbers.style.background='#eee'; toolbar.style.background='#ddd'; }
        };

        const updateTabs = () => {
            tabBar.innerHTML=''; tabs.forEach(t=>{
                const b=document.createElement('button'); b.textContent=t;
                b.style.padding='2px 5px'; b.style.background=(t===activeTab?'#666':'#444'); b.style.color='#fff';
                b.addEventListener('click',()=>{
                    if(activeTab) localStorage.setItem(storageKey(activeTab), textarea.value);
                    activeTab=t; textarea.value=localStorage.getItem(storageKey(t))||''; updateLines(); updateTabs();
                }); tabBar.appendChild(b);
            });
        };

        textarea.addEventListener('input', ()=>{ updateLines(); if(activeTab) localStorage.setItem(storageKey(activeTab), textarea.value); });
        textarea.addEventListener('scroll', ()=>lineNumbers.scrollTop = textarea.scrollTop);

        newBtn.addEventListener('click', ()=>{ textarea.value=''; activeTab=null; updateLines(); });
        saveBtn.addEventListener('click', ()=>saveFile(activeTab));
        loadBtn.addEventListener('click', loadFile);
        deleteBtn.addEventListener('click', deleteFile);
        darkBtn.addEventListener('click', toggleDark);
        replaceBtn.addEventListener('click', searchReplace);

        // Keyboard shortcuts
        textarea.addEventListener('keydown', (e)=>{
            if(e.ctrlKey){ if(e.key==='s'){ e.preventDefault(); saveFile(activeTab); }
            else if(e.key==='n'){ e.preventDefault(); textarea.value=''; activeTab=null; updateLines(); }
            else if(e.key==='f'){ e.preventDefault(); searchInput.focus(); } }
        });

        updateLines();

        CMDLine.commands['notepad']={
            run: async (_, args)=>{
                const file = args[1];
                if(file){ textarea.value=localStorage.getItem(storageKey(file))||''; activeTab=file; if(!tabs.includes(file)) tabs.push(file); updateTabs(); updateLines(); }
                container.style.display='flex'; textarea.focus();
                return '';
            },
            desc:'Open advanced notepad'
        };
    };

    waitForCMDLine();
})();
