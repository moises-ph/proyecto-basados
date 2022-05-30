var usr = '';
var pswrd = '';

function guardar_digit(e){
    let id = e.target.id;
    if(id == 'Usuario_login'){
        usr = e.target.value;
    }
    else if(id == 'Contraseña_login'){
        pswrd = e.target.value;
    }
}

function validar_digit(e){
    console.log('click');
    if(usr.length < 10){
        console.log('El usuario debe tener 10 digitos');
        alert('El número de documento debe tener 10 dígitos');
        e.preventDefault();
        return false;
    }
    else{
        console.log('El usuario es correcto');
        return true;
    }
}

document.getElementById('submit').addEventListener('click', validar_digit);
document.getElementById('Usuario_login').addEventListener('keyup', guardar_digit);
document.getElementById('Contraseña_login').addEventListener('keyup', guardar_digit);

/* VARIABLE ERROR Y MENSAJE SERVIDOR */

var mensaje_div = document.getElementById('mensaje');
var error_div = document.getElementById('error');

var error_var = window.error;
var mensaje_var = window.mensaje;

if(error == '' && mensaje == ''){
    mensaje_div.style.display = 'none';
    error_div.style.display = 'none';
    console.log('No hay mensaje ni error');
}
else if (error != '' && mensaje == ''){
    error_div.innerHTML = error;
    error_div.style.display = 'block';
    mensaje_div.style.display = 'none';
    alert(error);
    console.log(error);
}
else if (error == '' && mensaje != ''){
    mensaje_div.innerHTML = mensaje;
    mensaje_div.style.display = 'block';
    error_div.style.display = 'none';
    alert(mensaje);
    console.log(mensaje);
}
