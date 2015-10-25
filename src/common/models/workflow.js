module.exports = function(Workflow) {
  Workflow.prototype.getDefaultStage = function(next) {
    Workflow.app.models.WorkflowStage.findOne({where: {
      workflowId: this.id,
      isInitial: 1,
    }}, function(err, wfStage) {

      if(err) throw err;

      if(!wfStage)
        next(null, null)
      else
        next(null, wfStage)
    })
  }
};
