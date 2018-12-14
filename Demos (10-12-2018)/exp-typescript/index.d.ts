declare namespace U2U {
    class Person {
        private name;
        private age;
        constructor(name: string, age: number);
    }
}
declare let a: number;
declare let b: number;
declare let c: string | number;
declare let d: string | undefined | null;
declare let trainer: {
    name: string;
    age?: number;
};
declare function add(n1: number, n2: number): number;
declare function add(n1: number, n2: number, n3: number): number;
declare function add(t1: string, n2: number): number;
declare let operation: {
    (n1: number, n2: number): number;
};
interface IOperation {
    (x: number, y: number): number;
}
declare let operation2: IOperation;
declare function whatever(arr: number[], op: IOperation): void;
interface IPerson {
    name: string;
    age: number;
    sayHello?: {
        (greeting: string): void;
    };
}
declare let rob: IPerson;
declare class Person implements IPerson {
    name: string;
    age: number;
    constructor(name: string, age: number);
    sayHello?: ((greeting: string) => void) | undefined;
    married: boolean;
}
declare class Car {
    protected _brand: string;
    protected _model: string;
    static counter: number;
    constructor(_brand: string, _model: string);
    readonly brand: string;
    model: string;
    accelerate(): void;
}
declare let tesla: Car;
declare class ElectricCar extends Car {
    private battery;
    constructor(brand: string, model: string, battery: number);
    accelerate(): void;
}
declare let ec: ElectricCar;
declare let car: Car;
