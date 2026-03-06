function searchBook() {

let book = document.getElementById("book").value
let query = document.getElementById("query").value.toLowerCase()

let paragraphs = book.split("\n")

let results = paragraphs.filter(p => 
    p.toLowerCase().includes(query)
)

let resultHTML = ""

results.slice(0,5).forEach(r=>{
    resultHTML += "<p>" + r + "</p><hr>"
})

document.getElementById("results").innerHTML = resultHTML

}
