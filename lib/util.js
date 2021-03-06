// Generated by CoffeeScript 1.7.1
(function() {
  var request, _isZhihuDaily, _isZhihuQuestion,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  request = require("request");


  /*
      detect url is zhihu question
      @param {String} url
   */

  _isZhihuQuestion = exports.isZhihuQuestion = function(url) {
    var pattern;
    pattern = /zhihu\.com\/question/i;
    return pattern.test(url);
  };


  /*
      detect url is zhihu topic
      @param {String} url
   */

  _isZhihuQuestion = exports.isZhihuTopic = function(url) {
    var pattern;
    pattern = /zhihu\.com\/topic/i;
    return pattern.test(url);
  };


  /*
      detect url is zhihu daily
   */

  _isZhihuDaily = exports.isZhihuDaily = function(url) {
    var pattern;
    pattern = /daily\.zhihu\.com\/story\/\d+/i;
    return pattern.test(url);
  };


  /*
      download page
   */

  exports.download = function(url, cb) {
    return request(url, function(err, response, body) {
      if (err) {
        return cb(err);
      } else if (response.statusCode !== 200) {
        return cb(new Error("http error,code:" + response.statusCode));
      } else {
        return cb(null, body.toString());
      }
    });
  };


  /*
      remove attributes
      @param {Object} node
   */

  exports.trimAttrs = function(node) {
    var all, attr, n, proAttrs, _i, _len, _results;
    all = node.find("*");
    _results = [];
    for (_i = 0, _len = all.length; _i < _len; _i++) {
      n = all[_i];
      proAttrs = ['src'];
      if (n.name !== "object" && n.name !== "embed") {
        proAttrs.push('href');
        proAttrs.push('width');
      }
      _results.push((function() {
        var _j, _len1, _ref, _results1;
        _ref = n.attribs;
        _results1 = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          attr = _ref[_j];
          if (__indexOf.call(proAttrs, attr) < 0) {
            _results1.push($(n).removeAttr(attr));
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };


  /*
      replace relative path with real path
      @param {Object} node
      @param {String} baseUrl
   */

  exports.pullOutRealPath = function(node, baseUrl) {
    var imgs, links;
    if (baseUrl) {
      imgs = node.find('img');
      imgs.each(function(i, img) {
        var realPath;
        realPath = img.attribs['src'];
        _.each(img.attribs, function(value, key) {
          if (_isUrl(value) && (value !== realPath || (!realPath))) {
            return realPath = value;
          }
        });
        return img.attribs['src'] = _isUrl(realPath) ? realPath : url.resolve(baseUrl, realPath);
      });
      links = node.find('a');
      return links.each(function(i, link) {
        if (link.attribs['href']) {
          return link.attribs['href'] = url.resolve(baseUrl, link.attribs['href']);
        }
      });
    }
  };


  /*
     get questions in a topic
   */

  exports.getTopicQuestions = function($, nodes) {
    var questionsArr, seenUrls;
    questionsArr = [];
    seenUrls = [];
    nodes.each(function() {
      var node, qTitle, qUrl;
      node = $(this);
      qTitle = node.text().trim();
      qUrl = exports.toAbsolute(node.attr('href'));
      if (seenUrls.indexOf(qUrl) === -1) {
        seenUrls.push(qUrl);
        return questionsArr.push({
          title: qTitle,
          url: qUrl
        });
      }
    });
    return questionsArr = questionsArr;
  };


  /*
     get questions in a topic
   */

  exports.getTags = function($, nodes) {
    var tags;
    tags = [];
    nodes.each(function() {
      var node;
      node = $(this);
      return tags.push({
        title: node.text().trim(),
        url: exports.toAbsolute(node.attr('href'))
      });
    });
    return tags = tags;
  };


  /*
      get title of a topic
   */

  exports.toAbsolute = function(href) {
    var absoluteUrl;
    return absoluteUrl = "http://www.zhihu.com" + href;
  };


  /*
      get title of a topic
   */

  exports.getTopicTitle = function(node) {
    var matches, pattern, text, title;
    text = node.text().trim();
    pattern = /^([^\n]*)/;
    matches = text.match(pattern);
    return title = matches[1];
  };


  /*
      get follower count
   */

  exports.getFollowerCount = function(node) {
    var followerCount, matches, pattern, text;
    text = node.text().trim().replace(/(\r\n|\n|\r)/gm, ' ');
    pattern = /.*(\d+).*人关注/i;
    matches = pattern.exec(text);
    return followerCount = parseInt(matches[1], 10);
  };


  /*
      get author info
   */

  exports.getAuthor = function(info) {
    var arr;
    arr = info.split("，");
    return {
      name: arr[0],
      about: arr[1] || ""
    };
  };

}).call(this);

//# sourceMappingURL=util.map
