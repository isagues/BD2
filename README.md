# Couch + Pouch + Elastic

Sistema de notas estilo Notion con replica local y busqueda de texto completo.

## Autores

- [Euge Piñeiro](https://github.com/eugepineiro)
- [Pannunzio, Faustino](https://github.com/Fpannunzio)
- [Sagues, Ignacio](https://github.com/isagues)

## Desarrollo

La idea es generar un sistema de notas web que permita editar y visualizar informacion en el nevegador. La forma de modelar esta informacion es en fragmentos. Estos fragmentos se componen y referencian entre si para dar lugares a piezas de informacion mayor. Este sistema permite modularizar el contendio en pequeños bloques autocontenidos y almacenarlos y visualziarlos de la forma que se guste.

![Documento-lista](https://www.notion.so/cdn-cgi/image/f=auto,w=1920,q=100/https://images.ctfassets.net/spoqsaf9291f/3In6K0C1YjjNeOWnFgesSG/7e16eb7387df1d9dfe319871c107b8cc/blocks-2b.png)
Notion

En este caso, se tiene una lista como fragmento de informacion principal. Esta tiene su titulo y adentro tiene otros fragmentos. En este caso los fragmentos son texto pero podrian ser otras listas, una referencia a otra nota, etc.

Para poder realizar esto se elige utilizar CouchDB desde el servidor y complementarlo con PouchDB. CouchDB nos permite almacenar de forma practica los documentos y accederlas por el ID. Ademas, si se piensa en un esquema donde se trabaje en equipo, couch permite controlar los conflictos de forma nativa. Esto, junto a la modularizacion de cada piesa de informacion, permite reducir los problemas generados. Por otro lado, PouchDB permite mantener replicada la informacion de forma local en el navegador y hacer de intermediario para las comunicaciones con couchdb.

Si bien esta modularizacion es conveniente para el trabajo y edicion de la informacion, dificulta la busqueda de palabras o informacion. Si bien se puede saber donde esta cierta palabra puntual, se dificulta el acceso al documento completo, habria que realizar toda una reconstruccion. Para esto se complementa el sistema con elasticsearch. Esta base va a tener los documentos completos, sin referencias en el medio. Facilitando el acceso a los datos buscados. La diferencia con renderear un documento es que se reconstruye solo uno y no todos los posibles en la db.
