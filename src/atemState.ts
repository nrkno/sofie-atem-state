import { AtemState as StateObject, Enums as AtemEnum, Commands as AtemCommands, StateObjects } from 'atem-connection'
import AbstractCommand from 'atem-connection/dist/commands/AbstractCommand' // @todo: should come from main exports

export interface ChangeRecord {
	kind: String,
	path: Array<String | Number>,
	lhs?: string | number | boolean | Object,
	rhs?: string | number | boolean | Object,
	index?: number,
	item?: Object
}

export class AtemState {
	private _state: StateObject

	setState (state: StateObject) {
		this._state = state
	}

	getState (): StateObject {
		return this._state
	}

	diffState (newState: StateObject): Array<AbstractCommand> {
		return this.diffStates(this._state, newState)
	}

	diffStates (oldState: StateObject, newState: StateObject): Array<AbstractCommand> {
		const commands: Array<AbstractCommand> = []

		commands.concat(this.resolveVideoState(oldState, newState))

		return commands
	}

	applyCommands (commands: Array<AbstractCommand>) {
		for (let command of commands) {
			command.applyToState(this._state) // do we care about the read only parameters?
		}
	}

	private resolveVideoState (oldState: StateObject, newState: StateObject): Array<AbstractCommand> {
		const commands: Array<AbstractCommand> = []

		commands.concat(this.resolveMixEffectsState(oldState, newState))

		return commands
	}

	private resolveMixEffectsState (oldState: StateObject, newState: StateObject): Array<AbstractCommand> {
		const commands: Array<AbstractCommand> = []

		for (const mixEffectId in oldState.video.ME) {
			const oldMixEffect = oldState.video.ME[mixEffectId]
			const newMixEffect = oldState.video.ME[mixEffectId]

			if (oldMixEffect.previewInput !== newMixEffect.previewInput) {
				const command = new AtemCommands.PreviewInputCommand()
				command.mixEffect = Number(mixEffectId)
				command.properties.source = newMixEffect.previewInput
				commands.push(command)
			}

			if (oldMixEffect.programInput !== newMixEffect.programInput) {
				// @todo: check if we need to use the cut command?
				// use cut command if:
				//   DSK is tied
				//   Upstream Keyer is set for next transition
				const command = new AtemCommands.ProgramInputCommand()
				command.mixEffect = Number(mixEffectId)
				command.properties.source = newMixEffect.previewInput
				commands.push(command)
			}

			if (!oldMixEffect.inTransition && newMixEffect.inTransition) {
				const command = new AtemCommands.AutoTransitionCommand()
				command.mixEffect = Number(mixEffectId)
				commands.push(command)
			} else if (!oldMixEffect.inTransition && oldMixEffect.transitionPosition !== newMixEffect.transitionPosition) {
				const command = new AtemCommands.TransitionPositionCommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps({
					handlePosition: newMixEffect.transitionPosition
				})
				commands.push(command)
			}

			if (oldMixEffect.transitionPreview !== newMixEffect.transitionPreview) {
				const command = new AtemCommands.PreviewTransitionCommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps({
					preview: newMixEffect.transitionPreview
				})
				commands.push(command)
			}

			// @todo: fadeToBlack
		}

		commands.concat(this.resolveTransitionPropertiesState(oldState, newState))
		commands.concat(this.resolveTransitionSettingsState(oldState, newState))

		return commands
	}

	private resolveTransitionPropertiesState (oldState: StateObject, newState: StateObject): Array<AbstractCommand> {
		const commands: Array<AbstractCommand> = []

		for (const mixEffectId in oldState.video.ME) {
			const oldTransitionProperties = oldState.video.ME[mixEffectId].transitionProperties
			const newTransitionProperties = oldState.video.ME[mixEffectId].transitionProperties
			let props: Partial<{ selection: number, style: number }> = {}

			if (oldTransitionProperties.selection !== newTransitionProperties.selection) {
				props.selection = newTransitionProperties.selection
			}
			if (oldTransitionProperties.style !== newTransitionProperties.style) {
				props.style = newTransitionProperties.style
			}

			if (props.selection || props.style) {
				const command = new AtemCommands.TransitionPropertiesCommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps(props)
				commands.push(command)
			}
		}

		return commands
	}

	private resolveTransitionSettingsState (oldState: StateObject, newState: StateObject): Array<AbstractCommand> {
		const commands: Array<AbstractCommand> = []

		return commands
	}
}
