import { PartialDeep } from 'type-fest'
import * as deepMerge from 'deepmerge'
import { PartialObjectDeep } from 'type-fest/source/partial-deep'

export function diffObject<T>(oldObj: Partial<T>, newObj: Partial<T>): Partial<T> {
	const diff: Partial<T> = {}
	for (const key in newObj) {
		const typedKey = key as keyof T
		if (newObj[typedKey] !== oldObj[typedKey]) {
			diff[typedKey] = newObj[typedKey]
		}
	}

	return diff
}

function keyIsValid(key: string, oldObj: any, newObj: any) {
	const oldVal = oldObj[key]
	const newVal = newObj[key]
	return (oldVal !== undefined && oldVal !== null) || (newVal !== undefined && newVal !== null)
}

export function getAllKeysString<V>(oldObj: { [key: string]: V }, newObj: { [key: string]: V }): string[] {
	const rawKeys = Object.keys(oldObj).concat(Object.keys(newObj))
	return rawKeys.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i)
}
export function getAllKeysNumber<V>(
	oldObj: { [key: number]: V } | Array<V> | undefined,
	newObj: { [key: number]: V } | Array<V> | undefined
): number[] {
	const rawKeys = Object.keys(oldObj ?? []).concat(Object.keys(newObj ?? []))
	return rawKeys.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i).map((v) => parseInt(v, 10))
}

export function jsonClone<T>(src: T): T {
	return JSON.parse(JSON.stringify(src))
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function fillDefaults<T extends object>(defaults: T, val: PartialDeep<T> | PartialObjectDeep<T> | undefined): T {
	return deepMerge(defaults, (val ?? {}) as Partial<T>)
}
