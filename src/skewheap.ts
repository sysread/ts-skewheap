interface Node<T> {
  item:  T;
  left:  Node<T> | null;
  right: Node<T> | null;
}

type Compare<T>   = (a: T, b: T) => number;
type MaybeNode<T> = Node<T> | null;

function explain<T>(node: Node<T>, indent: string='  ') {
  console.log(`${indent}Node<` + node.item + '>');

  if (node.left != null)
    explain(node.left, indent + "  ");

  if (node.right != null)
    explain(node.right, indent + "  ");
}

function merge_recursive<T>(cmp: Compare<T>, a: MaybeNode<T>, b: MaybeNode<T>): MaybeNode<T> {
  if (a == null) return b;
  if (b == null) return a;

  if (cmp(a.item, b.item) > 0)
    return merge_recursive(cmp, b, a);

  return {
    item:  a.item,
    left:  merge_recursive(cmp, b, a.right),
    right: a.left,
  };
}

function merge<T>(cmp: Compare<T>, a: MaybeNode<T>, b: MaybeNode<T>): MaybeNode<T> {
  const queue    = [];
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

    if (node.right != null) {
      queue.push(node.right);
      node.right = null;
    }

    subtrees.push(node);
  }

  // Sort the collected subtrees
  subtrees.sort((a, b) => cmp(a.item, b.item))

  if (subtrees.length > 0) {
    return subtrees.reduceRight((ult, penult) => {
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


export default class SkewHeap<T> {
  public    cmp:   Compare<T>;
  protected root:  MaybeNode<T> = null;
  protected count: number       = 0;

  constructor(cmp: Compare<T>) {
    this.cmp = cmp;
  }

  get size(): number {
    return this.count;
  }

  get is_empty(): boolean {
    return this.root == null;
  }

  put(...items: T[]): void {
    for (const item of items) {
      const node = { item: item, left: null, right: null };
      this.root = merge(this.cmp, this.root, node);
      ++this.count;
    }
  }

  take(): T|null {
    if (this.root == null)
      return null;

    const item = this.root.item;
    this.root = merge(this.cmp, this.root.left, this.root.right);
    --this.count;

    return item;
  }

  drain(): T[] {
    const items = [];

    while (this.size > 0) {
      const item = this.take();

      if (item != null)
        items.push(item);
    }

    return items;
  }

  merge(heap: SkewHeap<T>): SkewHeap<T> {
    const new_heap = new SkewHeap<T>(this.cmp);
    new_heap.count = this.count + heap.count;
    new_heap.root  = merge_recursive(this.cmp, this.root, heap.root);
    return new_heap;
  }

  absorb(heap: SkewHeap<T>): void {
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
