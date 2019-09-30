/**
 * @author Rodrigo Gonçalves
 * @description arquivo principal do bot responsavel por validar as mensagens
 * recebidas enquanto a execução fica por conta da classe Acao
 */
const Discord = require("discord.js");
const Bot = new Discord.Client();
const Acoes = require("./src/classes/Acoes.js");
const acao = new Acoes();
// TODO - forma mais eficiente para buscar comandos
const { prefix, comandos } = require("./src/data/comandos.json");
const token = require("./src/data/token.json");

Bot.on("ready", () => {
  acao.logger(`Iniciando >>> ${Bot.user.tag} id: ${Bot.user.id} <<<`);
});

Bot.on("message", message => {
  let cont = message.content.toLocaleLowerCase();
  if (cont.startsWith(prefix)) {
    if (cont.startsWith(prefix + "ajuda")) {
      acao.logger(`Comando ajuda chamdo por ${message.author.username}`);
      acao.ajuda(message, prefix, comandos);
    } else if (cont.startsWith(prefix + "build")) {
      acao.logger(`Comando build chamdo por ${message.author.username}`);
      acao.build(message);
    } else if (cont.startsWith(prefix + "rank")) {
      if (cont.split(" ")[1]) {
        acao.logger(`Comando rank chamdo por ${message.author.username}`);
        acao.rankIndividual(message);
      } else {
        acao.logger(`Comando rank chamdo por ${message.author.username}`);
        acao.ranking(message);
      }
    } else if (cont.startsWith(prefix + "news")) {
      acao.logger(`Comando news chamdo por ${message.author.username}`);
      acao.pegaNoticia(message);
    }
  }
});

Bot.login(token.token);
