interface Id {
  city_id: number
}

export function isCityId(cityIDs: Id[], city_id: number): boolean {
  for (let i = 0; i < cityIDs.length; i++) {
    const curr = cityIDs[i]
    if (curr.city_id === city_id) {
      return true
    }
  }
  return false
}
