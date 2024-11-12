// Add event listeners for the tab buttons
document.getElementById("generateTab").addEventListener("click", function (event) {
  openTab(event, 'Generate');
});
document.getElementById("historyTab").addEventListener("click", function (event) {
  openTab(event, 'History');
});

// Event listener to update displayed length value
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const basePhraseInput = document.getElementById('basePhrase');
const historyList = document.getElementById('historyList');

// Update displayed length value
lengthSlider.addEventListener('input', function() {
  lengthValue.textContent = lengthSlider.value;
});

// Generate button click
document.getElementById('generate').addEventListener('click', function() {
  const passwordLength = parseInt(lengthSlider.value, 10);
  const basePhrase = basePhraseInput.value.trim();
  const password = basePhrase ? generatePasswordWithBasePhrase(basePhrase, passwordLength) : generatePassword(passwordLength);
  
  document.getElementById('password').value = password;
  
  savePasswordToHistory(password); // Save password to history
  displayHistory();                // Refresh the displayed history
});

// Copy button click
document.getElementById('copy').addEventListener('click', function() {
  const passwordField = document.getElementById('password');
  passwordField.select();
  document.execCommand('copy');
});

// Function to generate random password
function generatePassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Function to generate password with base phrase
function generatePasswordWithBasePhrase(basePhrase, length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = basePhrase;
  for (let i = basePhrase.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return shuffleString(password);
}

// Shuffle function
function shuffleString(string) {
  const array = string.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

// Save password to history
function savePasswordToHistory(password) {
  chrome.storage.local.get({ history: [] }, function(result) {
    const history = result.history;
    history.push(password);
    chrome.storage.local.set({ history });
  });
}

// Display history
function displayHistory() {
  chrome.storage.local.get({ history: [] }, function(result) {
    historyList.innerHTML = ''; // Clear current list
    result.history.forEach((password) => {
      const listItem = document.createElement('li');
      listItem.className = 'history-item';
      
      const passwordText = document.createElement('span');
      passwordText.textContent = password;
      
      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(password);
      });
      
      listItem.appendChild(passwordText);
      listItem.appendChild(copyButton);
      historyList.appendChild(listItem);
    });
  });
}

// Tab switching
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Initialize by opening the default tab and displaying history
document.getElementById("generateTab").click();
displayHistory();
