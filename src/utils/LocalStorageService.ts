export const LocalStorageService = {
    set<T>(value: T, key: string = '__VERS_TODO_LIST__') {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get<T>(key: string = '__VERS_TODO_LIST__') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) as T : null;
    },
}