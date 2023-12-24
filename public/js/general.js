function toggleDarkMode() {
	sessionStorage.setItem("data", JSON.stringify({ "toggle_checkbox": "checked" }));
	const body = document.body;
	body.classList.toggle('dark-mode');

	const inputsAndTextAreas = document.querySelectorAll('input, textarea');
	inputsAndTextAreas.forEach((element) => {
		element.classList.toggle('dark-mode');
	});

	const table = document.querySelector('table');
	table.classList.toggle('dark-mode');
}

document.addEventListener('DOMContentLoaded', () => {

	var data = sessionStorage.getItem('data');
	if (JSON.parse(data).toggle_checkbox == 'checked') {
		document.getElementById("toggle_checkbox").checked = true;
		toggleDarkMode();
	}
});