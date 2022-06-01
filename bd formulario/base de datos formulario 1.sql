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

