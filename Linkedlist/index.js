const Node = require('./Node');

function Linkedlist() {
    this.head = null;
    this.length = 0;
}

Linkedlist.prototype.getNodeByIndex = function(n = 0) {
    let current = this.head;
    let i = 0;
    if(n < 0) {
        n = this.length + n;
    }
    while(current) {
        if(i == n) {
            return current;
        }
        current = current.next;
        i++;
    }
    return null;
}

Linkedlist.prototype.getElementByIndex = function(n) {
    const node = this.getNodeByIndex(n);
    if(node) {
        return node.value;
    }
    return undefined;
}
Linkedlist.prototype.includes = function(e) {
    for(let l of this) {
        if(l === e) {
            return true;
        }
    }
    return false;
}
Linkedlist.prototype.map = function(fn) {
    const newLinkedlist = new Linkedlist();
    let n = 0;
    for(let l of this) {
        const mod = fn(l, n, this);
        newLinkedlist.push(mod);
        n++;
    }
    return newLinkedlist;
}
Linkedlist.prototype.filter = function(fn) {
    const newLinkedlist = new Linkedlist();
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
Linkedlist.prototype.findNode = function(fn) {
    let current = this.head;
    let n = 0;
    let foundNode = null;
    while(current) {
        const found = fn(current.value, n, this);
        if(found) {
            foundNode = current;
            break;
        }
        current = current.next;
        n++;
    }
    return foundNode;
}
Linkedlist.prototype.find = function(fn) {
    const foundNode = this.findNode(fn);
    if(foundNode) {
        return foundNode.value;
    }
    return null;
}
Linkedlist.prototype.reduce = function(fn, initialValue) {
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
Linkedlist.prototype.remove = function(match, removeAllMatches) {
    let l = this.head;
    let previous = null;
    let n = 0;
    while(l) {
        let found = false;
        if(typeof match === "function") {
            found = match(l, n);
        } else {
            found = (l === match);
        }
        if(found) {
            if(previous) {
                previous.next = l.next;
            } else {
                this.head = l.next;
            }
            if(!removeAllMatches) {
                return true;
            }
        }
        previous = l;
        l = l.next;
        n++;
    }
    return true;
}
Linkedlist.prototype.push = function(e) {
    const node = new Node(e);
    let lastNode = this.getNodeByIndex(-1);
    if(lastNode) {
        lastNode.next = node;
    } else {
        this.head = node;
    }
    this.length++;
}
Linkedlist.prototype.pop = function() {
    let node = this.getNodeByIndex(-2);
    let element = null;
    if(this.length === 1) {
        element = this.head.value;
        this.head = null;
        this.length--;
        return element;
    }
    if(!node) {
        return null;
    }
    element = node.next.value;
    delete node.next;
    this.length--;
    return element;
}
Linkedlist.prototype.concat = function(list) {
    const newList = new Linkedlist();
    for(let l of this) {
        newList.push(l);
    }
    if(list instanceof Node) {
        // newList.push(list.value)
        while(list) {
            newList.push(list.value);
            list = list.next;
        }
    } else if(list instanceof Linkedlist) {
        for(let l of list) {
            newList.push(l);
        }   
    }
    return newList;
}
Linkedlist.prototype.slice = function(begin = 0, end = this.length) {
    let n = 0;
    const newLinkedList = new Linkedlist();
    for(let current of this) {
        if((n >= begin) && (n < end)) {
            newLinkedList.push(current);
            if(n === (end - 1)) {
                break;
            }
        }
        n++;
    }
    return newLinkedList;
}
Linkedlist.prototype.sort = function(fn) {
    const merge = (left, right) => {
        const resultList = new Linkedlist();
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
Linkedlist.prototype.findAndModify = function(fn) {
    let n = 0;
    let node = this.head;
    while(node) {
        const mod = fn(node.value, n, this);
        node.value = mod;
        node = node.next;
        n++;
    }
    return newLinkedlist;
}
Linkedlist.prototype.modifyByIndex = function(index, update) {
    if((index < 0) || (index >= this.length)) {
        throw new ReferenceError("Index you have mentioned doesnt exist");
    }
    let n = 0;
    let node = this.head;
    while(node) {
        if(n == index) {
            node.value = update;
            return true;
        }
        node = node.next;
        n++;
    }
}
Linkedlist.prototype.insertArray = function(array) {
    if(!Array.isArray(array)) {
        throw new TypeError(`Expected Array, got ${typeof array}`);
    }
    array.forEach((e) => {
        this.push(e);
    });
}
Linkedlist.prototype.insertElement = function(element, index) {
    let n = 0;
    let current = this.head;
    let previous = null;
    const newNode = new Node(element);
    while(current) {
        if(n === index) {
            if(previous) {
                newNode.next = current;
                previous.next = newNode;
            } else {
                newNode.next = this.head;
                this.head = newNode;
            }
            this.length++;
            return true;
        }
        previous = current;
        current = current.next;
        n++;
    }
}

Linkedlist.prototype.entries = function() {
    const finalArray = [];
    let n = 0;
    for(let l of this) {
        finalArray.push([n, l]);
    }
    return finalArray;
}

Linkedlist.prototype.reverse = function() {
    let reversedNodes = null;
    for(let l of this) {
        const newNode = new Node(l);
        if(reversedNodes) {
            newNode.next = reversedNodes;
        }
        reversedNodes = newNode;
    }
    const newLinkedList = new Linkedlist();
    newLinkedList = newLinkedList.concat(reversedNodes);
    return newList;
}
Linkedlist.prototype.forEach = function(fn) {
    let n = 0;
    for(let l in this) {
        fn(l, n, this);
        n++;
    }
    return;
}

Linkedlist.prototype[Symbol.iterator] = function() {
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

module.exports = Linkedlist;