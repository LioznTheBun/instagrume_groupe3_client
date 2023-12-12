var ajaxRequest = new XMLHttpRequest();
ajaxRequest.open('GET', 'test.php');
ajaxRequest.send();

$(document).ready(function() {
    $('.ban-button').on('click', function() {
        var userId = $(this).data('user-id');

        $.ajax({
            url: '/ban/' + userId,
            method: 'PUT',
            success: function(response) {
                // Handle success, update UI, etc.
                console.log(response);
            },
            error: function(error) {
                // Handle error
                console.error(error);
            }
        });
    });

    $('.unban-button').on('click', function() {
        var userId = $(this).data('user-id');

        $.ajax({
            url: '/unban/' + userId,
            method: 'PUT',
            success: function(response) {
                // Handle success, update UI, etc.
                console.log(response);
            },
            error: function(error) {
                // Handle error
                console.error(error);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
	
	let champsDate = document.querySelectorAll(".birthdate-aventurier");
	
	for (let champDate of champsDate) {
		
		champDate.addEventListener ("change", function(event) {
			let idAventurier = champDate.parentNode.id;
			let ajaxRequest = new XMLHttpRequest();
			
			ajaxRequest.open('POST', "php_ajax/modify_birthdate.php");
			ajaxRequest.onreadystatechange = function(){
                if(ajaxRequest.readyState === 4){
                    if(ajaxRequest.status === 200){

                        console.log(ajaxRequest.responseText);
                    }
                    else {
                        console.log("Erreur");
                    }
                }
            };
			var data = {idAventurier: idAventurier, dateNaissance: champDate.value};
			ajaxRequest.send(JSON.stringify(data));
		});
	}
});