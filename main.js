/**
 * @author Rodrigo Gonçalves
 * @description arquivo principal do bot responsavel por validar as mensagens 
 * recebidas enquanto a execução fica por conta da classe Acao
 */
const Discord = require('discord.js');
const Bot = new Discord.Client();
const Acoes = require('./src/classes/Acoes.js');
const a = new Acoes();
// TODO - forma mais eficiente para buscar comandos
const {
    prefix,
    comandos
} = require('./src/data/comandos.json');
const token = require('./src/data/token.json');

Bot.on('ready', () => {
    a.logger(`Iniciando >>> ${Bot.user.tag} id: ${Bot.user.id} <<<`);
});


Bot.on('message', message => {
    let cont = message.content.toLocaleLowerCase();
    if (cont.startsWith(prefix)) {
        if (cont.startsWith(prefix + 'ajuda')) {
           a.logger(`Comando ajuda chamdo por ${message.author.username}`); 
            a.ajuda(message, prefix, comandos);
        } else if (cont.startsWith(prefix + 'build')) {
            a.logger(`Comando build chamdo por ${message.author.username}`);
            a.build(message);
        } else if (cont.startsWith(prefix + 'rank')) {
            a.logger(`Comando rank chamdo por ${message.author.username}`); 
            a.ranking(message);
        }
    }
});

Bot.login(token.token);