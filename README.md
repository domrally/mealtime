# mealtime
[![](https://badgen.net/badge/license/MIT/blue)](#) [![types](https://badgen.net/npm/types/tslib?icon=typescript)](#) [![](https://badgen.net/github/tag/domrally/mealtime?icon=git&label)](#)

[![](https://badgen.net/codeclimate/loc/domrally/mealtime?icon=codeclimate&label=lines)](#) [![](https://badgen.net/packagephobia/install/mealtime?icon=packagephobia&label=size)](#) [![](https://badgen.net/npm/dw/mealtime?icon=npm&label)](#)

[![Node.js Package](https://github.com/domrally/mealtime/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/domrally/mealtime/actions/workflows/npm-publish.yml) [![](https://badgen.net/codeclimate/tech-debt/domrally/mealtime?icon=codeclimate)](#)  [![](https://badgen.net/codeclimate/maintainability/domrally/mealtime?icon=codeclimate)](#) [![](https://badgen.net/snyk/domrally/mealtime)](#) 

a (loose) simulation of a Mealy machine in typescript using async generators and proxies

## installation
```bash
> npm i mealtime
```
or 
```bash
> yarn add mealtime
```
or 
```html
<script type="module" src="unpkg.com/mealtime"></script>
```

## exports
```typescript
function createState<S, T extends symbol>(
    YourClass: new (...args: any[]): S & { 
        state: State<T>, 
        onEnter?(): void, 
        onExit?(): void 
    }
): new (...args: any[]) => S & AsyncIterable<T>
    
class State<S, T> {
    [Symbol.asyncIterator](): AsyncGenerator<[S, T], void, unknown>
    trigger(trigger: T):      void
}

function createProxy<S, T extends symbol>(
    initialState: S & AsyncIterable<T>, 
    transitions:  Record<T, [S & AsyncIterable<T>, S & AsyncIterable<T>][]>
): S & AsyncIterable<S>
```

## how to use

### importing
```typescript
import { createProxy, createState, createTriggers, State } from 'mealtime'
```
or
```html
<script type="module">
    import { createProxy, createState, createTriggers, State } from 'unpkg.com/mealtime'	
    // then use inline
</script>
```
or
```typescript
const path = 'https://unpkg.com/mealtime'
const { createProxy, composeState, createState, createTriggers, State } = await import(path)
```
### triggers
```typescript
const Hello = Symbol('Hello')
const World = Symbol('World')
const Triggers = Object.freeze({
    Hello,
    World
})
type Triggers = createTriggers<typeof Triggers>
```
### states
```typescript
// States
interface Example {
    name: string
    changeState(): void
}
const Start = createState<Example, Triggers>(
    class _ {
        constructor(public state: State<Triggers>) { }
        readonly name = 'Start'
        readonly changeState = () => this.state.trigger(Triggers.Hello)
    }
)
const End = createState<Example, Triggers>(
    class _ {
        constructor(public state: State<Triggers>) { }
        readonly name = 'End'
        readonly changeState = () => this.state.trigger(Triggers.World)
    }
)
```
### putting it all together
```typescript
// 
const state = new State<Triggers>(),
      start = new Start(state),
      end = new End(state)
// 
const currentState = createProxy<Example, Triggers>(start, {
    [Triggers.Hello]: [
        [start, end]
    ],
    [Triggers.World]: [
        [end, start]
    ]
})


// start the machine
const logLoop = async () => {
    console.log(currentState.name)
    for await (const t of currentState) {
        console.log(currentState.name)
    }
}
const eventLoop = async () => {
    while (true) {
        await new Promise<void>(resolve => setTimeout(() => {
            currentState.changeState()
            resolve()
        }, 1000))
    }
}
logLoop()
eventLoop()
```

## design

### abstract machines
The [state pattern](https://en.wikipedia.org/wiki/State_pattern) is a simulation of a [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine#Transducers). With the addition of the [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) on the current state it becomes a simulation of a more powerful form of state machine:

#### [Mealy machines](https://en.wikipedia.org/wiki/Mealy_machine)
> In the theory of computation, 
> a Mealy machine is a finite-state machine 
> whose output values are determined both by 
> its current state and the current inputs


### javascript & typescript
Javascript has built in support for the [proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern) through its [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) class. The addition of [typescript](https://www.typescriptlang.org/) allows us to implement a classic [state pattern](https://en.wikipedia.org/wiki/State_pattern) to hide behind the proxy


### patterns
The **state** and **proxy** patterns 
are three of twenty-three design patterns documented 
by the gang of four

#### [state pattern](https://en.wikipedia.org/wiki/State_pattern)
> allows an object to alter its behavior 
> when its internal state changes.
> This pattern is close to
> the concept of finite-state machines

#### [proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern)
> In short, a proxy is a wrapper or agent object 
> that is being called by the client 
> to access the real serving object behind the scenes.
> Use of the proxy can simply be forwarding to the real object
> or can provide additional logic
