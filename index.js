const request = require('request');
const fs = require("fs")
const Discord = require('discord.js');
const YAML = require('yamljs');
const YAMLl = require('yaml-loader');

const token = process.env.TOKEN;
const Client = new Discord.Client();

var embed = new Discord.RichEmbed()
var ERROR = new Discord.RichEmbed()
var AREA = new Discord.RichEmbed()

//GLOBAL VARIABLES
var MapCode
var CHARLIMIT = 1800

var height = 0
var width = 0
var SpawnersArray

var Length = 0
var Entrance = 0
var SizeRate = 0

var PartialDIFF = 0
var TotalDiff = 0
var i = 0
var area = 0
var AreaSelect = ""

var SomaDiffs = 0
var AreaCounter = 0

var Highest = 0
var AreaHighest = 0

var LOCAL = "3-enemy-balance"
var DIFFshow = ""
var CoefInfo = ""

/* Calibration BackUp:
  //CALIBRATION VARIABLES:
  var CountExpo = 1.15
  var ActiveExpo = 0.5
  var SpeedReduction = 10000
  var GeneralMulti = 0.00035
  var SizeRateExpo = 0.5
  var SpeedExpo = 1.3
  var Normalizer = 0.2
*/

  //CALIBRATION VARIABLES:
  var CountExpo = 1.15
  var ActiveExpo = 0.5
  var SpeedReduction = 10000
  var GeneralMulti = 0.00035
  var SizeRateExpo = 0.5
  var SpeedExpo = 1.3
  var Normalizer = 0.2



//When bot starts
Client.on('ready', () => {
console.log('Bot connected.');
Client.user.setActivity('you doing !ma help', {type: 'WATCHING'});
//Client.channels.find(x => x.name === 'general').send('Bot connected.');
});



//When message <<< ###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~
Client.on('message', (msg) => {
if (msg.author == Client.user) {return} //No self messages

var Message = msg.content
var attachment = msg.attachments.first();


//Collab with Evades.io bot <<<
if ( (String(msg.author) == '<@622188092782018600>') && (typeof attachment === 'object') ){

  if ( !(String(msg.channel.name) == LOCAL) ){
    Client.channels.find(x => x.name === String(msg.channel.name)).send("More info. on: " + (msg.guild.channels.find(channel => channel.name === LOCAL).toString()) + ".");
    }
  Client.channels.find(x => x.name === LOCAL).send("Here we go, my partner.");
  Client.channels.find(x => x.name === LOCAL).send(attachment.url);

Message = "!ma diff all"
mode = "diff"
AreaNum = "all"

request(attachment.url, { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  
  if (String(attachment.filename).endsWith('.yaml')){body = YAML.parse(body);}

MapCode = body;

if (typeof MapCode.name === 'undefined'){
  let ERROR = new Discord.RichEmbed()
  .setColor('#FF0000')
  .setTitle('**ERROR:**')
  .setDescription('Not valid itdentation format.')
  Client.channels.find(x => x.name === LOCAL).send(ERROR);
  return
}

MapInfo(mode, AreaNum, FinalAreaNum);

return 0
});
return 0
} //Collab with Evades.io bot <<<



var Message = msg.content
var attachment = msg.attachments.first();

if ( !((Message).slice(0, 3) == "!ma") ){return} //Just message starting with "!ma"

if ( !(String(msg.channel.name) == LOCAL) ){
  msg.reply("lets talk on " + (msg.guild.channels.find(channel => channel.name === LOCAL).toString()) + ".");
  return 0
  }

  
//HELP MESSAGE - Instructions
if (Message === '!ma help'){
    let embed = new Discord.RichEmbed()
    .setColor('#FFD700')
    .setTitle('**Map Analysis commands:**')
    .setDescription('!Ma Mode AreaNum FinalAreaNum')
    .addField('**Mode:**', '"area" : shows area code. \n "diff" : shows area difficility.', false)
    .addField('**AreaNum:**', '"all" : code/difficility of all areas. \n number : code/difficility of a specific area.', false)
    .addField('**FinalAreaNum:** (optional)', 'number : difficility of an area range, considering "AreaNum" as initial area.', false)
    .addField('**Example:**', '**!ma diff 15 27** : Shows difficility of 15-17 areas range. \n -----------------------------------------------------------------------------------------', false)
    .addField('**!ma coefs**', 'Shows enemies coefficients.', false)
    .addField('**!ma tutorial**', 'Shows tutorials information.', false)
    .addField('**!ma help**', 'Shows this message.', false)
    Client.channels.find(x => x.name === LOCAL).send(msg.author + ", some instructions:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
return 0
}


if (Message === '!ma coefs'){
  CoefInfo = "";
  enemies.forEach(GetCoefs);
  console.log(CoefInfo);

  let embed = new Discord.RichEmbed()
  .setColor('#FFD700')
  .setTitle('**Enemies coefficients:**')
  .setDescription(String(CoefInfo))
  Client.channels.find(x => x.name === LOCAL).send(msg.author + ", some info:");
  Client.channels.find(x => x.name === LOCAL).send(embed);
return 0
}


if (Message === '!ma tutorial'){
  var text = ""
  var text += "**Available tutorials:**" + "\n"
  var text += "```Apache" + "\n"
  var text += "!ma tutorial 1 -> Basic concepts." + "\n"
  var text += "!ma tutorial 2 -> Tools." + "\n"
  var text += "!ma tutorial 3 -> Coords on canvas." + "\n"
  var text += "!ma tutorial 4 -> Text blocks." + "\n"
  var text += "!ma tutorial 5 -> Identation." + "\n"
  var text += "!ma tutorial 6 -> Props." + "\n"
  var text += "!ma tutorial 7 -> Properties." + "\n"
  var text += "!ma tutorial 8 -> Simple enemies." + "\n"
  var text += "!ma tutorial 9 -> Complex enemies." + "\n"
  var text += "!ma tutorial 10 -> Engine limits." + "\n"
  var text += "!ma tutorial 11 -> Advices." + "\n"
  var text += "!ma tutorial 12 -> Examples." + "\n"
  var text += "```"

  Client.channels.find(x => x.name === LOCAL).send(msg.author + ", what do you wanna know?");
  Client.channels.find(x => x.name === LOCAL).send(embed);
return 0
}


//Message translation:
var Check = Message.slice(0, 4)

if (Check == "!ma "){

    Client.channels.find(x => x.name === LOCAL).send(msg.author + ", let me try.");


    var mode = ""
    var AreaNum 
    var FinalAreaNum = 0
    var Rest

    Rest = Message.slice(4); //After "!ma "
    if (Rest.indexOf(" ") == -1){
      Client.channels.find(x => x.name === LOCAL).send("Sorry, I'm not sure what are looking for.");
      return 0
    }else{

        mode = Rest.slice( 0, (Rest.indexOf(" ") ));
        Rest = Rest.slice((Rest.indexOf(" ")+1)); //After "mode "
    }
   
    if (mode == 'tutorial'){
    tutorial(Message, msg.author)
    return 0
    }


    if (Rest.indexOf(" ") == -1){
    AreaNum = Rest
    FinalAreaNum = ""
    }else{
    AreaNum = Rest.slice( 0, (Rest.indexOf(" ") ));
    FinalAreaNum = Rest.slice((Rest.indexOf(" ")+1)); //After "areanum " 
    }


    //Download file ######################################################################
    if (typeof attachment === 'undefined'){
        let ERROR = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('**ERROR:**')
        .setDescription('No file selected.')
        Client.channels.find(x => x.name === LOCAL).send(ERROR);
        return 0
    }

    if (!String(attachment.filename).endsWith('.json') && !String(attachment.filename).endsWith('.txt') && !String(attachment.filename).endsWith('.yaml')){
        let ERROR = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('**ERROR:**')
        .setDescription('File must be ".json/.txt/.yaml" format.')
        Client.channels.find(x => x.name === LOCAL).send(ERROR);
    return 0
    }


request(attachment.url, { json: true }, (err, res, body) => {
if (err) { return console.log(err); }

if (String(attachment.filename).endsWith('.yaml')){body = YAML.parse(body);}

MapCode = body;

if (typeof MapCode.name === 'undefined'){
    let ERROR = new Discord.RichEmbed()
    .setColor('#FF0000')
    .setTitle('**ERROR:**')
    .setDescription('Not valid itdentation format.')
    Client.channels.find(x => x.name === LOCAL).send(ERROR);
    return 0
}

if (typeof MapCode.properties === 'undefined'){
    let ERROR = new Discord.RichEmbed()
    .setColor('#FF0000')
    .setTitle('**ERROR:**')
    .setDescription('Not valid itdentation format.')
    Client.channels.find(x => x.name === LOCAL).send(ERROR);
    return 0
}

if (typeof MapCode.areas === 'undefined'){
    let ERROR = new Discord.RichEmbed()
    .setColor('#FF0000')
    .setTitle('**ERROR:**')
    .setDescription('Not valid itdentation format.')
    Client.channels.find(x => x.name === LOCAL).send(ERROR);
    return 0
}
//##########################################################################################
    


MapInfo(mode, AreaNum, FinalAreaNum)
return
});

return
}

Client.channels.find(x => x.name === LOCAL).send("Sorry, I'm not sure what are looking for.");
return
});
//END OF TRANSLATION <<< ###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~###~~~



//GET ENEMIES COEFFICIENTS:
function GetCoefs(value, key, map) {
  CoefInfo += `${key} : ${value}` + "\n";
}

//DATABASE ---------------------------------------------------------------------------
//Simple Enemy list
var enemies = new Map([
['teleporting', 38.4568],
['dasher', 560.9685],
['switch', 586.1021],
['snowman', 614.3447],
['icicle', 683.2781],
['draining', 750.695],
['disabling', 777.4323],
['normal', 806.9133],
['repelling', 806.9133],
['regen_sniper', 806.9133],
['slowing', 839.6466],
['immune', 839.6466],
['oscillating', 876.283],
['spiral', 876.283],
['zigzag', 876.283],
['zoning', 876.283],
['speed_sniper', 876.283],
['sizing', 917.6696],
['freezing', 917.6696],
['turning', 964.9335],
['gravity', 964.9335],
['wavy', 964.9335],
['homing', 1019.6115],
['liquid', 1019.6115],
['sniper', 1019.6115],
['slippery', 1083.8617],
['ice_sniper', 1255.2684],
['radiating_bullets', 1532.8226] 
])

//Complex Enemy list
var complexenemies = new Map([
  ["wall", 1],
  ["frost_giant", 1]
])



//1º STEP (mode sellection) ---------------------------------------------------------------------------
function MapInfo(mode, AreaNum, FinalAreaNum) {

//RESETING VARIABLES
height = 0
width = 0
Length = 0
Entrance = 0
SizeRate = 0
PartialDIFF = 0
TotalDiff = 0
i = 0
area = 0
AreaSelect = ""
SomaDiffs = 0
AreaCounter = 0
Highest = 0
AreaHighest = 0
DIFFshow = ""
CoefInfo = ""


  var name = "n/a"
  if (MapCode.name){
  name = MapCode.name
  }

  var friction = "n/a"
  if (MapCode.properties.friction){
  friction = MapCode.properties.friction
  }

  var background_color = "n/a"
  if (MapCode.properties.background_color){
  background_color = MapCode.properties.background_color
  }

  var lighting = "n/a"
  if (MapCode.properties.lighting){
  lighting = MapCode.properties.lighting
  }

  var snow = "n/a"
  if (MapCode.properties.snow){
  snow = MapCode.properties.snow
  }


//AREA MODE
if (mode == "area"){
  if (AreaNum == "all"){ //Shows map code
    console.log(MapCode.name)
    console.log(MapCode.properties)
    console.log("Areas: " + MapCode.areas.length)

    let AREA = new Discord.RichEmbed()
    .setColor('#00FF00')
    .setTitle('**Map info:**')
    .setDescription("**Name: **" + name + "\n" + "**Friction: **" + friction + "\n" + "**Background_color: **" + background_color + "\n" + "**Lighting: **" + lighting + "\n" + "**Snow: **" + snow + "\n \n" + "**Areas: **" + MapCode.areas.length)
    Client.channels.find(x => x.name === LOCAL).send(AREA);

    return 0

  }else{ //Shows specific area code

    if (AreaNum < 1){
      console.log("error: Map starts on 1º area.")

      let ERROR = new Discord.RichEmbed()
      .setColor('#FF0000')
      .setTitle('**ERROR:**')
      .setDescription("error: Map starts on 1º area.")
      Client.channels.find(x => x.name === LOCAL).send(ERROR);
      return 0
    }

    if (AreaNum > MapCode.areas.length){
      console.log("error: Map ends on " + (MapCode.areas.length-1) + "º area.")

      let ERROR = new Discord.RichEmbed()
      .setColor('#FF0000')
      .setTitle('**ERROR:**')
      .setDescription("error: Map ends on " + (MapCode.areas.length-1) + "º area.")
      Client.channels.find(x => x.name === LOCAL).send(ERROR);
      return 0
    }

    if ((1 <= AreaNum) && (AreaNum <= MapCode.areas.length)){
      console.log("Area: " + AreaNum + "º")
      console.log(MapCode.areas[(AreaNum-1)]);

      var limit
      if (MapCode.areas[(AreaNum - 1)].zones.length > 10) {
          limit = 10
      } else {
          limit = MapCode.areas[(AreaNum - 1)].zones.length
      }
      
      let string = '';
      for (var zon = 0; zon < limit; zon++) { //EACH ZONE
          var zona = MapCode.areas[(AreaNum - 1)].zones[zon]
      
          for (let key in zona) {
      
              var part = '';
              if (typeof zona[key] === 'object') {
                  var zona2 = zona[key]
                  part = '';
                  for (let key in zona2) {part += key + ': ' + zona2[key] + " ";}
      
              } else {part = zona[key]}
      
              string += key + ': ' + part + '\n';}
      
          string = string + "\n";
        }
      
        let AREA = new Discord.RichEmbed()
      .setColor('#00FF00')
      .setTitle("**Area: **" + AreaNum + "º")
      .setDescription(string)
      Client.channels.find(x => x.name === LOCAL).send(AREA);
      return 0
    }

    console.log("error: AreaNum not identyfied.")
    console.log("")
    console.log("Correct syntax:")
    console.log("MapInfo('PathToFile.json', Mode, AreaNum)")
    console.log("Supported commands:")
    console.log("Mode: 'areas' or 'diff'")
    console.log("AreaNum: number or 'all'")

    let ERROR = new Discord.RichEmbed()
    .setColor('#FF0000')
    .setTitle('**ERROR:**')
    .setDescription("AreaNum not identyfied.")
    .addField('**Correct syntax:**', '!Ma Mode AreaNum', false)
    .addField('**AreaNum:**', '"all" : code/difficility of all areas. \n number : code/difficility of a specific area.', false)
    .addField('**Example:**', '**!ma area 15** : Shows code of 15º area', false)
    Client.channels.find(x => x.name === LOCAL).send(ERROR);
  }

  return 0
}

//DIFF MODE
  if (mode == "diff"){
    AreaSelect = "specific"
    
    if (AreaNum == "all"){ //Diff of all areas
      AreaSelect = "all"
      DIFFshow = "```Css" + "\n"
      DIFFshow = DIFFshow + "Map name: " + name + "\nAreas: " + MapCode.areas.length + "\n\nAll DIFFs: \n"
      DIFF(0, MapCode.areas.length)
      DIFFshow = DIFFshow + "\nDiffs info:\nAverage: " + (SomaDiffs/AreaCounter).toFixed(3) + "\nHighest: "+ Highest.toFixed(3) + " (" + AreaHighest + "º)" + "\n```"
      Client.channels.find(x => x.name === LOCAL).send(DIFFshow);
      return 0

    }else{

      if ( (!typeof AreaNum === 'number') || (AreaNum == "") || (typeof AreaNum === 'undefined') ) {
        console.log("error: Initial area number not identyfied.")
        let ERROR = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('**ERROR:**')
        .setDescription("Initial area number not identyfied.")
        Client.channels.find(x => x.name === LOCAL).send(ERROR);
        return 0
      }

      if (AreaNum < 1){
        console.log("error: Map starts on 1º area")
        let ERROR = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle('**ERROR:**')
        .setDescription("Map starts on 1º area")
        Client.channels.find(x => x.name === LOCAL).send(ERROR);
        return 0
      }

      if ((FinalAreaNum == "") || (typeof FinalAreaNum === 'undefined')) {

        if (AreaNum <= MapCode.areas.length){
          DIFFshow = "```Makefile" + "\nArea name: " + name + "\n"
          DIFF( (AreaNum-1), AreaNum )
          DIFFshow = DIFFshow + "```"
          Client.channels.find(x => x.name === LOCAL).send(DIFFshow);
          return 0
    
          }else{
            console.log("error: Map ends on " + (MapCode.areas.length-1) + "º area.")
            let ERROR = new Discord.RichEmbed()
            .setColor('#FF0000')
            .setTitle('**ERROR:**')
            .setDescription("Map ends on " + (MapCode.areas.length-1) + "º area.")
            Client.channels.find(x => x.name === LOCAL).send(ERROR);
            return 0
          }

      }else{

        if (!typeof FinalAreaNum === 'number'){
          console.log("error: Final area number not identyfied.")
          let ERROR = new Discord.RichEmbed()
          .setColor('#FF0000')
          .setTitle('**ERROR:**')
          .setDescription("Final area number not identyfied.")
          Client.channels.find(x => x.name === LOCAL).send(ERROR);
          return 0
        }

        if (FinalAreaNum <= MapCode.areas.length){

          if (FinalAreaNum <= AreaNum) {
            console.log("error: Final area number must be higher than initial.")
            let ERROR = new Discord.RichEmbed()
            .setColor('#FF0000')
            .setTitle('**ERROR:**')
            .setDescription("Final area number must be higher than initial.")
            Client.channels.find(x => x.name === LOCAL).send(ERROR);
            return 0
          }

          AreaSelect = "all"
          DIFFshow = "```Css" + "\n"
          DIFFshow = DIFFshow + "Range DIFFs: \n"
          DIFF( (AreaNum-1), FinalAreaNum )
          DIFFshow = DIFFshow + "\nDiffs info:\nAverage: " + (SomaDiffs/AreaCounter).toFixed(3) + "\nHighest: "+ Highest.toFixed(3) + " (" + AreaHighest + "º)" + "\n```"
          Client.channels.find(x => x.name === LOCAL).send(DIFFshow);
          return 0
    
          }else{
            if (FinalAreaNum <= MapCode.areas.length){
            console.log("error: Map ends on " + (MapCode.areas.length-1) + "º area.")
            let ERROR = new Discord.RichEmbed()
            .setColor('#FF0000')
            .setTitle('**ERROR:**')
            .setDescription("Map ends on " + (MapCode.areas.length-1) + "º area.")
            Client.channels.find(x => x.name === LOCAL).send(ERROR);
            }else{
              console.log("error: FinalAreaNum not identyfied. ")
              let ERROR = new Discord.RichEmbed()
              .setColor('#FF0000')
              .setTitle('**ERROR:**')
              .setDescription("error: FinalAreaNum not identyfied. ")
              Client.channels.find(x => x.name === LOCAL).send(ERROR);
            }

          }

      }

      return 0
    }
  }

  console.log("error: Mode not identyfied.")
  console.log("")
  console.log("Correct syntax:")
  console.log("MapInfo('PathToFile.json', Mode, AreaNum)")
  console.log("Supported commands:")
  console.log("Mode: 'areas' or 'diff'")
  console.log("AreaNum: number or 'all'")

  let ERROR = new Discord.RichEmbed()
  .setColor('#FF0000')
  .setTitle('**ERROR:**')
  .setDescription("Mode not identyfied.")
  .addField('**Correct syntax:**', '!Ma Mode AreaNum FinalAreaNum', false)
  .addField('**Mode:**', '"area" : shows area code. \n "diff" : shows area difficility.', false)
  .addField('**AreaNum:**', '"all" : code/difficility of all areas. \n number : code/difficility of a specific area.', false)
  .addField('**FinalAreaNum:** (optional)', 'number : difficility of an area range, considering "AreaNum" as initial area.', false)
  Client.channels.find(x => x.name === LOCAL).send(ERROR);

  return 0
}

//2º STEP (array identifyer) ---------------------------------------------------------------------------
function DIFF(InitialArea, FinalArea){
  for (var a = InitialArea; a < FinalArea; a++) { //EACH AREA
    area = a + 1
    SpawnersArray = 0

    for (var z = 0; z < MapCode.areas[a].zones.length; z++) { //EACH ZONE
      
      if (MapCode.areas[a].zones[z].type == "active") { //Active block

      //Active size
      height = MapCode.areas[a].zones[z].height
      width = MapCode.areas[a].zones[z].width

      if (typeof height === 'undefined' || typeof height === 'string') {
        for (var Ref = z; (z >= 0) && !(typeof height === 'number') ; Ref--) {
          height = MapCode.areas[a].zones[Ref].height
        }
      }

      if (typeof width === 'undefined' || typeof width === 'string') {
        for (var Ref = z;  (z >= 0) && !(typeof width === 'number') ; Ref--) {
          width = MapCode.areas[a].zones[Ref].width
        }
      }

      //Spawner block
      SpawnersArray = MapCode.areas[a].zones[z].spawner //Make sure all active zones has "spawner:"
      }
    }


    if (width > height) {
      var Direction = "Horizontal (GoRight or GoLeft)"
      Length = width
      Entrance = height
      SizeRate = Length / Entrance
     } 
     else{
      var Direction = "Vertical (GoDown or GoUp)"
      Length = height
      Entrance = width
      SizeRate = Length / Entrance
     }


     //AREA INFO
     if (AreaSelect == "specific"){
    console.log("Area: " + (a+1) + "º")
    console.log("Active zone size: " + width + " x " + height + " | Tiles: " + (width/32).toFixed(0) + " x " + (height/32).toFixed(0))
    console.log("Area Direction: " + Direction)
    console.log("Partial results:")

    DIFFshow = DIFFshow + "Difficility: \n"
    DIFFshow = DIFFshow + "Area: " + (a+1) + "º" + "\n" + "Active zone size: " + width + " x " + height + " | Tiles: " + (width/32).toFixed(0) + " x " + (height/32).toFixed(0) + " | Size Rate: " + SizeRate.toFixed(2) + "\n" + "Area Direction: " + Direction + "\n" + "Partial results: \n"
     }

    //Call math
    CalculateTotal(SpawnersArray)
  }
}

//3º STEP (Spawners loop) ---------------------------------------------------------------------------
//Calculate Total diff
function CalculateTotal(SpawnerArray) {

  if (typeof SpawnerArray === 'undefined') {
    console.log("(" + area + "º) 'spawner:' block not found." )
    if (DIFFshow.length < CHARLIMIT){
    DIFFshow = DIFFshow + "(" + area + "º) Error: 'spawner:' block not found. \n"
    }
    return 0
  }

  TotalDiff = 0 //Reset Area diff variable
  for (i = 0; i < SpawnerArray.length; i++) {

    var type = ""
    var ammount = 0
    var radius = 0
    var speed = 0
 
  type = SpawnerArray[i].type
  if (SpawnerArray[i].types.length = 1){
   type = SpawnerArray[i].types[0]
  }
  if (typeof type === 'undefined') {
  type = "MULTIPLE"
  }
  String(type)

  ammount = SpawnerArray[i].count
  radius = SpawnerArray[i].radius
  speed = SpawnerArray[i].speed


  if (enemies.has(type)) {
    TotalDiff = CalculatePartial(type, ammount, radius, speed) + TotalDiff
  }else{
    if (complexenemies.has(type)) {
      TotalDiff = CalculatePartialComplex(type, ammount, radius, speed) + TotalDiff
    }else{
    console.log("(" + area + "º) Id: " + i + " | Type: " + type + " | error: type not found.")
    if (DIFFshow.length < CHARLIMIT){
    DIFFshow = DIFFshow + "(" + area + "º) Id: " + i + " | Type: " + type + " | error: type not found. \n"
    }
    //console.log(SpawnersArray[i]) //Shows not found enemy's array
    }
  }

}

var TextSize = ""
if (typeof width === 'undefined' || typeof width === 'string') {
  TextSize = " | error: 'width' dimention not defined."
}

if (typeof height === 'undefined' || typeof height === 'string') {
  TextSize = " | error: 'height' dimention not defined."
}

console.log("(" + area + "º) AD: " + TotalDiff.toFixed(2) + TextSize)
if (DIFFshow.length < CHARLIMIT){
DIFFshow = DIFFshow + "(" + area + "º) AD: " + TotalDiff.toFixed(2) + TextSize + "\n"
}

SomaDiffs = SomaDiffs + TotalDiff
if (!TotalDiff == 0){AreaCounter = AreaCounter + 1}

  if (TotalDiff > Highest){
    Highest = TotalDiff
    AreaHighest = area
  }

TotalDiff = 0
}

//4º STEP (Spawner calculation) ---------------------------------------------------------------------------
//Calculate Individual diffs
function CalculatePartial(type, ammount, radius, speed) {
    
  var Coef = enemies.get(type)

  //Main equation variables
  var EnemyArea = (ammount * 6.28319 * (radius) * radius)
  var ActiveArea = (Length * Entrance)
  var Density = EnemyArea / ActiveArea * 100

  //MAIN EQUATION:
  PartialDIFF = Math.pow(Math.pow((Density * Math.pow(ammount, CountExpo)), (1+(( Math.pow(speed, SpeedExpo) *Coef)/SpeedReduction))), Normalizer) / (Math.pow(ActiveArea, ActiveExpo) / Math.pow(SizeRate, SizeRateExpo) * GeneralMulti);
 

  //Print info
  if (AreaSelect == "specific"){
  console.log("Enemy id: " + i + " | Type: " + type + " | Density" + Density.toFixed(2) + "% | Diff: " + PartialDIFF.toFixed(2))
  console.log(SpawnersArray[i])
  
    var zona = SpawnersArray[i]
    var part = '';
    for (let key in zona) {part += key + ': ' + zona[key] + " ";}

  DIFFshow = DIFFshow + "Enemy id: " + i + " | Type: " + type + " | Density: " + Density.toFixed(2) + "% | Diff: " + PartialDIFF.toFixed(2) + "\n" + "[" + part + "]" + "\n"
  }

  return PartialDIFF
}

//Calculate Complex Partial diffs
function CalculatePartialComplex(type, ammount, radius, speed) {

//Wall enemy
if (type == "wall") {
  var perimeter = ((Entrance - (2 * radius)) * 2) + ((Length - (2 * radius)) * 2)
  var totalgap = perimeter - (2 * radius * ammount)
  var gap = totalgap / ammount

  if ( (gap < 32 || ((2 * radius)) >= (Entrance - 32)) ) {
    PartialDIFF = 100
    
    if (AreaSelect == "specific"){
    console.log("Enemy id: " + i + " | Type: " + type + " | Diff: " + PartialDIFF.toFixed(2))
    console.log(SpawnersArray[i])

    var zona = SpawnersArray[i]
    var part = '';
    for (let key in zona) {part += key + ': ' + zona[key] + " ";}

    DIFFshow = DIFFshow + "Enemy id: " + i + " | Type: " + type + " | Density: " + Density.toFixed(2) + "% | Diff: " + PartialDIFF.toFixed(2) + "\n" + "[" + part + "]" + "\n"
    }
    
    return PartialDIFF
  }


  var IntersectionArea = 0
if (ammount > 1) {
  if ( Entrance - (4 * radius) < 0 || Length - (4 * radius) < 0) {
    IntersectionArea = (Entrance - (4 * radius)) * (Length - (4 * radius))
  }
}


var EnemyArea = (ammount * 6.28319 * radius * radius)
var ActiveArea = Length * Entrance
var Density = EnemyArea / ActiveArea * 100

//2º MAIN EQUATION
PartialDIFF =  Math.pow(Math.pow((Math.pow(Density, 3.5) * ammount * 500), (1+(Math.pow(speed, 1.5)/2000))), 0.4) * 90000 / ((ActiveArea - (perimeter * 2 * radius) ) + ( 15 * totalgap * 2 * radius) );


if (AreaSelect == "specific"){
console.log("Enemy id: " + i + " | Type: " + type + " | Diff: " + PartialDIFF.toFixed(2))
console.log(SpawnersArray[i])

var zona = SpawnersArray[i]
var part = '';
for (let key in zona) {part += key + ': ' + zona[key] + " ";}

DIFFshow = DIFFshow + "Enemy id: " + i + " | Type: " + type + " | Density: " + Density.toFixed(2) + "% | Diff: " + PartialDIFF.toFixed(2) + "\n" + "[" + part + "]" + "\n"
}

return PartialDIFF
}

//Other complex enemy


return 0
}



function tutorial(msg, author){

  if (msg === '!ma tutorial 1'){
    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 1:**')
    .setDescription("Basic concepts.")
    .addField('**Map code:**', 'A file that contains all information about elements inside that map.', false)
    .addField('**Areas:**', 'Map division that contains elements information inside that level.\nAreas difficility should increace as it advance on map extention.', false)
    .addField('**Zones:**', 'Area division that represents an specifc element.', false)
    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 2'){
    var text = ""  
    text += "Current ways to make map codes:" + "\n"
    text += "1. 'By hand'" + "\n"
    text += "2. Extir's sheet" + "\n"
    text += "3. Ravel's map editor" + "\n"
    text += "4. Tax's code generator"

    var text2 = ""    
    text2 += "01. Brackets {http://brackets.io}" + "\n"
    text2 += "02. Sublime Text {https://www.sublimetext.com}" + "\n"
    text2 += "03. Notepad++ {https://notepad-plus-plus.org}" + "\n"
    text2 += "04. Komodo Edit {https://www.activestate.com/products/komodo-ide/downloads/edit}" + "\n"
    text2 += "05. Visual Studio Code {https://code.visualstudio.com}" + "\n"
    text2 += "06. Atom.io {https://atom.io}" + "\n"
    text2 += "07. Vim {https://www.vim.org}" + "\n"
    text2 += "08. Eclipse {https://www.eclipse.org/ide}" + "\n"
    text2 += "09. Geany {https://www.geany.org}" + "\n"
    text2 += "10. GNU Emacs {https://www.gnu.org/software/emacs}" + "\n"
    text2 += "11. Kate {https://kate-editor.org}" + "\n"
    text2 += "12. Intellij {https://www.jetbrains.com/idea}" + "\n"
    text2 += "13. UltraEdit {https://www.ultraedit.com}"

    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 2:**')
    .setDescription("Tools.")
    .addField('**Methods:**', text, false)
    .addField('**Text editors:**', text2, false)
    .addField('**Testing platform:**', "https://evades.ravelfett.com", false)

    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 3'){
    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 3:**')
    .setDescription("Coords on canvas.")
    .addField('**Function:**', 'Organize/align graphic elements on screen.', false)
    .addField('**Dimensions:**', '2 dimensions:\n-Horizontal > left direction is positive.\n-Vertical > Down direction is positive.', false)
    .addField('**Refference:**', 'Areas is placed on global canvas (map canvas); but all elements inside an area follows its coords (area canvas).', false)
    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 4'){
    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 4:**')
    .setDescription("Text blocks.")
    .addField('**Function:**', "A zone. Defines elements and it's parameters.", false)
    .addField('**Properties:**', "Not setted parameters will use it's general values (Map/Area/zones).", false)
    .addField('**obs:**', "Comments are optional but it can help you when using multiple elements.", false)
    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 5'){
    var text = ""  
    text += ".Json validator: https://jsonformatter.curiousconcept.com" + "\n"
    text += ".yaml validator: https://jsonformatter.org/yaml-validator" + "\n"
    text += ".json/.yaml converter: https://www.json2yaml.com" + "\n"

    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 5:**')
    .setDescription("Identation.")
    .addField('**Function:**', 'Organize information in text blocks witch defines its application.', false)
    .addField('**Details:**', 'Identation is defined by spaces/tabs and indicators, also make sure to use right syntax an lower case for name refferences.', false)
    .addField('**Usefful links:**', text, false)

    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 6'){
    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 6:**')
    .setDescription("Props.")
    .addField('**Definition:**', 'Elements inside active zone (wall/tele) with specifc properties that interacts with players/enemies as a feature to improve experience.', false)
    .addField('**Walls:**', "Static blocks that bounces enemies and block player's passage.", false)
    .addField('**Teles:**', 'Static block that effect only players, teleporting it to a specifc point.', false)
    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 7'){
    var text = ""
    text += "properties:" + "\n"
    text += "  friction: {0 - 1}" + "\n"
    text += "  background_color: [R, G, B, ALPHA]" + "\n"
    text += "  lighting: {0 - 1}" + "\n"
    text += "  snow: {0 - 1}" + "\n"
    text += "  texture: [normal, leaves, wooden, baguette, ice]"

    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 7:**')
    .setDescription("Properties.")
    .addField('**Definition:**', 'Parameters that defines element graphic/function.', false)
    .addField('**General properties:**', text, false)
    .addField('**Canvas properties:**', "'Position'(x: ,y: ); 'Translation:'(x: ,y: ); widht; height.", false)
    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 8'){
    var text = ""
    text = "teleporting, dasher, switch, snowman, icicle, draining, disabling, normal, repelling, regen_sniper, slowing, immune, oscillating, spiral, zigzag, zoning, speed_sniper, sizing, freezing, turning, gravity, wavy, homing, liquid, sniper, slippery, ice_sniper, radiating_bullets"

    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 8:**')
    .setDescription("Simple enemies.")
    .addField('**Definition:**', 'Enemies that move freely inside active zone and bounce/reflects when touchs an wall.', false)
    .addField('**Properties:**', "type, count, radius and speed.", false)
    .addField('**List:**', text, false)
    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 9'){
    var text = ""
    text += "-angle: {-180 to +180}" + "\n"
    text += "-direction: {used: -1 / +1} ?" + "\n"
    text += "-turn_speed: {used: -2 to +5} ?" + "\n"
    text += "-shot_interval: {ms} ?" + "\n"
    text += "-cone_angle: {used: 1 to 180} ?" + "\n"
    text += "-pause_interval: {ms} ?" + "\n"
    text += "-pause_duration: {ms} ?" + "\n"
    text += "-turn_acceleration: {used: 0.05-0.8}" + "\n"
    text += "-shot_acceleration: {used: 2-5}" + "\n"
    text += "-pattern: cone, spiral, quadspiral, twin, cone_edges, twinspiral, twincone, singlebig" + "\n"
    text += "-immune: {True/False}" + "\n"
    text += "-x:    [position for static ones]" + "\n"
    text += "-y:    [position for static ones]"

    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 9:**')
    .setDescription("Complex enemies.")
    .addField('**Definition:**', 'Enemies that do not reflect on walls or have many properties (wall/frost_giant).', false)
    .addField('**wall enemies:**', "Change it's movement direction by +90º each time it hits an wall.", false)
    .addField('**frost_giant enemies:**', 'Static or moving with different shoot patterns.\nProperties:\n\n' + text, false)
    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 10'){
    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 10:**')
    .setDescription("Engine limits.")
    .addField('**Current limitations:**', 'No multiple active zones;\nNo Inscriptions / Messages / Texts on map code;\nNo touching wall props and area limits;\nNo translation to same area;\nno safe zones in the middle of an area.', false)
    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 11'){
    let embed = new Discord.RichEmbed()
    .setColor('#c0c0c0')
    .setTitle('**Tutorial 11:**')
    .setDescription("Advices.")
    .addField('**No rework:**', 'Define area size/direction/position before setting teleporters.', false)
    .addField('**Organization:**', 'Use same identation for all areas.', false)
    .addField('**Analysis Support:**', 'Use short notations and comments.', false)
    .addField('**Not forget:**', "'spawner:' and 'assets:' declaration.", false)
    Client.channels.find(x => x.name === LOCAL).send("Here we go:");
    Client.channels.find(x => x.name === LOCAL).send(embed);
  return 0
  }

  if (msg === '!ma tutorial 12'){
    Client.channels.find(x => x.name === LOCAL).send("Here we go:");

    var text = ""
    text += "**Tutorial 12:** Map code example.\n"
    text += "```yaml\n"
    text += "name: Excellent Example" + "\n"
    text += "properties:" + "\n"
    text += "  friction: 0.75" + "\n"
    text += "  background_color: [255, 128, 0, 50]" + "\n"
    text += "  texture: leaves" + "\n"
    text += "  snow: 0.1" + "\n"
    text += "  lighting: 0.5" + "\n"
    text += "areas:" + "\n"
    text += "# Area 1" + "\n"
    text += "- name: Area 1" + "\n"
    text += "  x: 0" + "\n"
    text += "  y: 0" + "\n"
    text += "  zones:" + "\n"
    text += "#Initial tele" + "\n"
    text += "  - height: 480" + "\n"
    text += "    translate: {x: 0, y: 0}" + "\n"
    text += "    type: exit" + "\n"
    text += "    width: 64" + "\n"
    text += "    x: 0" + "\n"
    text += "    y: 0" + "\n"
    text += "#Final tele" + "\n"
    text += "  - height: 480" + "\n"
    text += "    translate: {x: 160, y: 0}" + "\n"
    text += "    type: exit" + "\n"
    text += "    width: 64" + "\n"
    text += "    x: 3136" + "\n"
    text += "    y: 0" + "\n"
    text += "#Initial safe zone" + "\n"
    text += "  - type: safe" + "\n"
    text += "    x: 0" + "\n"
    text += "    y: 0" + "\n"
    text += "    width: 320" + "\n"
    text += "    height: 480" + "\n"
    text += "    properties:" + "\n"
    text += "      minimum_speed: 10" + "\n"
    text += "#Final safe zone" + "\n"
    text += "  - type: safe" + "\n"
    text += "    x: 2880" + "\n"
    text += "    y: 0" + "\n"
    text += "    width: 320" + "\n"
    text += "    height: 480" + "\n"
    text += "#Active zone" + "\n"
    text += "  - height: 480" + "\n"
    text += "    spawner:" + "\n"
    text += "    - count: 12" + "\n"
    text += "      radius: 18" + "\n"
    text += "      speed: 3.3" + "\n"
    text += "      types: [normal]" + "\n"
    text += "    type: active" + "\n"
    text += "    width: 2560" + "\n"
    text += "    x: 320" + "\n"
    text += "    y: 0" + "\n"
    text += "#ASSETS PROPS" + "\n"
    text += "  assets:" + "\n"
    text += "  - type: light_region" + "\n"
    text += "    x: 0" + "\n"
    text += "    y: 0" + "\n"
    text += "    width: 320 " + "\n"
    text += "    height: 480" + "\n"
    text += "  - type: flashlight_spawner" + "\n"
    text += "    x: 160" + "\n"
    text += "    y: 240" + "\n"
    text += "  - type: wall" + "\n"
    text += "    x: 384" + "\n"
    text += "    y: 224" + "\n"
    text += "    width: 320" + "\n"
    text += "    height: 32" + "\n"
    text += "    texture: ice" + "\n"
    text += "#VICTORY AREA" + "\n"
    text += "- name: Victory" + "\n"
    text += "  x:  3200" + "\n"
    text += "  y:  0" + "\n"
    text += "  zones:" + "\n"
    text += "#Initial tele" + "\n"
    text += "  - height: 480" + "\n"
    text += "    translate: {x: -160, y: 0}" + "\n"
    text += "    type: exit" + "\n"
    text += "    width: 64" + "\n"
    text += "    x: 0" + "\n"
    text += "    y: 0" + "\n"
    text += "#Final 'tele' (removal)" + "\n"
    text += "  - {height: 480, type: removal, width: 64, x: 576, y: 0}" + "\n"
    text += "#Victory zone" + "\n"
    text += "  - {height: 480, type: victory, width: 640, x: 0, y: 0}"
    text += "```"

    Client.channels.find(x => x.name === LOCAL).send(text);

  return 0
  }

  Client.channels.find(x => x.name === LOCAL).send("Tutorial not found.\nYou can use '!ma tutorial' to see all available content.");
  return 0
}



Client.login(token);

//https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=awaitReactions
