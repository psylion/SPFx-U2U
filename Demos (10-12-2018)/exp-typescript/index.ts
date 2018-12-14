namespace U2U {
  export class Person {
    // private name : string;
    // private age : number;

    constructor(private name: string, private age: number) {
      // this.name = name;
      // this.age = age;
    }
  }
}

// variables
let a: number;
let b = 10;

let c: string | number;
let d: string | undefined | null;

let trainer: { name: string, age?: number };
trainer = { name: 'Rob' };

// functions
function add(n1: number, n2: number): number
function add(n1: number, n2: number, n3: number): number
function add(t1: string, n2: number): number
function add(arg1: number | string, arg2: number, arg3?: number): number {
  if (typeof (arg1) == 'number') {

  }

  return 0;
}

let operation: { (n1: number, n2: number): number };
operation = function (x, y) { return x * y; };
operation = (x, y) => x + y;

// interfaces
interface IOperation {
  (x: number, y: number): number;
}

let operation2: IOperation;
operation2 = function (x, y) { return x * y; };
operation2 = (x, y) => x + y;

function whatever(arr: number[], op: IOperation) {

}

interface IPerson {
  name: string;
  age: number;
  sayHello?: { (greeting: string): void };
}

let rob: IPerson = {
  age: 32,
  name: 'Rob',
  // sayHello: (greeting) => console.log(`${greeting} Rob`),
}

// classes
class Person implements IPerson {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  sayHello?: ((greeting: string) => void) | undefined;

  married: boolean = true;
}

class Car {
  static counter: number;

  constructor(protected _brand: string, protected _model: string) {
    Car.counter++;
  }

  get brand(): string {
    return this._brand;
  }

  set model(value: string) {
    this._model = value;
  }

  public accelerate(): void {
    console.log(`${this._brand} ${this._model} is accelerating`);
  }
}

let tesla = new Car('Tesla', 'Model-X');
console.log(tesla.brand);
tesla.model = 'Model-3';
// tesla.brand = '';
tesla.accelerate();

class ElectricCar extends Car{
  constructor(brand: string, model: string, private battery: number){
    super(brand, model);
  }

  public accelerate(): void {
    console.log(`${this._brand} ${this._model} goes zooooom`);
  }
}

let ec = new ElectricCar('Tesla', 'X', 1000);
ec.accelerate();
let car : Car = ec;
car.accelerate();
ec = car as ElectricCar;
ec.accelerate();

export abstract class Shape{
  constructor(){

  }

  protected abstract Area() : number;
}

export class Triangle extends Shape{
  protected Area(): number {
    throw new Error("Method not implemented.");
  }

}


// Generics
interface IFilter<T>{
  (el: T) : boolean;
}

function any<T>(arr : T[], filter : IFilter<T>) : boolean{
  for(let i = 0; i < arr.length; i++){
    if(filter(arr[i]))
    {
      return true;
    }
  }
  return false;
}

namespace Mine{
  class A{

  }

  export class B{

  }
}

let obj : Mine.B;

export {
  any,
  Mine
};