from pickle import TRUE
from flask import Flask, render_template, request
import pymysql

def conectDB(instruccion):
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

@app.route('/registro/true', methods=['POST'])

def registro_true():
  tipo_de_usuario = "'" + request.form('Usuario') + "'"
  tipo_de_documento = "'" + request.form('Tipo_documento') + "'"
  num_documento = request.form('id')
  nombre = "'" + request.form('nombre')+ "'" 
  apellidos = "'" + request.form('Apellidos') + "'"
  edad = "'" + request.form('edad') + "'"
  genero = "'" + request.form('Genero') + "'"
  email = "'" + request.form('email') + "'"
  password = "'" + request.form('password') + "'"
  
  query = "INSERT INTO registro(documento_identidad, nombres, apellidos, edad, genero, email, contraseña, tipo_de_usuario, tipo_de_documento) VALUES("+num_documento+", "+nombre+", "+apellidos+", "+edad+", "+genero+", "+email+", "+password+", "+tipo_de_usuario+", "+tipo_de_documento+")"

  state = conectDB(query)

  if state:
    return render_template('/registro/registro_true.html')
  else:
    return render_template('/registro/registro_false.html')
  





if __name__ == '__main__':
  app.run(debug=True)