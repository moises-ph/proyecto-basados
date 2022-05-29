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