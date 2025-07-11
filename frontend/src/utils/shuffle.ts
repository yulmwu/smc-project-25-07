export function shuffle<T>(array: T[]) {
    let currentIndex = array.length

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
}

export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    shuffle(newArray)
    return newArray
}
