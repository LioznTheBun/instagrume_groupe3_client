function editDescription(publicationId) {
    toggleForm(publicationId);
}

function toggleForm(publicationId) {
    var form = document.getElementById('editForm' + publicationId);
    form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
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
                    console.log("Publication supprimée avec succès")
                } else {
                    console.error('Echec de la suppression');
                }
                window.location.reload();
            })
            .catch(error => {
                console.error('Erreur :', error);
                window.location.reload();
            })
    }
}

document.getElementById('avatar').addEventListener('click', function () {
    document.getElementById('avatarInput').click();
});

function submitForm() {
    document.getElementById('avatarForm').submit();
}

document.getElementById('showProfileForm').addEventListener('click', function () {
    var form = document.getElementById('profileForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});