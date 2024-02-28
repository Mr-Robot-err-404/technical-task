interface Props {
  category_id: number
  last_update: Date
  name: string
}

export function isCategoryValid(categoryName: string, arr: Props[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    const curr = arr[i].name
    if (curr === categoryName) {
      return true
    }
  }
  return false
}

export function findCategoryId(categoryName: string, arr: Props[]): number {
  for (let i = 0; i < arr.length; i++) {
    const curr = arr[i].name
    if (curr === categoryName) {
      return arr[i].category_id
    }
  }
  return -1
}
