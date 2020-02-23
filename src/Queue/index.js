// const Node = require('./Node');
function Queue(size) {
    if(typeof size != "number") {
        throw new SyntaxError(`queue size: Expected a number but got ${typeof size}`);
    }
    this.queue = [];
    this.size = size;
}


Queue.prototype.enqueue = function(element) {
    if(this.queue.length >= this.size) {
        console.warn("Queue is full, can not push elements");
        return null;
    }
    this.queue.push(element);
}

Queue.prototype.dequeue = function() {
    if(this.queue.length < 1) {
        console.warn("Queue is empty");
        return {
            done: true
        };
    }
    const poppedValue = this.queue.pop();
    return {
        done: false,
        value: poppedValue
    };
}

Queue.prototype.isempty = function() {
    return (this.queue.length === 0);
}

Queue.prototype.peek = function() {
    if(this.isempty()) {
        console.warn("Queue is empty");
        return null;
    }
    return this.queue[0];
}
