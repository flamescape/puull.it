var _ = require('underscore')
  , fs = require('fs')
  , async = require('async')
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
    
    var findWork = function(){
        console.log('Work queue empty. Finding work to do.');
        // TODO: find min/max pids, push to the queue
        puush.getEnd().then(function(pid){
            for (var i = 0; i < 100; i++) {
                workQueue.push(pid - 500 - i);
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
