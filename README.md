# RestFul API Test

## Instalación del código

- Clonar repositorio.
- Abrir el repositorio con Visual Studio Code.
- Ejecutar comando: ***npm install***, para instalar las dependencias de npm.
- Ejecutar comando: ***npm run start*** o ***npm run dev*** para ejecutar la aplicación.

## Documentación de la API:
- [Contenido y detalles de la API](#contenido-y-detalles-de-la-api)
- [Tecnologías implementadas dentro de la API](#tecnologías-implementadas-dentro-de-la-api)
- Manejo del contenido:
  - [Requests y manejo de peticiones HTTP](#requests-y-manejo-de-peticiones-http)
  - [Rutas y resultados de las peticiones HTTP](#rutas-y-resultados-de-las-peticiones-http)
- [Anexos](#anexos)
  - Deploy de la API en Heroku
  
## Desarrollo del contenido

### Contenido y detalles de la API

El proyecto consiste en el desarrollo de una RestFul API, la cual trabaja y se encarga de manejar tanto usuarios como productos.
Al ser una API de prueba, esta se presta para las necesidades de desarrolladores que se encuentran comenzando en este campo del desarrollo backend,
y de igual forma permite a aquellos que ya conocen bastante sobre el campo, utilizarla para realizar las pruebas pertinentes y verificar su funcionamiento y ejecución.

Debido a la diversidad de tecnologías, paquetes y frameworks utilizados, la API de forma general se ha desarrollado a un nivel si bien no avanzado, pero se puede considerar
que muestra cierto nivel de robustez. Esto permite que el desarrollador aprenda nuevas tecnologías y de igual forma aprenda nuevas prácticas en el campo del desarrollo back.

Al ejecutar y realizar pruebas en la API se encuentra con que es posible realizar los procesos básicos de un CRUD (Create-Read-Update-Delete) tanto de los usuarios como de los productos.
Aparte de ellos, es posible realizar pruebas de inicio de sesión, registro y recuperación de credenciales en el caso de los usuarios. Mientras que para los productos se cuenta también con
un buscador de productos, el cual permite encontrar estos mediante sus atributos principales como lo son su código o su nombre.

### Tecnologías implementadas dentro de la API

La API se desarrolló utilizando NodeJs y el framework ExpressJs. Como base de datos se optó por utilizar MongoDB y su gestor en la nube MongoDBAtlas para crear y poblar las colecciones.

A continuación se presentan algunos de los paquetes y tecnologías utilizadas en el desarrollo global de la API:

- JsonWebToken (JWT) para procesos de autenticación de los usuarios.
- Validaciones de campos utilizando paquetes de npm.
- Recuperación de contraseñas mediante el envío de correos a la cuenta del usuario que lo solicite, utilizando SendGrid como el gestor para el envío de correos.
- Paquetes npm como el caso de Faker para crear fake data y generar los seeders para poblar la base de datos.
- Visual Studio Code como IDE para el desarrollo de la API.
- Insomnia Core para realizar las pruebas y manejo de las peticiones HTTP.
- Heroku para realizar el deploy de la API y hostearla en la web.

### Requests y manejo de peticiones HTTP
  1. **Usuario.**
      - **Register User.** Request de tipo POST en la que se reciben el nombre, telefono, username, fecha de nacimiento, correo electrónico y contraseña. Cada campo cuenta con tu tipo de dato asignado y algunas consideraciones extras.
      - **Login User.** Request de tipo POST en la que se recibe el username y la contraseña del ususario ya registrado. Al iniciar sesión cada usuario recibe un token generado de autenticación.
      - **Get one User.** Request de tipo GET en la que se muestra la información de un usuario e en específico. Utilizando el token de autenticación se procede a verificar el id del usuario registrado y que ya habia iniciado sesión, y con ello se muestra su información completa de registro.
      - **Get all Users.** Request de tipo GET en la que se muestra de forma paginada el listado de usuarios registrados.
      - **Update User.** Request de tipo PUT en la que se reciben los campos que el usuario desee actualizar. Sin embargo, para ello se realizan validaciones y se vuelve a utilizar el token de autenticación para verificar la identidad y de esa manera facilitar la actualización de los datos.
      - **Delete User.** Request de tipo DELETE en la que se recibe el id del usuario y el token de autenticación en la parte del header de la petición. Si la información concuerda, el usuarioes eliminado.
      - **Recover Paswword.** Request de tipo POST en la que se recibe el correo electrónico del usuario para enviarle a esta dirección un correo con un link temporal de recuperación de contraseña. Posterior a este proceso se realizan procesos de autenticación y actualzación de la información con la nueva contraseña.
  2. **Producto.**
      - **Create Product.** Request de tipo POST en la que se reciben el SKU, nombre, cantidad, precio, descripción e imagen. Cada campo cuenta con tu tipo de dato asignado y algunas consideraciones extras. En este proceso se genera un token de autenticación para cada producto creado, esto para facilitar el manejo de algunas peticiones donde es requerido realizar verificaciones.
      - **Get one Product.** Request de tipo GET en la que se muestra la información de un producto en específico. Para ello se coloca en la parte del header de la petición el token de autenticación.
      - **Get all Products.** Request de tipo GET en la que se muestra el listado de todos los productos creados de forma paginada.
      - **Update Product.** Request de tipo PUT en la que se reciben los campos que se desean actualizar. Para este proceso se realizan validaciones y se utiliza el token de autenticación para verificar el producto.
      - **Delete Product.** Request de tipo DELETE en la que se recibe el SKU del producto y mediante verificación del token de autenticación se procede a eliminar el producto.
      - **Find Product.** Request de tipo POST en la que se reciben el SKU o el nombre del producto y este mostrará su información.
### Rutas y resultados de las peticiones HTTP
  1. **Usuario.** 
      - **Register User.** 
          > ***"http://localhost:3000/register"***
         
         > **Resultado de la petición:** Usuario registrado correctamente.
      - **Login User.** 
          > ***"http://localhost:3000/login"***
          
          > **Resultado de la petición:** Inicio de sesión correcto y token de autenticación.
      - **Get one User.** 
          > ***"http://localhost:3000/currentUser"***
          
          > **Resultado de la petición:** Información de un usuario en específico verificado mediante proceso de autenticación.
      - **Get all Users.** 
          > ***"http://localhost:3000/getUsers"***
          
          > **Resultado de la petición:** Listado paginado de todos los usuarios registrados.
      - **Update User.** 
          > ***"http://localhost:3000/update"***
          
          > **Resultado de la petición:** Usuario actualizado correctamente y verificado mediante proceso de autenticación.
      - **Delete User.** 
          > ***"http://localhost:3000/delete"***
          
          > **Resultado de la petición:** Usuario eliminado correctamente de la base de datos.
      - **Recover Paswword.**
          > ***"http://localhost:3000/recovery"***
          
          > **Resultado de la petición:** Envío satisfactorio de correo electrónico con link de recuperación de contraseña. Posterior a ello, se espera una recuperación correcta se la contraseña.
  2. **Producto.**
      - **Create Product.** 
          > ***"http://localhost:3000/createProduct"***
         
          > **Resultado de la petición:** Producto creado correctamente y con token asignado de autenticación.
      - **Get one Product.** 
          > ***"http://localhost:3000/getProduct"***
         
          > **Resultado de la petición:** Información de un producto en específico verificado mediante proceso de autenticación.
      - **Get all Products.** 
          > ***"http://localhost:3000/getallproducts"***
         
          > **Resultado de la petición:** Listado paginado de todos los productos creados.
      - **Update Product.** 
          > ***"http://localhost:3000/updateProduct"***
         
          > **Resultado de la petición:** Producto actualizado correctamente y verificado mediante proceso de autenticación.
      - **Delete Product.** 
          > ***"http://localhost:3000/deleteProd"***
         
          > **Resultado de la petición:** Producto eliminado correctamente de la base de datos.
      - **Find Product.**
          > ***"http://localhost:3000/findProduct"***
         
         > **Resultado de la petición:** Información de un producto en específico pero solicitado mediante su propia información (SKU y/o nombre de producto).
### Anexos
  - [Deploy de la API en Heroku](https://elaniin-apitest.herokuapp.com/)
