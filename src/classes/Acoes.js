/**
 * @author Rodrigo Silva
 * @description Classe responsavel pela execução de todos os comandos
 * aceitos pelo bot
 */
class Acoes {

    /**
     * @description Retorna todos os comandos aceitos pelo bot
     * @param {str} prefix prefixo para reconhecer os comandos
     * @param {Array} comandos lista de comandos atuais no bot
     */
    ajuda(prefix, comandos) {
        let msg = 'Lista de comandos: ';
        comandos.forEach(comando => {
            msg += '\n' + prefix + comando;
        });

        this._respondeMention(msg);
    }


    /**
     * @description Coleta as informações de uma build
     * @param {Mensagem} msg: Objeto da mensagem recebida
     */
    build(msg) {
        let  listBuilds = require('./../data/builds.json');
        let response = this.listBuilds.map(build => {
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

        return response;
    }


    /**
     * @description Organiza os 10 primeiros do rank pvp e retorna em uma 
     * tabela estilizada
     */
    ranking() {


    }


    /**
     * @description Envia a resposata ao comando via mention para quem
     *  enviou o comando
     * @param {string} resposta resposta gerada pelas funções publicas
     */
    _respondeMention(resposta) {

    }


    /**
     * @description Envia a resposata ao comando via mensagem privada para quem
     *  enviou o comando
     * @param {string} resposta resposta gerada pelas funções publicas
     */
    _respondePrivado(resposta) {

    }
}