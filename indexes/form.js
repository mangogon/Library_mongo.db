$(function (){
    Parse.initialize('vasylynka');
    Parse.serverURL = 'http://localhost:1337/parse';
    var Book = Parse.Object.extend("Book");
    
    $("#btn-add").click(function(){
        var book = new Book();
        book.save({
            title:$("#title").val(),
            author: $('#author').val(),
            year:parseInt($('#year').val()),
            readingStatus:$("#readingStatus").val() =='1' ? true :false
        },{
            success:function(book){
                $('#message').addClass('alert alert-success').html('<b>Success</b> Book ' + $('#title').val() + ' saved');
            },
            error: function(book, error){
                $('#message').addClass('alert alert-error').html('<b>Error</b> '+error);
            }
        });
    });
    

    
    
});





