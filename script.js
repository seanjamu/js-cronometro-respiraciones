document.addEventListener("DOMContentLoaded", () => {
	const $tiempoTranscurrido = document.querySelector("#tiempoTranscurrido"),
		$btnIniciar = document.querySelector("#btnIniciar"),
		$btnPausar = document.querySelector("#btnPausar"),
		$btnMarca = document.querySelector("#btnMarca"),
		$btnDetener = document.querySelector("#btnDetener"),
		$zonaTactil = document.querySelector("#zonaTactil"),
		$sonidoRespiraciones = document.querySelector("#respiraciones"),
		$sonidoCampana = document.querySelector("#campana"),
		$sonidoAgua = document.querySelector("#agua"),
		$sonidoIvanDonalson = document.querySelector("#ivanDonalson"),
		$contenedorMarcas = document.querySelector("#contenedorMarcas");
	let marcas = [],
		idInterval,
		tiempoInicio = null;
	let diferenciaTemporal = 0;

	const ocultarElemento = elemento => {
		elemento.style.display = "none";
	}

	const mostrarElemento = elemento => {
		elemento.style.display = "";
	}

	const agregarCeroSiEsNecesario = valor => {
		if (valor < 10) {
			return "0" + valor;
		} else {
			return "" + valor;
		}
	}

	const milisegundosAMinutosYSegundos = (milisegundos) => {
		const minutos = parseInt(milisegundos / 1000 / 60);
		milisegundos -= minutos * 60 * 1000;
		segundos = (milisegundos / 1000);
		return `${agregarCeroSiEsNecesario(minutos)}:${agregarCeroSiEsNecesario(segundos.toFixed(1))}`;
	};


	const iniciar = () => {
		const ahora = new Date();
		tiempoInicio = new Date(ahora.getTime() - diferenciaTemporal);
		clearInterval(idInterval);
		idInterval = setInterval(refrescarTiempo, 100);
		ocultarElemento($btnIniciar);
		ocultarElemento($btnDetener);
		//mostrarElemento($btnMarca);
		mostrarElemento($btnPausar);
		$sonidoRespiraciones.play();
	};
	const pausar = () => {
		$sonidoRespiraciones.pause();
		diferenciaTemporal = new Date() - tiempoInicio.getTime();
		clearInterval(idInterval);
		mostrarElemento($btnIniciar);
		ocultarElemento($btnMarca);
		ocultarElemento($btnPausar);
		mostrarElemento($btnDetener);
	};
	const refrescarTiempo = () => {
		const ahora = new Date();
		const diferencia = ahora.getTime() - tiempoInicio.getTime();
		$tiempoTranscurrido.textContent = milisegundosAMinutosYSegundos(diferencia);
	};
	const ponerMarca = () => {
		marcas.unshift(new Date() - tiempoInicio.getTime());
		dibujarMarcas();
	};
	const dibujarMarcas = () => {
		$contenedorMarcas.innerHTML = "";
		for (const [indice, marca] of marcas.entries()) {
			const $p = document.createElement("p");
			let diferencia = marcas[indice] - marcas[indice + 1];
			let segundosDiferencia = (marcas.length - indice) > 1 ? milisegundosAMinutosYSegundos(diferencia) : 0;
			$p.innerHTML = `<strong class="is-size-4">${marcas.length - indice}.</strong> ${milisegundosAMinutosYSegundos(marca) + '(' + segundosDiferencia + ')'}`;
			$p.classList.add("is-size-3");
			$contenedorMarcas.append($p);
		}
	};

	const detener = () => {
		if (!confirm("¿Detener?")) {
			return;
		}
		$sonidoRespiraciones.pause();
		$sonidoRespiraciones.currentTime = 0;
		clearInterval(idInterval);
		init();
		marcas = [];
		dibujarMarcas();
		diferenciaTemporal = 0;
	}

	const init = () => {
		$tiempoTranscurrido.textContent = "00:00.0";
		ocultarElemento($btnPausar);
		ocultarElemento($btnMarca);
		ocultarElemento($btnDetener);
	};

	const tocar = (event) => {
		//Comprobamos si hay varios eventos del mismo tipo
		//comprobamos que ya esxte corriendo el cronometro
		if ($tiempoTranscurrido.textContent != "00:00.0") {
			if (event.targetTouches.length == 1) {
				ponerMarca();
				//en la marca 1-4-7-10 reproduzco el audio de las 30 respiraciones
				//0-3-6-9
				//-30respi
				//-aguante
				//-recuper 15secs
				if ((marcas.length) % 3 == 0
				) {
					$sonidoRespiraciones.play();
				} else {
					$sonidoRespiraciones.pause();
					$sonidoRespiraciones.currentTime = 0

					//si es recuperacion de 15 segundos cuento los 15 y reproduzco el sonido de campana
					if (marcas.length != 1 && (marcas.length + 1) % 3 == 0) {
						let intervaloCampana = setInterval(function () {
							ponerMarca();
							$sonidoCampana.play();
							$sonidoRespiraciones.play();
							clearInterval(intervaloCampana);
						}, 15000);
					}
				}
			}
		}
	};



	init();

	$btnIniciar.onclick = iniciar;
	$btnMarca.onclick = ponerMarca;
	$btnPausar.onclick = pausar;
	$btnDetener.onclick = detener;
	$zonaTactil.ontouchstart = tocar;

	$sonidoAgua.volume = 0.3;
	$sonidoIvanDonalson.volume = 0.3;
});