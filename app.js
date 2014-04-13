var express = require('express')
  , app = express()
  , bases = require('bases')
  , request = require('request')
  , puush = require('./js/puush')('AAF303829FFC9689A770B5B44EDF7487')
  , async = require('async')
  ;

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
