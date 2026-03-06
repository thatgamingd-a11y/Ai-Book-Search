// Load book from uploaded file
document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("bookText").value = reader.result;
    alert("Book loaded!");
  };
  reader.readAsText(file);
});

// Highlight matches
function highlightMatches(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

// Keyword Search
function keywordSearch() {
  const book = document.getElementById("bookText").value.trim();
  const query = document.getElementById("keywordInput").value.trim();
  if (!book) return alert("Load a book first!");
  if (!query) return alert("Enter keywords!");

  const paragraphs = book.split("\n").filter(p => p.trim());
  const results = paragraphs.filter(p => p.toLowerCase().includes(query.toLowerCase())).slice(0,7);

  const container = document.getElementById("keywordResults");
  if (!results.length) {
    container.innerHTML = "<p>No matches found.</p>";
    return;
  }

  container.innerHTML = results.map(r => `<div class="result-item">${highlightMatches(r, query)}</div>`).join("");
}

// Question Section (AI-ready)
async function askQuestion() {
  const book = document.getElementById("bookText").value.trim();
  const question = document.getElementById("questionInput").value.trim();
  if (!book) return alert("Load a book first!");
  if (!question) return alert("Enter a question!");

  const container = document.getElementById("questionResults");
  container.innerHTML = "<p>Searching...</p>";

  const paragraphs = book.split("\n").filter(p => p.trim());
  const results = paragraphs.filter(p => p.toLowerCase().includes(question.toLowerCase())).slice(0,5);

  container.innerHTML = results.length
    ? results.map(r => `<div class="result-item">${highlightMatches(r, question)}</div>`).join("")
    : "<p>No relevant information found.</p>";

  // --- AI backend integration example ---
  /*
  const formData = new FormData();
  formData.append("query", question);
  const response = await fetch("http://127.0.0.1:8000/query", {
    method: "POST",
    body: formData
  });
  const data = await response.json();
  container.innerHTML = data.results.map(r => `<div class="result-item">${r}</div>`).join("");
  */
}

// Event listeners
document.getElementById("keywordBtn").addEventListener("click", keywordSearch);
document.getElementById("questionBtn").addEventListener("click", askQuestion);
