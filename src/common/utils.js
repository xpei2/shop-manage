// 清除sessionStorage
export function sessionStorageRemove(key) {
    if (typeof key === "string") {
        window.sessionStorage.removeItem(key);
    } else {
        return;
    }
}
