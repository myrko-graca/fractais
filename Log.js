function Log(modo) {

	function contagemTempo(descricao) {
		var dt = new Date();
		return function() {
			var tempo = (new Date()).getTime() - dt.getTime();
			console.log(descricao + ": " + tempo + " ms");
		}
	}

	this.trace = function(arrMsg) {
		if (modo == "trace") {
			console.log(modo + ": " + arrMsg);
		}
	}
	this.debug = function(arrMsg) {
		if (modo == "debug" || modo == "info") {
			console.log(modo + ": " + arrMsg);
		}
	}
	this.info = function(arrMsg) {
		console.log(modo + ": " + arrMsg);
	}
	
	this.trace.contagemTempo = function(descricao) {
		if (modo == "trace") {
			return contagemTempo(descricao);
		} else {
			return function() {};
		}
	}

	this.debug.contagemTempo = function(descricao) {
		if (modo == "debug" || modo == "info") {
			return contagemTempo(descricao);
		} else {
			return function() {};
		}
	}

	this.info.contagemTempo = function(descricao) {
		return contagemTempo(descricao);
	}
}