const form = document.getElementById('recovery-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let contraseña = e.target.Contraseña_login.value;
    let contraseña_con = e.target.contraseña_con.value;
    let documento_id = e.target.Usuario_login.value;
    if(contraseña != contraseña_con){
        alert('Las contraseñas no coinciden');
        return false;
    };
    if (documento_id == ''){
        alert('El campo de usuario esta vacio');
        return false;
    }
})