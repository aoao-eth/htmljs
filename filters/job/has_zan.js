// Generated by CoffeeScript 1.9.3
(function() {
  var func_job;

  func_job = __F('job/job');

  module.exports = function(req, res, next) {
    if (res.locals.user) {
      return func_job.hasZan(req.params.id, res.locals.user.id, function(error, zan) {
        if (zan) {
          res.locals.has_zan = true;
        } else {
          res.locals.has_zan = false;
        }
        return next();
      });
    } else {
      res.locals.has_zan = false;
      return next();
    }
  };

}).call(this);
