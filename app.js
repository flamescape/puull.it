var express = require('express')
  , app = express()
  , request = require('request')
  ;

  
app.get('/dl/:id', function(req, res, next){
    request.get('http://puu.sh/'+req.params.id).pipe(res);
});

app.use(express.static('public'));

app.listen(80);
