interface Props {
    category_id: number;
    last_update: Date;
    name: string;
}

export function isCategory(category_name: string, arr: Props[]): boolean {
    for (let i = 0; i < arr.length; i++) {
        const curr = arr[i].name
        if (curr === category_name) {
            return true
        }
    }
    return false
}

export function findCategoryId(category_name: string, arr: Props[]): number {
    for (let i = 0; i < arr.length; i++) {
        const curr = arr[i].name
        if (curr === category_name) {
            return arr[i].category_id
        }
    }
    return -1
}