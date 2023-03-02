const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'xingar',
    description: 'Xingue o blackwin.',
    type: 1,
    options: [{name: 'user', type: 6, description: 'Coloque um usuário.', required: true }],

  run: async (client, interaction, args) => {
    
    var fortunes = [
        "VAI SE FUDER BlackWin",
    ];
    await interaction.reply(
      fortunes[Math.floor(Math.random() * fortunes.length)]
    );
  },
};