document.getElementById('quoteForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const quote = document.getElementById('quoteInput').value;

  try {
    const response = await fetch('/api/PostQuote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quote })
    });

    const data = await response.json();
    const message = response.ok ? data.message : data.error || 'Failed to add quote';
    document.getElementById('postResponse').textContent = message;
    if (response.ok) document.getElementById('quoteForm').reset();
  } catch (error) {
    document.getElementById('postResponse').textContent = 'Server error';
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const fetchQuoteBtn = document.getElementById('fetchQuoteBtn');
  const quoteDisplay = document.getElementById('quoteDisplay');

  if (fetchQuoteBtn && quoteDisplay) {
    fetchQuoteBtn.addEventListener('click', async function () {
      try {
        const response = await fetch('/api/getQuote');
        const data = await response.json();      

        if (data.length === 0) {
          quoteDisplay.textContent = 'No quotes found.';
        } else {
          data.forEach((item) => {
            const quoteElement = document.createElement('p');
            quoteElement.textContent = `• ${item.quote}`;
            quoteElement.classList.add('mb-2');
            quoteDisplay.appendChild(quoteElement);
          });
        }
      } catch (error) {
        quoteDisplay.textContent = 'Error fetching quotes.';
      }
    });
  }
});

(() => {
  const statusEl = document.getElementById('ws-status');
  const uptimeEl = document.getElementById('ws-uptime');

  function setStatus(text, variant) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = 'badge';
    statusEl.classList.add(`text-bg-${variant}`);
  }

  // Build URL and pass the same path configured on the server
  const socket = io('/', { path: '/live', transports: ['websocket', 'polling'] });

  // --- Socket lifecycle events ---
  socket.on('connect', () => {
    setStatus('Connected', 'success');
  });

  socket.on('disconnect', (reason) => {
    setStatus(`Disconnected (${reason})`, 'secondary');
    uptimeEl && (uptimeEl.textContent = '0s');
  });

  socket.io.on('reconnect_attempt', (attempt) => {
    setStatus(`Reconnecting… (try ${attempt})`, 'warning');
  });

  socket.io.on('reconnect', () => {
    setStatus('Reconnected', 'success');
  });

  socket.io.on('error', () => {
    setStatus('Error', 'danger');
  });

  // --- App events ---
  socket.on('hello', (payload) => {
    // Optional: console.log(payload.message);
  });

  socket.on('uptime', ({ seconds }) => {
    if (!uptimeEl) return;
    const s = Number(seconds) || 0;
    // Pretty hh:mm:ss
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    uptimeEl.textContent = `${h}:${m}:${sec}`;
  });

  // Example request: ask server time (wired in server as 'server:now')
  socket.emit('server:now');
  socket.on('server:now', ({ iso }) => console.log('Server time:', iso));
})();

