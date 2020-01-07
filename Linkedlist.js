class Node {
    constructor(n) {
        if(n != undefined) {
            this.value = n;
            this.next = null;
        } else {
            throw new Error("Node can not be empty, passe a value to the constructor");
        }
    }
}

class Linkedlist {
    constructor() {
        this.head = null;
        this.length = 0;
    }
    getNthNode(n = 0) {
        let current = this.head;
        let i = 0;
        while(current && current.next) {
            if(i == n) {
                return current;
            } else {
                current = current.next;
                i--;
            }
        }
        return;
    }
    getNthLastNode(n = 1) {
        let current = this.head;
        let i = this.length;
        if(n === this.length) {
            return this.head;
        }
        while(current && current.next) {
            current = current.next;
            i--;
            if((i - n) == 0) {
                return current;
            }
        }
        return;
    }
    includes(e) {
        for(let l of this) {
            if(l === e) {
                return true;
            }
        }
        return false;
    }
    map(fn) {
        const newLinkedlist = new Linkedlist();
        let n = 0;
        for(let l of this) {
            const mod = fn(l, n, this);
            newLinkedlist.push(mod);
            n++;
        }
        return newLinkedlist;
    }
    filter(fn) {
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
    reduce(fn, initialValue) {
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
    remove(match, removeAllMatches) {
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
    push(e) {
        const node = new Node(e);
        let lastNode = this.getNthLastNode();
        if(lastNode) {
            lastNode.next = node;
        } else {
            this.head = node;
        }
        this.length++;
    }
    pop() {
        let node = this.getNthLastNode(2);
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
    concat(list) {
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
    slice(begin = 0, end = this.length) {
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
    sort(fn) {
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
    findAndModify(fn) {
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
    modifyByIndex(index, update) {
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
    insertArray(array) {
        if(!Array.isArray(array)) {
            throw new TypeError(`Expected Array, got ${typeof array}`);
        }
        array.forEach((e) => {
            this.push(e);
        });
    }

    [Symbol.iterator]() {
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
}
