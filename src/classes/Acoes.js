/**
 * @author Rodrigo Silva
 * @description Classe responsavel pela execução de todos os comandos
 * aceitos pelo bot
 */
class Acoes {

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
        let listBuilds = require('./../data/builds.json');
        let response = listBuilds.map(build => {
            let classe = msg.content.toLocaleLowerCase().split(' ')[1];
            let resp = "";
            if (build.classe == classe || build.sigla == classe) {
                resp +=
                    build.msg +
                    '\nForça:             ' + build.forca +
                    '\nInteligência:  ' + build.inteligencia +
                    '\nTalento:         ' + build.talento +
                    '\nAgilidade:      ' + build.agilidade +
                    '\nVitalidade:    ' + build.vitalidade +
                    '\nBuild disponibilizada por ' + build.autor;

                return resp;
            }
        });

        msg.author.sendMessage(response);
    }


    /**
     * @description Organiza os 10 primeiros do rank pvp e retorna em uma 
     * tabela estilizada
     * @param {Mensagem} msg: Objeto da mensagem recebida
     */
    ranking(msg) {
        const htmlBruto = this._getHtmlRanking();
        let dados = this._limpaRanking(htmlBruto);
        let tabelaRank = this._montaTabelaRanking(dados);

        msg.reply(tabelaRank);
    }


    /**
     * @description Acessa o ranking na pagina do monster pk e retorna
     * o html bruto da pagina
     * @returns {string} resp Contem todo o html da pagina de rank
     */
    _getHtmlRanking() {
        const afterLoad = require('after-load');
        const uri = 'http://user.monsterpk.com.br/scriptsnovosite/rankbp.php';

        return afterLoad(uri);
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
        const line = '\n' + '-'.repeat(33);
        const nicks = dados[0];
        const kills = dados[1];

        let res = line;
        let space = ' '.repeat(8);
        res += '\n|' + space + 'MESTRES DO PVP' + space + ' |';
        res += line;
        res += '\n|  Posi' + space + 'Nick' + space + space + 'Kills' + ' |';
        res += line;

        for (let i = 0; i < 10; i++) {
            let rank = (((i + 1) < 10) ? ' ' + (i + 1) : (i + 1));
            // TODO - descobrir uma forma de alinha isso no discord
            let spacing = ' '.repeat((17 - nicks[i].length) * 2);
            console.log(spacing.length);

            res += '\n   ' + rank + '   ' + nicks[i] + spacing + kills[i];
        }

        res += line;
        console.log(res);

        return res;
    }
}

module.exports = Acoes;