function Fractais(tipo, mapeamento, maxIteracoes, parametros) {
	var processamento;

	this.getTipo = function() {
		return tipo;
	}
	this.getMapeamento = function() {
		return mapeamento;
	}
	this.getMaxIteracoes = function() {
		return maxIteracoes;
	}
	this.getParametros = function() {
		return parametros;
	}
	this.getConfiguracao = function() {
		var saida = "tipoFractal=" + tipo;
		if (parametros) {
			saida += "&parametrosFractal=" + parametros;
		}
		saida += "&maxIteracoes=" + maxIteracoes
		saida += "&" + mapeamento.toString();
		
		return saida;
	}
	
	//Funções para números complexos [r, i]
	function sumComplex(num1, num2) {
		var r = num1[0] + num2[0];
		var i = num1[1] + num2[1];
		return [r, i];
	}
	function subComplex(num1, num2) {
		var r = num1[0] - num2[0];
		var i = num1[1] - num2[1];
		return [r, i];
	}
	function multComplex(num1, num2) {
		var r = (num1[0] * num2[0]) - (num1[1] * num2[1]);
		var i = (num1[0] * num2[1]) + (num1[1] * num2[0]); 
		return [r, i];
	}
	function potComplex(num, potencia) {
		//Apenas para potências inteiras positivas
		var res = [num[0], num[1]];
		for (var i = 0; i < potencia - 1; i++) {
			res = multComplex(res, num);
		}
		return res;
	}
	function squaredModuloComplex(num) {
		return num[0] * num[0] + num[1] * num[1];
	}
	function divComplex(num1, num2) {
		if (num2[1] != 0) {
			var conjugado = [num2[0], num2[1] * -1.0];
			num1 = multComplex(num1, conjugado);
			num2 = multComplex(num2, conjugado);
		}
		return [num1[0] / num2[0], num1[1] / num2[0]];
	}
	function printComplex(num) {
		if (num[1] === 0) return "" + num[0];
		if (num[0] === 0) return "" + num[1] + "i";
		if (num[1] < 0) {
			return "" + num[0] + num[1] + "i";
		} else {
			return "" + num[0] + "+" + num[1] + "i";// (" + this.modulo() + ")";
		}
	}

	function potPlusConst(x, pot, C) {
		var num = potComplex(x, pot);
		return sumComplex(num, C);
	}

	function diverge(valorInicial, pot, C) {
		const VALOR_MAX = 4;
		var valor = potPlusConst(valorInicial, pot, C);
		var valorSquaredModulo = squaredModuloComplex(valor);
		var iteracoes = 1;
		while (valorSquaredModulo < VALOR_MAX && iteracoes < maxIteracoes) {
			valor = potPlusConst(valor, pot, C);
			valorSquaredModulo = squaredModuloComplex(valor);
			iteracoes++;
		}
		if (valorSquaredModulo > VALOR_MAX) {
			return iteracoes;
		} else {
			return 0;
		}
	}
	
	function MatrizDados(h,w){
		var m =new Array(h);
		var mi=new Array(w).fill(0);
		m[0]=mi;
		for(var i=1;i<h;i++){
			m[i]=mi.slice(0,w);
		}
		return m;
	}  

	function processarMandelbrot(potencia) {
		var zero = [0, 0];
		for (var i = 0; i < mapeamento.largura; i++) {
			for (var j = 0; j < mapeamento.altura; j++) {
				var xy = mapeamento.canvasParaCoordenada(i, j);
				var qtd = diverge(zero, potencia, xy);
				processamento[i][j] = qtd;
			}
		}
	}
	
	function processarJulia(potencia, ponto) {
		for (var i = 0; i < mapeamento.largura; i++) {
			for (var j = 0; j < mapeamento.altura; j++) {
				var xy = mapeamento.canvasParaCoordenada(i, j);
				var qtd = diverge(xy, potencia, ponto);
				processamento[i][j] = qtd;
			}
		}
	}

	function processarMetodoNewton(fx, dfx) {
		function newton(x, valFx, valDfx) {
			var fator = [0.52, 0];
			var valor = divComplex(valFx, valDfx);
			valor = multComplex(fator, valor);
			valor = subComplex(x, valor);
			return valor;
		}
		
		function metodoNewton(valorInicial) {
			const VALOR_MIN = 1e-6;
			
			var iteracoes = 1;
			var valFx = fx(valorInicial);
			var valDfx = dfx(valorInicial);
			var valorSquaredModulo = squaredModuloComplex(valFx);
			var valor;
			if (valorSquaredModulo != 0) {
				valor = newton(valorInicial, valFx, valDfx);
			} else {
				valor = valorInicial;
			}
			while (valorSquaredModulo > VALOR_MIN && iteracoes < maxIteracoes) {
				valFx = fx(valor);
				valDfx = dfx(valor);
				valorSquaredModulo = squaredModuloComplex(valFx);
				if (valorSquaredModulo != 0) {
					valor = newton(valor, valFx, valDfx);
					iteracoes++;
				}
			}
			return iteracoes;
		}
		for (var i = 0; i < mapeamento.largura; i++) {
			for (var j = 0; j < mapeamento.altura; j++) {
				var xy = mapeamento.canvasParaCoordenada(i, j);
				var qtd = metodoNewton(xy);
				processamento[i][j] = qtd;
			}
		}
	}

	this.getProcessamento = function() {
		return processamento;
	}
	
	this.processar = function() {
		processamento = MatrizDados(mapeamento.largura, mapeamento.altura);
		if (tipo == "Mandelbrot") {
			var potencia = 2;
			if (parametros) {
				var p = parametros.split(",");
				if (p[0]) {
					potencia = parseInt(p[0]);
				}
			}
			processarMandelbrot(potencia);
		} else if (tipo == "Julia") {
			var potencia = 2;
			var ponto = [0, 0];
			if (parametros) {
				var p = parametros.split(",");
				if (p[0]) {
					potencia = parseInt(p[0]);
				}
				if (p[1]) {
					var strPonto = parametros.match(/\[(.*?)\]/g)[0];
					if (strPonto) {
						var array = strPonto.replace(/(^.*\[|\].*$)/g, "").split(",");
						ponto = [parseFloat(array[0]), parseFloat(array[1])];
					}
				}
			}
			processarJulia(potencia, ponto);
		} else if (tipo == "MetodoNewton") {
			if (parametros == "x^4-1") {
				function fx(x) {
					//x^4-1
					var valor = multComplex(x, x);
					valor = multComplex(valor, valor);
					valor = subComplex(valor, [1, 0]);
					return valor;
				}
				function dfx(x) {
					//4*x^3
					var valor = multComplex(x, x);
					valor = multComplex(valor, x);
					valor = multComplex(valor, [4, 0]);
					return valor;
				}
			} else if (parametros == "x^3-1") {
				function fx(x) {
					//x^3-1
					var valor = multComplex(x, x);
					valor = multComplex(valor, x);
					valor = subComplex(valor, [1, 0]);
					return valor;
				}
				function dfx(x) {
					//3*x^2
					var valor = multComplex(x, x);
					valor = multComplex(valor, [3, 0]);
					return valor;
				}
			} else if (parametros == "x^3-x-1") {
				function fx(x) {
					//x^3-x-1
					var valor = multComplex(x, x);
					valor = multComplex(valor, x);
					valor = subComplex(valor, x);
					valor = subComplex(valor, [1, 0]);
					return valor;
				}
				function dfx(x) {
					//3*x^2
					var valor = multComplex(x, x);
					valor = multComplex(valor, [3, 0]);
					valor = subComplex(valor, [1, 0]);
					return valor;
				}
			} else if (parametros == "x^2+1") {
				function fx(x) {
					//x^2+1
					var valor = multComplex(x, x);
					valor = sumComplex(valor, [1, 0]);
					return valor;
				}
				function dfx(x) {
					//2*x
					var valor = multComplex(x, [2,0]);
					return valor;
				}
			}
			processarMetodoNewton(fx, dfx);
		}
		return processamento;
	}
	this.processar();
}

Fractais.processar = function(tipo) {
	var ed = document.getElementById("parametros_" + tipo);
	var check = document.getElementById("definirPonto_" + tipo);
	if (check) {
		Fractais.fn_processamento(tipo, ed.value, check.checked);
	} else {
		Fractais.fn_processamento(tipo, ed.value);
	}
}

Fractais.criarComponente = function(elemento, f) {
	Fractais.fn_processamento = f;
	elemento.innerHTML = '\
		<input type="radio" name="tipoFractal" value="Mandelbrot">Mandelbrot<br>\
		<fieldset style="display:none">\
			<legend>Parâmetros</legend>\
			<input id="parametros_Mandelbrot" type="text" size="50" title="potencia">\
			<button onclick="Fractais.processar(\'Mandelbrot\')">ok</button>\
		</fieldset>\
		<input type="radio" name="tipoFractal" value="Julia">Julia<br>\
		<fieldset style="display:none">\
			<legend>Parâmetros</legend>\
			<input id="parametros_Julia" type="text" size="50" title="potencia, [ponto]">\
			<button onclick="Fractais.processar(\'Julia\')">ok</button>\
			Definir ponto? <input id="definirPonto_Julia" type="checkbox" title="Marque para que seja definido um ponto ao clicar">\
		</fieldset>\
		<input type="radio" name="tipoFractal" value="MetodoNewton">Método de Newton<br>\
		<fieldset style="display:none">\
			<legend>Parâmetros</legend>\
			<input id="parametros_MetodoNewton" type="text" size="50" title="f(x)">\
			<button onclick="Fractais.processar(\'MetodoNewton\')">ok</button>\
		</fieldset>\
		';
		
	var radios = document.getElementsByName("tipoFractal");
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
	var dataList = criarLista("Mandelbrot");
	addParametro(dataList, "2");
	addParametro(dataList, "3");
	addParametro(dataList, "4");
	addParametro(dataList, "5");
	var dataList = criarLista("Julia");
	addParametro(dataList, "2,[-0.4,0.6]");
	addParametro(dataList, "2,[-0.8,0.156]");
	addParametro(dataList, "2,[0.285,0.01]");
	addParametro(dataList, "2,[-0.835,-0.232]");
	addParametro(dataList, "2,[0.28,0.528]");
	addParametro(dataList, "2,[-0.656,0.272]");
	addParametro(dataList, "2,[-0.7196788586496004,-0.21136202165578144]");
	addParametro(dataList, "2,[-0.30600000000000005,0.6220000076293946]");
	addParametro(dataList, "2,[0.3137599999999998,-0.5019733972167968]");
	addParametro(dataList, "2,[-0.764,0.0026666564941406623]");
	addParametro(dataList, "2,[-0.75,0.06999999999999984]");
	addParametro(dataList, "2,[0.021111111640930158,0.6383333349227907]");
	addParametro(dataList, "2,[0.36111111164093024,0.3583333349227904]");
	addParametro(dataList, "2,[-0.5588888883590699,0.4733333349227904]");
	addParametro(dataList, "2,[-0.524,-0.5493333435058594]");
	addParametro(dataList, "2,[0.3839999999999999,-0.14933334350585947]");
	addParametro(dataList, "2,[-0.8200000000000001,-0.18400003051757818]");
	addParametro(dataList, "2,[-0.7204800000000001,0.23018664184570314]");
	addParametro(dataList, "2,[-0.29040000000000044,-0.6760533972167968]");
	addParametro(dataList, "2,[-0.45718924799999994,-0.5748449131757815]");
	addParametro(dataList, "2,[]");
	var dataList = criarLista("MetodoNewton");
	addParametro(dataList, "x^4-1");
	addParametro(dataList, "x^3-1");
	addParametro(dataList, "x^3-x-1");
	addParametro(dataList, "x^2+1");
}