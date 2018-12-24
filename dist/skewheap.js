"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function explain(node, indent) {
    if (indent === void 0) { indent = '  '; }
    console.log(indent + "Node<" + node.item + '>');
    if (node.left != null)
        explain(node.left, indent + "  ");
    if (node.right != null)
        explain(node.right, indent + "  ");
}
function merge_recursive(cmp, a, b) {
    if (a == null)
        return b;
    if (b == null)
        return a;
    if (cmp(a.item, b.item) > 0)
        return merge_recursive(cmp, b, a);
    return {
        item: a.item,
        left: merge_recursive(cmp, b, a.right),
        right: a.left,
    };
}
function merge(cmp, a, b) {
    var queue = [];
    var subtrees = [];
    if (a != null)
        queue.push(a);
    if (b != null)
        queue.push(b);
    // Cut right subtrees from each path
    while (queue.length > 0) {
        var node = queue.shift();
        if (node == null)
            break;
        if (node.right != null) {
            queue.push(node.right);
            node.right = null;
        }
        subtrees.push(node);
    }
    // Sort the collected subtrees
    subtrees.sort(function (a, b) { return cmp(a.item, b.item); });
    if (subtrees.length > 0) {
        return subtrees.reduceRight(function (ult, penult) {
            // Swap the left and right if the penultimate node has a left subtree. Its
            // right subtree has already been cut.
            if (penult.left != null)
                penult.right = penult.left;
            // Set its left node to be the final node in the list.
            penult.left = ult;
            // Return the result
            return penult;
        });
    }
    else {
        return null;
    }
}
var SkewHeap = /** @class */ (function () {
    function SkewHeap(cmp) {
        this.root = null;
        this.count = 0;
        this.cmp = cmp;
    }
    Object.defineProperty(SkewHeap.prototype, "size", {
        get: function () {
            return this.count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkewHeap.prototype, "is_empty", {
        get: function () {
            return this.root == null;
        },
        enumerable: true,
        configurable: true
    });
    SkewHeap.prototype.put = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        for (var _a = 0, items_1 = items; _a < items_1.length; _a++) {
            var item = items_1[_a];
            var node = { item: item, left: null, right: null };
            this.root = merge(this.cmp, this.root, node);
            ++this.count;
        }
    };
    SkewHeap.prototype.take = function () {
        if (this.root == null)
            return null;
        var item = this.root.item;
        this.root = merge(this.cmp, this.root.left, this.root.right);
        --this.count;
        return item;
    };
    SkewHeap.prototype.drain = function () {
        var items = [];
        while (this.size > 0) {
            var item = this.take();
            if (item != null)
                items.push(item);
        }
        return items;
    };
    SkewHeap.prototype.merge = function (heap) {
        var new_heap = new SkewHeap(this.cmp);
        new_heap.count = this.count + heap.count;
        new_heap.root = merge_recursive(this.cmp, this.root, heap.root);
        return new_heap;
    };
    SkewHeap.prototype.absorb = function (heap) {
        this.count += heap.count;
        this.root = merge(this.cmp, this.root, heap.root);
        // Wipe out the other heap
        heap.count = 0;
        heap.root = null;
    };
    SkewHeap.prototype.explain = function () {
        console.log("SkewHeap<size=" + this.size + ">");
        if (this.root != null)
            explain(this.root);
    };
    return SkewHeap;
}());
exports.default = SkewHeap;
