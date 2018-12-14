export default class Person {
    constructor(public firstname, public lastname) {}

    public sayHello(): string {
        return `${this.firstname}: hi, how are you doing?`;
    }
}