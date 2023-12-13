var modalBan = document.getElementById('ban');
if (modalBan) {
modalBan.addEventListener('show.bs.modal', function(event) {
    var idUser = event.relatedTarget.getAttribute('data-user-id');
    modalBan.querySelector('#banInputId').value  = idUser;
});
}
modalBan.querySelector('#validBan').addEventListener('click', function(event) {
    var idUser = modalBan.querySelector('#banInputId').value = idUser;
    
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener ("readystatechange", function(){
        if(ajaxRequest.readyState === 4){
            if(ajaxRequest.status === 200){
               
                let modalBootstrap = bootstrap.Modal.getInstance(modalBan);
                modalBootstrap.hide();
                var message = JSON.parse(ajaxRequest.responseText);
                console.log(message);
            }
            else {
                console.log("Status error: " + ajaxRequest.status);
            }
        }
    });

    ajaxRequest.open('PUT', '/ban/' + idUser); 
    ajaxRequest.send();
});

var modalDeban = document.getElementById('deban');
if (modalDeban) {
modalDeban.addEventListener('show.bs.modal', function(event) {
    var idUser = event.relatedTarget.getAttribute('data-user-id');
    modalDeban.querySelector('#debanInputId').value  = idUser;
});
}
modalDeban.querySelector('#validDeban').addEventListener('click', function(event) {
    var idUser = modalDeban.querySelector('#debanInputId').value;
    
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener ("readystatechange", function(){
        if(ajaxRequest.readyState === 4){
            if(ajaxRequest.status === 200){
               
                let modalBootstrap = bootstrap.Modal.getInstance(modalDeban);
                modalBootstrap.hide();
                var message = JSON.parse(ajaxRequest.responseText);
                console.log(message);
            }
            else {
                console.log("Status error: " + ajaxRequest.status);
            }
        }
    });

    ajaxRequest.open('PUT', '/unban/' + idUser); 
    ajaxRequest.send();
});