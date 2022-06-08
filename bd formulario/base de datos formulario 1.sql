create database registro_BD;

use registro_BD;

create table registro ( R_num_documento int  primary key auto_increment not null,
								R_nombres varchar (20) not null,
                        R_apellidos varchar (20) not null,
                        R_edad int (3) not null,
                        R_genero varchar (10) not null,
                        R_email varchar (40) not null,
                        R_contraseña varchar (255) not null,
                        R_tipo_de_usuario varchar (10) not null,
                        R_tipo_de_documento varchar (50) not null);

create table datos_usuario (DU_num_documento int primary key,
							DU_telefono varchar(10),
                            DU_direccion varchar (50) not null,
                            DU_departamento varchar(50) not null,
                            DU_ciudad varchar(50) not null,
                            DU_Estado_civil varchar(40) not null,
                            DU_Estrato_economico varchar(1) not null,
                            DU_Ocupacion varchar(30) not null,
                            DU_Regimen_Perteneciente varchar(50) not null,
									 DU_fecha_de_nacimiento date not null,
                            constraint fk_registro_datos_usuario foreign key (DU_num_documento) references registro (R_num_documento)
                            );

create table acciones_registro(
							AR_id int not null primary key auto_increment,
                     AR_usuario varchar(40) not null,
                     AR_documento_identificacion int not null,
                     AR_accion varchar(100) not null,
                     AR_fecha datetime not null default current_timestamp);
                    
create table acciones_datos(
									 AD_id int not null primary key auto_increment,
                            AD_usuario varchar(40) not null,
                            AD_documento_identificacion int not null,
                            AD_accion varchar(100) not null,
                            AD_fecha datetime not null default current_timestamp);

DELIMITER //
create trigger log_registro_insert after insert on registro
for each row begin
	insert into acciones_registro(AR_usuario, AR_documento_identificacion, AR_accion) 
    values (concat(NEW.R_nombres, ' ', NEW.R_apellidos), NEW.R_num_documento, "INSERT (registro)");
end //
delimiter ;

DELIMITER //
create trigger log_registro_update after update on registro
for each row begin
	insert into acciones_registro(AR_usuario, AR_documento_identificacion, AR_accion) 
    values (concat(NEW.R_nombres, ' ', NEW.R_apellidos), NEW.R_num_documento, "UPDATE (actualizó información)");
end //
delimiter ;

DELIMITER //
create trigger log_datos after update on datos_usuario
for each row begin
	insert into acciones_datos(AD_usuario, AD_documento_identificacion, AD_accion) 
    values (concat((select r.R_nombres from registro r where r.R_num_documento = NEW.DU_num_documento), ' ', (select r.R_apellidos from registro r where r.R_num_documento = NEW.DU_num_documento)), NEW.DU_num_documento, "UPDATE (actualizó datos basicos)");
end //
delimiter ;	 

create table HU_clinico(HU_N_clinico int primary key not null auto_increment,
								HU_sitio_de_evento varchar(255) not null,
                        HU_movil varchar(10) not null,
                        HU_placa varchar(6) not null,
                        HU_fecha date not null,
                        HU_Hora_evento time not null,
                        HU_Hora_llamada time not null,
                        HU_Quien_solicita_serv varchar(100) not null,
                        HU_zona boolean not null,
                        HU_hora_llegada time not null,
                        HU_municipio varchar(255) not null,
                        HU_departamento varchar(255) not null,
                        HU_aseguradora varchar(120) not null,
                        HU_poliza_at varchar(100) not null,
                        HU_atencion_ph varchar(50) not null,
                        HU_valor int(100) not null,
                        HU_placa_de_vehiculo_ACC varchar(10) not null,
                        HU_cond_accidentado varchar(100) not NULL,
                        HU_rol_paciente VARCHAR(500) NOT NULL,
								/*Parte personal y acompañante del paciente*/
								HU_hi_nombres VARCHAR(50) NOT NULL,
                        HU_hi_apellidos VARCHAR(60) NOT NULL,
                        HU_genero VARCHAR(10) NOT NULL,
                        HU_tipo_de_documento VARCHAR(50) NOT NULL,
								HU_num_documento INT NOT NULL,
                        HU_fecha_de_nacimiento DATE NOT NULL,
                        HU_edad INT(3) NOT NULL,
                        HU_direccion_residencia VARCHAR(255) NOT NULL,
                        HU_per_municipio VARCHAR(50) NOT NULL,
                        HU_per_telefono INT(10) NOT NULL,
                        HU_ocupacion VARCHAR(255) NOT NULL,
                        HU_estado_civil VARCHAR(50) NOT NULL,
                        HU_acompañante VARCHAR(70) NOT NULL,
                        HU_parentesco VARCHAR(50) NOT NULL,
                        HU_acom_telefono INT(10) NOT NULL,
                        /* Parte del daño o anomalia en el paciente*/
                        HU_imagen VARCHAR(500) NOT NULL,
                        HU_sintomas VARCHAR(100) NOT NULL,
                        HU_alergias VARCHAR(100) NOT NULL,
                        HU_medicamentos VARCHAR(100) NOT NULL,
                        HU_patologias VARCHAR(100) NOT NULL,
                        HU_fc FLOAT(5) NOT NULL,
                        HU_sao2 FLOAT(6) NOT NULL,
                        HU_fr FLOAT(6) NOT NULL,
                        HU_t FLOAT(6) NOT NULL,
                        HU_t_a FLOAT(6) NOT NULL,
                        HU_ro FLOAT(6) NOT NULL,
                        HU_rv FLOAT(6) NOT NULL,
                        HU_rm FLOAT(6) NOT NULL,
                        HU_normoreactivas VARCHAR(255) NOT NULL,
                        HU_R_Nomoreactivas VARCHAR(100) ,
                        HU_asistencia_medica_dada VARCHAR(100) NOT NULL,
                        /*lonch VARCHAR NOT NULL, */ -- no se q es lonch investigue y no me dice q mrd es asi q asi lo dejo
								HU_evento VARCHAR(100) NOT NULL,
								HU_hora_de_entrega TIME NOT NULL,
								HU_hi_municipio VARCHAR(255) NOT NULL,
								HU_estado_de_entrega VARCHAR(255) NOT NULL,
								HU_hi_departamento VARCHAR(255) NOT NULL,
								CONSTRAINT fk_hu_clinico_registro FOREIGN KEY (HU_num_documento) REFERENCES registro(R_num_documento),
								CONSTRAINT fk_hu_clinico FOREIGN KEY (HU_N_clinico) REFERENCES HU_clinico(HU_num_documento)
						);