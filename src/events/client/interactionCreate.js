const { Interaction, InteractionType } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    once: false,

    /**
     * @param {Interaction} interaction
     */

    async execute(client, interaction) {
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = client.commands.get(interaction.commandName);
            if (command) {
                command.run(client, interaction);
            }
        }
    }
}