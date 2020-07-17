
// I know this is incredibly dumb, but we need to inject a CSS file into 
// the DOM of an IFrame without accessing external scripts for portability. 
// So each component has its own CSS block that gets combined by CSSElement.

const DOCUMENT_CSS = `
* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  
  /* Disable all selection by default */
  user-select: none;
}

/* Selection highlight for blocks & text selection */
.body-wrapper ::selection,
.body-wrapper ::-moz-selection {
    background: #ffe168;
}

[data-comment-block]:hover {
    background: #ffe168;
    cursor: pointer;
}

/* TODO: Better highlight color? */
.highlight {
  background: #fff0b4;
}

.highlight-focus,
.comment-context-focus {
  background: #ffe168;
}

[data-comment-inline], 
[data-comment-inline] *,
.highlight {
  user-select: text;
}

.body-wrapper {
  /* Via http://jsfiddle.net/mturjak/2wk6Q/1949/ */
  width: 210mm;
  min-width: 210mm;

  min-height: 297mm;
  padding: 20mm;
  margin: 10mm auto;
  border: 1px #D3D3D3 solid;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

body {
  display: flex;
  flex-direction: row;
  margin: 0;
  background: #f8f9fa;
}
`;

const TOC_CSS = `
.comments-toc {
  position: sticky;
  align-self: flex-start; /* Required for sticky to work */
  top: 0;
  
  height: 100vh;
}

.comments-toc-wrapper {
  min-width: 250px;
  width: 250px;
  
  margin-left: 0;
  margin-right: 16px;
  
  transition: margin-left 0.5s ease-in-out;
  height: calc(100vh - 40px - 20px);
}

.comments-toc.is-collapsed .comments-toc-wrapper {
  margin-left: -250px;
}

.comments-toc-scrollbox {
  height: 100%;
  
  /* Hide scrollbar unless we hover it */
  overflow: auto;
  visibility: hidden;
}

.comments-toc-sections {
  display: block;
  list-style: none;
  visibility: visible;

  margin: 0;
  padding: 0;
  padding-left: 16px;
}

.comments-toc a {
  text-decoration: none;
  color: #333;
  
  font-family: sans-serif;
  font-size: 16px;
  
  display: inline-block;
  padding: 4px 0;
}

/* Fade effect at the bottom for long scrolling. Could be an element instead of ::after... */
.comments-toc-fade {
  content: '';
  visibility: visible;
  
  position: absolute;
  bottom: 0;
  left: 0;
  
  width: 100%;
  height: 100px;
  
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
}

/* Hover responses */
.comments-toc a:hover {
  color: #666;
}

.comments-toc-scrollbox:hover,
.comments-toc-scrollbox:focus {
  visibility: visible;
}

.comments-toc:hover .comments-toc-fade {
  display: none;
}

/* Smaller font size for subsections */
.comments-section.comments-section-level-1 a {
  font-size: 95%;
  margin-left: 1em;
}

.comments-section.comments-section-level-2 a {
  font-size: 90%;
  margin-left: 2em;
}
`;

const HAMBURGER_BUTTON_CSS = `
/*!
 * Hamburgers
 * @description Tasty CSS-animated hamburgers
 * @author Jonathan Suh @jonsuh
 * @site https://jonsuh.com/hamburgers
 * @link https://github.com/jonsuh/hamburgers
 */
.hamburger {
  padding: 15px 15px;
  display: inline-block;
  cursor: pointer;
  transition-property: opacity, filter;
  transition-duration: 0.15s;
  transition-timing-function: linear;
  font: inherit;
  color: inherit;
  text-transform: none;
  background-color: transparent;
  border: 0;
  margin: 0;
  overflow: visible; }
  .hamburger:hover {
    opacity: 0.7; }
  .hamburger.is-active:hover {
    opacity: 0.7; }
  .hamburger.is-active .hamburger-inner,
  .hamburger.is-active .hamburger-inner::before,
  .hamburger.is-active .hamburger-inner::after {
    background-color: #888; }
  
.hamburger-box {
  width: 20px;
  height: 24px;
  display: inline-block;
  position: relative; }

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -2px; }
  .hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
    width: 20px;
    height: 3px;
    background-color: #888;
    border-radius: 4px;
    position: absolute;
    transition-property: transform;
    transition-duration: 0.15s;
    transition-timing-function: ease; }
  .hamburger-inner::before, .hamburger-inner::after {
    content: "";
    display: block; }
  .hamburger-inner::before {
    top: -8px; }
  .hamburger-inner::after {
    bottom: -8px; }

.hamburger--arrow.is-active .hamburger-inner::before {
  transform: translate3d(-5px, 4px, 0) rotate(-45deg) scale(0.7, 1); }

.hamburger--arrow.is-active .hamburger-inner::after {
  transform: translate3d(-5px, -4px, 0) rotate(45deg) scale(0.7, 1); }
`;

const SIDEBAR_CSS = `
.comments-sidebar {
  position: relative;
  min-width: 300px;
  width: 300px;
  
  margin-left: 16px;
}
`;

const COMMENT_CSS = `
.comment {
  position: absolute;
  width: 100%;
  left: 0;
  
  padding-bottom: 16px;
  padding-right: 16px;
  padding-left: 16px;
  
  font-family: sans-serif; 
  font-size: 12px;
}

.comment.is-reply {
  position: initial;
}

/* I'm using a psuedo element instead of giving the .comment a border-left
  because I don't want the border to go the full height - I want some height
  to spill over so that the action buttons are easier to click on :hover */
.comment-edge {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 14px;
  width: 2px;
}

.comment-header {
  display: flex;
  padding-bottom: 6px;
  font-size: 12px;
}

.comment-info {
  color: #666;
  flex-grow: 1;
  
}

.comment-updated {
  color: #666;
  visibility: hidden;
}

.comment-reply,
.comment-delete {
  float: right;
  visibility: hidden;
  
  font-family: sans-serif; 
  font-size: 12px;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;

  color: rgb(50, 131, 200);
  text-decoration: underline;
  cursor: pointer;
}
  
.comment.is-reply {
  padding-right: 0;
  padding-bottom: 0;
  margin-top: 8px;
}

.comment-delete {
  text-decoration: none;
  font-size: 16px;
  line-height: 12px;
}

/* Explicit child selectors to avoid cascading to replies */
.comment:hover > .comment-reply,
.comment:hover > .comment-header > .comment-updated,
.comment:hover > .comment-header > .comment-delete {
  visibility: visible;
}

.comment-delete {
  margin-left: 0.5rem;
}

.comment-content, .comment-content * {
  user-select: text;
  word-break: break-word;
  padding-bottom: 0.5em;
}
`;

const CONNECTOR_CSS = `
.comment-context-connection {
  position: absolute;
  width: 100%;
  
  /* Ignore events on the line - it's just visual */
  pointer-events: none;
  z-index: 9999;

  
  /* For debugging container size 
  background: rgba(255, 0, 0, 0.05);
  */

  opacity: 0.25;
}

.comment-context-connection line {
    stroke-width: 1;
}

/* Note: :focus-within doesn't work in IE11 but 
  this degradation won't affect usability so who cares */

.comment:hover .comment-context-connection,
.comment:focus-within .comment-context-connection {
  opacity: 1;
}
`;

export default class CSSElement {
    private style: HTMLStyleElement;
    
    constructor(document: Document) {
        const style = document.createElement('style');
        style.innerText = 
          DOCUMENT_CSS + 
          TOC_CSS + 
          SIDEBAR_CSS + 
          COMMENT_CSS +
          HAMBURGER_BUTTON_CSS + 
          CONNECTOR_CSS;

        document.body.appendChild(style);
        this.style = style;
    }

    public remove() {
        this.style.remove();
    }
}
