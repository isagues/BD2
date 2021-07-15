# Persistencia Políglota: CouchDB + PouchDB

Sistema de Notas con replica local.  

## Autores

- [Piñeiro, Eugenia](https://github.com/eugepineiro)
- [Pannunzio, Faustino](https://github.com/Fpannunzio)
- [Sagues, Ignacio](https://github.com/isagues)

## Desarrollo

Se implementó un Sistema de Notas web que permite a los usuarios editar y visualizar informacion en el navegador. 
La forma de modelar cada nota es en documentos JSON. Estos documentos se van anidando y referencian entre si para dar lugares a piezas de informacion mayor. Este sistema permite modularizar el contendio en pequeños bloques autocontenidos y almacenarlos y visualizarlos de la forma que se guste.

Para poder realizar esto se elige utilizar CouchDB desde el servidor y complementarlo con PouchDB. CouchDB nos permite almacenar de forma practica los documentos y accederlos por el ID.
Por otro lado, PouchDB permite mantener replicada la informacion de forma local en el navegador y hacer de intermediario para las comunicaciones con CouchDB.

A su vez, se realizó un Login haciendo uso de la funcionalidad couch_peruser de CouchDB, permitiendo que cada usuario tenga su propia base de datos. 


## Guía de Uso 

### Instalar los requerimientos
```bash
npm install 
```

### Crear un usuario en CouchDB
1. Entrar a Fauxton.
2. Crear DB _users (non partitioned)
3. Ir a settings
4. Habilitar CORS (all domains)
5. couch_peruser -> (enable = true)
6. user_db_security_editable -> true
7. Insertar usuario y asignarle un rol
```json
{     
    "_id": "org.couchdb.user:username",
    "name": "username",
    "type": "user",
    "roles": ["users"],
    "password": "password" 
}
```

### Levantar la webapp
```bash
npm run serve
```
### Presentacion

[Persistencia Políglota - Couch + Pouch](https://docs.google.com/presentation/d/1HtOaiWJ0MC0-v2tDTkVshMqH-ADe914Yf9Eel9IdZ_M/edit?usp=sharing)
