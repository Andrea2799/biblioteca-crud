const API = "http://localhost:3000/api/libros";
const API_XML = "http://localhost:3000/api/xml";

document.getElementById("btnAgregar").addEventListener("click", agregarLibro);
document.getElementById("btnCrud").addEventListener("click", () => mostrar("crud"));
document.getElementById("btnInforme").addEventListener("click", mostrarXML);

function mostrar(seccion) {
    document.getElementById("crudSection").style.display = seccion === "crud" ? "block" : "none";
    document.getElementById("xmlSection").style.display = seccion === "xml" ? "block" : "none";
}

async function agregarLibro() {
    const libro = {
        titulo: titulo.value,
        autor: autor.value,
        anio: anio.value,
        genero: genero.value,
        precio: precio.value
    };

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(libro)
    });

    cargarLibros();
}

async function cargarLibros() {
    const res = await fetch(API);
    const data = await res.json();

    listaLibros.innerHTML = "";

    data.forEach(l => {
        const li = document.createElement("li");
        li.innerHTML = `
            <b>${l.titulo}</b> - ${l.autor}
            <button onclick="eliminar(${l.id})">Eliminar</button>
        `;
        listaLibros.appendChild(li);
    });
}

async function eliminar(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    cargarLibros();
}

async function mostrarXML() {
    mostrar("xml");

    const res = await fetch(API_XML);
    const xml = await res.text();

    xmlOutput.textContent = xml;
}

cargarLibros();
