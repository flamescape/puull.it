var express = require('express')
  , app = express()
  , bases = require('bases')
  , request = require('request')
  , Datastore = require('nedb')
  , db = new Datastore({filename: './db/puushes', autoload: true});
  ;

db.ensureIndex({fieldName: 'pid', unique: true});
require('./js/auto-puuller')(db, require('./js/puush')('AAF303829FFC9689A770B5B44EDF7487'));

app.get('/puush/:pid', function(req, res, next){
    db.find({pid:parseInt(req.params.pid)}, function(err, lines){
        if (err || !lines.length) res.send(404);
        res.json(lines[0]);
    });
});

app.get('/dl/:id', function(req, res, next){
    console.log('req', req.ip, req.params.id);
    request.get('http://puu.sh/'+req.params.id).pipe(res);
});

app.get('/puush', function(req, res, next){
    puush.getEnd().then(function(end){
        res.json({
            end: end
        });
    });
});

app.use('/js/vendor', express.static('node_modules'));
app.use(express.static('public'));

app.listen(80);


