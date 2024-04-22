const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    category: "Public",
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Permet de voir la latence du bot")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    run: async (client, interaction) => {
        const msg = await interaction.reply({ content: `🏓 Calcul de la latence...`, fetchReply: true });

        const latency = msg.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = client.ws.ping;

        let latencyStatus;
        if (latency <= 200) {
            latencyStatus = "Faible";
        } else if (latency > 200 && latency <= 500) {
            latencyStatus = "Moyen";
        } else {
            latencyStatus = "Élevée";
        }

        msg.edit({ content: `🏓 Pong!\nLatence du bot : \`${latency}\`ms ( ${latencyStatus} )\nLatence de l'API Discord : \`${apiLatency}\`ms` })
    }
}