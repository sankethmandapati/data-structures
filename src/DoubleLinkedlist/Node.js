function Node(value) {
    if(value === undefined) {
        throw new TypeError("A node can not be undefined");
    } else {
        this.value = value;
        this.next = null;
        this.previous = null;
    }
}
Node.prototype.append = function(node) {
    if(!(node instanceof Node)) {
        node = new Node(node);
    }
    this.next = node;
    node.previous = this;
    return node;
}
Node.prototype.prepend = function(node) {
    if(!(node instanceof Node)) {
        node = new Node(node);
    }
    this.previous = node;
    node.next = this;
    return node;
}
Node.prototype.removeNext = function() {
    this.next = null;
    return this;
}

module.exports = Node;
