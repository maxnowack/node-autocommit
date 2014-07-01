var repositories = [
  "/Users/mnowack/Documents/testrepo/"
];


var fs = require('fs');
var git = require('gift');


var processChange = function (repo,event, filename) {
  repo.status(function(err,status){
    if(status.clean) return;
    repo.add(repo.path,function(err,files){
      if(err) throw err;

      repo.commit(filename,function(err){
        if(err) throw err;
        console.log("new commit: " + filename + " (" + repo.path + ")");
      });
    })
  });
}

repositories.forEach(function(item){
  fs.exists(item + "/.git/",function(exists){
    if(!exists){
      git.init(item,function(err,_repo){
        if(err) throw err;
        console.log("git init: " + item);
        fs.watch(item, function(event,filename){
          processChange(_repo,event,filename);
        });
        console.log("watcher started: " + item);
        processChange(_repo,"","general");
      });
    }else{
      fs.watch(item, function(event,filename){
        processChange(git(item),event,filename);
      });
      console.log("watcher started: " + item);
      processChange(git(item),"","general");
    }
  });
});
