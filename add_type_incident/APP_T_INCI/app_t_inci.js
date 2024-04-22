//se crean variables que hacen referencia a los elementos divs del html y al formulario
let div_edit=document.getElementById('edit_inci');
let div_delete=document.getElementById('delete_inci');
let div_edit_inci=document.getElementById('inci_area');
let div_delete_inci=document.getElementById('inci_area_delete');
let form_inci=document.getElementById('form_inci'); 

//se crea una variable que contendra las areas del hotel
let lista_areas;


//esta funcion permite eliminar una incidencia
function delete_inci(){

//esta variable hace referencia a la incidencia seleccionada
let nom_inci=document.getElementById('tipos_inci_delete').value;

//se realiza una peticion para eliminar la incidencia en base a su nombre

    fetch(`https://incidencia-karmina-2.onrender.com/api/Incidencias/${nom_inci}`,{
        method:'DELETE',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //al terminar la peticion se muestra un mensaje
       alert('Se elimino una incidencia')

       //se limpia los div´s referenciados
       div_delete_inci.innerHTML=" ";
       div_delete.innerHTML=" ";

       
    })
    
}

//esta fucnion permite editar una incidencia por medio de un parametro
function edit_inci(id_inci){
    

    //se crean variables que guarden los valores necesarios para editar la incidencia
    let id_incidencia=id_inci;
    let nom_inci=document.getElementById('name_in_edit').value;
    let des_inci=document.getElementById('descrip_edit').value;
    let area_inci=document.getElementById('Areas_hotel_edit').value;

    if(nom_inci=="" || des_inci=="" || area_inci==""){

        alert('Campos no validos')

    }else{

        //se crea un JSON en base a esos datos guardados
        let datos_inci={
            id:id_incidencia,
            nombre:nom_inci,
            des:des_inci,
            area:parseInt(area_inci)
        }

        //se hace una peticion para editar dicha informacion guardada en un  JSON
        fetch('https://incidencia-karmina-2.onrender.com/api/Incidencias/edit_inci/',{
            method:'PUT',
            body:JSON.stringify(datos_inci),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res=>res.json())
        .then(json=>{

            //terminada la peticion se muestra un mensaje
            alert('Se edito una incidencia')

            //se limpia los div´s referenciados
            div_edit.innerHTML=" ";
            div_edit_inci.innerHTML=" ";

        })

    }

    

}


//se crea una funcion en la cual se puede buscar una incidencia en especifico en base a su nombre
function datos_incidencia(value_inci){

    //se hace una peticion para buscar la incidencia

    fetch(`https://incidencia-karmina-2.onrender.com/api/Incidencias/espec/${value_inci}`,{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{
       
        //se crea una variable con elementos html en donde se pone los valores 
        //recibidos por la api

        let edit=`
        <form>
        <h1>Datos de modificacion de una incidencia</h1>

        <label>Nombre del tipo de Incidencia</label><br>
        <input type="text" id="name_in_edit" name="name_in_edit" value="${json[0].tipo_incidencia}"><br><br>

        <label>Descripcion tipo de Incidencia</label><br>
        <textarea  id="descrip_edit" name="descrip_edit">${json[0].descripcion}</textarea><br><br>

        <label>Asignar area:</label><br>
        <select name="Areas_hotel_edit" id="Areas_hotel_edit">${lista_areas}</select><br><br>

        <button type="button" id="btn_edit_inci" onclick="edit_inci(${json[0].id_incidencia})">Editar</button>
        </form>
        `;

        //se inserta los valores y elementos html en le div referenciado
        div_edit.innerHTML=edit;
    
    
    })


}




//esta funcion mandar llamar a las areas
function areasdelhotel() {

    //se hace una peticion para mandar traer las areas disponibles
    fetch('https://incidencia-karmina-2.onrender.com/api/Areas_h',{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //se hace referencia a los selects para insertar las areas
        let selec_areas_hotel=document.getElementById('Areas_hotel')
        let selec_areas_hotel_edit=document.getElementById('Areas_hotel_edit_s')
        let selec_area_delete=document.getElementById('Areas_hotel_delete_s')

        //se crea una variable que crea la primera opcion por default
        lista_areas='<option value="">*</option>';
        
        //se recorre la informacion obtenida de la api para almacenarse
        for(let i=0;i<json.length;i++){
    
            lista_areas+=`<option value=${json[i].id_area}>${json[i].nombre_de_area}</option>`;
        }
        
        //se inserta la informacion en los div´s referenciados
        selec_areas_hotel.innerHTML=lista_areas;
        selec_areas_hotel_edit.innerHTML=lista_areas;
        selec_area_delete.innerHTML=lista_areas;
    })
        
}  


//esta funcio permite conocer si una incidencia puede modificarse o eliminarse
function buscar_dispo(nom_problem){


    //se crea una vraible dinamica que permite guardar el valor de un select de edicion o eliminacion
    let dispo=document.getElementById(nom_problem).value;

    //se hace una peticion para buscar su disponibilidad
    fetch(`https://incidencia-karmina-2.onrender.com/api/Incidencias/dispo/${dispo}`,{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //si nuestra variable no tiene el subfijo delete se usara para editar
        if(nom_problem=="tipos_inci"){

            //si encontro coincidencias mayores a 0 no se puede modificar
            if(json[0].coincidencias>0){

                alert('No se puede modificar esta incidencia');
                div_edit_inci.innerHTML=" ";
                
    
            }else if(json[0].coincidencias==0){

                //si las coincidencias es igual a 0 manda llamar a la fucnion datos
                //para editar con el parametro "dispo"
                datos_incidencia(dispo);
    
    
            }

        }else if(nom_problem=="tipos_inci_delete"){

             //si encontro coincidencias mayores a 0 no se puede eliminar
            if(json[0].coincidencias>0){

                alert('No se puede eliminar esta incidencia');
                div_delete_inci.innerHTML=" ";
                
    
            }else if(json[0].coincidencias==0){

                //si las coincidencias es igual a 0 crea un elemento html que manda llamar a una funcion
                let button_delete=`<button id="delete_inci" onclick="delete_inci()">Eliminar Incidencia</button><br><br>`

                //inserta dicho elemento en el div 
                div_delete.innerHTML=button_delete;
    
    
            }

        }
        
    })
    
}

//esta funcion permite que buscar incidencias por area de manera dinamica para el apartado de edicion o eliminacion
function buscar_inci_area(nom_incidencia,incidencia,tarea,div){

    //se crea una variable dinamica en donde se obtiene la area seleccionada
    let buscar_inci=document.getElementById(nom_incidencia).value;

    //convertimos la variable de string a int ya que es un id
    parseInt(buscar_inci);

    //si esta vacio nuestro valor mostrara un mensaje
    if(buscar_inci==""){
        alert('Seleccione un area');

        if(nom_incidencia=="Areas_hotel_delete_s"){

            div_delete.innerHTML="";
            div_delete_inci.innerHTML="";

        }else if(nom_incidencia=="Areas_hotel_edit_s"){

            div_edit.innerHTML="";
            div_edit_inci.innerHTML="";

        }
        
        
    }else{
        //en caso contrario hara una peticion donde pide las incidencias por area seleccionada
        fetch(`https://incidencia-karmina-2.onrender.com/api/Incidencias/Areas/${buscar_inci}`,{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //despues de terminar la peticion se crea una variable dianmica que hace referencia un div
        //ya sea de edicion o eliminacion para mostras las incidencias
        let div_inci_x=document.getElementById(div)

        //si nuestra repsuesta por parte de la api es 0 muestra un mensaje
        if(json.length==0){


            alert('Sin incidencias asignadas');
            
            //limpia el div referenciado
            div_inci_x.innerHTML=" ";

        }else{

            //en caso contrario se crea una variable que creara opciones para un select
            let lista_incidencias='<option value="">*</option>';

            //se recorrera la informacion a traves de un ciclo for 
            for(let i=0;i<json.length;i++){
        
                lista_incidencias+=`<option value="${json[i].tipo_incidencia}">${json[i].tipo_incidencia}</option>`;
            }

            //se crea una variable dinamica con elemntos html y su informacion dinamica 
            //en base a lo obtenido al ser invocada la funcion
            let info=
            `
            <label>Seleccione la incidencia a ${tarea}:</label><br><br>
            <select name="${incidencia}" id="${incidencia}">
            ${lista_incidencias}
            </select>

            <button type="button" id="btn_buscar_dispo_${tarea}" onclick="buscar_dispo('${incidencia}')">Buscar disposicion de ${tarea}</button><br><br></br>`;

            //se inserta los elementos creados en un div
            div_inci_x.innerHTML=info;

        }

    })
        
    }

}

//se hace referencia al boton agregar para agregar incidencias
let btnagregarINCI=document.getElementById('btnagregar');
//al escuchar el evento click hara tareas
btnagregarINCI.addEventListener('click',()=>{

    //obtendra los datos del formulario para agregar 
    let nombre_incidencia=document.getElementById('name_in').value;
    let descripcion_incidencia=document.getElementById('descrip').value;
    let area=document.getElementById('Areas_hotel').value;

    if(nombre_incidencia=="" || descripcion_incidencia=="" || area==""){

        alert('No puede haber campos vacios')
    }else{

         //los datos obtenidos se convertiran en formato JSON
        let datos_inci={
            nombre_incidencia:nombre_incidencia,
            descripcion_incidencia:descripcion_incidencia,
            area:area
        };
        
        //se hara un peticion a la api para poder agregar los datos
        fetch('https://incidencia-karmina-2.onrender.com/api/Incidencias',{
            method:'POST',
            body:JSON.stringify(datos_inci),//se mandan los datos JSON
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res=>res.json())
        .then(json=>{

            //al terminar la peticion se mandara un mensaje
            alert('Se agrego una incidencia')
            //se resetea el formulario 
            form_inci.reset();
        })

    }

   
});


//mandamos llamar a la funcion areas 
areasdelhotel();