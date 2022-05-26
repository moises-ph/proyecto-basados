const form = document.getElementById('formulario-registro');

function validacion_same(valor1, valor2){
    if(valor1 != valor2){
        return false;
    }else{
        return true;
    }
}

form.addEventListener('submit', e => {
    const contraseña_org = document.getElementById('contraseña_org');
    const con_contraseña = document.getElementById('confirmacion_contraseña_org');
    const email = document.getElementById('email');
    const con_email = document.getElementById('con_email');

    const EMAIL = validacion_same(email.value, con_email.value);
    const CONTRASEÑA = validacion_same(contraseña_org.value, con_contraseña.value);

    if(!EMAIL && !CONTRASEÑA){
        e.preventDefault();
        email.setCustomValidity('Los emails no coinciden');
        con_email.setCustomValidity('Los emails no coinciden');
        contraseña_org.setCustomValidity('Las contraseñas no coinciden');
        con_contraseña.setCustomValidity('Las contraseñas no coinciden');
    }
    else{
        email.setCustomValidity('');
        con_email.setCustomValidity('');
        contraseña_org.setCustomValidity('');
        con_contraseña.setCustomValidity('');
    }
});
