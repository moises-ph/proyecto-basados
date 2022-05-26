import email
from pickle import TRUE
from flask import Flask, render_template, render_template_string, request, redirect
import pymysql

def DB_con_registro(instruccion):
  db = pymysql.connect(host='localhost', user='root', passwd='mphr2015', db='registro_BD')
  cur = db.cursor()
  cur.execute(instruccion)
  db.commit()
  db.close()
  return True

def DB_con_consulta(instruccion):
  db = pymysql.connect(host='localhost', user='root', passwd='mphr2015', db='registro_BD')
  cur = db.cursor()
  cur.execute(instruccion)
  resultado = cur.fetchall()
  db.close()
  if resultado:
    return resultado
  else:
    return False

app = Flask(__name__)

@app.route('/')

def template():
  return render_template('index.html')

''' LOGIN '''

@app.route('/login', methods=['GET', 'POST'])

def login():
  if request.method == 'POST':
    documento_id = request.form.getlist('documento_id')[0]
    password = request.form.getlist('Contraseña')[0]
    print(documento_id  + " " + password)
    query = "SELECT (contraseña) FROM registro WHERE C_C = " + documento_id + ";"
    state = DB_con_consulta(query)
    
    if state[0][0] == password:
      return redirect('/dashboard')
    else:
      return render_template('/Login/login.html', error = "Usuario o contraseña incorrectos")
  
  else :
    return render_template('/Login/login.html')


'''REGISTRO'''

@app.route('/registro', methods=['GET', 'POST'])
def registro():
  state = ''
  query = ''
  if request.method == 'POST':
    tipo_de_usuario = request.form.getlist('usuario')[0] 
    tipo_de_documento = request.form.getlist('Tipo_documento')[0]
    num_documento = request.form.getlist('id')[0]
    nombre = request.form.getlist('nombre')[0]
    apellidos = request.form.getlist('Apellidos')[0]
    edad =request.form.getlist('edad')[0]
    genero =  request.form.getlist('Genero')[0]
    email =  request.form.getlist('email')[0]
    password =  request.form.getlist('password')[0]

    print(num_documento)

    query = "SELECT * FROM registro WHERE C_C = " + num_documento + ";"
    state = DB_con_consulta(query)
    print(state[0][0])
    '''Error de usuario ya registrado'''
    num_id_existe = state[0][0] 
    '''Error de consulta'''
    if num_id_existe == num_documento:
      print("ya existe")
      return render_template('/registro/registro.html', error = "Usuario ya existe")
    else :
      print("no existe")
      query = "INSERT INTO registro(C_C, nombres, apellidos, edad, genero, email, contraseña, tipo_de_usuario, tipo_de_documento) VALUES("+num_documento+", '"+nombre+"', '"+apellidos+"', "+edad+", '"+genero+"', '"+email+"', '"+password+"', '"+tipo_de_usuario+"', '"+tipo_de_documento+"')"

      state = DB_con_registro(query)

      query = "INSERT INTO datos_usuario(C_C) VALUES("+num_documento+")"

      state2 = DB_con_registro(query)

      if state == True and state2 == True:
        return render_template('/registro/registro.html', state = 'Registro exitoso')
      else:
        print(state + "\n" + state2)
        return render_template('/registro/registro.html', state = 'Error al registrar')

  else :
    return render_template('/registro/registro.html')

'''DASHBOARD'''

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
  if request.method == 'POST':

    '''Tabla Datos Basicos BD'''
    fecha_nacimiento = request.form.getlist('fechaNacimiento')[0]
    tipo_doc_id = request.form.getlist('Tipo_documento')[0]
    telefono = request.form.getlist('Telefono')[0]
    celular = request.form.getlist('celular')[0]
    direccion = request.form.getlist('Direccion')[0]
    departamento = request.form.getlist('Departamento')[0]
    ciudad = request.form.getlist('Cuidad')[0]
    estado_civil = request.form.getlist('EstadoCivil')[0]
    estrato = request.form.getlist('estrato')[0]
    ocupacion = request.form.getlist('ocupacion')[0]
    regimen_perteneciente = request.form.getlist('regimen-perteneciente')[0]
    email = request.form.getlist('email')[0]
    contraseña = request.form.getlist('contraseña')[0]

    '''Tabla Historia Clinica BD'''
    tiempo = request.form.getlist('tiempo-historial')[0]
    motivo = request.form.getlist('evento-historial-clinico')[0]
    descripcion = request.form.getlist('descripcion-historialClinico')[0]

    query = "INSERT INTO datos_usuario()"
  
  else :
    return render_template('/Dashboard/dashboard.html')




'''EJECUCION'''
if __name__ == '__main__':
  app.run(debug=True)