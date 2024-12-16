<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Para levantar este proyecto de manera local siga las instrucciones

- 1. Descargue e instale Node en su versión LTS > 20.x.x
- 2. En el directorio del proyecto ejecute 'npm install'
- 3. Cree un archivo .env en el root del directorio con las claves y valores de .env.template.local:
- 4. En el directorio del proyecto ejecute: 'docker compose up -d' para iniciar la base de datos propia de este microservicio en un contenedor docker.
- 5. En el directorio del proyecto ejecute 'npm run start'

## Endpoints

### Login

- **URL**: `POST localhost:3000/auth/login`
- **Descripción**: Inicia Sesión al sistema como 'student'
- **Cuerpo**:
  ```json
  {
    "email": "correo electronico del usuario",
    "password": "contraseña del usuario"
  }
  ```
  **Respuesta**:
  ```json
  {
    "token": "jwt token del usuario firmado por el sistema"
  }
  ```

### Logout

- **URL**: `POST localhost:3000/auth/logout`
- **Descripción**: Cierra sesíon en el sistema, requiere de un JWT token generado por el sistema previamente (Debe haber iniciado sesión, requiere JWT bearer token en el header).
- **Cuerpo**: No requiere cuerpo, pero si el jwt bearer token en el header
  **Respuesta**:
  ```json
  {
    "message": "The token is now blacklisted"
  }
  ```

### Register

- **URL**: `POST localhost:3000/auth/register`
- **Descripción**: Crea un usuario con el rol de 'student'
- **Cuerpo**:
  ```json
  {
    "name": "Nombre del usuario",
    "firstLastName": "Primer apellido del usuario",
    "secondLastName": "Segundo apellido del usuario",
    "rut": "Rut del usuario",
    "email": "Correo electronico del usuario",
    "carerId": "Id de la carrera a la que pertenece el usuario",
    "password": "Contraseña del usuario",
    "repeatedPassword": "Contraseña repetida para verificacion del usuario"
  }
  ```
  **Respuesta**:
  ```json
  {
    "name": "Nombre del usuario",
    "firstLastName": "Primer apellido del usuario",
    "secondLastName": "Segundo apellido del usuario",
    "rut": "Rut del usuario",
    "email": "Correo electronico del usuario",
    "carerId": "Id de la carrera a la que pertenece el usuario",
    "hashedPassword": "Contraseña hasheada con Bcrypt salt de valor 12",
    "Role": "Rol del usuario en el sistema"
  }
  ```

### Validate Token

- **URL**: `POST localhost:3000/auth/validate`
- **Descripción**: verifica que el token no este revocado (que no se encuentre en la blacklist) entrega un boolean (true si es valudo su uso, y falso si ya esta presente en la blacklist)
- **Cuerpo**:
  ```json
  {
    "token": "Cadena string del JWT"
  }
  ```
  **Respuesta**:
  ```json
  {
    "isValid": true
  }
  ```

### Update Profile

- **URL**: `PUT localhost:3000/user/update-profile`
- **Descripción**: Actualiza el nombre o el primer apellido o el segundo apellido (Debe haber iniciado sesión, requiere JWT bearer token en el header)
- **Cuerpo**:
  ```json
  {
    "name": "Nombre del usuario",
    "firstLastName": "Primer apellido del usuario",
    "secondLastName": "Segundo apellido del usuario"
  }
  ```
  **Respuesta**:
  ```json
  {
    "name": "Nombre del usuario (actualizado)",
    "firstLastName": "Primer apellido del usuario (actulizado)",
    "secondLastName": "Segundo apellido del usuario (actualizado)",
    "rut": "Rut del usuario",
    "email": "Correo electronico del usuario",
    "career": {
        "career_id": "Id de la carrera a la que pertenece el usuario",
        "name": "Nombre de la carrera a la que pertenece el usuario"
    }
    "hashedPassword": "Contraseña hasheada con Bcrypt salt de valor 12",
    "Role": "Rol del usuario en el sistema"
  }
  ```

### Update Password

- **URL**: `PUT localhost:3000/auth/update-password`
- **Descripción**: Actualiza la contraseña del usuario (Debe haber iniciado sesión, requiere JWT bearer token en el header)
- **Cuerpo**:
  ```json
  {
    "currentPassword": "Contraseña actual",
    "password": "Nueva contraseña",
    "repeatedPassword": "Nueva contraseña repetida para proceso de verificación"
  }
  ```
  **Respuesta**:
  ```json
  {
    "name": "Nombre del usuario",
    "firstLastName": "Primer apellido del usuario",
    "secondLastName": "Segundo apellido del usuario",
    "rut": "Rut del usuario",
    "email": "Correo electronico del usuario",
    "carerId": "Id de la carrera a la que pertenece el usuario",
    "hashedPassword": "Contraseña hasheada con Bcrypt salt de valor 12 (actualizada)",
    "Role": "Rol del usuario en el sistema"
  }
  ```

## RABBIT MQ

- **Queue**: 'events_queue'
- **Rabbitmq URL**: localhost:5672

### Queue Update Profile

Para el evento de actualizar el perfil del usuario se deben cumplir los siguientes requisitos:

- Se debe publicar el mensaje en la Queue descrita anteriormente.
- El mensaje debe tener titulo de 'update_profile' que son los eventos que escucha este microservicio para hacer trigger el evento
- Lo que se debe enviar como mensaje es la siguiente data:
  **Data**:
  ```json
  {
    "name": "Nombre nuevo del usuario", **OPCIONAL**
    "firstLastName": "Apellido paterno nuevo del usuario", **OPCIONAL**
    "secondLastName": "Apellido materno nuevo del usuario", **OPCIONAL**
    "email": "Correo del usuario" **REQUERIDO**
  }
  ```
