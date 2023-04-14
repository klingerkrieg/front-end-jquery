var URL_BASE = "http://localhost:8080/"
$(function(){
    $('#submit').click(function(){

        dados = $('#form').serializeArray();

        console.log(dados);

        $.ajax(URL_BASE+"people",{
            data:dados
        }).done(function() {
            alert( "success" );
        })
        .fail(function() {
            alert( "error" );
        })
    });
});