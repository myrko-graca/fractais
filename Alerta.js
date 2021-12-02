var estilo = document.querySelector("style[nome='componenteAlerta']");
if (!estilo) {
	estilo = document.createElement("style");
	estilo.setAttribute("nome", "componenteAlerta");

	estilo.innerHTML = "\
		.modalAlerta {display: none;position: fixed;z-index: 1;padding-top: 20px;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;background-color: rgb(0,0,0);background-color: rgba(0,0,0,0.6);}\
		.modalAlerta-content {border-radius: 20px;background-color: #fefefe;margin: auto;padding: 10px 20px 10px;border: 1px solid #888;width: 70%;-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 1s;}\
		.botaoAlerta  {background-color:#7892c2; -moz-border-radius: 25px; -webkit-border-radius: 25px; border-radius:25px; border:1px solid #505A5C; display:inline-block; cursor:pointer; color:#ffffff; font-family:serif; font-size:17px; padding:2px 7px 2px 7px; text-decoration:none; text-shadow:0px 1px 0px #2f6627; min-width:75px; min-height:20px; opacity:0.75; text-align: center;margin: 5px 5px 5px 5px;}\
		.botaoAlerta:focus {border-color: #404040; opacity:0.9;}\
		.botaoAlerta:hover{opacity:1.0;}\
	";

	document.head.appendChild(estilo);
}
		
function btsAlertaConfirma() {
	return [{texto: "confirma?", valor: true}, {texto: "cancelar!", valor: false, cor: "#bd6060"}];
}
function btsAlertaOk() {
	return [{texto: "ok", valor: true}];
}
function btsAlertaSimNao() {
	return [{texto: "sim", valor: "S"}, {texto: "não", valor: "N", cor: "#bd6060"}];
}
function btsAlertaCancelar() {
	return [{texto: "Cancelar", valor: true}];
}

function alerta(msg, botoes, fnCallback, percentualTamanho, valorDefault) {
	if (msg.mensagem) {
		var params = msg;
		msg = params.mensagem;
		botoes = params.botoes;
		fnCallback = params.fnCallback;
		percentualTamanho = params.percentualTamanho;
		valorDefault = params.valorDefault;
	}
	var modal = document.createElement("div");
	
	this.getElemento = function() {
		return modal;
	}
	modal.className = "modalAlerta";
	var conteudo = document.createElement("div");
	var texto = document.createElement("p");
	texto.style.fontSize = "large";
	texto.innerHTML = msg;
	conteudo.appendChild(texto);
	conteudo.className = "modalAlerta-content";
	modal.style.paddingTop = "10%";
	if (percentualTamanho) {
		conteudo.style.width = percentualTamanho + "%";
	} else {
		if (msg.length < 20) {
			conteudo.style.width = "20%";
			texto.innerHTML = "<center>" + texto.innerHTML + "</center>";
		} else if (msg.length < 50) {
			conteudo.style.width = "40%";
			texto.innerHTML = "<center>" + texto.innerHTML + "</center>";
		} else {
			conteudo.style.width = "60%";
		}
	}
	if (!botoes) {
		botoes = btsAlertaOk();
	}
	var bts = document.createElement("center");
	conteudo.appendChild(bts);
	for (var i = 0; i < botoes.length; i++) {
		var bt = document.createElement("span");
		if (botoes[i].valor == undefined || botoes[i].valor == null) {
			bt.valor = botoes[i].texto;
		} else {
			bt.valor = botoes[i].valor;
		}
		bt.className = "botaoAlerta";
		bt.innerHTML = botoes[i].texto;;
		if (botoes[i].cor) {
			bt.style.backgroundColor = botoes[i].cor;
		}
		bts.appendChild(bt);
		bt.onclick = function(e) {
			if (fnCallback) {
				var valor = e.target.valor;
				fnCallback(valor);
			}
			document.body.removeChild(modal);
		}
	}
	//Valor default se clicar enter
	if (valorDefault) {
		var inputs = texto.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].onkeyup = function(event) {
				if (event.key !== "Enter") return;
				if (fnCallback) {
					fnCallback(valorDefault);
				}
				document.body.removeChild(modal);
			}
		}
	}
	
	modal.appendChild(conteudo);
	document.body.appendChild(modal);
	modal.style.display = "block";
	
	this.fechar=function(){
		try{
			document.body.removeChild(modal);
		}
		catch(e){};
	}
	
	this.setMensagem=function(s){
		texto.innerHTML = s;
	}
}

function janelaAutenticacao(fnAutenticacao, fnCallback, usuario) {
	if (!usuario) {
		usuario = "";
	}
	var htmllogin = "\
		<table align='center'>\
			<tr>\
				<td style='text-align:right'>Usuário: </td>\
				<td><input id='usuario' style='width: 150px;' type='text' value='" + usuario + "'/></td>\
			</tr>\
			<tr>\
				<td style='text-align:right'>Senha: </td>\
				<td><input id='senha' style='width: 150px;' type='password'/></td>\
			</tr>\
		</table>";
	function retorno(valor) {
		if (valor) {
			var userid = document.getElementById("usuario").value;
			var senha = document.getElementById("senha").value;
			fnAutenticacao(userid, senha, fnCallback);
		}
	}
	alerta({
		mensagem: htmllogin, 
		botoes: btsAlertaConfirma(), 
		fnCallback: retorno, 
		percentualTamanho: 30,
		valorDefault: true
	});
}

function janelaChaveAcesso(mensagem, fnCallback) {
	var trMensagem = "";
	if (mensagem) {
		trMensagem = "\
		<tr>\
			<td colspan = '2'>" + mensagem + "</td>\
		</tr>";
	}
	var htmllogin = "\
		<table align='center'>"
			+ trMensagem + 
			"<tr>\
				<td style='text-align:right'>Chave de acesso:&nbsp; </td>\
				<td><input id='ChaveAcesso' type='text' style='width: 250px;'/></td>\
			</tr>\
		</table>";
	function retorno(valor) {
		if (valor) {
			var chaveAcesso = document.getElementById("ChaveAcesso").value;
			fnCallback(chaveAcesso);
		}
	}
	alerta({
		mensagem: htmllogin, 
		botoes: btsAlertaConfirma(), 
		fnCallback: retorno, 
		percentualTamanho: 40
	});
}

function janelaPergunta(mensagem, fnCallback) {
	var trMensagem = "";
	if (mensagem) {
		trMensagem = "\
		<tr>\
			<td>" + mensagem + "</td>\
		</tr>";
	}
	var htmllogin = "\
		<table align='center'>"
			+ trMensagem + 
			"<tr>\
				<td><input id='Resposta' type='text' style='width: 250px;'/></td>\
			</tr>\
		</table>";
	function retorno(valor) {
		if (valor) {
			var resposta = document.getElementById("Resposta").value;
			fnCallback(resposta);
		}
	}
	alerta({
		mensagem: htmllogin, 
		botoes: btsAlertaConfirma(), 
		fnCallback: retorno, 
		percentualTamanho: 40
	});
}
function janelaColar(fnProcessarPaste) {
	var html = "<p style='font-size:small;'>Primeira linha tem o nome das colunas?<label> <input type='checkbox' data-id='alerta_check_linha_titulo'> </p>\
	<p>Cole o texto aqui (Crtl+V): <input data-id='alerta_texto_colar' type='text'></p>";
	function retorno(valor) {
		if (valor) {
			fnProcessarPaste(input.value, check.checked);
		}
	}
	var a = new alerta({
		mensagem: html, 
		fnCallback: retorno, 
		percentualTamanho: 40,
		valorDefault: true
	});
	var input = a.getElemento().querySelector("[data-id='alerta_texto_colar']");
	var check = a.getElemento().querySelector("[data-id='alerta_check_linha_titulo']");
	check.onclick = function() {
		input.focus();
	}
	input.focus();
	input.addEventListener('paste', 
		function(e) {
			var pastedData;
			var clipboardData = e.clipboardData || window.clipboardData;
			if (clipboardData) {
				pastedData = clipboardData.getData('Text');
			}
			a.fechar();
			fnProcessarPaste(pastedData, check.checked);
		}
	);
}

