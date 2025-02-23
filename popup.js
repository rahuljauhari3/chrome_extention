document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveKeyBtn = document.getElementById('saveKey');
  const chatBox = document.getElementById('chatBox');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');
  let conversation = [];

  // Load saved API key from storage
  chrome.storage.sync.get(['groqApiKey'], (result) => {
    if (result.groqApiKey) {
      apiKeyInput.value = result.groqApiKey;
    }
  });

  // Load saved conversation from storage
  chrome.storage.sync.get(['groqConversation'], (result) => {
    if (result.groqConversation) {
      conversation = result.groqConversation;
      // Display the loaded messages
      conversation.forEach((message) => {
        appendMessage(message.role === 'user' ? 'You' : 'Groq', message.content);
      });
    }
  });

  saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    chrome.storage.sync.set({ groqApiKey: key }, () => {
      alert('API key saved!');
    });
  });

  sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (!message) return;

    appendMessage('You', message);
    conversation.push({ role: 'user', content: message });
    messageInput.value = '';

    // Save conversation to Chrome Storage Sync
    chrome.storage.sync.set({ groqConversation: conversation }, () => {
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

              // Save the updated conversation to Chrome Storage Sync
              chrome.storage.sync.set({ groqConversation: conversation }, () => {});
            } else {
              appendMessage('Groq', 'Error getting response.');
            }
          }
        );
      });
    });
  });

  clearChatBtn.addEventListener('click', () => {
    // Clear the chat box UI
    chatBox.innerHTML = '';
    // Clear the conversation array
    conversation = [];
    // Clear the stored conversation
    chrome.storage.sync.remove('groqConversation', () => {
      console.log('Chat history cleared');
    });
  });

  // Handle selected text from content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'selectedText') {
      const selectedText = message.text;
      appendMessage('You', selectedText);
      conversation.push({ role: 'user', content: selectedText });

      // Save conversation to Chrome Storage Sync
      chrome.storage.sync.set({ groqConversation: conversation }, () => {
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

                // Save the updated conversation to Chrome Storage Sync
                chrome.storage.sync.set({ groqConversation: conversation }, () => {});
              } else {
                appendMessage('Groq', 'Error getting response.');
              }
            }
          );
        });
      });
    }
  });

  function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});