// Generated by CoffeeScript 1.12.7
(function() {
  var A, ASchema, B, BSchema, C, CSchema, ObjectId, P, Promise, TEST_CASES, Test, TestSchema, assert, deepPopulate, logger, mongoose;

  assert = require('assert');

  Promise = require('bluebird');

  mongoose = require('mongoose');

  deepPopulate = require('mongoose-deep-populate')(mongoose);

  P = require('../index');

  ObjectId = mongoose.Schema.Types.ObjectId;

  mongoose.Promise = Promise;

  ASchema = new mongoose.Schema({
    name: String,
    age: Number
  });

  A = mongoose.model('A', ASchema);

  BSchema = new mongoose.Schema({
    name: String,
    age: Number
  });

  B = mongoose.model('B', BSchema);

  CSchema = new mongoose.Schema({
    name: String,
    age: Number,
    b: {
      type: ObjectId,
      ref: 'B'
    }
  });

  C = mongoose.model('C', CSchema);

  TestSchema = new mongoose.Schema({
    name: String,
    age: Number,
    a: {
      type: ObjectId,
      ref: 'A'
    },
    c: {
      type: ObjectId,
      ref: 'C'
    }
  });

  TestSchema.plugin(deepPopulate);

  Test = mongoose.model('Test', TestSchema);

  TEST_CASES = {
    infinite: function() {
      return P(Test).infinite(true).exec();
    },
    config: function() {
      return P().config({
        size: 8,
        display: 3,
        size_name: 'size',
        page_name: 'page',
        light: false
      });
    },
    simple: function() {
      return P(Test).simple(true).exec();
    },
    inject: function() {
      var o;
      o = {
        page: 5,
        size: 10
      };
      return P(Test).inject(o).exec();
    },
    extend: function() {
      return P(Test).find().select('name a c').page(1).size(5).sort({
        age: -1
      }).extend('deepPopulate', ['a', 'c', 'c.b'], {
        populate: {
          'c.b': {
            select: 'name'
          }
        }
      });
    },
    populate: function() {
      return P(Test).find().select('name a c').page(1).size(10).display(5).sort({
        age: -1
      }).populate('a', 'name').populate('c');
    }
  };

  logger = function(m) {
    return console.log("[mongoose-sex-page]: " + m);
  };

  mongoose.connect('mongodb://localhost/pagnation', {
    useMongoClient: true
  }).then(function(db) {
    return A.create({
      name: 'A',
      age: 1
    }).bind({}).then(function(a) {
      this.a = a;
      return B.create({
        name: 'B',
        age: 2
      });
    }).then(function(b) {
      return C.create({
        name: 'C',
        age: 3,
        b: b.id
      });
    }).then(function(c) {
      var i, tests;
      tests = (function() {
        var j, results1;
        results1 = [];
        for (i = j = 1; j <= 100; i = ++j) {
          results1.push({
            name: "Test" + i,
            age: i,
            a: this.a,
            c: c
          });
        }
        return results1;
      }).call(this);
      return Test.create(tests);
    }).then(function() {
      return TEST_CASES.extend().exec().then(function(arg) {
        var page, pages, records, size, total;
        page = arg.page, size = arg.size, total = arg.total, records = arg.records, pages = arg.pages;
        assert.equal(page, 1);
        assert.equal(size, 5);
        assert.equal(total, 100);
        assert.equal(records.length, 5);
        assert.equal(pages, 100 / 5);
        assert.equal(typeof records[0].a, 'object');
        assert.equal(typeof records[0].c, 'object');
        assert.equal(typeof records[0].c.b, 'object');
        return assert.equal(records[0].c.b.age, void 0);
      });
    }).then(function() {
      return TEST_CASES.populate().exec().then(function(arg) {
        var page, pages, records, size, total;
        page = arg.page, size = arg.size, total = arg.total, records = arg.records, pages = arg.pages;
        assert.equal(page, 1);
        assert.equal(size, 10);
        assert.equal(total, 100);
        assert.equal(records.length, 10);
        assert.equal(pages, 100 / 10);
        assert.equal(typeof records[0].a, 'object');
        assert.equal(typeof records[0].c, 'object');
        return assert.equal(records[0].a.age, void 0);
      });
    }).then(function() {
      return TEST_CASES.extend().exec(function(e, arg) {
        var page, pages, records, size, total;
        page = arg.page, size = arg.size, total = arg.total, records = arg.records, pages = arg.pages;
        if (e != null) {
          throw e;
        }
        assert.equal(page, 1);
        assert.equal(size, 5);
        assert.equal(total, 100);
        assert.equal(records.length, 5);
        assert.equal(pages, 100 / 5);
        assert.equal(typeof records[0].a, 'object');
        assert.equal(typeof records[0].c, 'object');
        assert.equal(typeof records[0].c.b, 'object');
        return assert.equal(records[0].c.b.age, void 0);
      });
    }).then(function() {
      return TEST_CASES.populate().exec(function(e, arg) {
        var page, pages, records, size, total;
        page = arg.page, size = arg.size, total = arg.total, records = arg.records, pages = arg.pages;
        if (e != null) {
          throw e;
        }
        assert.equal(page, 1);
        assert.equal(size, 10);
        assert.equal(total, 100);
        assert.equal(records.length, 10);
        assert.equal(pages, 100 / 10);
        assert.equal(typeof records[0].a, 'object');
        assert.equal(typeof records[0].c, 'object');
        return assert.equal(records[0].a.age, void 0);
      });
    }).then(function() {
      TEST_CASES.config();
      return TEST_CASES.simple().then(function(results) {
        assert.equal(results.length === 8, true);
        return assert.equal(results.length > 0, true);
      });
    }).then(function() {
      return TEST_CASES.inject().then(function(result) {
        assert.equal(result.records.length === 10, true);
        assert.equal(result.page === 5, true);
        return assert.equal(result.display.length === 3, true);
      });
    }).then(function() {
      return TEST_CASES.infinite().then(function(result) {
        return assert.equal(result.records.length, 100);
      });
    }).then(function() {
      return logger('tests passed');
    })["catch"](function(e) {
      throw e;
    })["finally"](function() {
      return Test.remove().then(function() {
        return A.remove();
      }).then(function() {
        return B.remove();
      }).then(function() {
        return C.remove();
      }).then(function() {
        return db.close();
      })["catch"](function(e) {
        db.close();
        throw e;
      });
    });
  })["catch"](function(e) {
    throw e;
  });

}).call(this);
