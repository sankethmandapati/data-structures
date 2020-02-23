function Stack(size) {
    if(typeof size != "number") {
        throw new SyntaxError(`queue size: Expected a number but got ${typeof size}`);
    }
    this.stack = [];
    this.size = size;
}

Stack.prototype.push = function() {}