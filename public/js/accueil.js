
$(document).ready(function () {
    $('.lockToggle').change(function () {
        var postId = $(this).data('post-id');
        var isLocked = $(this).prop('checked');

        var route = isLocked ? '/unlock/' : '/lock/';

        $.ajax({
            type: 'PUT',
            url: route + postId,
            success: function (response) {
                console.log('User status changed successfully:', response);
            },
            error: function (error) {
                console.error('Error changing user status:', error);
            }
        });
    });
});

function showPopup() {
    document.getElementById('popup').style.display = 'block';
}

function showPublication(postId) {
    var popup = document.getElementById('popupPublication');

    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener('readystatechange', function () {
        if (ajaxRequest.readyState === 4) {
            if (ajaxRequest.status === 200) {
                var publicationDetails = JSON.parse(ajaxRequest.responseText);

                document.querySelector('.post-img-top').src = "http://127.0.0.1:3000/img/" + publicationDetails.photo;
                document.querySelector('.avatar_user').src = "http://127.0.0.1:3000/img/" + publicationDetails.auteur.avatar;
                document.querySelector('.pseudo_user_popup').innerHTML = publicationDetails.auteur.pseudo;
                document.querySelector('.content_post_popup').innerHTML = '<p>' + publicationDetails.description + '</p>';
                document.querySelector('.date_post_popup').innerHTML = '<p class="date_post">Publié le ' + publicationDetails.date_publication + '</p>';


                var commentairesHtml = '';
                for (var i = 0; i < publicationDetails.commentaires.length; i++) {
                    var commentaire = publicationDetails.commentaires[i];
                    commentairesHtml += '<div class="commentaire post">';
                    commentairesHtml += '<div class="post_body_popup">';
                    commentairesHtml += '<p class="pseudo_comment_popup">' + commentaire.auteur.pseudo + '</p>';
                    commentairesHtml += '<p class="comment_popup">' + commentaire.contenu + '</p>';
                    commentairesHtml += '<div class="like_dislike_popup">';
                    if (commentaire.rating_commentaire !== null) {
                        commentairesHtml += '<div class="like_popup"><img class="img_like_popup" src="images/like.png"></div>';
                        commentairesHtml += '<p>' + commentaire.rating_commentaire.likes_count + '</p>';
                        commentairesHtml += '<div class="dislike_popup"><img class="img_dislike_popup" src="images/dislike.png"></div>';
                        commentairesHtml += '<p>' + commentaire.rating_commentaire.dislikes_count + '</p>';
                    }
                    commentairesHtml += '</div></div></div>';
                }
                document.querySelector('.commentaires_popup').innerHTML = commentairesHtml;
                popup.style.display = 'block';
            } else {
                console.log('Status error: ' + ajaxRequest.status);
            }
        }
    });
    ajaxRequest.open('GET', '/publications/' + postId);
    ajaxRequest.send();
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
}

function createPublication() {
    let description = document.getElementById('inputDescription').value;
    let imageFile = document.getElementById('uploadImage').files[0];

    let formData = new FormData();
    formData.append('description', description);
    formData.append('image', imageFile);

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
    ajaxRequest.send(formData);
}

function togglePublishButton() {
    var commentTextareaAccueil = document.getElementById('commentTextareaAccueil').value;
    var publishButtonAccueil = document.getElementById('publishButtonAccueil');

    if (commentTextareaAccueil.trim() !== '') {
        publishButtonAccueil.style.display = 'block';
    } else {
        publishButtonAccueil.style.display = 'none';
    }
}




