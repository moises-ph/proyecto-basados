const form = document.getElementById('formulario-registro');

function validar_contraseña(contraseña){
    const password = document.getElementById('contraseña_org');
    const password_con = document.getElementById('confirmacion_contraseña');
    if(password.value != password_con.value){
        password_con.setCustomValidity('Las contraseñas no coinciden');
        return false
    } else {
        password_con.setCustomValidity('');
        return true;
    }
}

form.addEventListener('submit', (e) => {
    
});
