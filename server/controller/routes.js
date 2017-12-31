var pg = require('pg');
var express = require('express');
var path = require('path');
var router = express.Router();

var dbUrl = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: 'bulletinboard',
  host: 'localhost',
  port: 5432
};

var pgClient = new pg.Client(dbUrl);

pgClient.connect();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client/public/html/index.html'));
});

router.get('/forum', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client/public/html/forum.html'))
});

router.post('/api/post-message', function(req, res) {
  var query = "INSERT INTO messages (name, messages) VALUES ($1, $2)"
  if (req.body.name !== '' && req.body.message !== '') {
    pgClient.query(query, [req.body.name, req.body.message], (err, queryRes) => {
      if (err) {
        res.json(err)
      } else {
        res.json(queryRes)
      }

    });
  } else if (req.body.name === '' & req.body.message !== '') {
    pgClient.query("INSERT INTO messages (name, messages) VALUES ($1, $2)", ["Anonymous", req.body.message], (error, queryRes) => {
      if (error) {
        res.json(error)
      } else {
        res.json(queryRes)
      }
    });
  } else if ((req.body.name !== '' && req.body.message === '') || (req.body.name === '' && req.body.message === '')) {
    res.json("null_message")
  }
});

router.get('/api/posts', (req,res) => {
	pgClient.query("SELECT * FROM messages", (error,queryRes) => {
		if(error){
			res.json(error)
		} else {
			res.json(queryRes)
		}
	});
});

router.put('/api/update-message/:id', (req,res) => {
	pgClient.query('UPDATE messages SET messages=$1 WHERE id=' + req.params.id, [req.body.message], (err,results) => {
		if(err){
			res.json(err)
		}
		res.json({message: "Message Updated"})
	});
});

module.exports = router;
