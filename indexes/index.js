$(function(){

    // Connection to the MongoDB database via Parse
    Parse.initialize("vasylynka");
    Parse.serverURL = 'http://localhost:1337/parse';
    var Book = Parse.Object.extend("Book");

    // Handlebars templates
    var message_source=$("#message-template").html();
    var message_template=Handlebars.compile(message_source);

    var results_source=$("#results-template").html();
    var results_template=Handlebars.compile(results_source);

    var detail_source=$("#detail-template").html();
    var detail_template=Handlebars.compile(detail_source);

    $('#message').html(message_template({}));

    function doSearch(ev){
        var term =$("#term").val();

        // This query is used to ask MongoDB for Book objects
        var query = new Parse.Query(Book);
        query.matches('title', new RegExp(term, 'i'));
        query.find({
            success: function (books) {
                // The objects were retrieved successfully.
                // Now we must build a list of JS objects for Handlebars
                var results = [];
                for (var i = 0; i < books.length; i++) {
                    var book = books[i]; // an instance of the Book class
                    // We add a JS object containing the book data
                    results.push({
                        id: book.id,
                        title: book.get('title'),
                        author: book.get('author'),
                        year: book.get('year'),
                        readingStatus: book.get('readingStatus')
                    });
                }
                // Now we can display the results in HB
                var context = {results:results, number:results.length, plural: results.length !=1}
                var rendered_template=results_template(context);
                $("#results").html(rendered_template);
                $("#detail").html("");

                $("#results a").click(function(e) {
                    e.preventDefault();
                    var link_id=$(this).attr("id");
                    var book_id=link_id.split ("-")[1];
                    var book_query = new Parse.Query(Book);
                    book_query.get(book_id, {
                        success: function(book) {
                            // The object was retrieved successfully.
                            var context = {
                                title: book.get('title'),
                                author: book.get('author'),
                                year: book.get('year'),
                                readingStatus: book.get('readingStatus'),
                                url: "http://www.google.com/search?q=" + encodeURI(book.get('title'))
                            };
                            rendered_template = detail_template(context);
                            $("#detail").html(rendered_template);
                        },
                        error: function(object, error) {
                            // The object was not retrieved successfully.
                            // error is a Parse.Error with an error code and message.
                            console.log('Error: ' + error);
                        }

                    });
                });
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
                console.error(error);
            }
        });
    }

    $("#search-btn").click(doSearch);
    $("#term").keyup(doSearch);

});