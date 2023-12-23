
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

function formatCommentDate(timestamp) {
    var differenceEnMillisecondes = new Date() - new Date(timestamp);
    var seconds = Math.floor(differenceEnMillisecondes / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    if (days > 0) {
        return days + ' j';
    } else if (hours > 0) {
        return hours + ' h';
    } else if (minutes > 0) {
        return minutes + ' min';
    } else {
        return 'il y a quelques instants';
    }
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

                var timestamp = publicationDetails.date_publication.timestamp * 1000; // Convertir en millisecondes

                var datePublication = new Date(timestamp);

                var differenceEnMillisecondes = new Date() - datePublication;

                var seconds = Math.floor(differenceEnMillisecondes / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);

                var formattedDate;

                if (days > 0) {
                    formattedDate = 'Publié il y a ' + days + ' jour(s)';
                } else if (hours > 0) {
                    formattedDate = 'Publié il y a ' + hours + ' heure(s)';
                } else if (minutes > 0) {
                    formattedDate = 'Publié il y a ' + minutes + ' minute(s)';
                } else {
                    formattedDate = 'Publié il y a quelques instants';
                }

                document.querySelector('.date_post_popup').innerHTML = '<p class="date_post">' + formattedDate + '</p>';

                var commentairesHtml = '';
                for (var i = 0; i < publicationDetails.commentaires.length; i++) {
                    var commentaire = publicationDetails.commentaires[i];
                    commentairesHtml += '<div class="commentaire post">';
                    commentairesHtml += '<div class="post_body_popup">';
                    commentairesHtml += '<p class="pseudo_comment_popup">' + commentaire.auteur.pseudo + '</p>';

                    
                    commentairesHtml += '<p class="comment_popup">' + commentaire.contenu + '</p>';
                    commentairesHtml += '<p class="date_comment_popup">' + formatCommentDate(commentaire.date_comm.timestamp * 1000) + '</p>';

                    commentairesHtml += '<div class="like_dislike_popup">';
                    if (commentaire.rating_commentaire !== null) {
                        commentairesHtml += '<div class="like_popup"><img class="img_like_popup" src="images/like.png"></div>';
                        commentairesHtml += '<p>' + commentaire.rating_commentaire.likes_count + '</p>';
                        commentairesHtml += '<div class="dislike_popup"><img class="img_dislike_popup" src="images/dislike.png"></div>';
                        commentairesHtml += '<p>' + commentaire.rating_commentaire.dislikes_count + '</p>';
                    }
                    commentairesHtml += '</div>';

                    commentairesHtml += '<div class="button_answer_popup">';
                    commentairesHtml += '<button class="reply-button" onclick="toggleReplyForm(\'' + commentaire.id + '\', event)">Répondre</button>';
                    commentairesHtml += '</div>';
                
                    commentairesHtml += '<div class="reply-form" style="display: none;" id="reply-form-popup-' + commentaire.id + '">';
                    commentairesHtml += '<form action="/createCommReply" class="form_popup_comm" method="post" enctype="multipart/form-data">';
                    commentairesHtml += '<textarea class="buttonReponsePostPopup" id="commentReponse" name="contenu" placeholder="Votre réponse..." oninput="togglePublishButton()"></textarea>';
                    commentairesHtml += '<input type="hidden" name="dateComm" value="' + new Date().toISOString() + '">';
                    commentairesHtml += '<input type="hidden" name="auteur_id" value="' + publicationDetails.auteur + '">';
                    commentairesHtml += '<input type="hidden" name="publication" value="' + publicationDetails.id + '">';
                    commentairesHtml += '<input type="hidden" name="parentCommentId" value="' + commentaire.id + '">';
                    commentairesHtml += '<button id="publishButtonReponse" type="submit">Publier</button>';
                    commentairesHtml += '</form>';
                    commentairesHtml += '</div>';
                    
                    commentairesHtml += '</div></div>';
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


function toggleReplyForm(commentId, event) {
    var replyFormId = 'reply-form-popup-' + commentId;
    var replyForm = document.getElementById(replyFormId);

    if (replyForm.style.display === 'none' || replyForm.style.display === '') {
        replyForm.style.display = 'block';
    } else {
        replyForm.style.display = 'none';
    }

    event.stopPropagation();
}

function toggleReplyFormAccueil(commentId, event) {
    var replyFormId = 'reply-form-' + commentId;  // Utilisez le même préfixe
    var replyForm = document.getElementById(replyFormId);

    if (replyForm && (replyForm.style.display === 'none' || replyForm.style.display === '')) {
        replyForm.style.display = 'block';
    } else if (replyForm) {
        replyForm.style.display = 'none';
    }

    event.stopPropagation();
}