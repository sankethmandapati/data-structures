function Node(value) {
    if(value === undefined) {
        throw new TypeError("A node can not be undefined");
    } else {
        this.value = value;
        this.next = null;
        this.previous = null;
    }
};

module.exports = Node;