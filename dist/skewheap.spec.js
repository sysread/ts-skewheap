"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var skewheap_1 = require("./skewheap");
var chai_1 = require("chai");
require("mocha");
/*
 * Comparison function for the heap being tested
 */
function compare(a, b) {
    if (a > b)
        return 1;
    if (a < b)
        return -1;
    return 0;
}
/*
 * Build a shuffled array of numbers for testing
 */
var ordered = [];
var items = [];
for (var i = 0; i < 100; ++i) {
    ordered.push(i);
    items.push(i);
}
for (var i = 0; i < 100; ++i) {
    var a = Math.floor(Math.random() * 100);
    var b = Math.floor(Math.random() * 100);
    _a = [items[b], items[a]], items[a] = _a[0], items[b] = _a[1];
}
/*
 * Begin testing
 */
describe('SkewHeap', function () {
    it('initializes empty', function () {
        var heap = new skewheap_1.SkewHeap(compare);
        chai_1.assert.equal(heap.size, 0, 'size is 0');
        chai_1.assert.equal(heap.take(), null, 'take returns null');
    });
    it('orders items', function () {
        var heap = new skewheap_1.SkewHeap(compare);
        for (var i = 0; i < items.length; ++i) {
            chai_1.assert.equal(heap.size, i, 'heap size increases after put');
            heap.put(items[i]);
        }
        var size = heap.size;
        var prev = null;
        while (heap.size > 0) {
            var item = heap.take();
            chai_1.assert.equal(heap.size, --size, 'heap size reduced after take()');
            if (item == null) {
                chai_1.assert.fail("take() returned null when not empty");
                return;
            }
            if (prev != null) {
                chai_1.assert.isAbove(item, prev, 'take() returns ordered item');
            }
            prev = item;
        }
        chai_1.assert.equal(heap.take(), null, 'take() returns null after heap is emptied');
    });
    it('merges with other heaps', function () {
        var a = new skewheap_1.SkewHeap(compare);
        var b = new skewheap_1.SkewHeap(compare);
        a.put.apply(a, items.slice(0, 50));
        b.put.apply(b, items.slice(50));
        var c = a.merge(b);
        chai_1.assert.equal(a.size, 50, "original a heap's size unchanged");
        chai_1.assert(!a.is_empty, "original a heap is not empty");
        chai_1.assert.equal(b.size, 50, "original b heap's size unchanged");
        chai_1.assert(!b.is_empty, "original b heap is not empty");
        chai_1.assert.equal(c.size, a.size + b.size, "merged heap contains sum of other heaps' values");
        chai_1.assert.deepEqual(c.drain(), ordered, "merged heap contains items in expected order");
    });
    it('merges destructively (absorb)', function () {
        var a = new skewheap_1.SkewHeap(compare);
        var b = new skewheap_1.SkewHeap(compare);
        a.put.apply(a, items.slice(0, 50));
        b.put.apply(b, items.slice(50));
        a.absorb(b);
        chai_1.assert.equal(a.size, 100, "original a heap's size unchanged");
        chai_1.assert(!a.is_empty, "original a heap is not empty");
        chai_1.assert.equal(b.size, 0, "original b heap's size is zero");
        chai_1.assert(b.is_empty, "original b heap is empty");
        chai_1.assert.deepEqual(a.drain(), ordered, "merged heap contains items in expected order");
    });
});
