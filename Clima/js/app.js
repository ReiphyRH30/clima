const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', ()=>{
    formulario.addEventListener('submit', buscarClima)
});

function buscarClima(event) {
    event.preventDefault();

    // Validar campos
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad ==='' || pais ===''){

        // Mostrar Error
        mostrarError('Campos obligatorios');
        return
    }

    // Consultar API
    consultarAPI( ciudad, pais )
}

function mostrarError(mensaje){
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta){
        // Crear alerta
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700',
        'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center')

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `
        container.appendChild(alerta);

        // Eliminar alerta

        setTimeout(() => {
            alerta.remove()
        }, 5000);
    }
}

function consultarAPI( ciudad, pais ) {
    const appId = 'cffd0ca1fce59678c6e72189c31c8165'

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner(); //Muestra Spinner de carga

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

            console.log(datos);
            // Limpiar Html previo
            limpiarHTML();

            if(datos.cod === '404'){
                mostrarError('Ciudad no encontrada');
                return;
            }

            // Imprimir la respuesta en html
            mostrarClima(datos)
        })
}



function mostrarClima(datos) {


    const { name, main:{ temp, temp_max, temp_min} } = datos;


    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML =`${centigrados} &#8451;`
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p')
    tempMaxima.innerHTML =`Max: ${max} &#8451`;
    tempMaxima.classList.add('text-xl')

    const tempMinima = document.createElement('p')
    tempMinima.innerHTML =`Min: ${min} &#8451`;
    tempMinima.classList.add('text-xl')

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white')
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv)

    formulario.reset();
}

function kelvinACentigrados(grados) {
    return Math.round(grados - 273.15)
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function Spinner() {
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML= `
    
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    
    
    `;

    resultado.appendChild(divSpinner)
}