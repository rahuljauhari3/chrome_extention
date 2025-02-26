document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const modelSelect = document.getElementById('modelSelect');
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
      console.log('Loaded API key:', result.groqApiKey);
    }
  });

  // Load saved model selection
  chrome.storage.sync.get(['groqModel'], (result) => {
    if (result.groqModel) {
      modelSelect.value = result.groqModel;
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
    console.log('Saving API key:', key);
    chrome.storage.sync.set({ groqApiKey: key }, () => {
      console.log('API key saved.');
      alert('API key saved!');
    });
  });

  // New clear key functionality
  document.getElementById('clearKey').addEventListener('click', () => {
    console.log('Clearing API key.');
    chrome.storage.sync.remove('groqApiKey', () => {
      apiKeyInput.value = '';
      console.log('API key cleared from storage.');
      alert('API key cleared!');
    });
  });

  // Save model selection when changed
  modelSelect.addEventListener('change', () => {
    chrome.storage.sync.set({ groqModel: modelSelect.value });
  });

  sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (!message) return;
    console.log('User message sending:', message);
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
        console.log('Sending chat request with conversation:', conversation);
        chrome.runtime.sendMessage(
          {
            type: 'chatRequest',
            apiKey: apiKey,
            model: modelSelect.value,
            conversation: conversation
          },
          (response) => {
            if (response && response.answer) {
              console.log('Received response:', response.answer);
              appendMessage('Groq', response.answer);
              conversation.push({ role: 'assistant', content: response.answer });

              // Save the updated conversation to Chrome Storage Sync
              chrome.storage.sync.set({ groqConversation: conversation }, () => {});
            } else {
              console.log('Error: No answer in response.');
              appendMessage('Groq', 'Error getting response.');
            }
          }
        );
      });
    });
  });

  // Add Enter key support
  messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('Enter key pressed.');
      sendBtn.click();
    }
  });

  clearChatBtn.addEventListener('click', () => {
    console.log('Clearing chat history.');
    chatBox.innerHTML = '';
    conversation = [];
    chrome.storage.sync.remove('groqConversation', () => {
      console.log('Chat history cleared from storage.');
    });
  });

  // Handle selected text from content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'selectedText') {
      const selectedText = message.text;
      appendMessage('You', selectedText);
      conversation.push({ role: 'user', content: selectedText });
  
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
            model: modelSelect.value,
            conversation: conversation
          },
          (response) => {
            if (response && response.answer) {
              appendMessage('Groq', response.answer);
              conversation.push({ role: 'assistant', content: response.answer });
            }
          }
        );
      });
    }
  });

  function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `chat-message ${sender.toLowerCase()}-message`;

    const strong = document.createElement('strong');
    strong.textContent = `${sender}: `;
    div.appendChild(strong);

    // Create a container for the message content
    const messageContainer = document.createElement('span');
    messageContainer.innerHTML = text; // Preserve the original message

    // Check for code blocks
    const codeBlockRegex = /```([\s\S]*?)```/g;
    let match;
    let lastIndex = 0;

    while ((match = codeBlockRegex.exec(text)) !== null) {
        // Append normal text before the code block
        const normalText = text.substring(lastIndex, match.index);
        if (normalText.trim()) {
            div.appendChild(document.createTextNode(normalText));
        }

        // Create code block
        const codeContent = match[1].trim();
        const codeContainer = document.createElement('div');
        codeContainer.className = 'code-block';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-button';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(codeContent).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy', 2000);
            }).catch(err => console.error('Copy failed:', err));
        };

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = codeContent;
        pre.appendChild(code);

        codeContainer.appendChild(copyBtn);
        codeContainer.appendChild(pre);
        div.appendChild(codeContainer);

        lastIndex = codeBlockRegex.lastIndex;
    }

    // Append remaining normal text after the last code block
    if (lastIndex < text.length) {
        div.appendChild(document.createTextNode(text.substring(lastIndex)));
    }

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

});