import { Commands, Enums, AtemStateUtil } from 'atem-connection'
import { State as StateObject } from './state'
import * as Resolvers from './resolvers'

export class AtemState {
	version: Enums.ProtocolVersion = Enums.ProtocolVersion.V7_2

	private _state: StateObject

	public constructor() {
		this._state = AtemStateUtil.Create()
	}

	setState(state: StateObject): void {
		this._state = state
	}

	getState(): StateObject {
		return this._state
	}

	diffState(newState: StateObject): Array<Commands.ISerializableCommand> {
		return AtemState.diffStates(this.version, this._state, newState)
	}

	/** Deprecated */
	diffStates(oldState: StateObject, newState: StateObject): Array<Commands.ISerializableCommand> {
		return AtemState.diffStates(this.version, oldState, newState)
	}

	static diffStates(
		version: Enums.ProtocolVersion,
		oldState: StateObject,
		newState: StateObject
	): Array<Commands.ISerializableCommand> {
		const commands: Array<Commands.ISerializableCommand> = []

		commands.push(...Resolvers.videoState(oldState, newState, version))

		return commands
	}
}
