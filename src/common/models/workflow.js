/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
module.exports = function(Workflow) {
  Workflow.prototype.getDefaultStage = function(next) {
    Workflow.app.models.WorkflowStage.findOne({where: {
      workflowId: this.id,
      isInitial: 1,
    }}, function(err, wfStage) {
      if (err) throw err;
      if (!wfStage)
        next(null, null);
      else
        next(null, wfStage);
    });
  };
};
