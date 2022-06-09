export interface Delegate<params extends any[]> extends WeakSet<Action>,
	PromiseLike<params>,
	AsyncIterable<params> {
	(...args: params): void
}

/**
 * function that sends a message to all listeners
 * @param args tuple of data that is passed to the listeners
 */
export class Delegate<params extends any[]> {
	/**
	 * @param initial state of the returned object
	 * @param states array of states that can be activated
	 * @returns an event that can be called and listened to
	 */
	constructor(
		initial?: params
	) {
		const set = new Set<Action>(),
			event: Partial<Delegate<params>> = (...args: params) => {
				const copy = new Set(set)

				copy.forEach(resolve => resolve?.(...args))
			}
		/**
		 * Creates and manages a state pattern based on an initial set of possible states
		 * @param initial state of the returned object
		 * @param states array of states that can be activated
		 * @returns a state without the extended event interface
		 */
		event.has = (a: Action) => set.has(a)
		/**
		 * Creates and manages a state pattern based on an initial set of possible states
		 * @param initial state of the returned object
		 * @param states array of states that can be activated
		 * @returns a state without the extended event interface
		 */
		event.delete = (a: Action) => set.delete(a)
		/**
		 * Creates and manages a state pattern based on an initial set of possible states
		 * @param initial state of the returned object
		 * @param states array of states that can be activated
		 * @returns a state without the extended event interface
		 */
		event.add = (a: Action) => {
			if (initial) a(...initial)

			return set.add(a) as unknown as Delegate<params>
		}
		/**
		 * Creates and manages a state pattern based on an initial set of possible states
		 * @param initial state of the returned object
		 * @param states array of states that can be activated
		 * @returns a state without the extended event interface
		 */
		event.then = async <U = params, V = never>(
			onfulfilled: (args: params) => PromiseLike<U>,
			onrejected: (reason: any) => PromiseLike<V>
		) => {
			try {
				const thing = (await event[Symbol.asyncIterator]!().next())
					.value as params

				return onfulfilled?.(thing)
			} catch (error) {
				return onrejected?.(error)
			}
		}
		/**
		 * Creates and manages a state pattern based on an initial set of possible states
		 * @param initial state of the returned object
		 * @param states array of states that can be activated
		 * @returns a state without the extended event interface
		 */
		event[Symbol.asyncIterator] = async function* () {
			while (true) {
				yield new Promise<params>(resolve => {
					const resolution = ((...args: params) => resolve(args)) as Action

					set.add(resolution)
				})
			}
		}

		return event as unknown as Delegate<params>
	}
}

type Action = (...args: any[]) => void
