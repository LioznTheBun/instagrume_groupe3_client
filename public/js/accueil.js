
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
    var datePublication = new Date(timestamp);
    var now = new Date();
    var differenceEnMillisecondes = now - datePublication;
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
                var userId = parseInt(document.getElementById('id-container').getAttribute('data-current-user'), 10);
                for (var i = 0; i < publicationDetails.commentaires.length; i++) {
                    var commentaire = publicationDetails.commentaires[i];
                    if(commentaire.auteur.id === userId || sessionStorage.getItem('role') === 'admin') {
                        var isCurrentUserComment = true;
                    } else {
                        var isCurrentUserComment = false;
                    }
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

                    if (isCurrentUserComment) {
                        commentairesHtml += '<div class="delete_icon_popup" onclick="deleteComment(\'' + commentaire.id + '\')">';
                        commentairesHtml += '<img class="img_delete_popup" src="images/corbeille.png">';
                        commentairesHtml += '</div>';

                        commentairesHtml += '<div class="edit_icon_popup" onclick="toggleEditCommentForm(\'' + commentaire.id + '\')">';
                        commentairesHtml += '<img class="img_edit_popup" src="images/editer.png">';
                        commentairesHtml += '</div>';
                    }

                    commentairesHtml += '<div class="button_answer_popup">';
                    commentairesHtml += '<button class="reply-button" onclick="toggleReplyForm(\'' + commentaire.id + '\', event)">Répondre</button>';
                    commentairesHtml += '</div>';



                    commentairesHtml += '</div></div>';
                    commentairesHtml += '<div class="edit-form" style="display: none;" id="edit-form-popup-' + commentaire.id + '">';
                    commentairesHtml += '<form method="POST" action="/selfCommentaires/' + commentaire.id + '" class="form_popup_comm">';
                    commentairesHtml += '<label for="editComment">Modifier votre commentaire :</label>';
                    commentairesHtml += '<input type="hidden" name="id" value="' + commentaire.id + '" required>';
                    commentairesHtml += '<textarea name="contenu" required>' + commentaire.contenu + '</textarea>';
                    commentairesHtml += '<button type="submit">Modifier</button>';
                    commentairesHtml += '</form>';
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
function toggleEditCommentFormPopup(commentId) {
    var form = document.getElementById('edit-form-popup-' + commentId);
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function toggleReplyFormAccueil(commentId, event) {
    var replyFormId = 'reply-form-' + commentId;
    var replyForm = document.getElementById(replyFormId);

    if (replyForm) {
        if (replyForm.style.display === 'none' || replyForm.style.display === '') {
            var pseudoToReply = document.querySelector('.post_text_pseudo[data-comment-id="' + commentId + '"]').textContent;
            var commentTextarea = replyForm.querySelector('textarea[name="contenu"]');
            commentTextarea.value = '@' + pseudoToReply + ' ';
            replyForm.style.display = 'block';
        } else {
            replyForm.style.display = 'none';
        }
    }

    event.stopPropagation();
}
function deleteComment(commentId) {
    if (confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
        var deleteUrl = '/commentaires/' + commentId;

        fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Échec de la suppression du commentaire');
                    window.location.reload();
                }
                window.location.reload();
            })
            .catch(error => {
                console.error('Erreur :', error);
            });
    }
}
function deleteComm(commentId) {
    if (confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
        var deleteUrl = '/commentaires/' + commentId;

        fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Échec de la suppression du commentaire');
                    window.location.reload();
                }
                window.location.reload();
            })
            .catch(error => {
                console.error('Erreur :', error);
            });
    }
}
function deleteSelfComment(commentId) {
    if (confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
        var deleteUrl = '/deleteComment/' + commentId;

        fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    window.location.reload();
                }
                window.location.reload();
            })
            .catch(error => {
                console.error('Erreur :', error);
            });
    }
}
function deletePublication(publicationId, deleteUrl) {
    if (confirm('Voulez-vous vraiment supprimer cette publication ?')) {
        fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error('Echec de la suppression de la publication');
                }
                window.location.reload();
            })
            .catch(error => {
                console.error('Erreur :', error);
                window.location.reload();
            });
    }
}

function toggleEditCommentAccueilForm(commentId) {
    var form = document.getElementById('edit-comment-form-' + commentId);
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function toggleEditCommentForm(commentId) {
    var form = document.getElementById('edit-form-popup-' + commentId);
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function toggleLikePost(postId, action) {
    const likeButton = document.getElementById(`likesPostButton_${postId}`);
    const dislikeButton = document.getElementById(`dislikesPostButton_${postId}`);
    const likesCountElement = document.getElementById(`likesPostCount_${postId}`);
    const dislikesCountElement = document.getElementById(`dislikesPostCount_${postId}`);
    fetch(`/likePost/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: action,
        }),
    })
    .then(response => response.json())
    .then(data => {
        likesCountElement.innerText = data.likes_count;
        dislikesCountElement.innerText = data.dislikes_count;

        if (data.user_liked === true) {
            likeButton.style.backgroundColor = 'cyan';
            likeButton.style.filter = 'invert(0%)';
            dislikeButton.style.removeProperty('background-color');
            dislikeButton.style.removeProperty('filter');
        } else if (data.user_liked === false) {
            dislikeButton.style.backgroundColor = 'red';
            dislikeButton.style.filter = 'invert(0%)';
            likeButton.style.removeProperty('background-color');
            likeButton.style.removeProperty('filter');
        } else {
            likeButton.style.removeProperty('background-color');
            dislikeButton.style.removeProperty('background-color');
            likeButton.style.removeProperty('filter');
            dislikeButton.style.removeProperty('filter');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function toggleDislikePost(postId, action) {
    const likeButton = document.getElementById(`likesPostButton_${postId}`);
    const dislikeButton = document.getElementById(`dislikesPostButton_${postId}`);
    const likesCountElement = document.getElementById(`likesPostCount_${postId}`);
    const dislikesCountElement = document.getElementById(`dislikesPostCount_${postId}`);
    fetch(`/dislikePost/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: action,
        }),
    })
    .then(response => response.json())
    .then(data => {
        likesCountElement.innerText = data.likes_count;
        dislikesCountElement.innerText = data.dislikes_count;

        if (data.user_liked  === true) {
            likeButton.style.backgroundColor = 'cyan';
            likeButton.style.filter = 'invert(0%)';
            dislikeButton.style.removeProperty('background-color');
            dislikeButton.style.removeProperty('filter');
        } else if (data.user_liked === false) {
            dislikeButton.style.backgroundColor = 'red';
            dislikeButton.style.filter = 'invert(0%)';
            likeButton.style.removeProperty('background-color');
            likeButton.style.removeProperty('filter');
        } else {
            likeButton.style.removeProperty('background-color');
            dislikeButton.style.removeProperty('background-color');
            likeButton.style.removeProperty('filter');
            dislikeButton.style.removeProperty('filter');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function toggleLikeCom(comId, action) {
    const likeButton = document.getElementById(`likesComButton_${comId}`);
    const dislikeButton = document.getElementById(`dislikesComButton_${comId}`);
    const likesCountElement = document.getElementById(`likesComCount_${comId}`);
    const dislikesCountElement = document.getElementById(`dislikesComCount_${comId}`);
    fetch(`/likeCom/${comId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: action,
        }),
    })
    .then(response => response.json())
    .then(data => {
        likesCountElement.innerText = data.likes_count;
        dislikesCountElement.innerText = data.dislikes_count;

        if (data.user_liked  === true) {
            likeButton.style.backgroundColor = 'cyan';
            likeButton.style.filter = 'invert(0%)';
            dislikeButton.style.removeProperty('background-color');
            dislikeButton.style.removeProperty('filter');
        } else if (data.user_liked === false) {
            dislikeButton.style.backgroundColor = 'red';
            dislikeButton.style.filter = 'invert(0%)';
            likeButton.style.removeProperty('background-color');
            likeButton.style.removeProperty('filter');
        } else {
            likeButton.style.removeProperty('background-color');
            dislikeButton.style.removeProperty('background-color');
            likeButton.style.removeProperty('filter');
            dislikeButton.style.removeProperty('filter');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function toggleDislikeCom(comId, action) {
    const likeButton = document.getElementById(`likesComButton_${comId}`);
    const dislikeButton = document.getElementById(`dislikesComButton_${comId}`);
    const likesCountElement = document.getElementById(`likesComCount_${comId}`);
    const dislikesCountElement = document.getElementById(`dislikesComCount_${comId}`);
    fetch(`/dislikeCom/${comId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: action,
        }),
    })
    .then(response => response.json())
    .then(data => {
        likesCountElement.innerText = data.likes_count;
        dislikesCountElement.innerText = data.dislikes_count;

        if (data.user_liked  === true) {
            likeButton.style.backgroundColor = 'cyan';
            likeButton.style.filter = 'invert(0%)';
            dislikeButton.style.removeProperty('background-color');
            dislikeButton.style.removeProperty('filter');
        } else if (data.user_liked === false) {
            dislikeButton.style.backgroundColor = 'red';
            dislikeButton.style.filter = 'invert(0%)';
            likeButton.style.removeProperty('background-color');
            likeButton.style.removeProperty('filter');
        } else {
            likeButton.style.removeProperty('background-color');
            dislikeButton.style.removeProperty('background-color');
            likeButton.style.removeProperty('filter');
            dislikeButton.style.removeProperty('filter');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}