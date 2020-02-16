var Node = require('../DoubleLinkedlist/Node');

function CircularLinkedlist() {
    this.head = null;
    this.length = 0;
}

CircularLinkedlist.prototype.addNode = function(n, type) {
    let node = new Node(n);
    if(this.length === 0) {
        this.head = node;
        this.head.next = node;
    } else if(type === 'stack') {
        node.next = this.head;
        this.head = node;
        this.length++;
    } else {
        const tail = this.head.previous;
        tail.next = node;
        node.previous = tail;
    }
    this.head.previous = node;
    return n;
}

CircularLinkedlist.prototype.queue = function(n) {
    this.addNode(n, 'queue');
    return n;
}
CircularLinkedlist.prototype.stack = function(n) {
    this.addNode(n, 'stack');
    return n;
}
CircularLinkedlist.prototype.pop = function() {
    const tailNodeValue = this.tail.value;
    const previousNode = this.tail.previous;
    delete previousNode.next;
    previousNode.next = null;
    this.tail = previousNode;
    return tailNodeValue;
}
CircularLinkedlist.prototype.returnNodeAtIndex = function(index) {
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
CircularLinkedlist.prototype.getElementAtIndex = function(index) {
    const node = this.returnNodeAtIndex(index);
    if(node === -1) {
        return undefined;
    }
    return node.value;
}
CircularLinkedlist.prototype.updateAtIndex = function(index, newValue) {
    const node = this.returnNodeAtIndex(index);
    if(node === -1) {
        return -1;
    } else {
        node.value = newValue;
        return 1;
    }
}
CircularLinkedlist.prototype.removeAtIndex = function(index) {
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
CircularLinkedlist.prototype.insertElement = function(n, index) {
    const nodeAtIndex = this.returnNodeAtIndex(index);
    if(nodeAtIndex === -1) {
        throw new ReferenceError('no element found at specified index');
    }
    const node = new Node(n);
    const previous = nodeAtIndex.previous;

    node.next = nodeAtIndex;
    node.previous = previous;
    previous.next = node;
}
CircularLinkedlist.prototype.slice = function(begin = 0, end = this.length) {
    let n = 0;
    const newLinkedList = new CircularLinkedlist();
    for(let current of this) {
        if((n >= begin) && (n < end)) {
            newLinkedList.queue(current);
            if(n === (end - 1)) {
                break;
            }
        }
        n++;
    }
    return newLinkedList;
}
CircularLinkedlist.prototype.reverseIterate = function * () {
    let current = this.tail;
    while(current) {
        yield current.value;
        current = current.previous;
    }
}
CircularLinkedlist.prototype[Symbol.iterator] = function() {
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