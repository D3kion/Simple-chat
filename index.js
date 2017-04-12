var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
/*   CONFIGURATION   */
var PORT = 80;
var PASSWORD = 'PASS';
/*   CONFIGURATION   */

app.set('port', (process.env.PORT || PORT));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  if (req.cookies !== undefined && req.cookies.pass === PASSWORD) {
    res.sendFile(__dirname + '/public/chat.html');
  } else {
    res.redirect('/sign-in');
  }
});

app.get('/sign-in', function(req, res) {
  res.sendFile(__dirname + '/public/sign-in.html');
});

app.post('/sign-in', function(req, res) {
  if (req.body.password === PASSWORD) {
    res.cookie('pass', PASSWORD, { maxAge: 2592000000, httpOnly: true });
    res.cookie('username', req.body.username, { maxAge: 2592000000 });
    res.redirect('/');
  } else {
    res.redirect('/sign-in');
  }
});

http.listen(app.get('port'), function() {
  console.log('listening on *:' + PORT);
});

io.on('connection', function(socket){
  socket.on('chat msg', function(username, msg){
    io.emit('chat msg', username, msg);
  });
});