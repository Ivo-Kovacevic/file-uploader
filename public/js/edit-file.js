document.querySelector(".edit-file-button").addEventListener("click", (e) => {
    const editFileButton = document.querySelector(".edit-file-button");
    const displayFile = document.querySelector(".display-file");
    const editFile = document.querySelector(".edit-file");

    displayFile.classList.toggle("hidden");
    editFile.classList.toggle("hidden");

    if (editFileButton.textContent === "Edit file") {
        editFileButton.textContent = "Cancel editing";
    } else {
        editFileButton.textContent = "Edit file";
    }
});
