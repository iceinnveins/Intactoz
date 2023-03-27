const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'quem',
    description: 'quem.',
    type: 1,
    options: [{type: 6, description: 'quem.', required: true }],

  run: async (interaction, args) => {
    var fortunes = [
        "Quem?",
    ];
    
    await interaction.reply(
      fortunes[Math.floor(Math.random() * fortunes.length)]
    );
  },
};