var bases = require('bases')
  , Promise = require('bluebird')
  , request = require('request')
  , async = require('async')
  , crypto = require('crypto')
  , fs = Promise.promisifyAll(require('fs'))
  ;
  
module.exports = function(db, puush){
    
    var fetch = (function(){
        var q = async.queue(function(pid, cb){
            request({
                url:'http://puu.sh/'+bases.toBase62(pid),
                encoding: null,
                method: 'get'
            }, function(err, res, body){
                if (err) return cb(err);
                
                var filename = '';
                try {
                    filename = res.headers['content-disposition'].match(/^inline; filename="(.*)"$/)[1];
                } catch (x){}
                
                return cb(null, {
                    pid: pid,
                    filename: filename,
                    headers: res.headers,
                    body: body
                });
            });
        }, 2);
        
        return Promise.promisify(q.push.bind(q));
    })();
    
    puush.getEnd().then(function(pid){
        return pid - 500;
    }).then(fetch).then(function(p){
        p.md5 = crypto.createHash('md5').update(p.body).digest('hex');
        fs.writeFile('./db/store/' + p.md5, p.body);
        delete p.body;
        db.insert(p);
        console.log('written', p);
        return p;
    });

};
