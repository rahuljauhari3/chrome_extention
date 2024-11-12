// Event listener to update displayed length value
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const basePhraseInput = document.getElementById('basePhrase');

lengthSlider.addEventListener('input', function() {
  lengthValue.textContent = lengthSlider.value;
});

document.getElementById('generate').addEventListener('click', function() {
  const passwordLength = parseInt(lengthSlider.value, 10);  // Get the selected length
  const basePhrase = basePhraseInput.value.trim();  // Get base phrase if provided
  const password = basePhrase ? generatePasswordFromText(basePhrase, passwordLength) : generatePassword(passwordLength);
  document.getElementById('password').value = password;
});

document.getElementById('copy').addEventListener('click', function() {
  const passwordField = document.getElementById('password');
  passwordField.select();
  document.execCommand('copy');
});

function generatePassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Generate password based on text and add randomness
function generatePasswordFromText(text, length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
  let password = "";
  let hash = 0;

  // Create a simple hash from the text
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash = hash & hash;  // Convert to 32bit integer
  }

  // Generate password based on hash and add randomness to ensure it changes on each click
  for (let i = 0; i < length; i++) {
    const index = Math.abs((hash + i + Math.floor(Math.random() * charset.length)) % charset.length);
    password += charset[index];
  }

  return password;
}
