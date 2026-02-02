// ==UserScript==
// @name         Blank Userscript Template
// @namespace    https://example.com/
// @version      1.0.0
// @description  Blank Tampermonkey userscript
// @author       Death
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=example.com
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

let line = ""
let dia = document.createElement("dialog");

Object.assign(dia.style, {
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    color: "green"
});

let output = document.createElement("textarea");

Object.assign(output.style, {
    width: "100%",
    height: "calc(100% - 20px)",
    backgroundColor: "black",
    color: "lime",
    border: "none",
    outline: "none",
    resize: "none",
    fontFamily: "monospace",
    fontSize: "14px",
    padding: "8px",
    cursor: "default",
    overflowY: "auto"
});


output.readOnly = true;
output.tabIndex = -1;
output.value += "System ready...\n";
dia.appendChild(output);



let cmdLine = document.createElement("input");

Object.assign(cmdLine.style, {
    width: "100%",
    height: "20px",
    color: "white"
});

dia.appendChild(cmdLine);

document.body.appendChild(dia);

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dia.open ? dia.close() : dia.showModal();
    }

});

cmdLine.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        console.log("Enter pressed:", cmdLine.value);
        line = cmdLine.value;
        line = line.toLowerCase();
        run(line)
    }
});

function writeLine(line) {
    output.value += line + "\n";
    output.scrollTop = output.scrollHeight;
}


function run(code) {
    if (line.startsWith("ping")) {
        writeLine("pong!");
    }

};


})();
