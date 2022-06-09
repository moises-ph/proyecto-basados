var data = document.getElementById('data').innerHTML;
const data_json = JSON.parse(data);

var password = document.getElementById('contraseña').value;
var password_confirm = document.getElementById('contraseña-con').value;
var email = document.getElementById('email').value;
var email_confirm = document.getElementById('email-con').value;

var pswrd_con = false;
var email_con = false;

const ids_data = [['nombre-lock', data_json.nombre],['apellidos-lock',data_json.apellido],['fecha-nacimiento',data_json.fecha_de_nacimiento],['edad-act', data_json.edad],['genero', data_json.genero],['tipo_id', data_json.tipo_documento],['telefono', data_json.telefono],['direccion', data_json.direccion],['departamento', data_json.departamento],['ciudad', data_json.ciudad],['estado-civil', data_json.estado_civil],['estrato', data_json.estrato],['ocupacion', data_json.ocupacion],['regimen-perteneciente', data_json.Regimen_Perteneciente],['documento-id', data_json.numerodocumento]];

ids_data.map(value => {
    if(value[1] !== 'none' && typeof value[1] == 'string'){
        document.getElementById(value[0]).value = value[1];
    }
    else if(value[1] !== 0 && typeof value[1] == 'number'){
        document.getElementById(value[0]).value = value[1];
    }
})
/*
if(data_json.fecha_de_nacimiento !== '0000-00-00'){
    document.getElementById('fecha-nacimiento').disabled = true;
}

password.addEventListener('keyup', function(){
    if(password.value !== password_confirm.value){
        password_confirm.style.borderColor = 'red';
        pswrd_con = false;
    }
    else{
        password_confirm.style.borderColor = 'green';
        pswrd_con = true;
    }
});

email.addEventListener('keyup', function(){
    if(email.value !== email_confirm.value){
        email_confirm.style.borderColor = 'red';
        email_con = false;
    }
    else{
        email_confirm.style.borderColor = 'green';
        email_con = true;
    }
})

var form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(pswrd_con && email_con){
        return true;
    }
    else{
        return false;
    }
})*/