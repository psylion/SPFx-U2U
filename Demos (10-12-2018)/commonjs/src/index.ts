import Person from './person';
import * as $ from 'jquery';

$(() => {
    const person1 = new Person('Robrecht', 'Van Caenegem');
    // console.log(person1.sayHello());

    const elm = $('.logger');
    if (elm.length) {
        elm.append(`<p>${person1.sayHello()}</p>`);
    }
});