document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString();
  console.log('Mouseup - selected text:', selectedText);
  // if (selectedText) {
  //   showHoverButton(selectedText);
  // }
});

document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  console.log('Selection changed. Current selection:', selection.toString());
  if (!selection.toString()) {
    const hover = document.getElementById('text-hover-tooltip');
    if (hover) {
      console.log('Removing hover tooltip.');
      hover.remove();
    }
  }
});

function showHoverButton(text) {
  console.log('Creating hover tooltip for selected text.');
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
  hover.style.position = 'absolute';
  hover.style.backgroundColor = 'white';
  hover.style.border = '1px solid #ccc';
  hover.style.padding = '12px';
  hover.style.borderRadius = '4px';
  hover.style.top = `${window.scrollY + rect.bottom + 5}px`;
  hover.style.left = `${window.scrollX + rect.left}px`;
  hover.style.zIndex = '10000';
  hover.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  hover.style.maxWidth = '300px';

  const description = document.createElement('p');
  description.textContent = 'Summarize this text using Groq AI';
  description.style.margin = '0 0 8px 0';
  description.style.color = '#666';

  const button = document.createElement('button');
  button.textContent = 'Summarize';
  button.style.padding = '4px 8px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '3px';
  button.style.cursor = 'pointer';
  console.log('Before clicking. Text:', text);

  // Use event parameter and stop propagation to ensure the click event is handled
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('Hover button clicked. Text:', text);
    button.disabled = true;
    button.textContent = 'Opening chat...';
    
    chrome.runtime.sendMessage({
      type: 'openChatWindow',
      text: text
    });
  });

  hover.appendChild(description);
  hover.appendChild(button);
  document.body.appendChild(hover);

  // Remove hover when clicking outside
  document.addEventListener('mousedown', function removeHover(e) {
    if (!hover.contains(e.target)) {
      console.log('Click outside hover tooltip. Removing it.');
      hover.remove();
      document.removeEventListener('mousedown', removeHover);
    }
  });
}