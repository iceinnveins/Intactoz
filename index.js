const Discord = require("discord.js")

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
  if (interaction.isButton()) {
    if (interaction.customId === "tickets_basico") {
      let nome_canal = `🔖-${interaction.user.id}`;
      let canal = interaction.guild.channels.cache.find(c => c.name === nome_canal);

      if (canal) {
        interaction.reply({ content: `Olá **${interaction.user.username}**, você já possui um ticket em ${canal}.`, ephemeral: true})
      } else {

        let categoria = interaction.channel.parent;
        if (!categoria) categoria = null;

        interaction.guild.channels.create({

          name: nome_canal,
          parent: categoria,
          type: Discord.ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [ Discord.PermissionFlagsBits.ViewChannel ]
            },
            {
              id: interaction.user.id,
              allow: [
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.AddReactions,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.AttachFiles,
                Discord.PermissionFlagsBits.EmbedLinks
              ]
            },
          ]

        }).then( (chat) => {

          interaction.reply({ content: `Olá **${interaction.user.username}**, seu ticket foi aberto em ${chat}.`, ephemeral: true })

          let embed = new Discord.EmbedBuilder()
          .setColor("Random")
          .setDescription(`Olá ${interaction.user}, você abriu o seu ticket.\nAguarde um momento para ser atendido.`);

          let botao_close = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("close_ticket")
            .setEmoji("🔒")
            .setStyle(Discord.ButtonStyle.Danger)
          );

          chat.send({ embeds: [embed], components: [botao_close] }).then(m => {
            m.pin()
          })

        })
      }
    } else if (interaction.customId === "close_ticket") {
      interaction.reply(`Olá ${interaction.user}, este ticket será excluído em 5 segundos.`)
      try {
        setTimeout( () => {
          interaction.channel.delete().catch( e => { return; } )
        }, 5000)
      } catch (e) {
        return;
      }
      
    }
  }
})