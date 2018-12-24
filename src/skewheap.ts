interface Node<T> {
  item:  T;
  left:  Node<T> | null;
  right: Node<T> | null;
}

type Compare<T>   = (a: T, b: T) => number;
type MaybeNode<T> = Node<T> | null;

function merge<T>(cmp: Compare<T>, a: MaybeNode<T>, b: MaybeNode<T>): MaybeNode<T> {
  if (a == null) return b;
  if (b == null) return a;

  if (cmp(a.item, b.item) > 0)
    return merge(cmp, b, a);

  return {
    item:  a.item,
    left:  merge(cmp, b, a.right),
    right: a.left,
  };
}

function explain<T>(node: Node<T>, indent: string='  ') {
  console.log(`${indent}Node<` + node.item + '>');

  if (node.left != null)
    explain(node.left, indent + "  ");

  if (node.right != null)
    explain(node.right, indent + "  ");
}


export class SkewHeap<T> {
  public cmp:      Compare<T>;
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
      this.root = merge<T>(this.cmp, this.root, node);
      ++this.count;
    }
  }

  take(): T|null {
    if (this.root == null)
      return null;

    const item = this.root.item;
    this.root = merge<T>(this.cmp, this.root.left, this.root.right);
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
    new_heap.root  = merge(this.cmp, this.root, heap.root);
    return new_heap;
  }

  explain() {
    console.log(`SkewHeap<size=${this.size}>`);
    if (this.root != null)
      explain(this.root);
  }
}
