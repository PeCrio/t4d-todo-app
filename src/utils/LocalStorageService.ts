export const LocalStorageService = {
    set<T>(value: T, key: string = '__VERS_TODO_LIST__') {
        const storageEvent = new Event('_New_List_Added');
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(storageEvent)
    },
    get<T>(key: string = '__VERS_TODO_LIST__') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) as T : null;
    },
}