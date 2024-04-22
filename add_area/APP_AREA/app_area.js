//se crean las variables que hacen referencia a divs para editar y eliminar, y al formulario creado en html
let div=document.getElementById('edit');

let div_delete=document.getElementById('delete');

let form=document.getElementById('form_area');

//se crea esta funcion para editar un area
function edit_area(id_area){

    // crea una variable para obtener el nuevo nombre de area
    let new_name_area=document.getElementById('nom_area_edit').value;

    if(new_name_area==""){
        alert('Nombre no valido')
    }else{

            //los datos se organizan en formato JSON 
            let datos_de_edit={
                id:id_area,
                new_name:new_name_area
            }
            
            //se hace peticion tipo "PUT" a la ruta que permita editar areas
            fetch('https://incidencia-karmina-2.onrender.com/api/Areas_h',{
                method:'PUT',
                body:JSON.stringify(datos_de_edit),//se envian los datos
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(res=>res.json())
            .then(json=>{

                //al recibir respuesta muestra un mensaje, se limpia un div y se llama a la funcion "areas()"
                alert('Se actualizo una area')
                div.innerHTML=" ";
                areas();
            })

        
    }


}






//se crea una funcion para eliminar areas
function delete_area(id_area_delete){

    //se hace una peticion tipo "delete" anexando el id del area a eliminar, a traves de la ruta especifica
    fetch(`https://incidencia-karmina-2.onrender.com/api/Areas_h/${id_area_delete}`,{
        method:'DELETE',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //al recibir respuesta se muestra un mensaje, se limpia un div y se llama a areas()
        alert('Se elimino una area')
        div_delete.innerHTML=" ";
        areas();
    })

    
}






//esta funcion permite traer todas las areas registradas
function areas(){

    //se consulta por la ruta las areas

    fetch('https://incidencia-karmina-2.onrender.com/api/Areas_h',{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //al tener respuesta se crea variables que detectan donde se insertara la infromacion recibida

        let areas_hotel=document.getElementById('areas');
        let areas_hotel_delete=document.getElementById('areas_delete');

        //se establece una opcion nula en caso de que no se seleccione nada
        let lista_areas_hotel='<option value="">*</option>';

        //ciclo for para obtener la informacion brindada por la api
        for(let i=0;i<json.length;i++){

            lista_areas_hotel+=`<option value="${json[i].id_area}">${json[i].nombre_de_area}</option>`;
        }

        //se inserta la informacion recibida
        areas_hotel.innerHTML=lista_areas_hotel;
        areas_hotel_delete.innerHTML=lista_areas_hotel;
 
})

}




//variable que hace referencia al boton 'btnagregar'
let btnagregararea=document.getElementById('btnagregar');

//al escuchar el evento click se ejecutara lo siguiente
btnagregararea.addEventListener('click',()=>{

    //se crea un variable en la cual se obtiene el nombre del area
    let nombre_area=document.getElementById('nom_area').value;

    //si su valor esta vacio mandara una alerta
    if(nombre_area==""){
        alert('Campo no valido')
    }else{

        //en caso contrario se crea un JSON en donde se almacena el nombre del area
        let datos_area={area_nombre:nombre_area};

        //se hace una peticion para agregar la nueva area
        fetch('https://incidencia-karmina-2.onrender.com/api/Areas_h',{
            method:'POST',
            body:JSON.stringify(datos_area),//mandamos los datos
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res=>res.json())
        .then(json=>{
            //en caso positivo se muestra un mensaje 
            alert('Se agrego una area')
            //se resetea nuestro formulario
            form.reset();
            //se llama a la funcion areas()
            areas();
        })

    }
    
    
});


//se crea esta funcion para comprobar si un area no esta en uso
//si esta en uso no se puede modificar o eliminar 
function dispo_g(area_x){
    
    //se crea un variable en donde se obtiene el area a confirmar su uso
    let area=document.getElementById(area_x).value;

    //si esta vacio, se muestra un mensaje y no permite avanzar
    if(area==""){
        alert('Seleccione un area')
        if(area_x=="areas"){
            div.innerHTML="";
        }else{
            div_delete.innerHTML="";
        }
    }else{

    //en caso contrario se hara una peticion a la ruta especifica y al area especifica
    fetch(`https://incidencia-karmina-2.onrender.com/api/Areas_h/dipo_area/${area}`,{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //si la variable es igual a "areas" la funcion se dedica a editar y si 
        //la variable es igual a "areas_delete" la funcion se dedica a eliminar

        if(area_x=="areas"){

            //si la repsuesta es mayor a 0 no se podra modificar el area
            //pues se encontro coincidencias 
            if(json[0].coincidencias>0){

                alert('No se puede modificar esta area')
                div.innerHTML=" ";
                areas();
    
            }else if(json[0].coincidencias==0){

                //en caso contrario que la respuesta es igual a 0 
                //no encontro coincidencias y por ende se puede modificar


                //creamos un variable que contiene elementos html que permitiran modificar el area seleccionada
                let valor_a_modificar=
                `
                <h1>Datos de Modificacion del Area</h1>

                <label >Nuevo nombre del area</label><br>
                <input type="text" id="nom_area_edit"><br><br>
    
                <button type="button" id="btnedit" onclick="edit_area(${area})">Editar</button>
                `;

                //insertamos en un div_edit la variable con los elementos html
                div.innerHTML=valor_a_modificar;
    
            }
           

        }else if(area_x=="areas_delete"){

            if(json[0].coincidencias>0){

                //si la repsuesta es mayor a 0 no se podra eliminar el area
                //pues se encontro coincidencias 

                alert('No se puede eliminar esta area')
                div.innerHTML=" ";
                areas();
    
            }else if(json[0].coincidencias==0){

                //en caso contrario que la respuesta es igual a 0 
                //no encontro coincidencias y por ende se puede eliminar
        
                //creamos un variable que contiene elementos html que permitiran eliminar el area seleccionada
                let valor_a_eliminar=
                `
                <button type="button" id="btndelete" onclick="delete_area(${area})">Eliminar area</button>
                `;

                //insertamos en un div_delete la variable con los elementos html
                div_delete.innerHTML=valor_a_eliminar;
    
            }

        }

        
    })

 }
    
}


//instaciamos el boton que permitira mostrar todas las areas 
let btn_show_areas=document.getElementById('btn_show_areas');

//al dar click se ejecutara las tareas definidas
btn_show_areas.addEventListener('click',()=>{

//se hace una peticion en donde se pide todas las areas a la api    
fetch('https://incidencia-karmina-2.onrender.com/api/Areas_h',{
    method:'GET',
    body:JSON.stringify(),
    headers:{
        'Content-Type':'application/json'
    }
})
.then(res=>res.json())
.then(json=>{

    //declaramos una variable que haga referencia a la tabla de html
    let tabla=document.getElementById('tabla_areas');

    //se crea una variable con elementos html que son los titulos de la tabla
    let titulos_tabla_delete=`
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre del area</th>
            </tr>
            </tehead>`;

    //variable que lamacenara los datos recibidos por la peticion fetch
    let res='';

    //ciclo for para recorrer la informacion en formato array JSON y almacenarla en la variable
    //res
    for(let i=0;i<json.length;i++){

        res+=`
        <tbody>
        <tr>
            <td>${json[i].id_area}</td>
            <td>${json[i].nombre_de_area}</td>    
        </tr>
        </tbody>
        `;
    }

    //se inserta la informacion en la tabla html
    tabla.innerHTML=`${titulos_tabla_delete} ${res}`;
})

})


areas()