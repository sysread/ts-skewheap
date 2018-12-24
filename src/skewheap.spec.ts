import { SkewHeap } from "./skewheap"
import { assert } from "chai";
import "mocha";

/*
 * Comparison function for the heap being tested
 */
function compare(a: number, b: number): number {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

/*
 * Build a shuffled array of numbers for testing
 */
const ordered: number[] = [];
const items:   number[] = [];

for (let i = 0; i < 100; ++i) {
  ordered.push(i);
  items.push(i);
}

for (let i = 0; i < 100; ++i) {
  const a = Math.floor(Math.random() * 100);
  const b = Math.floor(Math.random() * 100);
  [ items[a], items[b] ] = [ items[b], items[a] ];
}

/*
 * Begin testing
 */
describe('SkewHeap', () => {
  it('initializes empty', () => {
    const heap = new SkewHeap(compare)
    assert.equal(heap.size, 0, 'size is 0');
    assert.equal(heap.take(), null, 'take returns null');
  })

  it('orders items', () => {
    const heap = new SkewHeap(compare)

    for (let i = 0; i < items.length; ++i) {
      assert.equal(heap.size, i, 'heap size increases after put');
      heap.put(items[i]);
    }

    let size = heap.size;
    let prev = null;

    while (heap.size > 0) {
      const item = heap.take();

      assert.equal(heap.size, --size, 'heap size reduced after take()');

      if (item == null) {
        assert.fail("take() returned null when not empty");
        return;
      }

      if (prev != null) {
        assert.isAbove(item, prev, 'take() returns ordered item');
      }

      prev = item;
    }

    assert.equal(heap.take(), null, 'take() returns null after heap is emptied');
  });

  it('merges with other heaps', () => {
    const a = new SkewHeap(compare);
    const b = new SkewHeap(compare);

    a.put(...items.slice(0, 50));
    b.put(...items.slice(50));

    const c = a.merge(b);

    assert.equal(a.size, 50, "original a heap's size unchanged");
    assert(!a.is_empty, "original a heap is not empty");

    assert.equal(b.size, 50, "original b heap's size unchanged");
    assert(!b.is_empty, "original b heap is not empty");

    assert.equal(c.size, a.size + b.size, "merged heap contains sum of other heaps' values");

    assert.deepEqual(c.drain(), ordered, "merged heap contains items in expected order");
  });

  it('merges destructively (absorb)', () => {
    const a = new SkewHeap(compare);
    const b = new SkewHeap(compare);

    a.put(...items.slice(0, 50));
    b.put(...items.slice(50));

    a.absorb(b);

    assert.equal(a.size, 100, "original a heap's size unchanged");
    assert(!a.is_empty, "original a heap is not empty");

    assert.equal(b.size, 0, "original b heap's size is zero");
    assert(b.is_empty, "original b heap is empty");

    assert.deepEqual(a.drain(), ordered, "merged heap contains items in expected order");
  });
});
