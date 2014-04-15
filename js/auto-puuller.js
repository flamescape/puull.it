var _ = require('underscore')
  , fs = require('fs')
  , async = require('async')
  , Promise = require('bluebird')
  ;
  
module.exports = function(db, puush){

    var record = function(p){
        if (!p.isDeleted && !p.isPrivate) {
            fs.writeFile('./db/store/' + p.md5, p.body);
        }
        p.tags = [];
        db.insert(_.omit(p, 'body'));
        return p;
    };

    var workQueue = async.queue(function(pid, cb){
        puush.fetch(pid)
            .then(record)
            .then(function(){ console.log('Fetched PID:', pid); cb(); })
            .catch(function(err){ console.log('Caught err:', err); cb(); });
    }, 5);
    
    var lastRecordedPid = function(){
        return new Promise(function(resolve, reject){
            db.find({}).sort({pid:-1}).limit(1).exec(function(err, rows){
                if (err) return reject(err);
                if (!rows.length) return resolve(null);
                resolve(rows[0].pid);
            });
        });
    };
    
    var findWork = function(){
        console.log('Work queue empty. Finding work to do.');

        Promise.all([
            lastRecordedPid(),
            puush.getEnd()
        ]).spread(function(min, max){
            max -= 500; // we don't want the very latest, as many won't have actually finished uploading yet
            if (!min) min = max - 500; // if we have an empty datastore, we'll need to start somewhere
            for (var i = min; i < max; i++) {
                workQueue.push(i);
            }
        });
    };
    
    workQueue.drain = findWork;
    findWork();
    
    var pause = function(){
        workQueue.pause();
    };
    
    var resume = function(){
        workQueue.resume();
    };
    
    return {
        pause: pause,
        resume: resume
    };

};
