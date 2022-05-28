var email_con = '';
var email_org = '';
var password_org = '';
var password_con = '';

function guardar_email_org(email){
    console.log('email_org: ' + email.value);
    email_org = email.value;
}

function guardar_email_con(email){
    console.log('email_con: ' + email.value);
    email_con = email.value;
}

function guardar_pssword_org(password){
    console.log('password_org: ' + password.value);
    password_org = password.value;
}

function guardar_pssword_con(password){
    console.log('password_con: ' + password.value);
    password_con = password.value;
}

document.getElementById('submit').addEventListener('click', (e) => {
    console.log(e);
    console.log('click');
    e.preventDefault();
    if (email_org != email_con && password_org != password_con){
        console.log('Los datos no coinciden');
        alert('Los correos electrónicos y las contraseñas no coinciden');
        return false;
    }
    else if (email_org != email_con){
        console.log('Los correos no coinciden');
        alert('Los correos electrónicos no coinciden');
        return false;
    }
    else if (password_org != password_con){
        console.log('Las contraseñass no coinciden');
        alert('Las contraseñas no coinciden');
        return false;
    }
    else {
        document.getElementById('formulario-registro').requestSubmit();
        console.log('Los datos coinciden');
        return true;
    }
});