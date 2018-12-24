# NAME

SkewHeap

# SYNOPSIS

  const SkewHeap = require("skewheap");

  const q = new SkewHeap.SkewHeap((a, b) => {
    if (a < b) return -1;
    if (b < a) return 1;
    return 0;
  });

  for (let i = 0; i < 100; ++i) {
    q.put(i);
  }

  while (!q.is_empty) {
    const item = q.take();
  }

# DESCRIPTION

A skew heap is a min heap (a priority queue) for which all destructive
operations (`put`, `take`) are implemented in terms of a single function,
`merge`.  Operations on a skew heap have an ammortized performance of O(log n)
(in fact, it is slightly better than that). A skew heap's most interesting
characteristic is the ability to quickly merge with another skew heap.

# METHODS

## new

Accepts one parameter, a function taking two arguments, which it compares and
returns 1, 0, or -1. Returning -1 or 0 signifies that the first parameter is
less than or equal to the second and should be ordered ahead of the second
parameter.

## size

Returns the number of items in the queue.

## is_empty

Returns true if the queue has no items in it.

## put

Puts one or more items into the queue. Accepts a variable number of arguments.
All arguments must be comparable via the comparison function provided to the
constructor.

```
  heap.put(42)
  heap.put(1, 2, 3, 4)
```

## take

Returns the next item from the queue. If there are no items in the queue,
returns `undefined`.

# AUTHOR

# LICENSE
