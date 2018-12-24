interface Node<T> {
    item: T;
    left: Node<T> | null;
    right: Node<T> | null;
}
declare type Compare<T> = (a: T, b: T) => number;
declare type MaybeNode<T> = Node<T> | null;
export declare class SkewHeap<T> {
    cmp: Compare<T>;
    protected root: MaybeNode<T>;
    protected count: number;
    constructor(cmp: Compare<T>);
    readonly size: number;
    readonly is_empty: boolean;
    put(...items: T[]): void;
    take(): T | null;
    drain(): T[];
    merge(heap: SkewHeap<T>): SkewHeap<T>;
    explain(): void;
}
export {};
