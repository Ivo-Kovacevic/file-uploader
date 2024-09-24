const fileInput = document.getElementById("upload_file");
const label = document.getElementById("label_text");

fileInput.addEventListener("change", (event) => {
    const fileName = event.target.files.length > 0 ? event.target.files[0].name : "Select file";
    label.textContent = fileName;
});
