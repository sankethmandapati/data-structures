var Node = require('./Node');

function DoubleLinkedList() {
    this.head = null;
    this.tail = null;
    this.length = 0;
}
DoubleLinkedList.spread = function() {
    const newDLll = new DoubleLinkedList();
    for(let i = 0; i < arguments.length; i++) {
        newDLll.concat(arguments[i]);
    }
    return newDll;
}
DoubleLinkedList.prototype.push = function(n) {
    if(this.length === 0) {
        this.head = this.tail = new Node(n);
    } else {
        this.tail = this.tail.append(n);
    }
    this.length++;
    return n;
}
DoubleLinkedList.prototype.unshift = function() {
    this.head = arguments.reduce((o, n) => (o || new Node(n)).append(n), this.head);
    this.length += arguments.length;
    return this.length;
}
DoubleLinkedList.prototype.pop = function() {
    if(this.length > 0) {
        const tailNodeValue = this.tail.value;
        const previousNode = this.tail.previous;
        if(this.length === 1) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = previousNode.removeNext();
        }
        return tailNodeValue;
    }
}
DoubleLinkedList.prototype.findNodeByIndex = function(index) {
    index = (index < 0) ? (this.length + index) : index;
    if(index >= 0 && index < this.length) {
        const forwardIterate = index < (this.length - index);
        let nextProperty = forwardIterate ? 'next' : 'previous';
        let currentNode = forwardIterate ? this.head : this.tail;
        let n = forwardIterate ? 0 : (this.length - 1);
        while(currentNode) {
            if(n === index) {
                return currentNode;
            }
            currentNode = currentNode[nextProperty];
            forwardIterate ? n++ : n--;
        }
    }
    return -1;
}
DoubleLinkedList.prototype.slice = function(begin = 0, end = this.length) {
    const forwardIterate = begin < (this.length - end - 1);
    let n = forwardIterate ? 0 : (this.length - 1);
    const iterator = forwardIterate ? this : this.reverseIterate();
    const method = forwardIterate ? 'push' : 'unshift';
    const newLinkedList = new DoubleLinkedList();
    for(let current of iterator) {
        if((n >= begin) && (n < end)) {
            newLinkedList[method](current);
            if(n === (end - 1)) {
                break;
            }
        }
        forwardIterate ? n++ : n--;
    }
    return newLinkedList;
}
DoubleLinkedList.prototype.findByIndex = function(index) {
    const node = this.findNodeByIndex(index);
    if(node === -1) {
        return undefined;
    }
    return node.value;
}
DoubleLinkedList.prototype.updateAtIndex = function(index, newValue) {
    const node = this.findNodeByIndex(index);
    if(node === -1) {
        return -1;
    } else {
        node.value = newValue;
        return 1;
    }
}
DoubleLinkedList.prototype.removeAtIndex = function(index) {
    const node = this.findNodeByIndex(index);
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
        previous.append(next);
    }
    return true;
}
DoubleLinkedList.prototype.insertElement = function(n, index) {
    const nodeAtIndex = this.findNodeByIndex(index);
    if(nodeAtIndex === -1) {
        throw new ReferenceError('no element found at specified index');
    }
    const previous = nodeAtIndex.previous;
    const node = nodeAtIndex.prepend(n);
    if(previous) {
        node.prepend(previous);
    } else {
        this.head = node;
    }
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
        newList.push(l);
    }
    if(list instanceof Node) {
        while(list) {
            newList.push(list.value);
            list = list.next;
        }
    } else if(list instanceof DoubleLinkedList) {
        for(let l of list) {
            newList.push(l);
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
                resultList.push(leftPointer.value);
                leftPointer = leftPointer.next || undefined;
            } else {
                resultList.push(rightPointer.value);
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
        this.push(e);
    });
}
DoubleLinkedList.prototype.forEach = function(fn) {
    let n = 0;
    for(let l of this) {
        fn(n, l);
        n++;
    }
}
DoubleLinkedList.prototype.map = function(fn) {
    const newDll = new DoubleLinkedList();
    let n = 0;
    for(let l of this) {
        const res = fn(l, n, this);
        newDll.push(res);
        n++;
    }
    return newDll;
}
DoubleLinkedList.prototype.reduce = function(fn, initialValue) {
    if(typeof fn != "function") {
        throw new TypeError(`${typeof fn} is not a function`);
    }
    if(this.length === 0 && !initialValue) {
        throw new TypeError("Reduce of empty array with no initial value");
    }
    let resultValue = (initialValue === undefined) ? this.head.value : initialValue;
    let n = 0;
    for(let l of this) {
        resultValue = fn(resultValue, l, n, this);
        n++;
    }
    return resultValue;
}
DoubleLinkedList.prototype.findNode = function(fn) {
    let n = 0;
    let node = this.head;
    while(node) {
        const found = fn(l, n);
        if(found) {
            return node;
        }
        node = node.next;
        n++;
    }
    return null;
}
DoubleLinkedList.prototype.find = function(fn) {
    const foundNode = this.findNode(fn);
    if(foundNode) {
        return foundNode.value;
    }
    return null;
}
DoubleLinkedList.prototype.findAndModify = function(fn) {
    let n = 0;
    let node = this.head;
    while(node) {
        const mod = fn(node.value, n, this);
        node.value = mod;
        node = node.next;
        n++;
    }
    return this;
}
DoubleLinkedList.prototype.filter = function(fn) {
    const newLinkedlist = new DoubleLinkedList();
    let n = 0;
    for(let l of this) {
        const found = fn(l, n);
        if(found) {
            newLinkedlist.push(l);
        }
        n++;
    }
    return newLinkedlist;
}
DoubleLinkedList.prototype.join = function(delimiter = ',') {
    let result = '';
    let n = 0;
    const lastIndex = this.length - 1;
    for(let l in this) {
        result += l + ((n === lastIndex) ? '' : delimiter);
        n++;
    }
    return result;
}
DoubleLinkedList.prototype.reverse = function() {
    const newDll = new DoubleLinkedList();
    for(let l of this) {
        newDll.unshift(l);
    }
    return newDll;
}
DoubleLinkedList.prototype[Symbol.iterator] = function() {
    let current = this.head;
    return {
        next: () => {
            const val = current.value;
            const returnVal = {
                value: val,
                done: (val === undefined)
            };
            current = current.next || {};
            return returnVal;
        }
    };
}
DoubleLinkedList.prototype[Symbol.toPrimitive] = function() {
    return this.join();
}
DoubleLinkedList.prototype.shift = function() {
    const { value, next } = this.head || {next: null, previous: null};
    if(next) {
        delete next.previous;
        next.previous = null;
        this.head = next;
    }
    return value;
}
DoubleLinkedList.prototype.every = function(fn, self) {
    let result = true;
    let n = 0;
    if(typeof fn !== 'function') {
        throw new TypeError('Expected a function as first argument');
    }
    if(typeof self !== 'object') {
        throw new TypeError('Expected an object as second argument');
    }
    for(let l of this) {
        result = !!fn.call(self, l, n, this) && result;
        n++;
    }
    return result;
}
DoubleLinkedList.prototype.some = function(fn, self) {
    let result = false;
    let n = 0;
    if(typeof fn !== 'function') {
        throw new TypeError('Expected a function as first argument');
    }
    if(typeof self !== 'object') {
        throw new TypeError('Expected an object as second argument');
    }
    for(let l of this) {
        result = !!fn.call(self, l, n, this) || result;
        n++;
    }
    return result;
}
DoubleLinkedList.prototype.includes = function(keyword) {
    let result = false;
    for(let l of this) {
        const found = (l === keyword);
        if(found) {
            result = true;
            break;
        }
    }
    return result;
}
DoubleLinkedList.prototype.indexOf = function(keyword) {
    let result = -1;
    let n = 0;
    for(let l of this) {
        const found = (l === keyword);
        if(found) {
            result = n;
            break;
        }
        n++;
    }
    return result;
}
DoubleLinkedList.prototype.lastIndexOf = function() {
    let result = -1;
    let n = this.length - 1;
    const gen = this.reverseIterate();
    for(let l of gen) {
        const found = (l === keyword);
        if(found) {
            result = n;
            break;
        }
        n--;
    }
    return result;
}
DoubleLinkedList.prototype.reduceRight = function(fn, initialValue) {
    if(typeof fn != "function") {
        throw new TypeError(`${typeof fn} is not a function`);
    }
    if(this.length === 0 && !initialValue) {
        throw new TypeError("Reduce of empty array with no initial value");
    }
    let resultValue = (initialValue === undefined) ? this.head.value : initialValue;
    let n = this.length - 1;
    const gen = this.reverseIterate();
    for(let l of gen) {
        resultValue = fn(resultValue, l, n, this);
        n--;
    }
    return resultValue;
}
DoubleLinkedList.prototype.splice = function() {
    let [start, nodesToRemove, ...rest] = arguments;
    start = parseInt(start, 10) || 0;
    nodesToRemove = parseInt(nodesToRemove, 10) || this.length;
    let beginingNode = null;
    let endingNode = null;
    if(start < -this.length) {
        start = 0;
    }
    if((start >= this.length) || (nodesToRemove <= 0)) {
        this.insertArray(rest);
    } else if(start === 0) {
        if(nodesToRemove >= this.length) {
            this.head = null;
            this.tail = null;
            this.length = rest.length;
            this.insertArray(rest);
        } else {
            endingNode = this.findNodeByIndex(nodesToRemove);
            delete endingNode.previous;
            endingNode.previous = null;
            this.head = rest.reduceRight((o, n) => o.prepend(n), endingNode);
            this.length = this.length - nodesToRemove + rest.length;
        }
    } else if(nodesToRemove >= (this.length - start)) {
        beginingNode = this.findNodeByIndex(start - 1);
        delete beginingNode.next;
        // beginingNode.next = null;
        this.tail = rest.reduce((o, n) => o.append(n), beginingNode);
        this.length = start + 1 + rest.length;
    } else {
        beginingNode = this.findNodeByIndex(start - 1);
        endingNode = this.findNodeByIndex(start + nodesToRemove);
        delete beginingNode.next;
        delete endingNode.previous;
        rest.reduce(
            (o, n) => o.append(n), beginingNode
        ).append(endingNode);
        this.length = this.length - nodesToRemove + rest.length;
    }
    return null;
}
DoubleLinkedList.prototype.toString = function() {
    return this.join();
}
DoubleLinkedList.prototype.toArray = function() {
    return [...this];
}
DoubleLinkedList.prototype.shiftNodeToTop = function(node) {
    if(!node) {
        return false;
    }
    if(!node.previous) {
        return true;
    }
    if(!node.next) {
        this.tail = node.previous;
        node.previous = null
        this.head = node.append(this.head);
        return true;
    }
    node.previous.append(node.next);
    node.previous = null;
    this.head = node.append(this.head);
    return true;
}
DoubleLinkedList.prototype.findAndShiftToTop = function(fn) {
    const node = this.findNode(fn);
    const result = this.shiftNodeToTop(node);
    return result;
}
DoubleLinkedList.prototype.findByIndexAndShiftToTop = function(index) {
    const node = this.findByIndex(index);
    const result = this.shiftNodeToTop(node);
    return result;
}

module.exports = DoubleLinkedList;
