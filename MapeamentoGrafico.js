function MapeamentoGrafico(xmin, ymin, xmax, ymax, largura, altura) {
	this.xmin = parseFloat(xmin);
	this.ymin = parseFloat(ymin);
	this.xmax = parseFloat(xmax);
	this.ymax = parseFloat(ymax);
	this.largura = largura;
	this.altura = altura;
	
	this.canvasParaCoordenada = function(a, b) {
		var a1 = parseFloat(a) / this.largura;
		var b1 = parseFloat(b) / this.altura;
		var x = this.xmin + a1 * (this.xmax - this.xmin);
		var y = this.ymax - b1 * (this.ymax - this.ymin);
		return [x, y];
	}
	
	this.ajustar = function(centro, percentualReducao) {
		var tamX = (this.xmax - this.xmin) * percentualReducao;
		var tamY = (this.ymax - this.ymin) * percentualReducao;
		this.xmin = centro[0] - tamX / 2.0;
		this.ymin = centro[1] - tamY / 2.0;
		this.xmax = centro[0] + tamX / 2.0;
		this.ymax = centro[1] + tamY / 2.0;
	}
	
	this.coordenadaParaCanvas = function(x, y) {
		//TODO
	}
	
	this.toString = function() {
		return "coordenadas=" + this.xmin + "," + this.ymin + "," + this.xmax + "," + this.ymax + "&tamanho=" + this.largura + "," + this.altura + "";
	}
}

