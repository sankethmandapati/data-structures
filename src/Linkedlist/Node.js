function Node(n) {
    if(n != undefined) {
        this.value = n;
        this.next = null;
    } else {
        throw new Error("Node can not be empty, passe a value to the constructor");
    }
}

module.exports = Node;