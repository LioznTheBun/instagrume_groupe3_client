function showPopup() {
    document.getElementById('popup').style.display = 'block';
}

function showPublication() {
    document.getElementById('popupPublication').style.display = 'block';
}

function closePopupPublication() {
    document.getElementById('popupPublication').style.display = 'none';
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
function createPublication() {
    var modalCreatePublication = document.getElementById('publishButton');
    modalCreatePublication.addEventListener('click', function (event) {
        let dataToSend = new Object();
        dataToSend.description = document.getElementById('inputDescription').value;

        let ajaxRequest = new XMLHttpRequest();
        ajaxRequest.addEventListener('readystatechange', function () {
            if (ajaxRequest.readyState === 4) {
                if (ajaxRequest.status === 200) {
                    location.reload();
                } else {
                    console.log('Status error: ' + ajaxRequest.status);
                }
            }
        });

        ajaxRequest.open('POST', '/publications');
        ajaxRequest.setRequestHeader('Content-Type', 'application/json');
        ajaxRequest.send(JSON.stringify(dataToSend));
    });
}

function togglePublishButton() {
    var textareaValue = document.getElementById('commentTextarea').value;
    var publishButton = document.getElementById('publishButton');

    if (textareaValue.trim() !== '') {
        publishButton.style.display = 'block';
    } else {
        publishButton.style.display = 'none';
    }
}




