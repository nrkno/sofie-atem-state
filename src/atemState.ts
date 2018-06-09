import { Commands } from 'atem-connection'
import { State as StateObject } from '.'
import * as Resolvers from './resolvers'

export class AtemState {
	private _state: StateObject

	setState (state: StateObject) {
		this._state = state
	}

	getState (): StateObject {
		return this._state
	}

	diffState (newState: StateObject): Array<Commands.AbstractCommand> {
		return this.diffStates(this._state, newState)
	}

	diffStates (oldState: StateObject, newState: StateObject): Array<Commands.AbstractCommand> {
		let commands: Array<Commands.AbstractCommand> = []

		commands = commands.concat(Resolvers.videoState(oldState, newState))

		return commands
	}
}
