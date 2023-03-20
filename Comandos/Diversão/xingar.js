const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'xingar',
    description: 'Xingue o blackwin.',
    type: 1,
    options: [{name: 'user', type: 6, description: 'Marque o otário do black.', required: true }],

  run: async (client, interaction, args) => {
    
    var fortunes = [
        "VAI SE FUDER <@414010792837644299>",
    ];
    await interaction.reply(
      fortunes[Math.floor(Math.random() * fortunes.length)]
    );
  },
};