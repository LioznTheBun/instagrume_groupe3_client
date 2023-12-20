
$(document).ready(function () {
    $('.banToggle').change(function () {
        var userId = $(this).data('user-id');
        var isBanned = $(this).prop('checked');

        var route = isBanned ? '/unban/' : '/ban/';

        $.ajax({
            type: 'PUT',
            url: route + userId,
            success: function (response) {
                console.log('User status changed successfully:', response);
            },
            error: function (error) {
                console.error('Error changing user status:', error);
            }
        });
    });
});