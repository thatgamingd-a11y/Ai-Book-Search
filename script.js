async function uploadBook(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://127.0.0.1:8000/upload_book", {
    method: "POST",
    body: formData
  });
  const data = await response.json();
  alert(data.message);
}

document.getElementById("fileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  await uploadBook(file);
});

// Highlight matches (optional)
function highlightMatches(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

// Ask a question — calls backend for semantic search
async function askQuestion() {
  const question = document.getElementById("questionInput").value.trim();
  if (!question) return alert("Enter a question!");

  const formData = new FormData();
  formData.append("question", question); // must match backend parameter

  const response = await fetch("http://127.0.0.1:8000/query", {
    method: "POST",
    body: formData
  });
  const data = await response.json();

  const container = document.getElementById("questionResults");

  if (!data.results || data.results.length === 0) {
    container.innerHTML = "<p>No relevant information found.</p>";
    return;
  }

  // display results (optional: highlight question words)
  container.innerHTML = data.results
    .map(r => `<div class="result-item">${highlightMatches(r, question)}</div>`)
    .join("");
}

document.getElementById("questionBtn").addEventListener("click", askQuestion);
