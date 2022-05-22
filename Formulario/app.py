from pickle import TRUE
from flask import Flask, render_template, render_template_string, request, redirect
import pymysql

def DB_con_registro(instruccion):
  db = pymysql.connect(host='localhost', user='root', passwd='mphr2015', db='formulario')
  cur = db.cursor()
  cur.execute(instruccion)
  db.commit()
  db.close()
  return True

def DB_con_consulta(instruccion):
  db = pymysql.connect(host='localhost', user='root', passwd='mphr2015', db='formulario')
  cur = db.cursor()
  cur.execute(instruccion)
  resultado = cur.fetchall()
  db.close()
  return resultado

app = Flask(__name__)

@app.route('/')

def template():
  return render_template('index.html')

@app.route('/login')

def login():
  return render_template('/Login/login.html')

@app.route('/registro')

def registro():
  return render_template('/registro/registro.html')

@app.route('/registro_true', methods=['POST'])

def registro_true():
  print(request.form.getlist('usuario')[0])
  tipo_de_usuario = request.form.getlist('usuario')[0] 
  tipo_de_documento = request.form.getlist('Tipo_documento')[0]
  num_documento = request.form.getlist('id')[0]
  nombre = request.form.getlist('nombre')[0]
  apellidos = request.form.getlist('Apellidos')[0]
  edad =request.form.getlist('edad')[0]
  genero =  request.form.getlist('Genero')[0]
  email =  request.form.getlist('email')[0]
  password =  request.form.getlist('password')[0]
  
  query = "INSERT INTO registro(id, nombres, apellidos, edad, genero, email, contraseña, tipo_de_usuario, tipo_de_documento) VALUES("+num_documento+", '"+nombre+"', '"+apellidos+"', "+edad+", '"+genero+"', '"+email+"', '"+password+"', '"+tipo_de_usuario+"', '"+tipo_de_documento+"')"

  state = DB_con_registro(query)

  if state:
    return redirect('/login')
  else:
    return render_template('/registro/registro.html', error = 'Error al registrar')
  
@app.route('/login_true', methods=['POST'])
def login_true():
  usuario = request.form.getlist('usuario')[0]
  password = request.form.getlist('Contraseña')[0]
  print(usuario + " " + password)
  query = "SELECT (contraseña) FROM registro WHERE nombres = '" + usuario + "';"
  state = DB_con_consulta(query)
  
  if state[0][0] == password:
    return redirect('/dashboard')
  else:
    return render_template('/Login/login.html', error = "Usuario o contraseña incorrectos")






if __name__ == '__main__':
  app.run(debug=True)