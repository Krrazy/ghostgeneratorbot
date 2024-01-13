// Dependencies
const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
  name: 'stok', // Command name
  description: 'stokları atar.', // Command description

  /**
   * Command execute
   * @param {Message} message The message sent by user
   */
  execute(message) {
    // Arrays
    const stock = [];

    // Read all of the services
    fs.readdir(`${__dirname}/../stock/`, function (err, files) {
      // If cannot scan the directory
      if (err) return console.log('Unable to scan directory: ' + err);

      // Put services into the stock
      files.forEach(function (file) {
        if (!file.endsWith('.txt')) return;
        stock.push(file);
      });
message.react('1195471797072695326')
      const embed = new MessageEmbed()
        .setColor(config.color.default)
        .setTitle(`<:ghost_greenduyuru:1195472652178030723> ${message.guild.name} sunucusunda **${stock.length}** servis aktif`)
        .setDescription('');

      // Loop over each service
      stock.forEach(async function (data) {
        const acc = fs.readFileSync(`${__dirname}/../stock/${data}`, 'utf-8');

        // Get number of lines
        const lines = acc.split(/\r?\n/);

        // Update embed description message
        embed.description += `**${data.replace('.txt', '')}:** \`${lines.length}\`\n`;
      });

      // Sort the stock by the number of lines in ascending order
      stock.sort(function (a, b) {
        const aAcc = fs.readFileSync(`${__dirname}/../stock/${a}`, 'utf-8');
        const bAcc = fs.readFileSync(`${__dirname}/../stock/${b}`, 'utf-8');
        return aAcc.split(/\r?\n/).length - bAcc.split(/\r?\n/).length;
      });

      // Get the four services with the least stock
      const leastStockServices = stock.slice(0, 4);

      // Format the least stock services with line count
      const formattedServices = leastStockServices.map((service) => {
        const acc = fs.readFileSync(`${__dirname}/../stock/${service}`, 'utf-8');
        const lines = acc.split(/\r?\n/).length;
        return `${service.replace('.txt', '')} (${lines} )`;
      });

      // Add the least stock services to the footer
      embed.setFooter(`En az stok: ${formattedServices.join(' ')}`);

      message.channel.send(embed);
    });
  },
};
