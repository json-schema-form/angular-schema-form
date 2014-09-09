var fs = require('fs'),
  tasks = fs.readdirSync('./gulp/tasks'),
  gulp = require('gulp');

tasks.forEach(function(task) {
  require('./tasks/' + task);
});
