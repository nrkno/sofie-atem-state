export function compareProps<T> (oldProps: T, newProps: T, props: Array<keyof T>) {
	const changedProps: Partial<T> = {}

	for (let key of props) {
		if ((newProps)[key] !== (oldProps)[key]) {
			(changedProps)[key] = (newProps)[key]
		}
	}

	return changedProps
}
