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
							fecha_de_nacimiento varchar (50) not null,
                            constraint fk_registro_datos_usuario foreign key (num_documento) references registro(num_documento)
                            );

create table historia_clinica ( num_documento int primary key auto_increment,
								Tiempo_historial varchar(50)not null,
                                evento_historial varchar(50) not null,
                                descripcion_historial text(255) not null,
                                constraint fk_datos_usuario_historia_clinica foreign key (num_documento) references registro(num_documento));
                                
create table acciones(
					id int not null primary key auto_increment,
                    usuario varchar(40) not null,
                    documento_identificacion int not null,
                    accion varchar(100) not null,
                    fecha datetime not null default current_timestamp);
                    
insert into registro() values (2, "moises", 'pineda', 17, 'Hombre', "mois.mp8@gmail.com", '123456', 'paciente', 'T.I');
SELECT num_documento from registro where num_documento = 2;

DELIMITER //
create trigger log_registro after insert on registro
for each row begin
	insert into acciones(usuario, documento_identificacion, accion) 
    values (concat(NEW.nombres, ' ', NEW.apellidos), NEW.num_documento, "Se registró");
end //
delimiter ;

drop trigger log_registro;