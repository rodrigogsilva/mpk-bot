const request = require("request");
const token = require("../data/token.json");

/**
 * @author Rodrigo Gonçalves
 * @description Classe responsavel pela execução de todos os comandos
 * aceitos pelo bot
 */
class Acoes {
  /**
   * @description Um logger simples que imprime no terminal ações
   * realizadas pelo bot
   * @param {String} log Messagem a ser mostrada no terminal
   */
  logger(log) {
    let data = new Date();
    let dia = this._dataZero(data.getDate());
    let mes = this._dataZero(data.getMonth() + 1);
    let ano = this._dataZero(data.getFullYear());
    let hor = this._dataZero(data.getHours());
    let min = this._dataZero(data.getMinutes());
    let sec = this._dataZero(data.getSeconds());

    let output = `[ ${dia}-${mes}-${ano} | ${hor}:${min}:${sec} ] ${log}`;

    console.log(output);
  }

  /**
   * @description Retorna todos os comandos aceitos pelo bot
   * @param {Message} msg Objeto do comando enviado
   * @param {string} prefix prefixo para reconhecer os comandos
   * @param {Array} comandos lista de comandos atuais no bot
   */
  ajuda(msg, prefix, comandos) {
    let resp = "Lista de comandos: ";
    comandos.forEach(comando => {
      resp += "\n" + prefix + comando;
    });

    msg.channel.send(resp);
  }

  /**
   * @description Coleta as informações de uma build
   * @param {Mensagem} msg Objeto da mensagem recebida
   */
  build(msg) {
    let builds = require("./../data/builds.json");
    let classe = msg.content.toLocaleLowerCase().split(" ")[1];
    let response = "";
    // TODO - pensar em uma forma de adicionar varias builds para
    // uma mesma classe permitindo que
    for (let i = 0; i < builds.length; i++) {
      if (builds[i].classe == classe || builds[i].sigla == classe) {
        response +=
          "\n\n" +
          builds[i].msg +
          "\nForça:             " +
          builds[i].forca +
          "\nInteligência:  " +
          builds[i].inteligencia +
          "\nTalento:         " +
          builds[i].talento +
          "\nAgilidade:      " +
          builds[i].agilidade +
          "\nVitalidade:    " +
          builds[i].vitalidade +
          "\nBuild disponibilizada por " +
          builds[i].autor;
      }
    }

    if (response == "") {
      msg.reply(
        "Informe a classe que você quer saber a build " +
          "(archer, atalanta, kina, lutador, mago, mech, pike ou sacer)"
      );
    } else {
      msg.author.send(response);
    }
  }

  /**
   * @description recebe html com o rank, busca os 10 primeiros do rank
   * e gera uma tabela contendo nick e número de kills
   * @param {Mensagem} msg Objeto da mensagem recebida
   */
  ranking(msg) {
    const uri = "http://user.monsterpk.com.br/scriptsnovosite/rankbp.php";

    request(uri, (error, response, body) => {
      let dados = this._limpaRanking(body);

      let tabelaRank = this._montaTabelaRanking(dados);

      msg.reply(tabelaRank);
    });
  }

  /**
   * @description Função paleativa para mostrar ranking individual. Será
   * refatorada quando eu não tiver mais o que fazer :v
   * @param {Mensagem} msg Objeto da mensagem recebida
   */
  rankIndividual(msg) {
    let uri = "http://user.monsterpk.com.br/scriptsnovosite/rankbp.php";
    let nick = msg.content.toLocaleLowerCase().split(" ")[1];
    uri += "?nick=" + nick;

    // TODO - Refatorar essa função para utilizar as funções de ranking
    let a = request(uri, (error, response, body) => {
      let nickL = body.match(/(?:td width="98".*>)(.+?)</gi);

      if (!nickL) {
        msg.reply("Não encontrei seu nick :/");
        return;
      }

      nickL = nickL[0].match(/>(.*?)</gi)[0].slice(1, -1);
      let killL = body
        .match(/(?:td width="60".*>)(.+?)(?:<)/gi)[0]
        .match(/>(.*?)</gi)[0]
        .slice(1, -1);
      let deathL = body
        .match(/(?:td width="70".*>)(.+?)(?:<)/gi)[0]
        .match(/>(.*?)</gi)[0]
        .slice(1, -1);
      let pointsL = body
        .match(/(?:td width="80".*>)(.+?)(?:<)/gi)[0]
        .match(/>(.*?)</gi)[0]
        .slice(1, -1);

      let nick = this._center(nickL, 22);
      let kill = " " + this._addZero(killL, 3) + "  ";
      let deat = "  " + this._addZero(deathL, 3) + "  ";
      let pont = " " + this._addZero(pointsL, 4) + "  ";

      let ranking =
        "```\n" +
        "╔══════════════════════╦═══════╦════════╦════════╗\n" +
        "║         Nick         ║ Kills ║ Mortes ║ Pontos ║\n" +
        "╠══════════════════════╬═══════╬════════╬════════╣\n" +
        `║${nick}║${kill}║${deat}║${pont}║\n` +
        "╚══════════════════════╩═══════╩════════╩════════╝\n" +
        "```";

      msg.reply(ranking);
    });
  }

  /**
   * coleta uma mensagem aleatória de newsapi.org e responde o chat com
   * o tiltulo, autor e o link para a noticia
   * @param {Object} msg objeto do discord para retornar a mensagem
   */
  pegaNoticia(msg) {
    const data = new Date();
    data.setDate(data.getDate() - 20);
    const dataConv = this._formataDate(data);
    const urlNoticias = `https://newsapi.org/v2/top-headlines?country=br&category=technology&from=${dataConv}&sortBy=publishedAt&apiKey=${token.api}`;
    request(urlNoticias, (error, response, body) => {
      let retorno;
      body = JSON.parse(body);

      if (body.status.toUpperCase() !== "OK" || !body.articles.length) {
        retorno = "Não encontrei uma noticia :/";
      } else {
        // escolhe uma noticia aleatória
        const noticia =
          body.articles[Math.floor(Math.random() * body.articles.length)];
        this.logger(`Noticia : ${JSON.stringify(noticia.url)}`);
        retorno = `\nTitulo: ${noticia.title}\nPor: ${noticia.author}\nLink: ${noticia.url}`;
      }
      msg.reply(retorno);
    });
  }

  /**
   * @description Pega o Html bruto e devolve uma lista contendo 2 lista, uma
   * com o nick dos 10 primeros do ranking e outra com as respequitivas kills
   * de cada jogador
   * @param {string} bruto string do html da pagina requisitada
   * @returns {Array} Array com 4 arrays, um contendo nick do jogador, as
   * kills desse jogador, as mortes e a quantidade de pontos
   */
  _limpaRanking(bruto) {
    let res = [];
    let nickLimpo = [];
    let killLimpo = [];
    let deathLimpo = [];
    let pointLimpo = [];

    let nicks = bruto.match(/(?:td width="98".*>)(.+?)</gi);
    let kills = bruto.match(/(?:td width="60".*>)(.+?)(?:<)/gi);
    let deaths = bruto.match(/(?:td width="70".*>)(.+?)(?:<)/gi);
    let points = bruto.match(/(?:td width="80".*>)(.+?)(?:<)/gi);

    for (let i = 0; i < 10; i++) {
      let ni = nicks[i].match(/>(.*?)</gi)[0].slice(1, -1);
      let ki = kills[i].match(/>(.*?)</gi)[0].slice(1, -1);
      let de = deaths[i].match(/>(.*?)</gi)[0].slice(1, -1);
      let po = points[i].match(/>(.*?)</gi)[0].slice(1, -1);

      nickLimpo.push(ni);
      killLimpo.push(ki);
      deathLimpo.push(de);
      pointLimpo.push(po);
    }

    res.push(nickLimpo);
    res.push(killLimpo);
    res.push(deathLimpo);
    res.push(pointLimpo);

    return res;
  }

  /**
   * @description recebe o nick e as kills dos 10 primeiro jogadores
   * e cria uma tabela estilizada com essas informações
   * @param {Array} dados Array com 4 arrays, um contendo nick do
   * jogador, as kills desse jogador, as mortes e a quantidade de pontos
   * @returns {string} Tabela dos 10 primeiros do ranking
   */
  _montaTabelaRanking(dados) {
    const nicks = dados[0];
    const kills = dados[1];
    const death = dados[2];
    const points = dados[3];

    let ranking =
      "```\n" +
      "╔══════════════════════════════════════════════════════════╗\n" +
      "║                      MESTRES DO PVP                      ║\n" +
      "╠═════════╦══════════════════════╦═══════╦════════╦════════╣\n" +
      "║ Posição ║         Nick         ║ Kills ║ Mortes ║ Pontos ║\n" +
      "╠═════════╬══════════════════════╬═══════╬════════╬════════╣\n";

    for (let i = 0; i < 10; i++) {
      let rank = "   " + this._addZero(i + 1, 2) + "   ";
      let nick = this._center(nicks[i], 22);
      let kill = " " + this._addZero(kills[i], 3) + "  ";
      let deat = "  " + this._addZero(death[i], 3) + "  ";
      let pont = " " + this._addZero(points[i], 4) + "  ";

      ranking += `║${rank}║${nick}║${kill}║${deat}║${pont}║\n`;
    }

    ranking +=
      "╚═════════╩══════════════════════╩═══════╩════════╩════════╝\n" + "```";

    return ranking;
  }

  /**
   * @description Centraliza uma palavra em uma certa quantidade de caracteres
   * @param {String} word palavra a ser centralizada
   * @param {int} size tamanho total para centralizar a palavra
   * @returns {String} espaço $word espaço
   */
  _center(word, size) {
    let res = "";
    let val = size - word.length;
    let space = Math.floor(val / 2);

    res += val % 2 != 0 ? " " : "";
    res += " ".repeat(space) + word + " ".repeat(space);

    return res;
  }

  /**
   * @description Adiciona 0's a esquerda do valor fornecido para igualar
   * ao tamanho desejado
   * @param {int} val valor a ser validado
   * @param {int} size tamanho que valor deveria ter
   * @returns {String} valor adaptado ou não
   */
  _addZero(val, size) {
    let minus = " ";
    if (val < 0) {
      minus = "-";
      val = Math.abs(val);
    }

    let res = "" + val;
    if (res.length < size) {
      res = "0".repeat(size - res.length) + res;
    }
    return minus + res;
  }

  /**
   * @description Adiciona 0 a esquerda do valor fornecido para ter 2 digitos
   * @param {int} num valor a ser editado
   * @returns 0n ou n
   */
  _dataZero(num) {
    return num < 10 ? "0" + num : num;
  }

  /**
   * Converte objeto Date para yyyy-mm-dd
   * @param {Date} date data que será mudada
   */
  _formataDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
}

module.exports = Acoes;
