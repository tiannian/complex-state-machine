interface StorageInterface {
    get (space: string, key: string): Promise<string>;
    set (space: string, key: string, value: string): Promise<string>;
    del (space: string, key: string): Promise<string>;
    new (conn: any, prefix: string);
}

export {
    StorageInterface,
}

