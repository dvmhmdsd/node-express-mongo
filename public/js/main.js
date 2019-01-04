$(function() {
    
    
    $('#delete').on('click', (e) => {
        let item = $(e.target).data('id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/' + item,
            success: () => {
                alert('deleted');
                window.location.href = '/';
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
});