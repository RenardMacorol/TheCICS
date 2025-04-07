export interface Handle<T>{
    handle(): Promise<T[]>;
}