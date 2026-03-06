// Load book text from uploaded .txt file
document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.type !== "text/plain") {
    alert("Please upload a plain text (.txt) file");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("bookText").value = reader.result;
  };
  reader.readAsText(file);
});

// Highlight matched query terms in text
function highlightMatches(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex
  const regex = new RegExp(escaped, "gi");
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

// Simple client-side keyword search (for demo)
function simpleSearch(book, query) {
  const paragraphs = book.split("\n").filter((p) => p.trim());
  const lowerQuery = query.toLowerCase();
  const results = paragraphs.filter((p) =>
    p.toLowerCase().includes(lowerQuery)
  );
  return results.slice(0, 7); // limit to 7 results
}

// Display results with highlights
function displayResults(results, query) {
  const container = document.getElementById("results");
  if (!results.length) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }
  container.innerHTML = results
    .map((res) => `<div class="result-item">${highlightMatches(res, query)}</div>`)
    .join("");
}

// Main search handler
async function searchBook() {
  const bookText = document.getElementById("bookText").value.trim();
  const query = document.getElementById("queryInput").value.trim();
  if (!bookText) {
    alert("Please upload or paste a book first.");
    return;
  }
  if (!query) {
    alert("Please enter a search query.");
    return;
  }

  // For now, do client-side keyword search
  const results = simpleSearch(bookText, query);
  displayResults(results, query);

  // --- Here you could add code to call your AI backend ---
  /*
  const response = await fetch("YOUR_BACKEND_API_ENDPOINT", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, bookText }),
  });
  const data = await response.json();
  displayResults(data.results, query);
  */
}

// Wire up the button
document.getElementById("searchBtn").addEventListener("click", searchBook);
