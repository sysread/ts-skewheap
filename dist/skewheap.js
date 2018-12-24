"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function merge(cmp, a, b) {
    if (a == null)
        return b;
    if (b == null)
        return a;
    if (cmp(a.item, b.item) > 0)
        return merge(cmp, b, a);
    return {
        item: a.item,
        left: merge(cmp, b, a.right),
        right: a.left,
    };
}
function explain(node, indent) {
    if (indent === void 0) { indent = '  '; }
    console.log(indent + "Node<" + node.item + '>');
    if (node.left != null)
        explain(node.left, indent + "  ");
    if (node.right != null)
        explain(node.right, indent + "  ");
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
        new_heap.root = merge(this.cmp, this.root, heap.root);
        return new_heap;
    };
    SkewHeap.prototype.explain = function () {
        console.log("SkewHeap<size=" + this.size + ">");
        if (this.root != null)
            explain(this.root);
    };
    return SkewHeap;
}());
exports.SkewHeap = SkewHeap;
