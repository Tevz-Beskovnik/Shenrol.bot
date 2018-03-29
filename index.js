const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs")
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Couldn't find commands.")
        return;
    }

   jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
   });

});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("say *help for help");
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  

  if(cmd === `${prefix}hello`){
      return message.channel.send("Hello!");
  }

  if(cmd === `${prefix}goSuckABigOne`){
      return message.channel.send("No u");
  }

  if(cmd === `${prefix}help`){

      let bicon = bot.user.displayAvatarURL;
      let botembed = new Discord.RichEmbed()
      .setThumbnail(bicon)
      .setTitle("Bot Help Commands")
      .setColor("#42f445")
      .addField("*iHelp", "For informations help.")
      .addField("*fHelp", "For fun help.")
      .addField("*aHelp", "For administrator help.")

      return message.channel.send(botembed);
  }

  if(cmd === `${prefix}iHelp`){

    let infoEmbed = new Discord.RichEmbed()
    .setTitle("Information Help")
    .setColor("#1c00ff")
    .addField("*serverInfo", "To get server informations.")
    .addField("*botInfo", "For bot informations.")
    .addField("*levelInfo", "To find out your level informations.");

    message.channel.send(infoEmbed);
    return;
  }

  if(cmd === `${prefix}fHelp`){

    let funEmbed = new Discord.RichEmbed()
    .setTitle("Fun Stuff Help")
    .setColor("#1c00ff")
    .addField("*joke", "For a joke.")
    .addField("*8ball 'question' ?","To get your bigest mysteries anwsered.")
    .addField("*hello", "For a nice greating")
    .addField("*noU", "For a endles loop.");

    message.channel.send(funEmbed);
    return;
  }

  if(cmd === `${prefix}aHelp`){

    let aEmbed = new Discord.RichEmbed()
    .setTitle("Admin help")
    .setColor("#1c00ff")
    .addField("*report 'name' 'reason'", "This command is used to report players, for this command a reports channel is needed.")
    .addField("*kick 'name' 'reason'", "This is the kick command it can only be accased by administratos, for this command a incidents channel is needed.")
    .addField("*ban 'name' 'reason'", "This is the ban command and is only accaseble by administrators, for this command a incidents channel is needed.")

    message.channel.send(aEmbed);
    return;
  }

  if(cmd === `${prefix}botInfo`){

     let bicon = bot.user.displayAvatarURL;
     let botembed = new Discord.RichEmbed()
     .setThumbnail(bicon)
     .setDescription("Bot information")
     .setColor("#f44242")
     .addField("Bot name:", bot.user.username)
     .addField("Bot creation date:", bot.user.createdAt)
     .addField("Bot description:", "This bot was created for testing porpuses only.");

      return message.channel.send(botembed);
  }

  if(cmd === `${prefix}serverInfo`){

     let sicon = message.guild.displayAvatarURL;
     let serverembed = new Discord.RichEmbed()
     .setThumbnail(sicon)
     .setDescription("Server information")
     .setColor("#4292f4")
     .addField("Server name:", message.guild.name)
     .addField("server created:", message.guild.createdAt)
     .addField("Joined server:", message.member.joinedAt)
     .addField("Total members:", message.guild.memberCount);

      return message.channel.send(serverembed)
  }

  if(cmd === `${prefix}noU`){
      return message.channel.send("No U.");
  } 

  if(cmd === `${prefix}joke`){
      let jReplies = ["You.", "What is a alcoholic bevrage for males? -A cocktail.", "What concert costs 45 cents? -50 Cent featuring Nickelback.", "What are the strongest days of the week? -Saturday and Sunday. All the rest are weak-days.", "Why do seagulls live by the sea? -Cause if they lived by the bay, they'd be bagels.", "Did you hear about the new striper? -Shes making head lines.", "My Grandpa had the heart of a lion... And a life time ban from the Zoo.", "Never trust an atom... They make up everything!", "What is Beethoven's favorite fruit? -Ba-na-na-nas.", "What do vegetarian zombies say? -Grrrrrainnnnnssss.", "A backwards poet writes inverse.", "I was wondering why the baseball was getting bigger. Then it hit me.", "What's brown and sticky? A stick."];

      let jResault = Math.floor((Math.random() *jReplies.length));

      message.channel.send(jReplies[jResault]);
      return;
  }

  if(cmd === `${prefix}report`){

    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't find user.");
    let reason = args.join(" ").slice(22);
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You need to be a adminsistrator.");
    if(rUser.hasPermission("ADMINISTRATOR")) return message.channel.send("That peron has the same or higher permissions.");
    
    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Report")
    .setColor("#f2ff00")
    .addField("Reported user:", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported by:", `${message.author}`)
    .addField("Channel", message.channel)
    .addField("Time of report:", message.createdAt)
    .addField("Reason:", reason);

    let reportsChannel = message.guild.channels.find(`name`, "reports")
    if(!reportsChannel) return message.channel.send("Couldn't find reports channel.");

    message.delete().catch(O_o=>{});
    reportsChannel.send(reportEmbed);

    return;
  }

  if(cmd === `${prefix}kick`){
    
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Can't find person");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You need to be a adminsistrator.");
    if(kUser.hasPermission("ADMINISTRATOR")) return message.channel.send("That peron has the same or higher permissions.");

    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("#ff9400")
    .addField("Kicked user:", `${kUser} with ID: ${kUser.id}`)
    .addField("kicked By:", `${message.author}`)
    .addField("Reason:", kReason)
    .addField("Time:", message.createdAt);

    let kickChannel = message.guild.channels.find(`name`, "incidents");
    if(!kickChannel) return message.channel.send("There is not an existend incidents channel.");

    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);

    return;
  }

  if(cmd === `${prefix}ban`){

    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Can't find person");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You need to be a adminsistrator.");
    if(bUser.hasPermission("ADMINISTRATOR")) return message.channel.send("That peron has the same or higher permissions.");

    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#ff0000")
    .addField("Baned user:", `${bUser} with ID: ${bUser.id}`)
    .addField("Baned By:", `${message.author}`)
    .addField("Reason:", bReason)
    .addField("Time:", message.createdAt);

    let banChannel = message.guild.channels.find(`name`, "incidents");
    if(!banChannel) return message.channel.send("There is not an existend incidents channel.");

    message.guild.member(bUser).ban(bReason);
    banChannel.send(banEmbed);

    return;
  }
  
  if(cmd === `${prefix}8ball`){
  if(!args[1]) return message.reply("Please ask a full question.")
  let replies = ["Yes.", "No.", "Never.", "Maybe.", "I don't know.", "Ask me again later."];

  let resault = Math.floor((Math.random() * replies.length));
  let question = args.slice(1) .join(" ");

  message.channel.send(replies[resault]);
  return;
  }

  let xp = require("./xp.json");

  let xpAdd = Math.floor(Math.random() * 7) + 8;
  console.log(xpAdd);

  if(!xp[message.author.id]){
      xp[message.author.id] = {
        xp: 0,
        level: 0
      };
  }
  
  
  let curXp = xp[message.author.id].xp;
  let curLvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 900;
  xp[message.author.id].xp = curXp + xpAdd;
  if(nxtLvl <= xp[message.author.id].xp){
      xp[message.author.id].level = curLvl + 1;
      let lvlUp = new Discord.RichEmbed()
      .setTitle("Level up!")
      .setColor("#a800a5")
      .addField("your current level is:",  curLvl + 1)

      message.channel.send(lvlUp)
      return;
  
  }

  if(cmd === `${prefix}levelInfo`){
      let pIcon = message.author.displayAvatarURL
      let levelEmbed = new Discord.RichEmbed()
      .setTitle("Level")
      .setColor("#ff5d00")
      .setThumbnail(pIcon)
      .addField("Your current level is:", curLvl)
      .addField("Your current xp is:", curXp);

      message.channel.send(levelEmbed)
      return;
  }

  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
});

  console.log(`level is ${xp[message.author.id].level}`);

});

bot.login(botconfig.token)
