var Node = require('./Node');

function DoubleLinkedList() {
    this.head = null;
    this.tail = null;
    this.length = 0;
}

DoubleLinkedList.prototype.push = function(n) {
    let node = new Node(n);
    if(this.length === 0) {
        this.head = node;
    } else {
        this.tail.next = node;
        node.previous = this.tail;
    }
    this.tail = node;
    this.length++;
    return n;
}
DoubleLinkedList.prototype.pop = function() {
    const tailNodeValue = this.tail.value;
    const previousNode = this.tail.previous;
    delete previousNode.next;
    previousNode.next = null;
    this.tail = previousNode;
    return tailNodeValue;
}
DoubleLinkedList.prototype.returnNodeAtIndex = function(index) {
    if(index < 0 || index >= this.length) {
        const mid = Math.ceil(this.length/2);
        let nextProperty = (index >= mid) ? 'previous' : 'next';
        let currentNode = this.head;
        let n = 0;
        while(currentNode) {
            if(n === index) {
                return currentNode;
            }
            currentNode = currentNode[nextProperty];
        }
    }
    return -1;

}
DoubleLinkedList.prototype.getElementAtIndex = function(index) {
    const node = this.returnNodeAtIndex(index);
    if(node === -1) {
        return undefined;
    }
    return node.value;
}
DoubleLinkedList.prototype.updateAtIndex = function(index, newValue) {
    const node = this.returnNodeAtIndex(index);
    if(node === -1) {
        return -1;
    } else {
        node.value = newValue;
        return 1;
    }
}
DoubleLinkedList.prototype.removeAtIndex = function(index) {
    const node = this.returnNodeAtIndex(index);
    if(node === -1) {
        return undefined;
    }
    const previous = node.previous;
    const next = node.next;
    if(!previous) {
        this.head = next;
    } else if(!next) {
        this.tail = previous
    } else {
        previous.next = next;
        next.previous = previous;
    }
    delete node;
    return true;
}
DoubleLinkedList.prototype[Symbol.iterator] = function() {
    let current = this.head;
    return {
        next: () => {
            if(!current) {
                return {done: true};
            }
            const returnVal = {
                value: current.value,
                done: false
            };
            current = current.next;
            return returnVal;
        }
    };
}