document.getElementById("fileInput").addEventListener("change", function(e){

let file = e.target.files[0]

let reader = new FileReader()

reader.onload = function(event){
document.getElementById("bookText").value = event.target.result
}

reader.readAsText(file)

})
