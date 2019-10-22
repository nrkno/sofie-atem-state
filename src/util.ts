export function diffObject<T> (oldObj: T, newObj: T, ...ignoreKeys: Array<keyof T>): Partial<T> | undefined {
	const diff: Partial<T> = {}
	let hasData = false
	for (let key in newObj) {
		if (ignoreKeys && ignoreKeys.indexOf(key) !== -1) continue

		const typedKey = key as keyof T
		if (newObj[typedKey] !== oldObj[typedKey]) {
			diff[typedKey] = newObj[typedKey]
			hasData = true
		}
	}

	return hasData ? diff : undefined
}

function keyIsValid (key: string, oldObj: any, newObj: any) {
	const oldVal = oldObj[key]
	const newVal = newObj[key]
	return (oldVal !== undefined && oldVal !== null) || (newVal !== undefined && newVal !== null)
}

export function getAllKeysString<V> (oldObj: { [key: string]: V }, newObj: { [key: string]: V }): string[] {
	const rawKeys = Object.keys(oldObj).concat(Object.keys(newObj))
	return rawKeys.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i)
}
export function getAllKeysNumber<V> (oldObj: { [key: number]: V } | Array<V>, newObj: { [key: number]: V } | Array<V>): number[] {
	const rawKeys = Object.keys(oldObj).concat(Object.keys(newObj))
	return rawKeys.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i).map(v => parseInt(v, 10))
}

export function jsonClone<T> (src: T): T {
	return JSON.parse(JSON.stringify(src))
}
