const { Client, Partials, Collection } = require("discord.js");
const config = require("./config");
const { readdirSync } = require('fs');
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10");
const rest = new REST({ version: '10' }).setToken(config.token);

const client = new Client({
    intents: 3276799,
    shards: "auto",
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember
    ],
    autoReconnect: true
});

client.commands = new Collection();
client.config = require("./config");

console.log("[Index] Loading handlers")

// -----------> Commands Slash Handler <-----------
console.log("[Handlers - Slash] Loading Prefix Commands")

const commands = [];
readdirSync("./src/commands/").forEach(dir => {
    readdirSync(`./src/commands/${dir}`).forEach(file => {
        try {
            const command = require(`./src/commands/${dir}/${file}`);
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`- /${command.data.name} has sucessfully loaded`)
        } catch (err) {
            console.log(err);
        }
    });
});
console.log(`Successfully reloaded application (/) commands.`);
console.log(`[Handlers - Slash] Finished loading Slash Command.`)

client.on("ready", async () => {
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }
});
console.log(`Successfully reloaded application (/) commands.`);
console.log(`[Handlers - Slash] Finished loading Slash Command.`)

// -----------> Events Handler <-----------
console.log(`[Event Handler] Started loading events!`)

readdirSync("./src/events/").forEach(dir => {
    readdirSync(`./src/events/${dir}`).forEach(file => {
        try {
            const event = require(`./src/events/${dir}/${file}`);
            event.once ? client.once(event.name, (...args) => event.execute(client, ...args)) : client.on(event.name, (...args) => event.execute(client, ...args));
            console.log(`- Event ${event.name} has loaded`)
        } catch (err) {
            console.log(err);
        }
    });
});        
console.log(`[Event Handler] Finished loading events!`)



// Anti Crash
console.log(`[Anti Crash] Anti Crash has been operational!`)

process.on("unhandledRejection", err => {
    console.log(err)
})
process.on("uncaughtException", err => {
    console.log(err)
})
process.on("uncaughtExceptionMonitor", err => {
    console.log(err)
})
console.log("[Index] Finished loading handlers")

client.login(config.token)