var URL_BASE = "http://localhost:8080/"
var URL_EDIT = null;

$(function(){
    $('#submit').click(save);
    //atualiza a lista após carregar a página
    updateList();
});

function del(url){
    if (confirm("Deseja realmente deletar esse registro?")){
        //envia para o backend
        $.ajax(url,{
            method:'delete',
        }).done(function(res) {
            //atualiza a lista após salvar
            updateList();
        })
        .fail(function(res) {
            console.log(res);
        });
    }
}


function save(){

    //captura os dados do form, já colocando como um JSON
    dados = $('#firstName,#lastName,#cpf,#email').serializeJSON();
    dados["address"] = $('#city,#street').serializeJSON();

    console.log(dados);

    //caso esteja editando
    if (URL_EDIT != null) {
        //envia para a url do objeto
        url = URL_EDIT;
        method = "PUT";
    } else {
        //caso contrário, envia para a url de salvar
        url = URL_BASE + "people";
        method = "POST";
    }

    //envia para o backend
    $.ajax(url,{
        data:JSON.stringify(dados),
        method:method,
        contentType: "application/json",
    }).done(function(res) {
        console.log(res);

        URL_EDIT = res._links.self.href;

        //atualiza a lista após salvar
        updateList();
    })
    .fail(function(res) {
        console.log(res);
    });
}

function edit(url){
    //Primeiro solicita as informações da pessoa ao backend
    $.ajax(url,{
        method:'get',
    }).done(function(res) {

        /*$.each(res,function(k, el){
            $('#'+k).val(el);
        });*/
        $('#firstName').val(res.firstName);
        $('#lastName').val(res.lastName);
        $('#cpf').val(res.cpf);
        $('#email').val(res.email);
        $('#city').val(res.address.city);
        $('#street').val(res.address.street);
        
    });
    //salva a url do objeto que estou editando
    URL_EDIT = url;
}

function updateList(){

    $.ajax(URL_BASE+"people",{
        method:'get',
    }).done(function(res) {

        let table = $('#tableContent');
        table.html("");
        $(res._embedded.people).each(function(k,el){
            let people = el;
            console.log(people._links);
            tr = $(`<tr>
                        <td>
                            <a href="#" onclick="edit('${people._links.self.href}')">Editar</a>
                        </td>
                        <td>${people.firstName}</td>
                        <td>${people.email}</td>
                        <td><a href="#" onclick="del('${people._links.self.href}')">Deletar</a></td>
                    </tr>`);
            table.append(tr);
        })
        
    })
    .fail(function(res) {
        let table = $('#tableContent');
        table.html("");
        tr = $(`<tr><td colspan='4'>Não foi possível carregar a lista</td></tr>`);
        table.append(tr);
    });

}