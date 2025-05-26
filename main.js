const article = document.querySelector("article");
const anterior = document.getElementById("anterior");
const siguiente = document.getElementById("siguiente");
const numeroPagina = document.getElementById("numeroPagina");
const tamaño = 10;
const pagina = 2;

let currentPage = 1;
const PageSize = 10;

const contenedor = document.querySelector("div");
contenedor.classList.add("contenedor");

//Consumo de api con fetch

const consultar = async (pagina) => 
{
    const apiKey = "key=6a36143df3bf4147a71e05e2acddfe5f";
    const response = await fetch(`https://api.rawg.io/api/games?page_size=${tamaño}&page=${pagina}&${apiKey}`);
    const data = await response.json();
    console.log(data);
    return data;
}


//Llamamos la funcion consultar y creamos paginas

async function cargarPagina(pagina){
    article.innerHTML = "";
    const data = await consultar(pagina);
    data.results.forEach(result => 
        {
            var plataformas = result.platforms.map(platform => platform.platform.name)

            var tiendas = result.stores.map(store => {
                return {
                    nombreTienda : store.store.name, 
                    //Se le pone https para que envie bien
                    dominioTienda: `https://${store.store.domain}`
                };
            })

            agregarCarta(result.name, result.released, result.updated, result.background_image, plataformas, tiendas);

        });
        numeroPagina.innerText = `Pagina ${pagina}`;

        anterior.disabled = pagina ===1;
        siguiente.disabled = !data.next;
}


//Agregar datos de result a una carta para añadirlos al article

const agregarCarta = (nombre, salida, updated, imagenUrl, plataformas, tiendas) => {
    

    const card = document.createElement("div");
    card.className = "card";
    
    const imagen = document.createElement("img");
    imagen.src = `${imagenUrl}`;
    imagen.alt = nombre;
    
    const titulo = document.createElement("h2");
    titulo.innerText = nombre;
    
    const fechaSalida = document.createElement("p");
    fechaSalida.innerText = `Lanzado el: ${salida}`;

    const actualizado =  document.createElement("p");
    actualizado.innerText = `Ultima actualización: ${updated}`;

    const listaPlataformas = document.createElement("p");
    listaPlataformas.innerText = `Lista de plataformas: ${plataformas}`;

    const listaTiendas = document.createElement("p");
    listaTiendas.innerText = "Tiendas: ";

    tiendas.forEach(tienda => 
        {
            const linkPlataforma = document.createElement("a");
            linkPlataforma.href = tienda.dominioTienda;
            linkPlataforma.innerText = tienda.nombreTienda;
            linkPlataforma.target = "_blank";
            listaTiendas.appendChild(linkPlataforma);
        })
    

    
    card.appendChild(imagen);
    card.appendChild(titulo);
    card.appendChild(fechaSalida);
    card.appendChild(actualizado);
    card.appendChild(listaPlataformas);
    card.appendChild(listaTiendas);
    article.appendChild(card);
}


//Eventos de los botones :D

anterior.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
    cargarPagina(currentPage);
    }
});

siguiente.addEventListener("click", () => {
    if (currentPage < 3 ){
    currentPage++;
    cargarPagina(currentPage);
    }
});

cargarPagina(currentPage);