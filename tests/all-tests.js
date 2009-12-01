var typal = require("../lib/typal").typal,
    assert = require("assert");

exports["test prototypal inheritance"] = function () {
    var obj = typal.beget();
    obj.method = function (){ return this.foo; }
    var obj2 = obj.beget();
    obj.foo = "bar";

    assert.equal(obj2.method(), "bar");
};

exports["test mixin"] = function () {
    var obj = typal.beget();
    obj.mix({
        hello: function () { return "hello world"; }
    });
    assert.equal(obj.hello(), "hello world");
};

exports["test mixin sugar"] = function () {
    var obj = typal.beget({
        hello: function () { return "world"; }
    });
    assert.equal(obj.hello(), "world");
};

exports["test mixin 'before' layering"] = function () {
    var obj = typal.beget({
        world: "mars",
        hello: function () { return "hello "+this.world; }
    });
    var obj2 = obj.beget({
        beforehello: function () {
            this.world = "earth";
        }
    });
    assert.equal(obj2.hello(), "hello earth");
};

exports["test mixin 'after' layering"] = function () {
    var obj = typal.beget({
        world: "mars",
        hello: function () { return "hello "+this.world; }
    });
    var obj2 = obj.beget({
        afterhello: function () {
            this.world = "earth";
        }
    });
    assert.equal(obj2.hello(), "hello mars");
    assert.equal(obj2.hello(), "hello earth");
};

exports["test construct"] = function () {
    var Type = typal.construct({
        constructor: function (val) {
            this.foo = val;
        }
    });
    var type = new Type("bar");

    assert.equal(type.foo, "bar");
};

exports["test construct with private data"] = function () {
    var Circle = typal.construct({
        constructor: function (radius) {
            this.mix({
                getCircumference: function () {
                    return 2 * Math.PI * radius;
                }
            });
        }
    });
    var circle = new Circle(4);

    assert.equal(circle.getCircumference(), 2 * Math.PI * 4);
};

exports["test instanceof"] = function () {
    var Type = typal.construct();
    var type = new Type();

    assert.ok(type instanceof Type);
};

exports["test constuctor equality"] = function () {
    var Type = typal.construct();
    var type = new Type();

    assert.strictEqual(Type, type.constructor);
};

if (require.main === module)
    require("os").exit(require("test").run(exports)); 
