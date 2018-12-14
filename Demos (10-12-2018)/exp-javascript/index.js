(function () {
  var i, j, func, funcArray = [], length = 10;

  for (i = 0; i < length; i += 1) {
    //let k = i;
    (function (){
      var k = i;

      func = function () {
        console.log(k);
      };
    })();

    funcArray.push(func);
  }

  for (j = 0; j < length; j += 1) {
    funcArray[j]();
  }
})();

var Person = (function(){
  function Person(name, age){
    this.name = name;
    this.age = age;
  }

  Person.prototype.print = function(){
    console.log(`${this.name} with age ${this.age}`);
  }

  return Person;
})();

var trainer = new Person('Rob', 32);
trainer.print();

var fn = trainer.print.bind(trainer);
fn();
// fn.apply(new Person('John', 28));
