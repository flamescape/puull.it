var express = require('express')
  , app = express()
  , bases = require('bases')
  , request = require('request')
  , fs = require('fs')
  , Datastore = require('nedb')
  , db = new Datastore({filename: './db/puushes', autoload: true});
  ;

db.ensureIndex({fieldName: 'pid', unique: true});
require('./js/auto-puuller')(db, require('./js/puush')('AAF303829FFC9689A770B5B44EDF7487'));

app.get('/puushes/:pid', function(req, res, next){
    db.findOne({pid:parseInt(req.params.pid)}, function(err, p){
        if (err || !p) res.send(404);
        res.json(p);
    });
});

app.get('/puushes/:pid/dl', function(req, res, next){
    db.findOne({pid:parseInt(req.params.pid)}, function(err, p){
        if (err || !p) return res.send(404);
        var path = './db/store/'+p.md5;
        if (!fs.existsSync(path)) return res.send(400);
        fs.createReadStream(path).pipe(res);
    });
});

app.get('/puushes', function(req, res, next){
    // 50 most recent
    db.find({}).sort({found: -1}).limit(50).exec(function(err, lines){
        if (err) res.send(500);
        res.json(lines);
    });
});

app.use('/js/vendor', express.static('node_modules'));
app.use(express.static('public'));

app.listen(80);


