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

