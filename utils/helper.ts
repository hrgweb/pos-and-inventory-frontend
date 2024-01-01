// Function to count occurrences of a specific value in a property
function countOccurrences(array: [], property: string, valueToCount: number) {
  return array.reduce((count, obj) => {
    return obj[property] === valueToCount ? count + 1 : count
  }, 0)
}

export const util = {
  countOccurrences
}
