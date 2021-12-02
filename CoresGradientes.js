function CoresGradientes(tipo, parametros) {
	var gradiente;

	if (!tipo) {
		tipo = "faixaCores";
	}
	function mdc(o){
		if(!o.length)
			return 0;
		for(var r, a, i = o.length - 1, b = o[i]; i;)
			for(a = o[--i]; r = a % b; a = b, b = r);
		return b;
	};

	function makeColorGradient(frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, len) {
		gradiente = [];
		if (center == undefined)   center = 128;
		if (width == undefined)    width = 127;
		if (len == undefined || Number.isNaN(len)) {
			var a = [Math.round(frequency1 * 100), Math.round(frequency2 * 100), Math.round(frequency3 * 100)];
			var valor = mdc(a)/100;
			len = Math.round(2 * Math.PI / valor);
		}
		
		for (var i = 0; i < len; ++i) {
			var red = Math.round(Math.sin(frequency1*i + phase1) * width + center);
			var grn = Math.round(Math.sin(frequency2*i + phase2) * width + center);
			var blu = Math.round(Math.sin(frequency3*i + phase3) * width + center);
			gradiente.push([red, grn, blu, 255]);
		}
		return gradiente;
	}
	function RGBToHSL(rgb) {
		// make r, g, and b fractions of 1
		let r = rgb[0] / 255,
			g = rgb[1] / 255,
			b = rgb[2] / 255,
		// find greatest and smallest channel values
			cmin = Math.min(r,g,b),
			cmax = Math.max(r,g,b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;
		// calculate hue
		// no difference
		if (delta == 0)
			h = 0;
		// red is max
		else if (cmax == r)
			h = ((g - b) / delta) % 6;
		// green is max
		else if (cmax == g)
			h = (b - r) / delta + 2;
		// blue is max
		else
			h = (r - g) / delta + 4;
		h = Math.round(h * 60);
		// make negative hues positive behind 360°
		if (h < 0)
			h += 360;
		// calculate lightness
		l = (cmax + cmin) / 2;
		// calculate saturation
		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		// multiply l and s by 100
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
		return [h, s, l];
	}
	function HSLToRGB(hsl) {
		let h = hsl[0],
			s = hsl[1] / 100,
			l = hsl[2] / 100;
		if (h >= 360)
			h %= 360;
		let c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs((h / 60) % 2 - 1)),
			m = l - c/2,
			r = 0,
			g = 0,
			b = 0;
		if (0 <= h && h < 60) {
			r = c; g = x; b = 0;
		} else if (60 <= h && h < 120) {
			r = x; g = c; b = 0;
		} else if (120 <= h && h < 180) {
			r = 0; g = c; b = x;
		} else if (180 <= h && h < 240) {
			r = 0; g = x; b = c;
		} else if (240 <= h && h < 300) {
			r = x; g = 0; b = c;
		} else if (300 <= h && h < 360) {
			r = c; g = 0; b = x;
		}
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);

		return [r, g, b, hsl[3]];
	}

	function gradienteHSL_L(hue, saturation, qtd, invertido, start) {
		gradiente = [];
		if (!start) {
			start = 0;
		}
		var fator = 100 / qtd;
		var lightness = 1;
		if (invertido) {
			for (var i = start; lightness <= 100; i++) {
				lightness = i * fator;
				//console.log("hsl: " + [hue, saturation, lightness]);
				gradiente.push(HSLToRGB([hue, saturation, lightness, 255]));
			}
			for (var i = start + 1; lightness >= 0; i++) {
				var lightness = 100 - i * fator;
				gradiente.push(HSLToRGB([hue, saturation, lightness, 255]));
			}
		} else {
			for (var i = start;  lightness >= 0; i++) {
				var lightness = 100 - i * fator;
				gradiente.push(HSLToRGB([hue, saturation, lightness, 255]));
			}
			for (var i = start + 1; lightness <= 100; i++) {
				var lightness = i * fator;
				gradiente.push(HSLToRGB([hue, saturation, lightness, 255]));
			}
		}
		return gradiente;
	}

	function gradienteHSL_H(saturation, lightness, start, fator) {
		gradiente = [];
		if (!start) {
			start = 0;
		}
		if (!fator) {
			fator = 1;
		}
		for (hue = 0; hue < 360; hue+=1*fator) {
			gradiente.push(HSLToRGB([hue + start, saturation, lightness, 255]));
		}
		return gradiente;
	}

	function getRGB(r, g, b, fator, offset, reinicia, invertido, qtd) {
		var tom = qtd * fator;
		tom += offset;

		if (reinicia) {
			r = (tom + r) % 256;
			g = (tom + g) % 256;
			b = (tom + b) % 256;
		} else {
			r = (tom + r);
			g = (tom + g);
			b = (tom + b);
		}
		if (invertido) {
			r = 255 - r;
			g = 255 - g;
			b = 255 - b;
		}
		return [r, g, b, 255];
	}

	if (tipo.startsWith("tipoCores=")) {
		var ps = tipo.split("&");
		if (ps[0]) {
			tipo = ps[0].split("=")[1];
		}
		if (ps[1]) {
			parametros = ps[1].split("=")[1];
		}
	}
	var p;
	if (parametros) {
		p = parametros.split(",");
	}
	this.getConfiguracao = function() {
		var saida = "tipoCores=" + tipo;
		if (parametros) {
			saida += "&parametrosCores=" + parametros;
		}
		return saida;
	}
	this.getTamanho = function() {
		if (gradiente) {
			return gradiente.length;
		}
	}
	this.get = function(posicao) {
		if (gradiente) {
			if (posicao == 0) {
				return [0, 0, 0, 255];
			} else {
				return gradiente[posicao % gradiente.length];
			}
		}
	}
	if (tipo == "faixaCores") {
		gradiente = [];
		var arrayCores = ["[0,0,0]", "[255,255,255]"];
		if (parametros) {
			arrayCores = parametros.match(/\[(.*?)\]/g);
		}
		for (var i = 0; i < arrayCores.length; i++) {
			var cor = arrayCores[i].replace(/(^.*\[|\].*$)/g, "").split(",");
			gradiente.push([parseInt(cor[0]), parseInt(cor[1]), parseInt(cor[2]), 255]);
		}
	} else if (tipo == "makeColorGradient") {
		gradiente = makeColorGradient(parseFloat(p[0]), parseFloat(p[1]), parseFloat(p[2]), parseFloat(p[3]), parseFloat(p[4]), parseFloat(p[5]), parseInt(p[6]), parseInt(p[7]), parseInt(p[8]));
	} else if (tipo == "gradienteHSL_L") {
		var inverte = false;
		if (p[3]) {
			inverte = (p[3].trim() == "true");
		}
		gradiente = gradienteHSL_L(parseInt(p[0]), parseInt(p[1]), parseInt(p[2]), inverte);
	} else if (tipo == "gradienteHSL_H") {
		gradiente = gradienteHSL_H(parseInt(p[0]), parseInt(p[1]), parseInt(p[2]), parseFloat(p[3]));
	} else if (tipo == "getRGB") {
		var r = parseInt(p[0]);
		var g = parseInt(p[1]);
		var b = parseInt(p[2]);
		var fator = parseFloat(p[3]);
		var offset = parseInt(p[4]);
		var invertido = false;
		var reinicia = false;
		if (p[5]) {
			reinicia = (p[5].trim() == "true");
		}
		var invertido = false;
		if (p[6]) {
			invertido = (p[6].trim() == "true");
		}
		this.get = function(posicao) {
			if (posicao == 0) {
				return [0, 0, 0, 255];
			} else {
				return getRGB(r, g, b, fator, offset, reinicia, invertido, posicao);
			}
		}
		this.getTamanho = function() {
			return Math.round(400 / fator);
		}
	}
	
	this.colorirPontos = function(canvas, processamento) {
		if (processamento.length > 0) {
			var largura = processamento.length;
			var altura = processamento[0].length;
			var context = canvas.getContext("2d");
			const bufferCanvas = context.createImageData(largura, altura);
			for (var i = 0; i < largura; i++) {
				for (var j = 0; j < altura; j++) {
					var qtd = processamento[i][j];
					var cor = this.get(qtd);
					var indice = (j * largura + i) * 4;
					bufferCanvas.data[indice + 0] = cor[0];
					bufferCanvas.data[indice + 1] = cor[1];
					bufferCanvas.data[indice + 2] = cor[2];
					bufferCanvas.data[indice + 3] = cor[3];
				}
			}
			context.putImageData(bufferCanvas, 0, 0);
		}
	}
}

CoresGradientes.processar = function(tipo) {
	var ed = document.getElementById("parametros_" + tipo);
	var cores = new CoresGradientes(tipo, ed.value);

	var paletaCores = document.getElementById("paletaCores");
	var context = paletaCores.getContext("2d");
	const buffer = context.createImageData(1000, 50);
	const largura = Math.trunc(1000 / cores.getTamanho());
	for (var i=0; i < cores.getTamanho(); i++) {
		var cor = cores.get(i);
		for (var j=0; j < 50; j++) {
			for (var k=0; k < largura; k++) {
				var indice = (j*1000 + i*largura + k) * 4;
				buffer.data[indice + 0] = cor[0];
				buffer.data[indice + 1] = cor[1];
				buffer.data[indice + 2] = cor[2];
				buffer.data[indice + 3] = cor[3];
			}
		}
	}
	paletaCores.style.display = "";
	context.putImageData(buffer, 0, 0);
	if (CoresGradientes.fn_processamento) {
		CoresGradientes.fn_processamento(cores);
	}
}

CoresGradientes.criarComponente = function(elemento, f) {
	CoresGradientes.fn_processamento = f;
	elemento.innerHTML = '\
		<input type="radio" name="tipoCores" value="faixaCores">Faixa de cores<br>\
		<fieldset style="display:none">\
			<legend>Parâmetros</legend>\
			<input id="parametros_faixaCores" type="text" size="50" title="cor1, cor2, cor3, cor4, cor5, ...">\
			<button onclick="CoresGradientes.processar(\'faixaCores\')">ok</button><br/>\
		</fieldset>\
		<input type="radio" name="tipoCores" value="makeColorGradient">Gradiente senoidal<br>\
		<fieldset style="display:none">\
			<legend>Parâmetros</legend>\
			<input id="parametros_makeColorGradient" type="text" size="50" title="frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, len"><button onclick="CoresGradientes.processar(\'makeColorGradient\')">ok</button><br/>\
		</fieldset>\
		<input type="radio" name="tipoCores" value="gradienteHSL_L">Gradiente de luminosidade<br>\
		<fieldset style="display:none">\
			<legend>Parâmetros</legend>\
			<input id="parametros_gradienteHSL_L" type="text" size="50" title="hue, saturation, qtd, invertido"><button onclick="CoresGradientes.processar(\'gradienteHSL_L\')">ok</button><br/>\
		</fieldset>\
		<input type="radio" name="tipoCores" value="gradienteHSL_H">Gradiente colorido<br>\
		<fieldset style="display:none">\
			<legend>Parâmetros</legend>\
			<input id="parametros_gradienteHSL_H" type="text" size="50" title="saturation, lightness, start, fator"><button onclick="CoresGradientes.processar(\'gradienteHSL_H\')">ok</button><br/>\
		</fieldset>\
		<input type="radio" name="tipoCores" value="getRGB">Gradiente RGB<br>\
		<fieldset style="display:none">\
			<legend>Parâmetros</legend>\
			<input id="parametros_getRGB" type="text" size="50" title="r, g, b, fator, offset, reinicia, invertido"><button onclick="CoresGradientes.processar(\'getRGB\')">ok</button><br/>\
		</fieldset>\
		<canvas id="paletaCores" width="1000" height="50" style="border:1px solid #000000;display:none"></canvas>';		
		
	var radios = document.getElementsByName("tipoCores");
	radios.forEach(
		function(radio) {
			radio.onchange = function(e) {
				radios.forEach(
					function(radio2) {
						document.getElementById("parametros_" + radio2.value).parentNode.style.display = "none";
					}
				);
				document.getElementById("parametros_" + this.value).parentNode.style.display = "";
			}
		}
	);
	
	function criarLista(tipo) {
		var edParametros = document.getElementById("parametros_" + tipo);
		edParametros.setAttribute("list", "listaParametros_" + tipo);
		edParametros.setAttribute("autocomplete", "off");
		var dataList = document.createElement("DATALIST");
		dataList.setAttribute("id", "listaParametros_" + tipo);
		document.body.appendChild(dataList);
		return dataList;
	}
	function addParametro(dataList, valor) {
		var opcao = document.createElement("OPTION");
		opcao.setAttribute("value", valor);
		dataList.appendChild(opcao);
	}
	var dataList = criarLista("faixaCores");
	addParametro(dataList, "[255,255,255]");
	addParametro(dataList, "[0,0,0][255,255,255]");
	addParametro(dataList, "[0,0,0][0,7,100][32,107,203][237,255,255][255,170,0][0,2,0]");

	var dataList = criarLista("makeColorGradient");
	addParametro(dataList, ".08, .08, .08, 0, 0, 0, 128, 127");
	addParametro(dataList, ".1,.1,.1,0,0,0,128,127");
	addParametro(dataList, ".3,.3,.3,0,0,0,128,127");
	addParametro(dataList, ".1,.1,.1,0,2,4,200,55");
	addParametro(dataList, ".3,.3,.3,0,2,4,230,25");
	addParametro(dataList, ".3,.3,.3,0,2,4,152,103");
	addParametro(dataList, ".1,.1,.1,0,2,4,128,127");
	addParametro(dataList, ".1,.2,.3,0,0,0,128,127");
	addParametro(dataList, ".05,.05,.05,0,100,200,128,127");
	addParametro(dataList, ".05,.05,.05,100,200,0,128,127");
	addParametro(dataList, ".05,.05,.05,200,50,200,128,127");
	addParametro(dataList, ".05,.05,.05,0, 0,200,128,127");
	addParametro(dataList, ".015,.015, .015,0,100,200,122,123");
	addParametro(dataList, ".1,.1,.1,2,4,6,128,127");

	var dataList = criarLista("gradienteHSL_L");
	addParametro(dataList, "225,100,50,true");
	addParametro(dataList, "10,100,50");

	var dataList = criarLista("gradienteHSL_H");
	addParametro(dataList, "50,50,0,0");
	addParametro(dataList, "100,50,0,0");

	var dataList = criarLista("getRGB");
	addParametro(dataList, "0,-50,0,100,0,true,false");
	addParametro(dataList, "0,0,0,2,20,true,false");
	addParametro(dataList, "0,20,50,2,0,false,false");
	addParametro(dataList, "0,-50,0,2,0,true,true");
	addParametro(dataList, "0,0,-50,2,50,true,true");
	addParametro(dataList, "20,0,0,2,50,true,true");
	addParametro(dataList, "0,50,0,2,50,true,true");
	addParametro(dataList, "0,0,50,2,50,true,true");
}