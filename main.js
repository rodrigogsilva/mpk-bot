/**
 * @author Rodrigo Gonçalves
 * @description arquivo principal do bot responsavel por validar as mensagens 
 * recebidas enquanto a execução fica por conta da classe Acao
 */
const Discord = require('discord.js');
const Bot = new Discord.Client();
const Acoes = require('./src/classes/Acoes.js');
// TODO - forma mais eficiente para buscar comandos
const {
    prefix,
    comandos
} = require('./src/data/comandos.json');
const token = require('./src/data/token.json');


Bot.on('ready', () => {

    console.log(`Iniciando >>> ${Bot.user.tag} id: ${Bot.user.id} <<<`);
});


Bot.on('message', message => {
    let cont = message.content.toLocaleLowerCase();
    if (cont.startsWith(prefix)) {
        if (cont.startsWith(prefix + 'ajuda')) {
            Acoes.ajuda(prefix, comandos);
        } else if (cont.startsWith(prefix + 'build')) {
            Acoes.build(message);
        } else if (cont.startsWith(prefix + 'rank')) {
            Acoes.ranking();
        }
    }
});

Bot.login(token);