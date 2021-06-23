import { Mealy } from '../../src/mealy.js'
import { State } from '../../src/state.js'

abstract class Chronograph extends State<Chronograph> {
	// 
	abstract top(): void
	abstract split(): void
	// 
	time: number = 0
	lap: number = 0
}
// 
class Restarted extends Chronograph {
	readonly top = () => {
		watching.time = 0
		watching.watch()
		this.setState(watching)
	}
	readonly split = () => { }
}
// 
class Lapped extends Chronograph {
	readonly top = () => this.setState(stopped)
	readonly split = () => this.setState(watching)
}
// 
class Stopped extends Chronograph {
	readonly top = () => {
		watching.watch()
		this.setState(watching)
	}
	readonly split = () => this.setState(restarted)
}
// 
class Watching extends Chronograph {
	private updating: Promise<void> = Promise.resolve()
	update = async () => {
		const u = this.updating
		let time = Date.now()
		while (u === this.updating) {
			time = await this.loop(time)
		}
	}
	watch = () => {
		this.updating = this.update()
	}
	private loop = async (time: number) => {
		this.time += Date.now() - time
		this.setState(this)
		const getRequest = (r: any) => window.requestAnimationFrame(() => r())
		await new Promise(resolve => getRequest(resolve))
		return Date.now()
	}
	readonly top = () => {
		this.updating = Promise.resolve()
		this.setState(stopped)
	}
	readonly split = () => {
		lapped.time = this.time
		lapped.lap = 0
		return this.setState(lapped)
	}
}
// 
const restarted = new Restarted()
const watching = new Watching()
const stopped = new Stopped()
const lapped = new Lapped()
// 
const { target, handler } = new Mealy<Chronograph>(restarted)
export const stopwatch = new Proxy(target, handler)
const toString = (ms: number) => {
	let ss = ms / 1000
	let mn = ss / 60

	mn = Math.floor(mn)
	ss -= Math.floor(mn * 60)
	ms -= mn * 60 * 1000
	ms -= ss * 1000

	return `${mn}:${ss}:${ms}`
}
export async function* time() {
	for await (const update of stopwatch) {
		yield toString(update.time)
	}
}
export async function* lap() {
	for await (const update of stopwatch) {
		yield toString(update.lap)
	}
}
