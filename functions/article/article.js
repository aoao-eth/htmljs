// Generated by CoffeeScript 1.9.3
(function() {
  var Article, ArticleTag, ArticleZanLogs, CanRead, Card, Column, Tags, User, Visit_log, cache, en_func, func_article, htmljs_cache;

  Article = __M('articles');

  Column = __M('columns');

  User = __M("users");

  Card = __M('cards');

  Visit_log = __M('article_visit_logs');

  en_func = require('./../../lib/translate.coffee');

  Visit_log.sync();

  User.hasOne(Article, {
    foreignKey: "user_id"
  });

  Article.belongsTo(User, {
    foreignKey: "user_id"
  });

  Article.sync();

  Column.hasOne(Article, {
    foreignKey: "column_id"
  });

  Article.belongsTo(Column, {
    foreignKey: "column_id"
  });

  ArticleZanLogs = __M('article_zan_logs');

  User.hasOne(ArticleZanLogs, {
    foreignKey: "user_id"
  });

  ArticleZanLogs.belongsTo(User, {
    foreignKey: "user_id"
  });

  ArticleZanLogs.sync();

  CanRead = __M("article_canread");

  User.hasOne(CanRead, {
    foreignKey: "user_id"
  });

  CanRead.belongsTo(User, {
    foreignKey: "user_id"
  });

  CanRead.sync();

  ArticleTag = __M('article_tag');

  ArticleTag.sync();

  Tags = __M('tags');

  Tags.sync();

  cache = {
    recent: []
  };

  htmljs_cache = require('./../../lib/cache.js');

  func_article = {
    addTagsToArticle: function(article_id, tagIds) {
      return ArticleTag.findAll({
        where: {
          articleid: article_id
        }
      }).success(function(qts) {
        qts.forEach(function(qt) {
          return qt.destroy();
        });
        return tagIds.forEach(function(tagid) {
          return ArticleTag.create({
            articleid: article_id,
            tagid: tagid
          });
        });
      });
    },
    run_sort: function() {
      var self;
      self = this;
      return this.getAllByField(1, 10000, null, function(error, articles) {
        if (articles && articles.length) {
          return articles.forEach(function(a) {
            return self.run_sort_byid(a.id);
          });
        }
      });
    },
    run_sort_byid: function(articleId) {
      return Article.find({
        where: {
          id: articleId
        }
      }).success(function(article) {
        var score;
        if (article && article.publish_time && article.publish_time > 1000000) {
          score = (article.comment_count / 5 + article.visit_count / 500) / Math.pow((new Date().getTime() / 1000 - article.createdAt.getTime() / 1000) / 60 / 60 + 2, 1.8);

          static_score = ( article.comment_count + article.zan_count ) * 100 + article.visit_count / 500 / Math.pow((new Date().getTime() / 1000 - article.createdAt.getTime() / 1000), 1.8 )
          return article.updateAttributes({
            score: score,
            static_score:static_score
          }, ['score','static_score']).success(function() {});
        }
      }).error(function(error) {
        return callback(error);
      });
    },
    getAll: function(page, count, condition, order, callback) {
      var query;
      if (!callback) {
        callback = order;
        order = "sort desc,id desc";
      }
      query = {
        offset: (page - 1) * count,
        limit: count,
        order: order,
        attributes: ['id', 'publish_time', 'createdAt', 'zan_count', 'comment_count', 'visit_count', 'main_pic', 'title', 'user_id', 'user_nick', 'user_headpic', 'is_jian', 'is_top', 'type', 'column_id', 'uuid', 'pinyin', 'tags','static_score'],
        include: [User, Column],
        raw: false
      };
      if (condition) {
        query.where = condition;
      }
      return Article.findAll(query).success(function(articles) {
        cache.recent = articles;
        return callback(null, articles);
      }).error(function(error) {
        return callback(error);
      });
    },
    getAllWithContent: function(page, count, condition, order, callback) {
      var query;
      if (!callback) {
        callback = order;
        order = "sort desc,id desc";
      }
      query = {
        offset: (page - 1) * count,
        limit: count,
        order: order,
        attributes: ['id', 'publish_time', 'html', 'zan_count', 'comment_count', 'main_pic', 'visit_count', 'title', 'user_id', 'user_nick', 'user_headpic', 'is_jian', 'is_top', 'type', 'column_id', 'uuid', 'pinyin','tags'],
        include: [User, Column],
        raw: false
      };
      if (condition) {
        query.where = condition;
      }
      return Article.findAll(query).success(function(articles) {
        cache.recent = articles;
        return callback(null, articles);
      }).error(function(error) {
        return callback(error);
      });
    },
    getAllByField: function(page, count, condition, order, callback) {
      var query;
      if (!callback) {
        callback = order;
        order = "sort desc,id desc";
      }
      query = {
        offset: (page - 1) * count,
        limit: count,
        order: order,
        attributes: ['id', 'publish_time', 'zan_count', 'comment_count', 'visit_count'],
        raw: false
      };
      if (condition) {
        query.where = condition;
      }
      return Article.findAll(query).success(function(articles) {
        return callback(null, articles);
      }).error(function(error) {
        return callback(error);
      });
    },
    getByUserIdAndType: function(id, type, callback) {
      return Article.findAll({
        where: {
          user_id: id,
          type: type,
          is_publish: 1
        },
        order: "id desc",
        limit: 20,
        raw: true
      }).success(function(articles) {
        return callback(null, articles);
      }).error(function(error) {
        return callback(error);
      });
    },
    getByUrl: function(url, callback) {
      return Article.find({
        where: {
          quote_url: url
        },
        raw: true
      }).success(function(article) {
        return callback(null, article);
      }).error(function(error) {
        return callback(error);
      });
    },
    getByPinyin: function(pinyin, callback) {
      return Article.find({
        where: {
          pinyin: pinyin
        },
        raw: true
      }).success(function(article) {
        return callback(null, article);
      }).error(function(error) {
        return callback(error);
      });
    },
    add: function(data, callback) {
      data.uuid = uuid.v4();
      return Article.create(data).success(function(article) {
        Column.find({
          where: {
            id: article.column_id
          }
        }).success(function(column) {
          var title;
          if (column && column.name) {
            title = column.name + " " + article.title;
          } else {
            title = article.title;
          }
          return en_func(title, function(en) {
            return article.updateAttributes({
              pinyin: en + ' ' + article.id
            }, ['pinyin']);
          });
        });
        return callback(null, article);
      }).error(function(error) {
        return callback(error);
      });
    },
    addComment: function(articleId) {
      return Article.find({
        where: {
          id: articleId
        }
      }).success(function(article) {
        if (article) {
          return article.updateAttributes({
            comment_count: article.comment_count ? article.comment_count + 1 : 1
          });
        }
      });
    },
    addVisit: function(articleId, visitor) {
      return Article.find({
        where: {
          id: articleId
        }
      }).success(function(article) {
        if (article) {
          article.updateAttributes({
            visit_count: article.visit_count ? article.visit_count + 2 : 1
          }, ['visit_count']);
          if (visitor) {
            return Visit_log.create({
              article_id: articleId,
              user_id: visitor.id,
              user_nick: visitor.nick,
              user_headpic: visitor.head_pic
            });
          }
        }
      });
    },
    getVisitors: function(articleId, count, callback) {
      var condition;
      if (articleId) {
        condition = {
          article_id: articleId
        };
      } else {
        condition = null;
      }
      return Visit_log.findAll({
        where: condition,
        limit: count,
        order: "id desc"
      }).success(function(logs) {
        return callback(null, logs);
      }).error(function(error) {
        return callback(error);
      });
    },
    addZan: function(article_id, user_id, score, callback) {
      score = score * 1;
      return ArticleZanLogs.find({
        where: {
          article_id: article_id,
          user_id: user_id
        }
      }).success(function(log) {
        if (log) {
          return callback(new Error('已经赞过这篇文章了哦'));
        } else {
          return Article.find({
            where: {
              id: article_id
            }
          }).success(function(article) {
            if (!article) {
              return callback(new Error('不存在的文章'));
            } else {
              return ArticleZanLogs.create({
                article_id: article_id,
                user_id: user_id
              }).success(function(log) {
                article.updateAttributes({
                  zan_count: article.zan_count * 1 + 1
                });
                return callback(null, log, article);
              }).error(function(e) {
                return callback(e);
              });
            }
          }).error(function(e) {
            return callback(e);
          });
        }
      }).error(function(e) {
        return callback(e);
      });
    },
    getZanByArticleIdAndUserId: function(article_id, user_id, callback) {
      return ArticleZanLogs.find({
        where: {
          article_id: article_id,
          user_id: user_id
        }
      }).success(function(log) {
        return callback(null, log);
      }).error(function(e) {
        return callback(e);
      });
    },
    getRecent: function(callback) {
      return Article.findAll({
        where: {
          is_publish: 1
        },
        order: "id desc",
        limit: 10,
        raw: true
      }).success(function(articles) {
        return callback(null, articles);
      }).error(function(error) {
        return callback(error);
      });
    },
    getById: function(id, callback) {
      return Article.find({
        where: {
          id: id
        },
        include: [User, Column],
        raw: true
      }).success(function(article) {
        return callback(null, article);
      }).error(function(error) {
        return callback(error);
      });
    },
    getByPinyin: function(pinyin, callback) {
      return Article.find({
        where: {
          pinyin: pinyin
        },
        include: [User],
        raw: true
      }).success(function(article) {
        if (!article) {
          return callback(new Error('不存在的文章'));
        } else {
          return callback(null, article);
        }
      }).error(function(error) {
        return callback(error);
      });
    },
    getZansByArticleId: function(article_id, callback) {
      return ArticleZanLogs.findAll({
        where: {
          article_id: article_id
        },
        include: [User],
        order: "id desc",
        raw: true
      }).success(function(logs) {
        return callback(null, logs);
      }).error(function(e) {
        return callback(e);
      });
    },
    addPay: function(article_id, user_id, callback) {
      return CanRead.create({
        article_id: article_id,
        user_id: user_id
      }).success(function() {
        return callback();
      }).error(function(e) {
        return callback(e);
      });
    },
    checkCanRead: function(user_id, article_id, callback) {
      return CanRead.find({
        where: {
          article_id: article_id,
          user_id: user_id
        }
      }).success(function(c) {
        if (c) {
          return callback();
        } else {
          return callback(new Error('无权限查看'));
        }
      }).error(function(e) {
        return callback(e);
      });
    },
    canReaders: function(article_id, callback) {
      return CanRead.findAll({
        where: {
          article_id: article_id
        },
        include: [User]
      }).success(function(readers) {
        return callback(null, readers);
      }).error(function(e) {
        return callback(e);
      });
    }
  };

  __FC(func_article, Article, ['update', 'count', 'delete', 'addCount']);

  module.exports = func_article;

}).call(this);
