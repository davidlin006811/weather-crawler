$(document).ready(function() {



    $("#txtInput").on("keyup", function() {
        var input = $(this).val().toUpperCase();
        if (!input.length) {
            $("#list").empty();
            return;
        }
        $("#list").empty();
        var para = { search: input };

        $.get('/searching', para, function(data) {

            for (var i = 0; i < data.length; i++) {
                $("#list").append('<li>' + data[i].city + ', ' + data[i].province + ', ' + data[i].country + '</li>');
                $("li").addClass("list-group-item");
            }
        });



    });

    /*$('#btn1').on("click", function() {
         var input = $('#txtInput').val()
         if (!input.length) {
             Console.log("You did not enter any city");
             return;
         }
         var para = { submit: input };
         $.get('/submit', para, function(data) {

               console.log(data);
           });
         $.get('/submit', para);

     })*/

});

$("body").on('click', '#list li', function() {
    $("#txtInput").val($(this).text());
});