// Generated by CoffeeScript 1.9.3
(function() {
  module.exports = function(req, res, next) {
    if (res.locals.card) {
      return (__F("card")).getVisitors(res.locals.card.id, function(error, visitors) {
        if (error) {
          next(error);
        } else {
          res.locals.visitors = visitors;
        }
        return next();
      });
    } else {
      return next();
    }
  };

}).call(this);
