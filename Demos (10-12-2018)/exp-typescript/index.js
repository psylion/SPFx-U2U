"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var U2U;
(function (U2U) {
    var Person = /** @class */ (function () {
        // private name : string;
        // private age : number;
        function Person(name, age) {
            this.name = name;
            this.age = age;
            // this.name = name;
            // this.age = age;
        }
        return Person;
    }());
    U2U.Person = Person;
})(U2U || (U2U = {}));
// variables
var a;
var b = 10;
var c;
var d;
var trainer;
trainer = { name: 'Rob' };
function add(arg1, arg2, arg3) {
    if (typeof (arg1) == 'number') {
    }
    return 0;
}
var operation;
operation = function (x, y) { return x * y; };
operation = function (x, y) { return x + y; };
var operation2;
operation2 = function (x, y) { return x * y; };
operation2 = function (x, y) { return x + y; };
function whatever(arr, op) {
}
var rob = {
    age: 32,
    name: 'Rob',
};
// classes
var Person = /** @class */ (function () {
    function Person(name, age) {
        this.married = true;
        this.name = name;
        this.age = age;
    }
    return Person;
}());
var Car = /** @class */ (function () {
    function Car(_brand, _model) {
        this._brand = _brand;
        this._model = _model;
        Car.counter++;
    }
    Object.defineProperty(Car.prototype, "brand", {
        get: function () {
            return this._brand;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Car.prototype, "model", {
        set: function (value) {
            this._model = value;
        },
        enumerable: true,
        configurable: true
    });
    Car.prototype.accelerate = function () {
        console.log(this._brand + " " + this._model + " is accelerating");
    };
    return Car;
}());
var tesla = new Car('Tesla', 'Model-X');
console.log(tesla.brand);
tesla.model = 'Model-3';
// tesla.brand = '';
tesla.accelerate();
var ElectricCar = /** @class */ (function (_super) {
    __extends(ElectricCar, _super);
    function ElectricCar(brand, model, battery) {
        var _this = _super.call(this, brand, model) || this;
        _this.battery = battery;
        return _this;
    }
    ElectricCar.prototype.accelerate = function () {
        console.log(this._brand + " " + this._model + " goes zooooom");
    };
    return ElectricCar;
}(Car));
var ec = new ElectricCar('Tesla', 'X', 1000);
ec.accelerate();
var car = ec;
car.accelerate();
ec = car;
ec.accelerate();
//# sourceMappingURL=index.js.map