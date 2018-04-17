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
        let dia = this._doisdig(data.getDate());
        let mes = this._doisdig(data.getMonth() + 1);
        let ano = this._doisdig(data.getFullYear());
        let hora = this._doisdig(data.getHours());
        let min = this._doisdig(data.getMinutes());
        let sec = this._doisdig(data.getSeconds());

        let output = `[ ${dia}-${mes}-${ano} | ${hora}:${min}:${sec} ] ${log}`;

        console.log(output);
    }

    /**
     * @description Retorna todos os comandos aceitos pelo bot
     * @param {Message} msg Objeto do comando enviado
     * @param {string} prefix prefixo para reconhecer os comandos
     * @param {Array} comandos lista de comandos atuais no bot
     */
    ajuda(msg, prefix, comandos) {
        let resp = 'Lista de comandos: ';
        comandos.forEach(comando => {
            resp += '\n' + prefix + comando;
        });

        msg.channel.send(resp);
    }


    /**
     * @description Coleta as informações de uma build
     * @param {Mensagem} msg: Objeto da mensagem recebida
     */
    build(msg) {
        let builds = require('./../data/builds.json');
        let classe = msg.content.toLocaleLowerCase().split(' ')[1];
        let response = '';
        // TODO - pensar em uma forma de adicionar varias builds para
        // uma mesma classe permitindo que 
        for (let i = 0; i < builds.length; i++) {
            if (builds[i].classe == classe || builds[i].sigla == classe) {
                response += '\n\n' +
                    builds[i].msg +
                    '\nForça:             ' + builds[i].forca +
                    '\nInteligência:  ' + builds[i].inteligencia +
                    '\nTalento:         ' + builds[i].talento +
                    '\nAgilidade:      ' + builds[i].agilidade +
                    '\nVitalidade:    ' + builds[i].vitalidade +
                    '\nBuild disponibilizada por ' + builds[i].autor;
            }
        }

        if (response == '') {
            msg.reply('Informe a classe que você quer saber a build ' +
                '(archer, atalanta, kina, lutador, mago, mech, pike ou sacer)');
        } else {
            msg.author.send(response);
        }
    }


    /**
     * @description recebe html com o rank, busca os 10 primeiros do rank
     * e gera uma tabela contendo nick e número de kills
     * @param {Mensagem} msg: Objeto da mensagem recebida
     */
    ranking(msg) {
        const request = require('request');
        const uri = 'http://user.monsterpk.com.br/scriptsnovosite/rankbp.php';

        request(uri, (error, response, body) => {
            let dados = this._limpaRanking(body);
            let tabelaRank = this._montaTabelaRanking(dados);

            msg.reply(tabelaRank);
            //console.log(tabelaRank);
        });
    }


    /**
     * @description Pega o Html bruto e devolve uma lista contendo 2 lista, uma 
     * com o nick dos 10 primeros do ranking e outra com as respequitivas kills 
     * de cada jogador
     * @param {string} bruto string do html da pagina requisitada
     * @returns {Array} res Array com 2 arrays, um contendo nick do jogador
     * e outro com as kills desse jogador
     */
    _limpaRanking(bruto) {
        let res = [];
        let nickLimpo = [];
        let killLimpo = [];

        const nicksRE = /(?:td width="98".*>)(.+?)</ig
        const killsRE = /(?:td width="60".*>)(.+?)(?:<)/ig

        let nicks = bruto.match(nicksRE);
        let kills = bruto.match(killsRE);

        for (let i = 0; i < 10; i++) {
            let ni = nicks[i].match(/>(.*?)</ig)[0].slice(1, -1);
            let ki = kills[i].match(/>(.*?)</ig)[0].slice(1, -1);
            nickLimpo.push(ni);
            killLimpo.push(ki);
        }

        res.push(nickLimpo);
        res.push(killLimpo);

        return res;
    }

    /**
     * @description recebe o nick e as kills dos 10 primeiro jogadores 
     * e cria uma tabela estilizada com essas informações
     * @param {Array} dados array com 2 arrays um contendo 10 nicks e outro, as 
     * kills dos jogadores respequitivamente
     * @returns {string} res Tabela dos 10 primeiros do ranking
     */
    _montaTabelaRanking(dados) {
        const line = '\n' + '-'.repeat(36);
        const nicks = dados[0];
        const kills = dados[1];

        let res = line;
        let space = ' '.repeat(10);
        res += '\n|' + space + 'MESTRES DO PVP' + space + ' |';
        res += line;
        res += '\n|  Posi' + space + 'Nick' + space + 'Kills' +space+ '|';
        res += line;

        for (let i = 0; i < 10; i++) {
            let rank = (((i + 1) < 10) ? ' ' + (i + 1) : (i + 1));
            // TODO - descobrir uma forma de alinha isso no discord
            let spacing = ' '.repeat((20 - nicks[i].length) * 2);

            res += '\n|  ' + rank + '   ' + nicks[i] + spacing + kills[i];
        }

        res += line;

        return res;
    }

    /**
     * @description Caso o numero informado seja menor que 10,
     * retorna o numero com um 0 (zero) a esquerda
     * @param {number} num numero a ser configurado
     */
    _doisdig(num) {
        return (num < 10) ? '0' + num : num;
    }
}

module.exports = Acoes;