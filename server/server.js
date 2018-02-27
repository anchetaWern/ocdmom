var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

var pusher = new Pusher({ 
  appId: process.env.APP_ID, 
  key: process.env.APP_KEY, 
  secret:  process.env.APP_SECRET,
  cluster: process.env.APP_CLUSTER, 
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/tracker.html');
});

app.post('/pusher/auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channel);  
  var app_key = req.body.app_key;

  var auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

var port = process.env.PORT || 80;
app.listen(port);