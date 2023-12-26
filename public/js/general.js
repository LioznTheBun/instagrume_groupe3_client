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

	const table = document.querySelector('.container');
	table.classList.toggle('dark-mode', isDarkModeEnabled);

	const imgElement = document.querySelector('.search_button img');
	imgElement.style.filter = isDarkModeEnabled ? 'invert(100%)' : 'none';

	const imgElement2 = document.querySelector('.button_add_post img');
	imgElement2.style.filter = isDarkModeEnabled ? 'invert(100%)' : 'none';

	const replyButton = document.querySelector('.reply-button');
	replyButton.classList.toggle('dark-mode', isDarkModeEnabled);

	const tableBoutonRating= document.querySelectorAll('.likes_comment_post img, .dislikes_comment_post img, .comment_like_post img, .comment_dislike_post img, delete_icon');
	tableBoutonRating.forEach((element) => {
		element.style.filter = isDarkModeEnabled ? 'invert(100%)' : 'none';
	});

	// Save or remove the dark mode state in sessionStorage
	if (isDarkModeEnabled) {
		sessionStorage.setItem("data", 'checked');
	} else {
		sessionStorage.removeItem("data");
	}
}