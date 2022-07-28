const form = document.getElementById('recovery-form');
form.addEventListener('submit', (e) => {
    let contraseña = e.target.Contraseña_login.value;
    let contraseña_con = e.target.contraseña_con.value;
    let documento_id = e.target.Usuario_login.value;
    if(contraseña != contraseña_con){
        e.preventDefault();
        alert('Las contraseñas no coinciden');
        return false;
    }
    else{
        e.preventDefault();
        fetch('/recovery',{
            method: 'POST',
            body: {
                documento_id,
                Contraseña: contraseña
            }
        }).then(res => res.json()).then(data=> alert(data.status)).catch(err => console.log(err))
        contraseña.value = '';
        contraseña_con.value = '';
        documento_id.value = '';
        return true;
    }
})