export function isDefined<T>(value: T | undefined | null): value is T {
  return <T>value !== undefined && <T>value !== null
}

export function typeOf<T>(value: unknown, type: string): value is T {
  return isDefined(value) && typeof value === type
}

export function isArray<T>(value: unknown): value is Array<T> {
  return Array.isArray(value)
}

export function isBool<T>(value: unknown): value is boolean {
  return typeOf(value, 'boolean')
}

export function isBoolean<T>(value: unknown): value is boolean {
  return typeOf(value, 'boolean')
}

export function isFunction<T>(value: unknown): value is Function {
  return typeOf(value, 'function')
}

export function isNumber<T>(value: unknown): value is number {
  return typeOf(value, 'number')
}

export function isString<T>(value: unknown): value is string {
  return typeOf(value, 'string')
}

export function isObject<T>(value: unknown): value is any {
  return typeOf(value, 'object') && !isFunction(value) && !isArray(value)
}

export function isPlainObject<T>(value: unknown): value is any {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export const isHTMLCollection = (obj: unknown): boolean =>
  obj instanceof HTMLCollection

export const isNodeList = (obj: unknown): boolean => obj instanceof NodeList

export const isNode = (obj: unknown): boolean => obj instanceof Node

export const isElement = (obj: unknown): boolean => {
  return obj instanceof Element || obj instanceof HTMLDocument
}

export const isNodeCollection = (obj: unknown): boolean =>
  isHTMLCollection(obj) || isNodeList(obj)
