const Discord = require("discord.js")

const discordTranscripts = require('discord-html-transcripts')

const config = require("./config.json")

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds
    ]
});

//FORM STAFF INICIO
client.on("interactionCreate", async(interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "formulario") {
            if (!interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
            const modal = new Discord.ModalBuilder()
                .setCustomId("modal")
                .setTitle("Formulário");

            const pergunta1 = new Discord.TextInputBuilder()
                .setCustomId("pergunta1") // Coloque o ID da pergunta
                .setLabel("Qual e seu nome/sobrenome?") // Coloque a pergunta
                .setMaxLength(20) // Máximo de caracteres para a resposta
                .setPlaceholder("Nome/Sobrenome") // Mensagem que fica antes de escrever a resposta
                .setRequired(true) // Deixar para responder obrigatório (true | false)
                .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)

            const pergunta2 = new Discord.TextInputBuilder()
                .setCustomId("pergunta2") // Coloque o ID da pergunta
                .setLabel("Qual e sua idade?") // Coloque a pergunta
                .setMaxLength(2) // Máximo de caracteres para a resposta
                .setPlaceholder("Idade") // Mensagem que fica antes de escrever a resposta
                .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
                .setRequired(true)

            const pergunta3 = new Discord.TextInputBuilder()
                .setCustomId("pergunta3") // Coloque o ID da pergunta
                .setLabel("Qual e seu horario disponivel?") // Coloque a pergunta
                .setPlaceholder("Manhã/Tarde/Noite/Madrugada") // Mensagem que fica antes de escrever a resposta
                .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
                .setRequired(true)

            const pergunta4 = new Discord.TextInputBuilder()
                .setCustomId("pergunta4") // Coloque o ID da pergunta
                .setLabel("Informe seu melhor email") // Coloque a pergunta
                .setPlaceholder("exemplo@gmail.com") // Mensagem que fica antes de escrever a resposta
                .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
                .setRequired(true)

            const pergunta5 = new Discord.TextInputBuilder()
                .setCustomId("pergunta5") // Coloque o ID da pergunta
                .setLabel("Porque devemos te aceitar na STAFF?") // Coloque a pergunta
                .setMaxLength(1000)
                .setPlaceholder("Motivo") // Mensagem que fica antes de escrever a resposta
                .setStyle(Discord.TextInputStyle.Paragraph) // Tipo de resposta (Short | Paragraph)
                .setRequired(true)


            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(pergunta1),
                new Discord.ActionRowBuilder().addComponents(pergunta2),
                new Discord.ActionRowBuilder().addComponents(pergunta3),
                new Discord.ActionRowBuilder().addComponents(pergunta4),
                new Discord.ActionRowBuilder().addComponents(pergunta5)

            )

            await interaction.showModal(modal)
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "modal") {
            let resposta1 = interaction.fields.getTextInputValue("pergunta1")
            let resposta2 = interaction.fields.getTextInputValue("pergunta2")
            let resposta3 = interaction.fields.getTextInputValue("pergunta3")
            let resposta4 = interaction.fields.getTextInputValue("pergunta4")
            let resposta5 = interaction.fields.getTextInputValue("pergunta5")


            if (!resposta1) resposta1 = "Não informado."
            if (!resposta2) resposta2 = "Não informado."
            if (!resposta3) resposta3 = "Não informado."
            if (!resposta4) resposta4 = "Não informado."
            if (!resposta5) resposta5 = "Não informado."


            let embed = new Discord.EmbedBuilder()
                .setColor("303136")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Usuario:** ${interaction.user}\n**ID:** \`${interaction.user.id}\``)
                .addFields(
                    {
                        name: `Nome`,
                        value: `\`\`\`${resposta1}\`\`\``,
                        inline: true
                    },
                    {
                        name: `Idade`,
                        value: `\`\`\`${resposta2}\`\`\``,
                        inline: true
                    },
                    {
                        name: `Horarios`,
                        value: `\`\`\`${resposta3}\`\`\``,
                        inline: true
                    },
                    {
                        name: `Email`,
                        value: `\`\`\`${resposta4}\`\`\``,
                        inline: true
                    },
                    {
                        name: `Motivo`,
                        value: `\`\`\`${resposta5}\`\`\``,
                        inline: false
                    }
                );

            interaction.reply({ embeds: [ new Discord.EmbedBuilder().setDescription(`**${interaction.user},** Seu formulário foi enviado com sucesso. Aguarde a resposta no seu privado!`)
                    .setColor("303136")
                ],
                ephemeral: true,
            })
            await interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`)).send({ embeds: [embed] })
        }
    }
})
//FORMULARIO STAFF - FIM



const { QuickDB } = require("quick.db")
const db = new QuickDB(); // npm i quick.db better-sqlite3

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    let confirm = await db.get(`antilink_${message.guild.id}`);
    if (confirm === false || confirm === null) {
        return;
    } else if (confirm === true) {
        if (message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return; // Caso o usuário tenha permissão de ADM, o bot vai permitir que o mesmo envie links
        if (message.content.toLocaleLowerCase().includes("http")) {
            message.delete()
            message.channel.send(`${message.author} Não envie links no servidor!`)
        }

    }
})


module.exports = client

client.on('interactionCreate', (interaction) => {

    if(interaction.type === Discord.InteractionType.ApplicationCommand){

        const cmd = client.slashCommands.get(interaction.commandName);

        if (!cmd) return interaction.reply(`Error`);

        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction)

    }
})

client.on('ready', () => {
    console.log(`🔥 Estou online em ${client.user.username}!`)
})


client.slashCommands = new Discord.Collection()

require('./Handler')(client)

client.login(config.token)

//EVENTS LOGS ENTRADA E SAIDA
client.on("guildMemberRemove", (member) => {
    let canal_logs = "1068948430132621363"; // Coloque o ID do canal de texto
    if (!canal_logs) return;

    let embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Adeus ${member.user.username}....`)
        .setDescription(`> O usuário ${member} saiu do servidor!\n> 😓 Espero que retorne um dia.\n> Nos sobrou apenas \`${member.guild.memberCount}\` membros.`);

    member.guild.channels.cache.get(canal_logs).send({ embeds: [embed], content: `${member}` }) // Caso queira que o usuário não seja mencionado, retire a parte do "content".
})

//VERIFICAÇÃO
client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "verificar") {
      let role_id = await db.get(`cargo_verificação_${interaction.guild.id}`);
      let role = interaction.guild.roles.cache.get(role_id);
      if (!role) return;
      interaction.member.roles.add(role.id)
      interaction.reply({ content: `Ola **${interaction.user.username}**, você foi verificado!`, ephemeral: true })
    }
  }
})
//VERIFICAÇÃO FIM

//TICKETS

client.on("interactionCreate", async (interaction) => {

  if (interaction.isModalSubmit()) {

    if (interaction.customId === 'modal_ticket') {

      const titulo = interaction.fields.getTextInputValue('titulo');
      const descrição = interaction.fields.getTextInputValue('descrição');

      const titulo02 = interaction.fields.getTextInputValue('titulo02');
      const descrição02 = interaction.fields.getTextInputValue('descrição02');

      await db.set(`titulo02_${interaction.guild.id}`, titulo02);
      await db.set(`descrição02_${interaction.guild.id}`, descrição02);

      let button_name = await db.get(`nome_button_abrir_${interaction.guild.id}`);

      const embed = new Discord.EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({ name: `${titulo}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setDescription(descrição)
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})

      const button = new Discord.ButtonBuilder()
        .setCustomId('ticket')
        .setLabel(button_name)
        .setStyle(2)
        .setEmoji('📨')

      const row = new Discord.ActionRowBuilder().setComponents(button)

      let channel = await db.get(`mensagem_ticket_canal_${interaction.guild.id}`);
      let canal = interaction.guild.channels.cache.get(channel);

      canal.send({ embeds: [embed], components: [row]})

      await interaction.deferUpdate()
    }
  }

  if (interaction.isButton) {

    let cargo = await db.get(`cargo_ticket_${interaction.guild.id}`);

    if (interaction.customId === 'ticket') {

      if (interaction.guild.channels.cache.find((c) => c.topic === interaction.user.id)) { interaction.reply({ content: `**🚷 Calma, Você já tem um ticket criado -> ${interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)}.**`, ephemeral: true }) }

      let categoria = await db.get(`categoria_ticket_${interaction.guild.id}`);

      interaction.guild.channels.create({
        name: `🔖・ticket--${interaction.user.username}`,
        type: Discord.ChannelType.GuildText,
        topic: `${interaction.user.id}`,
        parent: categoria,
        permissionOverwrites: [
          {
            id: cargo,
            allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.AttachFiles, Discord.PermissionFlagsBits.EmbedLinks, Discord.PermissionFlagsBits.AddReactions]
          },
          {
            id: interaction.guild.id,
            deny: [Discord.PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.AttachFiles, Discord.PermissionFlagsBits.EmbedLinks, Discord.PermissionFlagsBits.AddReactions]
          }

        ]

      }).then( async (channel) => {

        let titulo = await db.get(`titulo02_${interaction.guild.id}`);

        let descrição = await db.get(`descrição02_${interaction.guild.id}`);

        let iniciado = new Discord.EmbedBuilder()
          .setColor('#2f3136')
          .setAuthor({ name: `Suporte - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setDescription(`Olá ${interaction.user}, Seu ticket foi criado com sucesso.`)
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })

        let atalho = new Discord.ButtonBuilder()
          .setLabel('Atalho')
          .setURL(channel.url)
          .setStyle(Discord.ButtonStyle.Link)

        const butão = new Discord.ActionRowBuilder().addComponents(atalho);

        interaction.reply({ embeds: [iniciado], components: [butão], ephemeral: true })

        let criado = new Discord.EmbedBuilder()
          .setColor('#2f3136')
          .setAuthor({ name: titulo, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setDescription(descrição)
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })

        let fechar = new Discord.ButtonBuilder()
          .setCustomId('close')
          .setStyle(2)
          .setLabel('Fechar')

        const deletar = new Discord.ActionRowBuilder().addComponents(fechar);

        channel.send({ embeds: [criado], components: [deletar] }).then(m => { m.pin() })

      })

    }

    if (interaction.customId === 'close') {

      let ticket = interaction.channel.topic

      interaction.channel.edit({

        permissionOverwrites: [
          {
            id: cargo,
            allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.AttachFiles, Discord.PermissionFlagsBits.EmbedLinks, Discord.PermissionFlagsBits.AddReactions],
          },
          {
            id: ticket,
            deny: [Discord.PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.guild.id,
            deny: [Discord.PermissionFlagsBits.ViewChannel],
          }

        ],

      })

      let embed = new Discord.EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setDescription(`O Membro ${interaction.user}\`(${interaction.user.id})\` Fechou o ticket, Escolha uma opção abaixo. `)

      let botoes = new Discord.ActionRowBuilder().addComponents([

        new Discord.ButtonBuilder()
          .setStyle(Discord.ButtonStyle.Success)
          .setLabel('Reabrir')
          .setCustomId('reabrir'),
        new Discord.ButtonBuilder()
          .setStyle(Discord.ButtonStyle.Danger)
          .setLabel('Deletar')
          .setCustomId('deletar')])


      interaction.reply({ embeds: [embed], components: [botoes] })

    }

    if (interaction.customId === 'reabrir') {

      interaction.message.delete()

      let ticket = interaction.channel.topic

      interaction.channel.edit({

        permissionOverwrites: [
          {
            id: cargo,
            allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.AttachFiles, Discord.PermissionFlagsBits.EmbedLinks, Discord.PermissionFlagsBits.AddReactions],
          },
          {
            id: ticket,
            allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.AttachFiles, Discord.PermissionFlagsBits.EmbedLinks, Discord.PermissionFlagsBits.AddReactions],
          },
          {
            id: interaction.guild.id,
            deny: [Discord.PermissionFlagsBits.ViewChannel],
          }

        ],

      })

      let embed = new Discord.EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setDescription(`Olá <@${ticket}>, O Membro ${interaction.user} Reabriu seu ticket.`)

      let button = new Discord.ButtonBuilder()
        .setLabel('Apagar Mensagem')
        .setStyle(2)
        .setCustomId('msg')

      const row = new Discord.ActionRowBuilder().addComponents(button)

      interaction.channel.send({ content: `<@${ticket}>`, embeds: [embed], components: [row] })

    }

    if (interaction.customId === 'msg') {

      interaction.message.delete()

    }

    if (interaction.customId === 'deletar') {

      const topic = interaction.channel.topic

      const channel = interaction.channel

      const attachment = await discordTranscripts.createTranscript(channel);

      interaction.channel.delete()

      let embed = new Discord.EmbedBuilder()
        .setDescription(`Ticket de <@${topic}>\`(${topic})\` \n Deletado por ${interaction.user}\`(${interaction.user.id})\``)
        .setColor("#2f3136")
        .setTimestamp()

      let chat_log = await db.get(`canal_log_${interaction.guild.id}`);
      let canal = interaction.guild.channels.cache.get(chat_log)

      canal.send({ embeds: [embed], files: [attachment] })

    }

  }

})