const Discord = require('discord.js')
const { QuickDB } = require("quick.db") //npm i quick.db better-sqlite3
const db = new QuickDB()

module.exports = {
    name: 'config',
    description: 'Configração.',
    options: [
        {
            name: 'ticket',
            description: 'Sistema de Ticket.',
            type: Discord.ApplicationCommandOptionType.Subcommand,
            options: [

                {
                    name: 'canal',
                    description: 'Canal que a mensagem para criar ticket será enviada.',
                    type: Discord.ApplicationCommandOptionType.Channel,
                    channelTypes: [Discord.ChannelType.GuildText],
                    required: true
                },
                {
                    name: 'canal_log',
                    description: 'Canal que as logs será enviada.',
                    type: Discord.ApplicationCommandOptionType.Channel,
                    channelTypes: [Discord.ChannelType.GuildText],
                    required: true
                },
                {
                    name: 'categoria',
                    description: 'Selecione uma categoria a qual os tickets serão criados.',
                    type: Discord.ApplicationCommandOptionType.Channel,
                    channelTypes: [Discord.ChannelType.GuildCategory],
                    required: true
                },
                {
                    name: 'nome_botao',
                    description: 'Qual o nome do botão que abrirar o ticket ?.',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'cargo',
                    description: 'Cargo que podera ver os tickets.',
                    type: Discord.ApplicationCommandOptionType.Role,
                    required: true
                },



            ],

        }

    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: `❌ **Calma! Você precisar ser um admin para usar o meu sistema de ticket!**`, ephemeral: true })

        else {

            let canal = interaction.options.getChannel('canal')
            await db.set(`mensagem_ticket_canal_${interaction.guild.id}`, canal.id);

            let canal_log = interaction.options.getChannel('canal_log')
            await db.set(`canal_log_${interaction.guild.id}`, canal_log.id);

            let categoria = interaction.options.getChannel('categoria')
            await db.set(`categoria_ticket_${interaction.guild.id}`, categoria.id);

            let button = interaction.options.getString('nome_botao')
            await db.set(`nome_button_abrir_${interaction.guild.id}`, button);
            
            let cargo = interaction.options.getRole('cargo')
            await db.set(`cargo_ticket_${interaction.guild.id}`, cargo.id);

            let modal = new Discord.ModalBuilder()
                .setCustomId('modal_ticket')
                .setTitle('Mensagem Ticket');

            let titu = new Discord.TextInputBuilder()
                .setCustomId('titulo')
                .setLabel("Titulo (Para abrir ticket)")
                .setStyle(1)
                .setPlaceholder('Digite o titulo (Primeira Linha)')
                .setRequired(false);

            let desc = new Discord.TextInputBuilder()
                .setCustomId('descrição')
                .setLabel("Descrição da mensagem (Para abrir ticket)")
                .setStyle(2)
                .setPlaceholder('Digite a Descrição.')
                .setRequired(false)

            let titu02 = new Discord.TextInputBuilder()
                .setCustomId('titulo02')
                .setLabel("Titulo (Dentro do ticket)")
                .setStyle(1)
                .setPlaceholder('Digite o titulo (Primeira Linha)')
                .setRequired(false);

            let desc02 = new Discord.TextInputBuilder()
                .setCustomId('descrição02')
                .setLabel("Descrição da mensagem (Dentro do ticket)")
                .setStyle(2)
                .setPlaceholder('Digite a Descrição.')
                .setRequired(false)

            const titulo = new Discord.ActionRowBuilder().addComponents(titu);
            const descrição = new Discord.ActionRowBuilder().addComponents(desc);
            const titulo02 = new Discord.ActionRowBuilder().addComponents(titu02);
            const descrição02 = new Discord.ActionRowBuilder().addComponents(desc02);

            modal.addComponents(titulo, descrição, titulo02, descrição02);

            await interaction.showModal(modal);

        }

    }

}