chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'chatRequest') {
    const { apiKey, conversation } = message;

    fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // change to your preferred Groq model
        messages: conversation,
        temperature: 0.7,
        max_completion_tokens: 150
      })
    })
      .then((res) => res.json())
      .then((data) => {
        let answer = "No answer received.";
        if (data && data.choices && data.choices.length > 0) {
          answer = data.choices[0].message.content;
        }
        sendResponse({ answer });
      })
      .catch((err) => {
        console.error('Error calling Groq API:', err);
        sendResponse({ answer: 'Error calling Groq API.' });
      });

    return true;
  }
});