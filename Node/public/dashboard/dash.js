var data = document.getElementById('data').innerHTML;
const data_json = JSON.parse(data);

const ids_data = [['nombre-lock', data_json.nombre],['apellidos-lock',data_json.apellido],['fecha-nacimiento',data_json.fecha_de_nacimiento],['edad-act', data_json.edad],['genero', data_json.genero],['tipo_id', data_json.tipo_documento],['telefono', data_json.telefono],['direccion', data_json.direccion],['departamento', data_json.departamento],['ciudad', data_json.ciudad],['estado-civil', data_json.estado_civil],['estrato', data_json.estrato],['ocupacion', data_json.ocupacion],['regimen-perteneciente', data_json.Regimen_Perteneciente],['documento-id', data_json.numerodocumento]];

ids_data.map(value => {
    if(value[1] !== 'none' && typeof value[1] == 'string'){
        document.getElementById(value[0]).value = value[1];
    }
    else if(value[1] !== 0 && typeof value[1] == 'number'){
        document.getElementById(value[0]).value = value[1];
    }
})

var form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
})