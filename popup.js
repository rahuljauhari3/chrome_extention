document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveKeyBtn = document.getElementById('saveKey');
  const chatBox = document.getElementById('chatBox');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  
  // Load saved API key from storage
  chrome.storage.sync.get(['groqApiKey'], (result) => {
    if (result.groqApiKey) {
      apiKeyInput.value = result.groqApiKey;
    }
  });
  
  saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    chrome.storage.sync.set({ groqApiKey: key }, () => {
      alert('API key saved!');
    });
  });
  
  // Maintain conversation context for follow-up messages
  let conversation = [];
  
  sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (!message) return;
    
    appendMessage('You', message);
    conversation.push({ role: 'user', content: message });
    messageInput.value = '';
    
    // Retrieve the saved API key and send the conversation to background
    chrome.storage.sync.get(['groqApiKey'], (result) => {
      const apiKey = result.groqApiKey;
      if (!apiKey) {
        alert('Please enter your Groq API key.');
        return;
      }
      
      chrome.runtime.sendMessage(
        {
          type: 'chatRequest',
          apiKey: apiKey,
          conversation: conversation
        },
        (response) => {
          if (response && response.answer) {
            appendMessage('Groq', response.answer);
            conversation.push({ role: 'assistant', content: response.answer });
          } else {
            appendMessage('Groq', 'Error getting response.');
          }
        }
      );
    });
  });
  
  function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
