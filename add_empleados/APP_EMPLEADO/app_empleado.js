//se crean variables globales, una que permite guardar informacion y las otras hacen referencia
//a elementos div para editar y eliminar empleados
let lista;
let div_edit=document.getElementById('edit');
let div_delete=document.getElementById('delete');
//hacemos referencia al div 
let div_empleados_delete=document.getElementById('empleado_delete_div');
let div_empleados_edit=document.getElementById('empleado_edit_div');


//esta funcion elimina empleados atraves de una peticion fetch
function eliminar_empleado(){

    //se obtiene el id del empleado a aliminar
    let id_em_delete=document.getElementById('empleados_delete').value;

    //se hace la peticion de eliminacion pasando por parametro el id del empleado
    fetch(`https://incidencia-karmina-2.onrender.com/api/Empleados/${id_em_delete}`,{
        method:'DELETE',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{
        //si no hay problemas con la api se nos confirma la eliminacion del empleado
        alert('Se elimino empleado')

        //limpiamos los dos divs referenciados
        div_delete.innerHTML=" ";
        div_empleados_delete.innerHTML=" ";

    })
}


//se crea la funcion para editar empleados
function datos(id_edit_empleado){

    //obtenemos los datos de los objetos html y el id por medio de un parametro
    let id=id_edit_empleado
    let apellido_paterno=document.getElementById('apellido_p_edit').value;
    let apellido_materno=document.getElementById('apellido_m_edit').value;
    let nombres=document.getElementById('nombres_edit').value;
    let area_asignada=document.getElementById('areas_hotel_empleados_edit').value;
    let puesto=document.getElementById('puesto_edit').value;
    let num_nomina=document.getElementById('num_nomina_edit').value;

    if(apellido_paterno=="" || apellido_materno=="" || nombres=="" || area_asignada=="" || puesto=="" || num_nomina==""){

        alert('Campos no validos')
    }else{

         //todos los datos obtenidos los pasamos a formato JSON y algunos datos los convertimos de string a enteros
            let datos_empleado_edit={
                id:id,
                apellido_p:apellido_paterno,
                apellido_m:apellido_materno,
                nombres_empleado:nombres,
                num_nomina:parseInt(num_nomina),
                area_asignada:parseInt(area_asignada),
                puesto:puesto
            };

            //hacemos nuestra peticion de edicion
            fetch('https://incidencia-karmina-2.onrender.com/api/Empleados/edit',{
                method:'PUT',
                body:JSON.stringify(datos_empleado_edit),//mandamos los datos en JSON
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(res=>res.json())
            .then(json=>{

                //si no hay problema con la api se nos mostrara un mensaje
                alert('Se edito un empleado')

                //hacemos referencia al div 
                let div_empleados_edit=document.getElementById('empleado_edit_div');
                
                //se limpia los dos div referenciados
                div_empleados_edit.innerHTML=" ";
                div_edit.innerHTML=" ";
            

            })

    }

   

}


//esta funcion permite buscar las areas y insertarlas en elementos del html como son los select´s
function areas_empleados() {

    //se hace una peticion el acual se pide traer todas las areas
    fetch('https://incidencia-karmina-2.onrender.com/api/Areas_h',{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //se hace referencia a todos los select´s en donde se insertara la informacion brindada por la api
        let selec_areas=document.getElementById('areas_hotel_empleados')
        let select_areas_edit=document.getElementById('areas_edit')
        let select_areas_delete=document.getElementById('areas_delete')
        //se establece la variable que lamacenara las areas asi como una opcion vacia
        lista='<option value="">*</option>';

        //ciclo for para recorrer la infromacion obtenida del JSON
        for(let i=0;i<json.length;i++){
    
            lista+=`<option value=${json[i].id_area}>${json[i].nombre_de_area}</option>`;
        }
        
        //se inserta la informacion de las areas en los select´s
        selec_areas.innerHTML=lista;
        select_areas_edit.innerHTML=lista;
        select_areas_delete.innerHTML=lista;
    })
        
}  


//fucnion que permite traer la informacion del empleado a editar
function datos_empleado(id_em){

    //convertimos de string a int el di del empleado
    let id=parseInt(id_em);

    //hacemos una peticion en donde obtengamos al empleado por su id
    fetch(`https://incidencia-karmina-2.onrender.com/api/Empleados/edit_search/${id}`,{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //al tener respuesta de la api creamos una variable con elementos html
        //en donde tambien pondremos la infromacion del empleado para su modificacion
        //se crea un boton donde llama a un funcion que permite editar la informacion del empleado
        let edit=`
        <form>
        <h1>Datos de Modificacion de empleados</h1>

        <label >Apellido paterno:</label><br>
        <input type="text" id="apellido_p_edit" name="apellido_p_edit" value="${json[0].apellido_p}"><br><br>

        <label >Apellido materno:</label><br>
        <input type="text" id="apellido_m_edit" name="apellido_m_edit" value="${json[0].apellido_m}"><br><br>

        <label >Nombres:</label><br>
        <input type="text" id="nombres_edit" name="nombres_edit" value="${json[0].nombres}"><br><br>

        <label >Numero de nomina:</label><br>
        <input type="number" id="num_nomina_edit" name="num_nomina" value="${json[0].num_nomina}"><br><br>
        
        <label >Area a asignar:</label><br>
        <select name="areas_hotel_empleados_edit" id="areas_hotel_empleados_edit">${lista}</select><br><br>

        <label >Puesto:</label><br>
        <input type="text" id="puesto_edit" name="puesto_edit" value="${json[0].puesto}"><br><br>

        <button type="button" id="btn_edit_empleado" onclick="datos(${json[0].id_empleado})">Editar</button>
        </form>
        `;

        //insertamos en el div todo lo registrado en la variable para su visualizacion en el html
        div_edit.innerHTML=edit;


       
    })

}

//hacemos referencia al boton que permite agregar empleados
let btnagregarempleado=document.getElementById('btnagregar');
//al momento que se detecte un click se agregara un empleado
btnagregarempleado.addEventListener('click',()=>{

    //se obtendra todos los valores registrados
    //y se referenciara el formulario
    let form=document.getElementById('add_em');
    let apellido_paterno=document.getElementById('apellido_p').value;
    let apellido_materno=document.getElementById('apellido_m').value;
    let nombres=document.getElementById('nombres').value;
    let area_asignada=document.getElementById('areas_hotel_empleados').value;
    let puesto=document.getElementById('puesto').value;
    let num_nomina=document.getElementById('num_nomina').value;

    if(apellido_paterno=="" || apellido_materno=="" || nombres=="" || area_asignada=="" || puesto=="" || num_nomina==""){

        alert('Campos no validos')
    }else{

        //todos los datos obtenidos se pasan a formato JSON
        let datos_empleado={
            apellido_p:apellido_paterno,
            apellido_m:apellido_materno,
            nombres_empleado:nombres,
            num_nomina:num_nomina,
            area_asignada:area_asignada,
            puesto:puesto
        };

        //se realiza una peticion para agregar los datos dek nuevo empleado
        fetch('https://incidencia-karmina-2.onrender.com/api/Empleados',{
            method:'POST',
            body:JSON.stringify(datos_empleado),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res=>res.json())
        .then(json=>{
            //al tener una respuesta se muestra un mensaje y se resetea el formulario
            alert('Se agrego un empleado')
            form.reset();
        })


    }
    
    
});




//esta funcion permite buscar si se puede modificar o eliminar un empleado

function buscar_disponi(id_dispo){

    //obtenemos el id del empleado a identificar
    let id_em=document.getElementById(id_dispo).value;

    //si el campo esta vacio se pedira que se seleccione uno
    if(id_em==""){
        alert('Seleccione un empleado')
    }else{

        //en caso contrario se buscara si el empleado esta disponible para modificar o eliminar 
        
    fetch(`https://incidencia-karmina-2.onrender.com/api/Empleados/dipo_em/${id_em}`,{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //si el parametro obtenido de la funcion es "empleados_edit" se editara, si es "empleados_delete" se eliminara

        if(id_dispo=='empleados_edit'){

            if(json[0].coincidencias>0){
                //si hay coincidencias mayores a 0 no se podra modificar 
                //pues ya hay registros con ese empleado

                alert('No se puede modificar este empleado')
                div_edit.innerHTML=" ";
                div_empleados_edit.innerHTML=" ";
    
            }else if(json[0].coincidencias==0){

                // si hay coincidencias igual a 0 se podra modificar pues aun no han sido utilizado el empleado para un registro
                //y se llamara a la funcion con  el id del empleado como parametro
                datos_empleado(id_em);
    
    
            }

        }else if(id_dispo=='empleados_delete'){

            if(json[0].coincidencias>0){

                 //si hay coincidencias mayores a 0 no se podra eliminar
                //pues ya hay registros con ese empleado

                alert('No se puede eliminar este empleado')
                div_delete.innerHTML=" ";
                div_empleados_delete.innerHTML=" ";
    
            }else if(json[0].coincidencias==0){

                // si hay coincidencias igual a 0 se podra eliminar pues aun no han sido utilizado el empleado para un registro
                //se crea un objeto html en una variable y se inserta en un div para que se muestre y al hacer click llame a una funcion

                let button_delete=`<button id="delete_empleado" onclick="eliminar_empleado()">Eliminar empleado</button><br><br>`

                div_delete.innerHTML=button_delete;
    
    
            }

        }

        
       
    })

}

}


//esta funcion permite buscar si un empleados asi como crear objetos html

function buscar_empleados(id,empleados,tarea,div){

    //se crea una variable que almacena el area seleccionada del select
    let area=document.getElementById(id).value;

    //si la variable esta vacia mandara un mensaje
    if(area=="" && id=="areas_delete"){
        alert('Seleccione un area');
        div_delete.innerHTML=" ";
        div_empleados_delete.innerHTML=" ";
    }else if(area=="" && id=="areas_edit"){

        alert('Seleccione un area');
        div_edit.innerHTML=" ";
        div_empleados_edit.innerHTML=" ";

    }else{

    //en caso contrario que este vacia se buscara empleados del area seleccionada

    fetch(`https://incidencia-karmina-2.onrender.com/api/Empleados/${area}`,{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //al recibir respuesta se creara una variable dinamica que 
        //hara referencia al div modificar o eliminar, dependiendo del parametro obtenido.

        let div_empleados_x=document.getElementById(div)

        //si el JSON enviado por la api esta en 0 muestra un mensaje, llama a la funcion areas y limpia el div dinamico

        if(json.length==0 || json.index==0){

            alert('No se encontro empleados');

            div_empleados_x.innerHTML=" ";


        }else{


            //en caso contrario crea una opcion para select que significa nada

            let lista_empleados_hotel='<option value="">*</option>';

            //recorre el array enviado por la api para guardar todo lo recibido por la api

            for(let i=0;i<json.length;i++){

                lista_empleados_hotel+=`<option value=${json[i].id_empleado}>${json[i].apellido_p} ${json[i].apellido_m} ${json[i].nombres}</option>`;
            }

            //se crea una variable con informacion dinamica  y elementos html dinamicos que implementa id, nombre en 
            //base a parametros obtenidos
            //cuando se hace llamr la funcion
            //se agrega las opciones obtenidas de la api para los objetos creados en html

            let info=`
            <label>Seleccione al empleado a ${tarea}</label><br><br>

            <select name="${empleados}" id="${empleados}">
            ${lista_empleados_hotel}
            </select>

            <button id="btn_buscar_dispo_${tarea}" onclick="buscar_disponi('${empleados}')">Buscar disponiblidad de ${tarea}</button><br><br>`;

            //al final se inserta la informacion de los elementos html en un div
            div_empleados_x.innerHTML=info;


        }
        })
    }
}


//se manda llamar en primera instancia a la funcion areas
areas_empleados();

