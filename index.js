const http = require('node:http')
const fs = require('node:fs')
const mysql = require('mysql2')
const path = require('node:path')
const { formidable } = require('formidable')

// Configuración MySQL
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'recetario'
})

conexion.connect(error => {
    if (error) console.log('Problemas de conexión con MySQL', error)
    else console.log('Conectado a MySQL (recetario)')
})

// Tipos MIME
const mime = {
    html: 'text/html; charset=utf-8',
    css: 'text/css',
    jpg: 'image/jpg',
    ico: 'image/x-icon'
};

const servidor = http.createServer((req, res) => {
    const url = new URL('http://localhost:8888' + req.url)
    let camino = 'public' + url.pathname
    if (camino === 'public/') camino = 'public/index.html'
    encaminar(req, res, camino)
})

servidor.listen(8888)
console.log('Servidor web iniciado en http://localhost:8888')

// ---------------- Enrutamiento ----------------
function encaminar(pedido, respuesta, camino) {
    switch (camino) {
        case 'public/nueva_receta.html': {
            return servirArchivo(camino, respuesta);
        }

        case 'public/editar_receta': {
            if (pedido.method === 'GET') {
                return mostrarFormularioEdicion(pedido, respuesta);
            } else {
                respuesta.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' });
                respuesta.end('<h1>Método no permitido</h1>');
            }
            break;
        }

        case 'public/borrar_receta': {
            if (pedido.method === 'GET') {
                return mostrarFormularioBorrado(pedido, respuesta);
            } else {
                respuesta.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' });
                respuesta.end('<h1>Método no permitido</h1>');
            }
            break;
        }

        case 'public/listado': {
            if (pedido.method === 'GET') {
                return listadoRecetas(pedido, respuesta);
            } else {
                respuesta.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' });
                respuesta.end('<h1>Método no permitido</h1>');
            }
            break;
        }

        case 'public/alta_receta': {
            if (pedido.method === 'POST') {
                return altaReceta(pedido, respuesta);
            } else {
                respuesta.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' });
                respuesta.end('<h1>Método no permitido</h1>');
            }
            break;
        }

        case 'public/detalle': {
            if (pedido.method === 'GET') {
                return mostrarDetalleReceta(pedido, respuesta);
            } else {
                respuesta.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' });
                respuesta.end('<h1>Método no permitido</h1>');
            }
            break;
        }

        case 'public/editar': {
            if (pedido.method === 'POST') {
                return editarReceta(pedido, respuesta);
            } else {
                respuesta.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' });
                respuesta.end('<h1>Método no permitido</h1>');
            }
            break;
        }

        case 'public/borrar': {
            if (pedido.method === 'POST') {
                return borrarReceta(pedido, respuesta);
            } else {
                respuesta.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' });
                respuesta.end('<h1>Método no permitido</h1>');
            }
            break;
        }

        default: {
            return servirArchivo(camino, respuesta);
        }
    }
}


// ---------------- Archivos estáticos ----------------
function servirArchivo(camino, res) {
    fs.stat(camino, error => {
        if (!error) {
            fs.readFile(camino, (error, contenido) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
                    res.end('Error interno')
                } else {
                    const vec = camino.split('.')
                    const extension = vec[vec.length - 1]
                    const mimearchivo = mime[extension] || 'application/octet-stream'
                    res.writeHead(200, { 'Content-Type': mimearchivo })
                    res.end(contenido)
                }
            })
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end('<h1>Recurso inexistente</h1>')
        }
    })
}
// ---------------- CRUD ----------------

function altaReceta(req, res) {
    let cuerpo = ''
    req.on('data', chunk => cuerpo += chunk.toString())
    req.on('end', () => {
        const params = new URLSearchParams(cuerpo)
        const nombre = (params.get('nombre') || '').trim()
        const ingredientes = (params.get('ingredientes') || '').trim()
        const pasos = (params.get('pasos') || '').trim()
        const tiempo_preparacion = Number(params.get('tiempo_preparacion'))
        const dificultad = (params.get('dificultad') || 'fácil').trim()

        if (!nombre || !ingredientes || !pasos || !Number.isFinite(tiempo_preparacion) || tiempo_preparacion < 0) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end('<h1>Datos inválidos</h1><p><a href="nueva_receta.html">Volver al formulario</a></p>')
            return
        }

        const registro = { nombre, ingredientes, pasos, tiempo_preparacion, dificultad }

        conexion.query('INSERT INTO recetas SET ?', registro, error => {
            if (error) {
                console.log('Error en alta:', error)
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end('<h1>Error al guardar la receta</h1><p><a href="index.html">Volver</a></p>')
                return
            }


            res.writeHead(303, { Location: '/listado' })
            res.end()
        })
    })
}

// Listado (READ)
function listadoRecetas(req, res) {
    conexion.query('SELECT * FROM recetas ORDER BY codigo DESC', (error, filas) => {
        if (error) {
            console.log('Error en el listado:', error)
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end('<h1>Error en el listado</h1><p><a href="index.html">Volver</a></p>')
            return
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Listado de recetas</title>
<link rel="stylesheet" href="css/estilo.css">
</head>
<body>
<div class="contenedor">
<header>
  <h1>Listado de recetas</h1>
</header>
<nav>
  <a href="index.html">Inicio</a>
  <a href="nueva_receta.html">Añadir receta</a>
  <a href="/listado">Listado de recetas</a>
</nav>
<div class="card">
<table class="tabla">
<thead>
<tr>
<th>Código</th>
<th>Nombre</th>
<th>Tiempo (min)</th>
<th>Dificultad</th>
<th>Editar</th>
<th>Borrar</th>
</tr>
</thead>
<tbody>
`)

        for (const fila of filas) {
            res.write(`<tr>
<td>${fila.codigo}</td>
<td>
  <a href="detalle?codigo=${fila.codigo}" class="enlace-titulo">
    ${escapeHtml(fila.nombre)}
  </a>
</td>
<td>${fila.tiempo_preparacion}</td>
<td>${escapeHtml(fila.dificultad)}</td>
<td><a href="/editar_receta?codigo=${fila.codigo}" class="boton boton-primario">Editar</a></td>
<td><a href="/borrar_receta?codigo=${fila.codigo}" class="boton boton-secundario">Borrar</a></td>
</tr>`)
        }

        if (filas.length === 0) {
            res.write('<tr><td colspan="6">No hay recetas registradas.</td></tr>')
        }

        res.write(`</tbody></table></div></div></body></html>`)
        res.end()
    })
}

function mostrarFormularioEdicion(req, res) {
    const url = new URL('http://localhost:8888' + req.url)
    const codigo = Number(url.searchParams.get('codigo'))

    if (!Number.isInteger(codigo) || codigo <= 0) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end('<h1>Código inválido</h1><p><a href="/listado">Volver al listado</a></p>')
        return
    }

    conexion.query('SELECT * FROM recetas WHERE codigo = ?', [codigo], (error, filas) => {
        if (error) {
            console.log('Error buscando receta para edición:', error)
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end('<h1>Error interno</h1><p><a href="/listado">Volver al listado</a></p>')
            return
        }

        if (filas.length === 0) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end('<h1>No existe ninguna receta con ese código.</h1><p><a href="/listado">Volver al listado</a></p>')
            return
        }

        const receta = filas[0]

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Editar receta</title>
<link rel="stylesheet" href="css/estilo.css">
</head>
<body>
<div class="contenedor">
<header>
<h1>Editar receta</h1>
<p class="subtitulo">Modifica los datos de la receta</p>
</header>

<div class="card">
<form method="post" action="/editar">
<input type="hidden" name="codigo" value="${receta.codigo}">
<div class="campo">
<label>Nombre</label>
<input type="text" name="nombre" value="${escapeHtml(receta.nombre)}" required>
</div>
<div class="campo">
<label>Ingredientes</label>
<textarea name="ingredientes" required>${escapeHtml(receta.ingredientes)}</textarea>
</div>
<div class="campo">
<label>Pasos</label>
<textarea name="pasos" required>${escapeHtml(receta.pasos)}</textarea>
</div>
<div class="campo">
<label>Tiempo (min)</label>
<input type="number" name="tiempo_preparacion" min="0" value="${receta.tiempo_preparacion}" required>
</div>
<div class="campo">
<label>Dificultad</label>
<input type="text" name="dificultad" value="${escapeHtml(receta.dificultad)}" required>
</div>
<div class="acciones-form">
<button type="submit" class="boton boton-primario">Guardar cambios</button>
<a href="/listado" class="boton boton-secundario">Cancelar</a>
</div>
</form>
</div>
</div>
</body>
</html>`)
    })
}

function editarReceta(req, res) {
    let cuerpo = ''
    req.on('data', chunk => cuerpo += chunk.toString())
    req.on('end', () => {
        const params = new URLSearchParams(cuerpo)
        const codigo = Number(params.get('codigo'))
        const nombre = (params.get('nombre') || '').trim()
        const ingredientes = (params.get('ingredientes') || '').trim()
        const pasos = (params.get('pasos') || '').trim()
        const tiempo_preparacion = Number(params.get('tiempo_preparacion'))
        const dificultad = (params.get('dificultad') || 'fácil').trim()

        if (!Number.isInteger(codigo) || codigo <= 0 || !nombre || !ingredientes || !pasos || !Number.isFinite(tiempo_preparacion)) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end('<h1>Datos inválidos</h1><p><a href="/listado">Volver</a></p>')
            return
        }

        const sql = `UPDATE recetas SET nombre=?, ingredientes=?, pasos=?, tiempo_preparacion=?, dificultad=? WHERE codigo=?`
        const datos = [nombre, ingredientes, pasos, tiempo_preparacion, dificultad, codigo]

        conexion.query(sql, datos, (error, resultado) => {
            if (error) {
                console.log('Error en edición:', error)
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end('<h1>Error al actualizar la receta</h1><p><a href="/listado">Volver</a></p>')
                return
            }

            res.writeHead(303, { Location: '/listado' })
            res.end()
        })
    })
}

function mostrarFormularioBorrado(req, res) {
    const url = new URL('http://localhost:8888' + req.url)
    const codigo = Number(url.searchParams.get('codigo'))

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Borrar receta</title>
<link rel="stylesheet" href="css/estilo.css">
</head>
<body>
<div class="contenedor">
<header>
<h1>Borrar receta</h1>
<p class="subtitulo">Elimina la receta seleccionada</p>
</header>

<div class="card">
<form method="post" action="/borrar">
<input type="hidden" name="codigo" value="${codigo}">
<p>¿Seguro que quieres borrar esta receta?</p>
<div class="acciones-form">
<button type="submit" class="boton boton-primario">Borrar</button>
<a href="/listado" class="boton boton-secundario">Cancelar</a>
</div>
</form>
</div>
</div>
</body>
</html>`)
}

function borrarReceta(req, res) {
    let cuerpo = ''
    req.on('data', chunk => cuerpo += chunk.toString())
    req.on('end', () => {
        const params = new URLSearchParams(cuerpo)
        const codigo = Number(params.get('codigo'))

        if (!Number.isInteger(codigo) || codigo <= 0) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end('<h1>Código inválido</h1><p><a href="/listado">Volver</a></p>')
            return
        }

        conexion.query('DELETE FROM recetas WHERE codigo=?', [codigo], (error, resultado) => {
            if (error) {
                console.log('Error en borrado:', error)
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end('<h1>Error al borrar la receta</h1><p><a href="/listado">Volver</a></p>')
                return
            }

            res.writeHead(303, { Location: '/listado' })
            res.end()
        })
    })
}

function escapeHtml(texto = '') {
    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}
