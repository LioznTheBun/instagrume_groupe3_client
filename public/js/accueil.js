function showPopup() {
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    resetPopup();
    document.getElementById('popup').style.display = 'none';
}
document.getElementById('imageButton').addEventListener('click', function () {
    document.getElementById('uploadImage').click();
});
function resetPopup() {
    document.getElementById("uploadPreview").src = '';
    document.getElementById("uploadImage").value = '';
}
function PreviewImage() {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("uploadImage").files[0]);

    oFReader.onload = function (oFREvent) {
        document.getElementById("uploadPreview").src = oFREvent.target.result;
    };
};

