module.exports = function(Workspace) {
  Workspace.on('attached', function() {
    Workspace.nestRemoting('topics');
  });
};
