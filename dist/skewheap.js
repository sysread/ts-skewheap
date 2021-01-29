"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// DEBUG: print out an indented representation of the node
function explain(node, indent = '  ') {
    console.log(`${indent}Node<` + node.item + '>');
    if (node.left != null)
        explain(node.left, indent + "  ");
    if (node.right != null)
        explain(node.right, indent + "  ");
}
// Recursively merge the node with another, non-destructively.
function merge_recursive(cmp, a, b) {
    if (a == null)
        return b;
    if (b == null)
        return a;
    if (cmp(a.item, b.item) > 0)
        [a, b] = [b, a];
    return {
        item: a.item,
        left: merge_recursive(cmp, b, a.right),
        right: a.left,
    };
}
// Destructively merge the node with another. Because it is destructive, it can
// use the faster but less elegant iterative algorithm.
function merge(cmp, a, b) {
    if (a == b == null)
        return null;
    const queue = [];
    const subtrees = [];
    if (a != null)
        queue.push(a);
    if (b != null)
        queue.push(b);
    // Cut right subtrees from each path
    while (queue.length > 0) {
        const node = queue.shift();
        if (node == null)
            break;
        // Remove the right node and add it to the queue, if present.
        if (node.right != null) {
            queue.push(node.right);
            node.right = null;
        }
        // Add the node to the list of cut nodes
        subtrees.push(node);
    }
    // Sort the collected subtrees
    subtrees.sort((a, b) => cmp(a.item, b.item));
    if (subtrees.length > 0) {
        return subtrees.reduceRight((ult, penult) => {
            // Swap the left and right if the penultimate node has a left subtree.
            // Its right subtree has already been cut.
            if (penult.left != null)
                penult.right = penult.left;
            // Set its left node to be the final node in the list.
            penult.left = ult;
            // Return the result
            return penult;
        });
    }
    return null;
}
class SkewHeap {
    constructor(cmp) {
        this.root = null;
        this.count = 0;
        this.cmp = cmp;
    }
    get size() {
        return this.count;
    }
    get is_empty() {
        return this.root == null;
    }
    put(...items) {
        for (const item of items) {
            const node = { item: item, left: null, right: null };
            this.root = merge(this.cmp, this.root, node);
            ++this.count;
        }
    }
    take() {
        if (this.root == null)
            return null;
        const item = this.root.item;
        this.root = merge(this.cmp, this.root.left, this.root.right);
        --this.count;
        return item;
    }
    drain() {
        const items = [];
        while (this.size > 0) {
            const item = this.take();
            if (item != null)
                items.push(item);
        }
        return items;
    }
    merge(heap) {
        const new_heap = new SkewHeap(this.cmp);
        new_heap.count = this.count + heap.count;
        new_heap.root = merge_recursive(this.cmp, this.root, heap.root);
        return new_heap;
    }
    absorb(heap) {
        // Increment the count and merge the new heap's root into our own
        this.count += heap.count;
        this.root = merge(this.cmp, this.root, heap.root);
        // Wipe out the other heap
        heap.count = 0;
        heap.root = null;
    }
    explain() {
        console.log(`SkewHeap<size=${this.size}>`);
        if (this.root != null)
            explain(this.root);
    }
}
exports.default = SkewHeap;
