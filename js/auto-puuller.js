var _ = require('underscore')
  , fs = require('fs')
  ;
  
module.exports = function(db, puush){
    
    var record = function(p){
        if (!p.isDeleted && !p.isPrivate) {
            fs.writeFile('./db/store/' + p.md5, p.body);
        }
        p.tags = [];
        db.insert(_.omit(p, 'body'));
        console.log('written', p.md5, p.pid);
        return p;
    };
    /*
    puush.getEnd().then(function(pid){
        for (var i = 0; i < 50; i++) {
            puush.fetch(pid - (i+500)).then(record);
        }
    });
    */

};
