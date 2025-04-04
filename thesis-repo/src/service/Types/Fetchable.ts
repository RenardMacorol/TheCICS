
export interface Fetchable<T>{
    fetch(): Promise<T[]>;
}
