const form = document.getElementById('recovery-form');
form.addEventListener('submit', (e) => {
    console.log('POST /recovery');
    let contraseña = e.target.Contraseña_login.value;
    let contraseña_con = e.target.contraseña_con.value;
    let documento_id = e.target.Usuario_login.value;
    if(contraseña != contraseña_con){
        e.preventDefault();
        alert('Las contraseñas no coinciden');
        return false;
    }
    else{
        return true;
    }
})