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

async function searchBook() {
  const query = document.getElementById("queryInput").value.trim();
  if (!query) return alert("Please enter a query");

  const formData = new FormData();
  formData.append("query", query);

  const response = await fetch("http://127.0.0.1:8000/query", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  const container = document.getElementById("results");
  if (!data.results.length) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }
  container.innerHTML = data.results
    .map(r => `<div class="result-item">${r}</div>`)
    .join("");
}
