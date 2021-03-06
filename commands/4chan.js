const https = require('https');

exports.run = (client, message, args) => {
    const boards = [
        "a", "b", "c", "d", "e", "f", "g", "gif", "h", "hr", "k", "m", "o", "p", "r", "s", "t", "u", "v", "vg", "vr", "w", "wg", "i", "ic", "r9k", "s4s", "vip", "qa", "cm", "hm", "lgbt", "y", "3", "aco", "adv", "an", "asp", "bant", "biz", "cgl", "ck", "co", "diy", "fa", "fit", "gd", "hc", "his", "int", "jp", "lit", "mlp", "mu", "n", "news", "out", "po", "pol", "qst", "sci", "soc", "sp", "tg", "toy", "trv", "tv", "vp", "wsg", "wsr"
    ];

    if(args.length < 2){
        message.channel.send("No board specified");
        return;
    }

    if (message.channel.nsfw == false){
        return message.reply('due to We Out Here\'s rules, 4chan can only be used in NSFW channels, as the content of the command may not be appropriate for all ages.');
    }
    // print all boards
    if(args.length == 2){
        if(args[1] === "boards"){
            var msg = "";
            for(var i = 0; i < boards.length; i++){
                msg += boards[i] + ",";
            }
            msg = msg.substring(0, msg.length - 2); // remove ", " at end
            message.channel.send("```" + msg + "```");
            return;
        }
    }

    var board = args[1]; // first argument
    if(boards.indexOf(board) == -1){
        message.channel.send("Invalid board");
        return;
    }

    var page = Math.floor((Math.random() * 10) + 1);  // page 1 to 10
    var url = "https://a.4cdn.org/" + board + "/" + page + ".json"
    console.log(url);

    https.get(url, res => {
        res.setEncoding('utf8');
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", end => {
            body = JSON.parse(body);
            //console.log(body);  // debug
            var postNr = Math.floor(Math.random() * body.threads.length);
            var imgId = body.threads[postNr].posts[0].tim;
            var imgExt = body.threads[postNr].posts[0].ext;
            var com = body.threads[postNr].posts[0].com;

            // format text
            if(com == null){
                com = "";
            }else{
                /* (/A/g, "B") = replace all A's with B's */
                com = com.replace(/<br>/g, "\n");
                com = com.replace(/<span class=\"quote\">&gt;/g, ">");
                com = com.replace(/<\/span>/g, "");
                com = com.replace(/&quot/g, '"');
                com = com.replace(/&#039;/g, "'");
            }

            var thread = "http://boards.4chan.org/"+ board +"/thread/";
            thread += body.threads[postNr].posts[0].no;
            var imgUrl = "http://i.4cdn.org/" + board + "/";
            imgUrl += imgId + "" + imgExt;
            message.channel.send(com + "\n" + thread + "\n" + imgUrl).then(() => {
                console.log(">4chan: b:" + board + " p:" + page + " post:" + postNr + " " + thread);
            });
        });
    });
};


exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['4c'],
  permLevel: 0
}
module.exports.help = {
  name: '4chan',
  description: 'Look throughout the world of 4chan',
  usage: '4chan board [board]'
}