document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    chrome.runtime.sendMessage({ type: 'selectedText', text: selectedText });
    showOverlay(selectedText);
  }
});

function showOverlay(text) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  const chatBox = document.createElement('div');
  chatBox.style.backgroundColor = 'white';
  chatBox.style.padding = '20px';
  chatBox.style.borderRadius = '5px';
  chatBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  chatBox.style.width = '300px';
  chatBox.style.maxHeight = '300px';
  chatBox.style.overflowY = 'auto';

  const message = document.createElement('p');
  message.textContent = `Selected Text: ${text}`;
  chatBox.appendChild(message);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '10px';
  closeButton.style.width = '100%';
  closeButton.style.padding = '10px';
  closeButton.style.backgroundColor = 'red';
  closeButton.style.color = 'white';
  closeButton.style.border = 'none';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    overlay.remove();
  });
  chatBox.appendChild(closeButton);

  overlay.appendChild(chatBox);
  document.body.appendChild(overlay);
}