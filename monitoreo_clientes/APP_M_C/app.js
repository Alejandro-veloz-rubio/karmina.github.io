let btnbuscar=document.getElementById('buscar')
let table=document.getElementById('table_info')

btnbuscar.addEventListener('click',()=>{

    let folio=document.getElementById('folio').value;
    let num_room=document.getElementById('num_room').value;

    if(folio<=0 || folio=="" || num_room<=0 || num_room==""){
        alert('Campos no validos');
        table.innerHTML="";
    }else{

        let condicion=`id_report=${folio} && numero_habitacion=${num_room}`;

        fetch(`https://incidencia-karmina-2.onrender.com/api/Reporte/Estado_reporte/${condicion}`,{
            method:'GET',
            body:JSON.stringify(),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res=>res.json())
        .then(json=>{
    
            if(json.length==0){
                alert('No hay registro verifique que su numero de folio');
                div.innerHTML="";
            }else{
    
                if(json[0].observaciones==null){
                    json[0].observaciones="- - -"
                }
        
                let res=`
                <thead>
                <tr>
                    <th colspan="2">Informacion</th>
                </tr>
                </tehead>
                <tbody>
                <tr>
                    <td>Fecha de alta</td>
                    <td>${json[0].fecha_hora_report}</td>    
                </tr>
                <tr>
                    <td>Numero habitación</td>
                    <td>${json[0].numero_habitacion}</td>    
                </tr>
                <tr>
                    <td>Observaciones</td>
                    <td>${json[0].observaciones}</td>    
                </tr>
                <tr>
                    <td>Estado</td>
                    <td> ${json[0].estado}</td>    
                </tr>
                <tr>
                    <td>Comentarios</td>
                    <td>${json[0].comentarios}</td>    
                </tr>
                </tbody>          
                `;
        
                table.innerHTML=res;
            }  
            
        })


    }


})