// POST: Submit new quote
document.getElementById('quoteForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const quote = document.getElementById('quoteInput').value;

  try {
    const response = await fetch('/api/quote', {
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

// GET: Fetch random quote
document.getElementById('fetchQuoteBtn').addEventListener('click', async function () {
  try {
    const response = await fetch('/api/quote');
    const data = await response.json();
    document.getElementById('quoteDisplay').textContent = data.quote;
  } catch (error) {
    document.getElementById('quoteDisplay').textContent = 'Error fetching quote.';
  }
});
