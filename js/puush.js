var Promise = require('bluebird')
  , request = require('request')
  , bases = require('bases')
  , crypto = require('crypto')
  , stream = require('stream')
  , async = require('async')
  , fs = Promise.promisifyAll(require('fs'))
  ;

module.exports = function(apiKey){

    var del = function(pid){
        return new Promise(function(resolve, reject){
            request({
                url: 'http://puush.me/api/del',
                method: 'post',
                form: {
                    k: apiKey,
                    i: pid,
                    z: 'poop'
                }
            }, function(err, res, body){
                if (err) {
                    return reject(err);
                }
                return resolve(body);
            });
        });
    };
    
    var up = function(file, filename){
        return new Promise(function(resolve, reject){
            var r = request({
                url: 'http://puush.me/api/up',
                method: 'post'
            }, function(err, res, body){
                if (err) {
                    return reject(err);
                }
                
                // typical response looks like this:
                // 0,http://puu.sh/85Fri.txt,119561624,0
                var puu = body.split(',');
                var pid = parseInt(puu[2]);
                if (isNaN(pid)) {
                    return reject(Error('pid is not a number: '+body));
                }
                
                return resolve(pid);
            });
            
            var form = r.form();
            form.append('k', apiKey);
            form.append('c', crypto.createHash('md5').update(file).digest('hex'));
            form.append('z', 'poop');
            form.append('f', file, {
                filename: filename || 'x',
                contentType: 'application/octet-stream',
                knownLength: file.length
            });
        });
    };
    
    var upFile = function(filename){
        return fs.readFileAsync(filename).then(function(fc){
            return up(fc, require('path').basename(filename));
        });
    };
    
    var getEnd = function(){
        return up('', 'x.txt').then(function(pid){
            del(pid);
            return pid;
        });
    };
    
    var fetch = (function(){
        var q = async.queue(function(pid, cb){
            request({
                url:'http://puu.sh/'+bases.toBase62(pid),
                encoding: null,
                method: 'get'
            }, function(err, res, body){
                if (err) return cb(err);
                
                var md5 = crypto.createHash('md5').update(body).digest('hex');
                
                var p = {
                    pid: pid,
                    headers: res.headers,
                    body: body,
                    size: body.length,
                    md5: md5,
                    isDeleted: md5 === 'e737e67bca45ac3a2f1f080d104aec82',
                    isPrivate: md5 === 'ca9e65020a53f23371bc47906e900ab4'
                };
                
                try {
                    p.filename = res.headers['content-disposition'].match(/^inline; filename="(.*)"$/)[1];
                    p.type = res.headers['content-type'];
                } catch (x){}
                
                return cb(null, p);
            });
        }, 2);
        
        return Promise.promisify(q.push.bind(q));
    })();

    return {
        fetch: fetch,
        del: del,
        up: up,
        upFile: upFile,
        getEnd: getEnd
    };
    
};
