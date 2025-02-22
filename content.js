document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    chrome.runtime.sendMessage({ type: 'selectedText', text: selectedText });
    showHover(selectedText);
  }
});

// Remove or comment out old showOverlay function
// function showOverlay(text) { ... }

// New hover tooltip function
function showHover(text) {
  // Remove any existing hover
  const existingHover = document.getElementById('text-hover-tooltip');
  if (existingHover) {
    existingHover.remove();
  }

  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const hover = document.createElement('div');
  hover.id = 'text-hover-tooltip';
  hover.textContent = text;
  hover.style.position = 'absolute';
  hover.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  hover.style.color = '#fff';
  hover.style.padding = '8px 12px';
  hover.style.borderRadius = '4px';
  hover.style.top = `${window.scrollY + rect.bottom + 5}px`;
  hover.style.left = `${window.scrollX + rect.left}px`;
  hover.style.zIndex = '10000';
  hover.style.maxWidth = '300px';
  hover.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

  document.body.appendChild(hover);

  // Auto-remove the hover after 3 seconds
  setTimeout(() => {
    hover.remove();
  }, 3000);
}
