document.addEventListener('DOMContentLoaded', () => {
	const savedDarkMode = sessionStorage.getItem('data');
	const checkbox = document.getElementById('toggle_checkbox');

	if (savedDarkMode === 'checked') {
		checkbox.checked = true;
		toggleDarkMode();
	}

	checkbox.addEventListener('change', toggleDarkMode);
});

function toggleDarkMode() {
	const body = document.body;
	const checkbox = document.getElementById('toggle_checkbox');
	const isDarkModeEnabled = checkbox.checked;

	body.classList.toggle('dark-mode', isDarkModeEnabled);

	const inputsAndTextAreas = document.querySelectorAll('input, textarea');
	inputsAndTextAreas.forEach((element) => {
		element.classList.toggle('dark-mode', isDarkModeEnabled);
	});

	const popup = document.querySelector('.right-content-popup');
	popup.classList.toggle('dark-mode', isDarkModeEnabled);

	const table = document.querySelector('.container');
	table.classList.toggle('dark-mode', isDarkModeEnabled);

	const imgElement = document.querySelector('.search_button img');
	imgElement.style.filter = isDarkModeEnabled ? 'invert(100%)' : 'none';

	const imgElement2 = document.querySelector('.button_add_post img');
	imgElement2.style.filter = isDarkModeEnabled ? 'invert(100%)' : 'none';

	const replyButton = document.querySelector('.reply-button');
	replyButton.classList.toggle('dark-mode', isDarkModeEnabled);

	const card = document.querySelector('.publications_card_profil');
	card.classList.toggle('dark-mode', isDarkModeEnabled);

	const tableBoutonRating= document.querySelectorAll('.likes_comment_post img, .dislikes_comment_post img, .comment_like_post img, .comment_dislike_post img, .img_delete_popup, .img_edit_popup, .edit_icon, .delete_icon__post_div img, .delete_icon_div img .like_popup img, .dislike_popup img, .close_icon');
	tableBoutonRating.forEach((element) => {
		element.style.filter = isDarkModeEnabled ? 'invert(100%)' : 'none';
	});

	if (isDarkModeEnabled) {
		sessionStorage.setItem("data", 'checked');
	} else {
		sessionStorage.removeItem("data");
	}
}