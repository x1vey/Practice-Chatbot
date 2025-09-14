const chatBox = document.getElementById('chat');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');

// Replace this with your n8n webhook endpoint
const N8N_WEBHOOK_URL = 'https://YOUR_N8N_WEBHOOK_URL';

function addMessage(text, sender = 'user') {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.innerHTML = `<div class="bubble">${text}</div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  userInput.value = '';
  
  // Send to n8n
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    // Adjust how you read the response from n8n
    addMessage(data.reply || JSON.stringify(data), 'n8n');
  } catch (err) {
    addMessage('Error connecting to n8n', 'n8n');
  }
});
