const form = document.getElementById('formulario-registro');

function validacion_same(valor1, valor2){
    if(valor1 !== valor2){
        console.log('No coinciden');
        return false;
    }else{
        return true;
    }
}

form.addEventListener('submit', e => {
    console.log('Validando formulario');
    let contraseña_org = document.getElementById('contraseña_org');
    let con_contraseña = document.getElementById('confirmacion_contraseña_org');
    let email = document.getElementById('email');
    let con_email = document.getElementById('con_email');

    let EMAIL = validacion_same(email.value, con_email.value);
    let CONTRASEÑA = validacion_same(contraseña_org.value, con_contraseña.value);

    if(!EMAIL && !CONTRASEÑA){
        console.log('No coinciden (ambos)');
        e.preventDefault();
        email.setCustomValidity('Los emails no coinciden');
        con_email.setCustomValidity('Los emails no coinciden');
        contraseña_org.setCustomValidity('Las contraseñas no coinciden');
        con_contraseña.setCustomValidity('Las contraseñas no coinciden');
    }
    else if (!EMAIL){
        console.log('No coinciden (email)');
        e.preventDefault();
        email.setCustomValidity('Los emails no coinciden');
        con_email.setCustomValidity('Los emails no coinciden');
    }
    else if(!CONTRASEÑA){
        console.log('No coinciden (contraseña)');
        e.preventDefault();
        contraseña_org.setCustomValidity('Las contraseñas no coinciden');
        con_contraseña.setCustomValidity('Las contraseñas no coinciden');
    }
    else if (EMAIL && CONTRASEÑA){
        console.log('Formulario validado');
        email.setCustomValidity('');
        con_email.setCustomValidity('');
        contraseña_org.setCustomValidity('');
        con_contraseña.setCustomValidity('');
    }
});
