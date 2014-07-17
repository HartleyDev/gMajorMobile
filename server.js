var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var querystring = require('querystring')
var router = express.Router();
var db = require(__dirname + '/db/db.js');
var port = process.env.PORT || 8080;
var server = express();
var express = require('express');
server.use(express.static(__dirname + '/www'));
server.listen(port);
db.init();

// API Router
// handles requests starting with '/api' 

server.use('/api', router);

router.use(bodyParser.json());

router.get('/', function(req, res){
  console.log('get /api accessed');
});

router.route('/users')
  // create a bear (accessed at POST http://localhost:8080/api/users)
  .post(function(req, res) {
    var user = req.body;
    db.insert('gmajor.users', user, res);
  })
  .get(function(req, res){
    db.find('gmajor.users', res);
  });

router.route('/users/:userId')
  .post(function(req, res){
    var message = req.body;
    var conId = req.params.userId;
    db.update('gmajor.users', conId, message, res);
  })
  .get(function(req, res){
    var conId = req.params.userId;
    console.log(conId);
    db.find('gmajor.users', res, conId);
  });


router.route('/chats')
  .post(function(req, res){
    var message = req.body;
    db.insert('gmajor.chats', message, res);
  })
  .get(function(req, res){
    var parsedUrl = url.parse(req.url);
    var params = querystring.parse(parsedUrl.query);
    db.match('gmajor.chats', res, params);
  });

router.route('/chats/:chatId')
  .post(function(req, res){
    var message = req.body;
    var conId = req.params.chatId;
    db.update('gmajor.chats', conId, message, res);
  })
  .get(function(req, res){
    var conId = req.params.chatId;
    db.find('gmajor.chats', res, conId);
  });



// Restrictions: usernames must be unique
// API
// /user/:id/friends
  // POST: 
    // Adds UID associated with the name to user's friends array
    // {friend: friendname}
  // GET: 
    // Returns array of current user's friends

// server responsibilities: 
  // handle authentication/login, sessions/cookies
  // 
