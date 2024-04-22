//se crea una variable en donde hace referencia a la tabla
let lista=document.getElementById('result_problem');
//esta variable guardara a los empleados del area para que sean asignados
let empleados;

let empleados_vector=[];

function empleados_open(){

    fetch('https://incidencia-karmina-2.onrender.com/api/Empleados',{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        empleados_vector=json

    })

}

//esta funcion hace una peticion para traer todas las areas de la api
function llamado_areas(){

    //se hace una peticion para obtener las areas del hotel
    fetch('https://incidencia-karmina-2.onrender.com/api/Areas_h',{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //se crea una variable que hace referencia al select
        let areas_hotel=document.getElementById('areas');

        //se crea una variable donde se guardara las areas
        let lista_areas_hotel='<option value="">*</option><option value="todos">Todas las areas</option>';


        //se ejecuta un ciclo for para recorrer la informacion obtenida por la api
        for(let i=0;i<json.length;i++){

            lista_areas_hotel+=`<option value="${json[i].id_area}">${json[i].nombre_de_area}</option>`;
        }

        //se inserta la informacion recibida en un div
        areas_hotel.innerHTML=lista_areas_hotel;
        })

}




//esta funcion busca los empleados en base al area
function buscar_reportes(){

    //esta variable obtiene el area selecionada
    let area=document.getElementById('areas').value;

    if(area=='todos'){

        fetch( `https://incidencia-karmina-2.onrender.com/api/Reporte/todos_reportes/open`,{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
        })
        .then(res=>res.json())
        .then(json=>{

            let empleados_2;

            let rest='';

            if(json.length==0){
            
                alert('Sin registros')
    
                //limpiara la variable empleados
                empleados_2="";
    
                //limpiara la variable lista que es la tabla en html
                lista.innerHTML="";
    
                llamado_areas();
    
            }else{

                
                // en caso contrario se crea una variable con elementos de una table para html
                //donde hace referencia a los titulos de cada columna
                let titulos=`
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha y hora del reporte</th>
                    <th>Numero de habitacion</th>
                    <th>Problema</th>
                    <th>Observaciones</th>
                    <th>Area</th>
                    <th>Empleado Asignado</th>
                    <th>Asignar empleado</th>
                </tr>
                </thead>
                `;
                
                
            
        
            //con un ciclo for se almacena todo lo obtenido 
            for(let i=0;i<json.length;i++){


                    if(json[i].observaciones==null){
                        json[i].observaciones="- - -";
                    }
                    //se crea una variable donde se guardara los reportes, los empleados del area para asignar a cada
                    //reporte junto con un boton de enviar

                    for(let j=0;j<empleados_vector.length;j++){

                        if(empleados_vector[j].area_h==json[i].area){

                            empleados_2+=`<option value="${empleados_vector[j].id_empleado}">${empleados_vector[j].apellido_p} ${empleados_vector[j].apellido_m} ${empleados_vector[j].nombres}</option>`;
                        }
                    }

                    rest+=`
                    <tbody>
                    <tr>
                        <td>${json[i].id_report}</td>
                        <td>${json[i].fecha_hora_report}</td>
                        <td>${json[i].numero_habitacion}</td>
                        <td>${json[i].problema}</td>
                        <td>${json[i].observaciones}</td>
                        <td>${json[i].nombre_de_area}</td>
                        <td><select id=${json[i].id_report}><option value="">*</option>${empleados_2}</select></td>
                        <td><button  onclick="Empleado_asignado(${json[i].id_report})">Enviar</button></td>
                    </tr>
                    </tbody>
                    `;
                    
                    empleados_2="";

                    //se inserta los datos en la tabla
                    lista.innerHTML=titulos+rest; 
                
                
                }

            }

            

        })
    



    }else{

    if(area==""){
        alert('Seleccione un area');
        lista.innerHTML="";
    }else{

         //se hace una peticion en donde se busca los empleados por area
    fetch(`https://incidencia-karmina-2.onrender.com/api/Empleados/${area}`,{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

        //en un ciclo for almacena los empleados encontrados
        for(let i=0;i<json.length;i++){

            empleados+=`<option value="${json[i].id_empleado}">${json[i].apellido_p} ${json[i].apellido_m} ${json[i].nombres}</option>`;
        }

    })

    //porteriomente se hace una peticion para buscar los reportes por area que esten abiertos
    fetch( `https://incidencia-karmina-2.onrender.com/api/Reporte/${area}`,{
        method:'GET',
        body:JSON.stringify(),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(json=>{

       
        //si no hay reportes mostrara un mensaje

        if(json.length==0){
            
            alert('Sin registros')

            //limpiara la variable empleados
            empleados="";

            //limpiara la variable lista que es la tabla en html
            lista.innerHTML="";

            llamado_areas();

        }else{

        
            // en caso contrario se crea una variable con elementos de una table para html
            //donde hace referencia a los titulos de cada columna
            let titulos=`
            <thead>
            <tr>
                <th>ID</th>
                <th>Fecha y hora del reporte</th>
                <th>Numero de habitacion</th>
                <th>Problema</th>
                <th>Observaciones</th>
                <th>Area</th>
                <th>Empleado Asignado</th>
                <th>Asignar empleado</th>
            </tr>
            </thead>
            `;

            //se crea una variable donde se guardara los reportes, los empleados del area para asignar a cada
            //reporte junto con un boton de enviar
            let rest='';
        
            //con un ciclo for se almacena todo lo obtenido 
            for(let i=0;i<json.length;i++){
                if(json[i].observaciones==null){
                    json[i].observaciones="- - -"
                }
                rest+=`
                <tbody>
                <tr>
                    <td>${json[i].id_report}</td>
                    <td>${json[i].fecha_hora_report}</td>
                    <td>${json[i].numero_habitacion}</td>
                    <td>${json[i].problema}</td>
                    <td>${json[i].observaciones}</td>
                    <td>${json[i].nombre_de_area}</td>
                    <td><select id=${json[i].id_report}><option value="">*</option>${empleados}</select></td>
                    <td><button  onclick="Empleado_asignado(${json[i].id_report})">Enviar</button></td>
                </tr>
                </tbody>
                `;
            }
            //se inserta los datos en la tabla
            lista.innerHTML=titulos+rest;

            //se limpia la variable empleados
            empleados=" ";
            
        }
        
 
    })


    }

}



   
}


//esta funcion permite asignar empleados
function Empleado_asignado(id_reporte){
    //se obtiene los valores para asignar a un reporte un empleado
    let reporte=id_reporte;
    let empleado=document.getElementById(id_reporte).value;
    let date = new Date();
    let options = {timeZone: 'America/Mexico_City'};
    let time = date.toLocaleString('es-MX', options);
    let estado="En proceso";

    if(empleado==""){
        alert("Seleccione un empleado")
    }else{

        //esos datos se almacenan en formato JSON
        let datos_asignacion=
        {
            id_reporte:reporte,
            id_empleado:parseInt(empleado),
            tiempo:time,
            estatus:estado
        }



        // se hace una peticion para actualizar un reporte 
        fetch('https://incidencia-karmina-2.onrender.com/api/Reporte',{
            method:'PUT',
            body:JSON.stringify(datos_asignacion),//se manda los datos JSON
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res=>res.json())
        .then(json=>{

        //al terminar se muestra un mensaje
        alert('Se actualizo un reporte')

        //se actualiza la tabla con los reportes que aun quedan
        buscar_reportes();
        })

    }
    

   
}
    

//se manda llamar a la funcion areas
llamado_areas()

empleados_open()