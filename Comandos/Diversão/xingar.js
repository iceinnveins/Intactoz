const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'pablin',
    description: 'Pablin volte a call.',
    type: 1,
    options: [{name: 'user', type: 6, description: 'pablin!.', required: true }],

  run: async (client, interaction, args) => {
    
    var fortunes = [
        "VAI SE FUDER <@392343585627963393>",
    ];
    await interaction.reply(
      fortunes[Math.floor(Math.random() * fortunes.length)]
    );
  },
};