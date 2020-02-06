const DoubleLinkedlist = require('../DoubleLinkedlist');
const Node = require('../DoubleLinkedlist/Node');

class CircularLinkedList extends DoubleLinkedlist {
    constructor() {
        super();
    }
    connectHeadToTail() {
        this.head.previous = this.tail;
        this.tail.next = this.head;
    }
    push(n) {
        super.push(n);
        this.connectHeadToTail();
        return n;
    }
    pop() {
        const tailValue = super.pop();
        this.connectHeadToTail();
        return tailValue;
    }
}