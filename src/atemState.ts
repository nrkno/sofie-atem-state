import { Commands, Enums } from 'atem-connection'
import { State as StateObject } from '.'
import * as Resolvers from './resolvers'

export class AtemState {
	version: Enums.ProtocolVersion = Enums.ProtocolVersion.V7_2

	private _state: StateObject

	public constructor () {
		this._state = new StateObject()
	}

	setState (state: StateObject) {
		this._state = state
	}

	getState (): StateObject {
		return this._state
	}

	diffState (newState: StateObject): Array<Commands.ISerializableCommand> {
		return this.diffStates(this._state, newState)
	}

	diffStates (oldState: StateObject, newState: StateObject): Array<Commands.ISerializableCommand> {
		let commands: Array<Commands.ISerializableCommand> = []

		commands.push(...Resolvers.videoState(oldState, newState, this.version))

		return commands
	}
}
