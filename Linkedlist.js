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
        if(!node) {
            return null;
        }
        const element = node.next.value;
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
            newList.push(list.value)
            while(list.next) {
                list = list.next;
                newList.push(list.value);
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
            }
            n++;
        }
        return newLinkedList;
    }
    sort() {
        const merge = (left, right) => {
            const resultList = new Linkedlist();
            let leftPointer = left.head, rightPointer = right.head;
            while(leftPointer && rightPointer) {
                if(leftPointer.value < rightPointer.value) {
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
