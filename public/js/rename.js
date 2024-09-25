document.querySelectorAll(".rename").forEach((renameBtn) => {
    renameBtn.addEventListener("click", () => {
        const parentContainer = renameBtn.closest("div").parentElement;

        const folderName = parentContainer.querySelector(".folder-file-name");
        const folderForm = parentContainer.querySelector(".folder-file-name-form");

        folderForm.classList.toggle("hidden");

        if (renameBtn.textContent === "Rename") {
            renameBtn.textContent = "Cancel";
        } else {
            renameBtn.textContent = "Rename";
        }
    });
});
