const { PermissionFlagsBits } = require("discord.js");
const Discord = require("discord.js")
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  name: "avaliar", // Coloque o nome do comando
  description: "Avalie um staff usando este comando.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "staff",
        description: "Insira o staff para ser avaliado.",
        type: Discord.ApplicationCommandOptionType.User,
        required: true,
    },
    {
      name: "feedback",
      description: "Seu feedback para o staff",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
  },
  {
    name: "nota",
    description: "Insira uma nota para o membro da equipe (1 a 10)",
    type: Discord.ApplicationCommandOptionType.Number,
    required: true,
  },
],


  run: async (client, interaction) => {

    const canal = interaction.guild.channels.cache.get("1075252735336796171") /// canal para avaliações
     if (!canal) {
      interaction.reply({content: `O ID do canal ainda não foi configurado no script.`, ephemeral: true})
     } else {
      const staff = interaction.options.getMember("staff")
    const feedback = interaction.options.getString("feedback");
    const nota = interaction.options.getNumber("nota");
    const roleId = [""];/// ID do cargo, pode adicionar mais caso queira..
    const role = interaction.guild.roles.cache.find(role => roleId.includes(role.id));

if (!role) {
  interaction.reply({ content: `Erro de Cargo no Script`, ephemeral: true });
} else {
  if (!staff.roles.cache.has(role.id)) { 
    let embed = new Discord.EmbedBuilder()
    .setDescription(`**Olá** ${interaction.user}**, o usuário que foi mencionado não é da equipe, verifique que mencionou o usuário corretamente.** \n\n **Log do feedback : \`${feedback}\`\n Nota:** \`${nota}/10\``)
    .setColor("Red")
    .setFooter({text: `O Usuário que iria ser mencionado: ${staff.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
    interaction.reply({ephemeral: true, embeds: [embed] });
    return;
  } else {

  if (nota > 10 || nota < 1) {
    let embed = new Discord.EmbedBuilder()
    .setDescription(`**Olá ${interaction.user},  insira um número inteiro dentro do intervalo de \`1 a 10\`.** \n\n **Log do feedback : \`${feedback}\`\n Nota errada inserida:** \`${nota}/10\``)
    .setColor("Red")
    .setFooter({text: `O Staff que iria ser mencionado: ${staff.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
    interaction.reply({ephemeral: true, embeds: [embed] });
      return;
    } else {
      
      let embed = new Discord.EmbedBuilder()
      .setTitle('titulo')
      .setColor('Red')
      .setFooter({text: `censurado por motivos óbvios`, iconURL: 'o icone do bot'})
       .addFields(
        {name: 'Usuário da Avaliação:', value: `${interaction.user}`, inline: true}, 
        {name: 'Staff avaliado:', value: `${staff}`, inline: true },
         {name: 'Nota:', value: `\`${nota}/10\``, inline: false},
         {name: 'Feedback do membro:', value: `\`${feedback}\``, inline: false },
       )
       .setThumbnail('também por motivos óbvios')
   
       interaction.reply({content: `✅ Sua avaliação foi enviada com sucesso!`, ephemeral: true})
     canal.send({embeds: [embed]})
     }
    }
    }
  }
  }
}
