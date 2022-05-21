from pickle import TRUE
from flask import Flask, render_template, request
import pymysql

def DB_con(instruccion):
  db = pymysql.connect(host='localhost', user='root', passwd='', db='formulario')
  cur = db.cursor()
  cur.execute(instruccion)
  db.commit()
  db.close()
  return True

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
  
  query = "INSERT INTO registro(documento_identidad, nombres, apellidos, edad, genero, email, contraseña, tipo_de_usuario, tipo_de_documento) VALUES("+num_documento+", '"+nombre+"', '"+apellidos+"', "+edad+", '"+genero+"', '"+email+"', '"+password+"', '"+tipo_de_usuario+"', '"+tipo_de_documento+"')"

  state = DB_con(query)

  if state:
    return render_template('/registro/registro_true.html')
  else:
    return render_template('/registro/registro_false.html')
  





if __name__ == '__main__':
  app.run(debug=True)