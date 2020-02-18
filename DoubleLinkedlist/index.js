var Node = require('./Node');

function DoubleLinkedList() {
    this.head = null;
    this.tail = null;
    this.length = 0;
}
DoubleLinkedList.prototype.queue = function(n) {
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
DoubleLinkedList.prototype.stack = function(n) {
    let node = new Node(n);
    if(this.length === 0) {
        this.tail = node;
    } else {
        node.next = this.head;
        this.head.previous = node;
    }
    this.head = node;
    this.length++;
    return n;
}
DoubleLinkedList.prototype.pop = function() {
    const tailNodeValue = this.tail.value;
    const previousNode = this.tail.previous;
    if(this.length === 1) {
        delete this.head;
        delete this.tail;
        this.head = null;
        this.tail = null;
    } else {
        delete previousNode.next;
        previousNode.next = null;
        this.tail = previousNode;
    }
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
DoubleLinkedList.prototype.insertElement = function(n, index) {
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
DoubleLinkedList.prototype.slice = function(begin = 0, end = this.length) {
    // const direction = begin < (this.length - end - 1) ? 1 : -1;
    let n = begin < (this.length - end - 1) ? 0 : (this.length - 1);
    const newLinkedList = new DoubleLinkedList();
    if(n === 0) {
        for(let current of this) {
            if((n >= begin) && (n < end)) {
                newLinkedList.queue(current);
                if(n === (end - 1)) {
                    break;
                }
            }
            n++;
        }
    } else {
        const gen = this.reverseIterate();
        for(let current of gen) {
            if((n >= begin) && (n < end)) {
                newLinkedList.stack(current);
                if(n === begin) {
                    break;
                }
            }
            n--;
        }
    }
    return newLinkedList;
}
DoubleLinkedList.prototype.reverseIterate = function * () {
    let current = this.tail;
    while(current) {
        yield current.value;
        current = current.previous;
    }
}
DoubleLinkedList.prototype.concat = function(list) {
    const newList = new DoubleLinkedList();
    for(let l of this) {
        newList.queue(l);
    }
    if(list instanceof Node) {
        while(list) {
            newList.queue(list.value);
            list = list.next;
        }
    } else if(list instanceof DoubleLinkedList) {
        for(let l of list) {
            newList.queue(l);
        }   
    }
    return newList;
}
DoubleLinkedList.prototype.sort = function(fn) {
    const merge = (left, right) => {
        const resultList = new DoubleLinkedList();
        let leftPointer = left.head, rightPointer = right.head;
        while(leftPointer && rightPointer) {
            let comparision = 0;
            if(fn) {
                if(typeof fn == "function") {
                    comparision = fn(leftPointer.value, rightPointer.value);
                } else {
                    throw new Error(`Expected a function but got ${typeof fn}`);
                }
            } else {
                comparision = `${leftPointer.value}`.localeCompare(`${rightPointer.value}`);
            }
            if(comparision < 0) {
                resultList.queue(leftPointer.value);
                leftPointer = leftPointer.next || undefined;
            } else {
                resultList.queue(rightPointer.value);
                rightPointer = rightPointer.next || undefined;
            }
        }
        return resultList.concat(leftPointer).concat(rightPointer);
    };
    const mergeSort = (unsorted) => {
        if(unsorted.length <2) {
            return unsorted;
        }
        const mid = Math.floor(unsorted.length/2);
        const left = unsorted.slice(0, mid);
        const right = unsorted.slice(mid);
        return merge(
            mergeSort(left),
            mergeSort(right)
        );
    }
    const sorted = mergeSort(this);
    return sorted;
}
DoubleLinkedList.prototype.insertArray = function(array) {
    if(!Array.isArray(array)) {
        throw new TypeError(`Expected Array, got ${typeof array}`);
    }
    array.forEach((e) => {
        this.queue(e);
    });
}
DoubleLinkedList.prototype.forEach = function(fn) {
    let i = 0;
    for(let n of this) {
        fn(n, i);
        i++;
    }
}
DoubleLinkedList.prototype.map = function(fn) {
    const newDll = new DoubleLinkedList();
    let i = 0;
    for(let n of this) {
        const res = fn(i, n, this);
        i++;
    }
    return newDll;
}
DoubleLinkedList.prototype.reduce = function(fn, initialValue) {}
DoubleLinkedList.prototype.find = function(fn) {}
DoubleLinkedList.prototype.findAndModify = function(fn) {}
DoubleLinkedList.prototype.filter = function(fn) {}
DoubleLinkedList.prototype.join = function(fn) {}
DoubleLinkedList.prototype.reverse = function(fn) {}
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

module.exports = DoubleLinkedList;