chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'chatRequest') {
    const { apiKey, conversation, model } = message;
    console.log('Received chatRequest:', { apiKey, conversation, model });

    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || "llama3-70b-8192", // use selected model or default
        messages: conversation,
        temperature: 0.5,
        // Removed max_completion_tokens to allow full responses
      })
    })
      .then((res) => res.json())
      .then((data) => {
        let answer = "No answer received.";
        if (data && data.choices && data.choices.length > 0) {
          answer = data.choices[0].message.content;
        }
        console.log('API response:', data, 'Sending answer:', answer);
        sendResponse({ answer });
      })
      .catch((err) => {
        console.error('Error calling Groq API:', err);
        sendResponse({ answer: 'Error calling Groq API.' });
      });

    return true;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'openChatWindow') {
    console.log('Received message to open chat window with text:', message.text);
    chrome.windows.create({
      url: 'popup.html?text=' + encodeURIComponent(message.text),
      type: 'popup',
      width: 400,
      height: 600
    });

    sendResponse({ status: 'success' });
    return true; // Keeps the message channel open
  }
});
