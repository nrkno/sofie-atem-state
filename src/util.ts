export function compareProps<T> (oldProps: T, newProps: T, props: Array<keyof T>) {
	const changedProps: Partial<T> = {}

	for (let key of props) {
		if ((newProps)[key] !== (oldProps)[key]) {
			(changedProps)[key] = (newProps)[key]
		}
	}

	return changedProps
}

export function diffObject<T> (oldObj: T, newObj: T): Partial<T> | undefined {
	const diff: Partial<T> = {}
	let hasData = false
	for (let key in newObj) {
		const typedKey = key as keyof T
		if (newObj[typedKey] !== oldObj[typedKey]) {
			diff[typedKey] = newObj[typedKey]
			hasData = true
		}
	}

	return hasData ? diff : undefined
}
