const Discord = require('discord.js');
const client = new Discord.Client();
const request = require("request");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const baseurl = 'https://moodle.sertao.ifrs.edu.br';
const username = process.env.MOODLEUSER;
const password = process.env.MOODLEPASS;

const login = (baseurl,username,password)=> new Promise((re,err)=>{
    request(`${baseurl}/login/token.php?username=${username}&password=${password}&service=moodle_mobile_app`, function (error, response, body) {
        console.log(JSON.parse(body))
        re(JSON.parse(body))
    })
})

const core_calendar_get_calendar_upcoming_view = (baseurl,token)=> new Promise((re,err)=>{
    request(`${baseurl}/webservice/rest/server.php?moodlewsrestformat=json&wsfunction=core_calendar_get_calendar_upcoming_view&moodlewssettingfilter=true&moodlewssettingfileurl=true&wstoken=${token}`, function (error, response, body) {
       // console.log(JSON.parse(body))
        re(JSON.parse(body))
    })
})
function dateformat(int){
  var data = new Date(int)
  data.setTime( data.getTime() + -3 * 60 * 60 * 1000 );
  // pois a timezone do brasil é UTF-3
   var  dia  = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0'+mes : mes,
      hr  = (data.getHours()).toString(), 
      hrf = (hr.length == 1) ? '0'+hr : hr,
      mim  = (data.getMinutes()).toString(), 
      mimf = (mim.length == 1) ? '0'+mim : mim

      
  return {diaF, mesF, hrf, mimf }
}
async function a(){
const { token, privatetoken } = await login(baseurl, username, password)

 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
 
client.on('message', async msg => {
  if (msg.content === '!atividades') {
    console.log('atividades')

    const events = await core_calendar_get_calendar_upcoming_view(baseurl, token)
    var message = '';
    for (let index = 0; index < events.events.length; index++) {
      var data = dateformat(events.events[index].timesort*1000)
      message = `${message} [${data.diaF}/${data.mesF} às ${data.hrf}:${data.mimf}] ${events.events[index].name} de ${events.events[index].course.fullname}\n\n`;
      console.log(message)
    }
    msg.channel.send(message)
  }
})
 
client.login(process.env.DISCORDTOKEN);
}

a()
const http = require("http");

var express = require('express');
var app = express();
const server = http.createServer(app);
app.get('/', function(req, res) {
  res.send('O bot está rodando agora ;)');
});
server.listen(process.env.PORT)