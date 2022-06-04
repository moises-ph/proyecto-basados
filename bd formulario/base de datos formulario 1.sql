create database registro_BD;

use registro_BD;

create table registro ( num_documento int  primary key auto_increment not null,
								nombres varchar (20) not null,
                        apellidos varchar (20) not null,
                        edad int (3) not null,
                        genero varchar (10) not null,
                        email varchar (40) not null,
                        contraseña varchar (255) not null,
                        tipo_de_usuario varchar (10) not null,
                        tipo_de_documento varchar (50) not null);

create table datos_usuario (num_documento int primary key,
									 telefono int(10),
                            direccion varchar (50) not null,
                            departamento varchar(50) not null,
                            ciudad varchar(50) not null,
                            Estado_civil varchar(40) not null,
                            Estrato_economico int(1) not null,
                            Ocupacion varchar(30) not null,
                            Regimen_Perteneciente varchar(50) not null,
									 fecha_de_nacimiento date not null,
                            constraint fk_registro_datos_usuario foreign key (num_documento) references registro(num_documento)
                            );

create table acciones_registro(
					id int not null primary key auto_increment,
                    usuario varchar(40) not null,
                    documento_identificacion int not null,
                    accion varchar(100) not null,
                    fecha datetime not null default current_timestamp);
                    
create table acciones_datos(
							id int not null primary key auto_increment,
                            usuario varchar(40) not null,
                            documento_identificacion int not null,
                            accion varchar(100) not null,
                            fecha datetime not null default current_timestamp);

DELIMITER //
create trigger log_registro_insert after insert on registro
for each row begin
	insert into acciones_registro(usuario, documento_identificacion, accion) 
    values (concat(NEW.nombres, ' ', NEW.apellidos), NEW.num_documento, "INSERT (registro)");
end //
delimiter ;

DELIMITER //
create trigger log_registro_update after update on registro
for each row begin
	insert into acciones_registro(usuario, documento_identificacion, accion) 
    values (concat(NEW.nombres, ' ', NEW.apellidos), NEW.num_documento, "UPDATE (actualizó información)");
end //
delimiter ;

DELIMITER //
create trigger log_datos after update on datos_usuario
for each row begin
	insert into acciones_datos(usuario, documento_identificacion, accion) 
    values (concat(registro.nomrbes, ' ', registro.apellidos), NEW.num_documento, "UPDATE (actualizó datos basicos)");
end //
delimiter ;	 

create table HU_clinico(N_clinico int primary key not null auto_increment,
								sitio_de_evento varchar(255) not null,
                        movil varchar(10) not null,
                        placa varchar(6) not null,
                        fecha date not null,
                        Hora_evento time not null,
                        Hora_llamada time not null,
                        Quien_solicita_serv varchar(100) not null,
                        zona boolean not null,
                        hora_llegada time not null,
                        municipio varchar(255) not null,
                        departamento varchar(255) not null,
                        aseguradora varchar(120) not null,
                        poliza_at varchar(100) not null,
                        atencion_ph varchar(50) not null,
                        valor int(100) not null,
                        placa_de_vehiculo_ACC varchar(10) not null,
                        cond_accidentado varchar(100) not NULL,
                        rol_paciente VARCHAR(500) NOT NULL,
								/*Parte personal y acompañante del paciente*/
								hi_nombres VARCHAR(50) NOT NULL,
                        hi_apellidos VARCHAR(60) NOT NULL,
                        genero VARCHAR(10) NOT NULL,
                        tipo_de_documento VARCHAR(50) NOT NULL,
								num_documento INT NOT NULL,
                        fecha_de_nacimiento DATE NOT NULL,
                        edad INT(3) NOT NULL,
                        direccion_residencia VARCHAR(255) NOT NULL,
                        per_municipio VARCHAR(50) NOT NULL,
                        per_telefono INT(10) NOT NULL,
                        ocupacion VARCHAR(255) NOT NULL,
                        estado_civil VARCHAR(50) NOT NULL,
                        acompañante VARCHAR(70) NOT NULL,
                        parentesco VARCHAR(50) NOT NULL,
                        acom_telefono INT(10) NOT NULL,
                        /* Parte del daño o anomalia en el paciente*/
                        imagen VARCHAR(500) NOT NULL,
                        sintomas VARCHAR(100) NOT NULL,
                        alergias VARCHAR(100) NOT NULL,
                        medicamentos VARCHAR(100) NOT NULL,
                        patologias VARCHAR(100) NOT NULL,
                        fc FLOAT(5) NOT NULL,
                        sao2 FLOAT(6) NOT NULL,
                        fr FLOAT(6) NOT NULL,
                        t FLOAT(6) NOT NULL,
                        t_a FLOAT(6) NOT NULL,
                        ro FLOAT(6) NOT NULL,
                        rv FLOAT(6) NOT NULL,
                        rm FLOAT(6) NOT NULL,
                        normoreactivas VARCHAR(255) NOT NULL,
                        R_Nomoreactivas VARCHAR(100) ,
                        asistencia_medica_dada VARCHAR(100) NOT NULL,
                        /*lonch VARCHAR NOT NULL, */ -- no se q es lonch investigue y no me dice q mrd es asi q asi lo dejo
						evento VARCHAR(100) NOT NULL,
						hora_de_entrega TIME NOT NULL,
						hi_municipio VARCHAR(255) NOT NULL,
						estado_de_entrega VARCHAR(255) NOT NULL,
						hi_departamento VARCHAR(255) NOT NULL,
                        traije varchar(15) not null,
						CONSTRAINT fk_hu_clinico_registro FOREIGN KEY (num_documento) REFERENCES registro(num_documento),
						CONSTRAINT fk_hu_clinico FOREIGN KEY (N_clinico) REFERENCES hu_clinico(num_documento)
						);