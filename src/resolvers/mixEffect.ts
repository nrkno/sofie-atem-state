import {
	Commands as AtemCommands,
	Enums as ConnectionEnums,
	VideoState } from 'atem-connection'
import { Enums, State as StateObject } from '../'

import { resolveUpstreamKeyerState } from './upstreamKeyers'

export function resolveMixEffectsState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	let commands: Array<AtemCommands.AbstractCommand> = []

	commands = commands.concat(resolveTransitionPropertiesState(oldState, newState))
	commands = commands.concat(resolveTransitionSettingsState(oldState, newState))
	commands = commands.concat(resolveUpstreamKeyerState(oldState, newState))

	for (const mixEffectId in oldState.video.ME) {
		if (!oldState.video.ME[mixEffectId] || !newState.video.ME[mixEffectId]) {
			continue
		}
		const oldMixEffect = oldState.video.ME[mixEffectId]
		const newMixEffect = newState.video.ME[mixEffectId]
		if (!oldMixEffect || !newMixEffect) continue
		if (typeof newMixEffect.input !== 'undefined' && typeof newMixEffect.transition !== 'undefined') {
			if (typeof oldMixEffect.input === 'undefined') {
				oldMixEffect.input = oldMixEffect.programInput
			}
			if (newMixEffect.input !== oldMixEffect.input || newMixEffect.transition === Enums.TransitionStyle.DUMMY) {
				const command = new AtemCommands.PreviewInputCommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps({ source: newMixEffect.input })
				commands.push(command)

				if (newMixEffect.transition === Enums.TransitionStyle.CUT) {
					const command = new AtemCommands.CutCommand()
					command.mixEffect = Number(mixEffectId)
					commands.push(command)
				} else if (newMixEffect.transition !== Enums.TransitionStyle.DUMMY) {
					if (newMixEffect.transition !== (oldMixEffect.transition || oldMixEffect.transitionProperties.style)) { // set style before auto transition command
						const command = new AtemCommands.TransitionPropertiesCommand()
						command.mixEffect = Number(mixEffectId)
						command.updateProps({ style: newMixEffect.transition as ConnectionEnums.TransitionStyle })
						commands.push(command)
					}

					const resetCommand = new AtemCommands.TransitionPositionCommand()
					resetCommand.mixEffect = Number(mixEffectId)
					resetCommand.updateProps({ handlePosition: 0 })
					commands.push(resetCommand)

					const command = new AtemCommands.AutoTransitionCommand()
					command.mixEffect = Number(mixEffectId)
					commands.push(command)
				}
			}
		} else {
			if (oldMixEffect.previewInput !== newMixEffect.previewInput) {
				const command = new AtemCommands.PreviewInputCommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps({ source: newMixEffect.previewInput })
				commands.push(command)
			}
			if ((oldMixEffect.input || oldMixEffect.programInput) !== newMixEffect.programInput) {
				// @todo: check if we need to use the cut command?
				// use cut command if:
				//   DSK is tied
				//   Upstream Keyer is set for next transition
				const command = new AtemCommands.ProgramInputCommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps({ source: newMixEffect.programInput })
				commands.push(command)
			}
		}

		if (newMixEffect.inTransition && oldMixEffect.transitionPosition !== newMixEffect.transitionPosition) {
			const command = new AtemCommands.TransitionPositionCommand()
			command.mixEffect = Number(mixEffectId)
			command.updateProps({
				handlePosition: newMixEffect.transitionPosition
			})
			commands.push(command)
		}
		if (oldMixEffect.inTransition && !newMixEffect.inTransition) {
			const command = new AtemCommands.TransitionPositionCommand()
			command.mixEffect = Number(mixEffectId)
			command.updateProps({
				handlePosition: 10000 // finish transition
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

	return commands
}

export function resolveTransitionPropertiesState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const mixEffectId in oldState.video.ME) {
		if (!oldState.video.ME[mixEffectId] || !newState.video.ME[mixEffectId]) {
			continue
		}
		const oldTransitionProperties = oldState.video.ME[mixEffectId].transitionProperties
		const newTransitionProperties = newState.video.ME[mixEffectId].transitionProperties
		let props: Partial<{ selection: number, style: number }> = {}

		if (oldTransitionProperties.selection !== newTransitionProperties.selection) {
			props.selection = newTransitionProperties.selection
		}
		if (oldTransitionProperties.style !== newTransitionProperties.style) {
			props.style = newTransitionProperties.style
		}

		if (typeof props.selection !== 'undefined' || typeof props.style !== 'undefined') {
			const command = new AtemCommands.TransitionPropertiesCommand()
			command.mixEffect = Number(mixEffectId)
			command.updateProps(props)
			commands.push(command)
		}
	}

	return commands
}

export function resolveTransitionSettingsState (oldState: StateObject, newState: StateObject): Array<AtemCommands.AbstractCommand> {
	const commands: Array<AtemCommands.AbstractCommand> = []

	for (const mixEffectId in oldState.video.ME) {
		if (!oldState.video.ME[mixEffectId] || !newState.video.ME[mixEffectId]) {
			continue
		}
		const oldTransitionSettings = oldState.video.ME[mixEffectId].transitionSettings
		const newTransitionSettings = newState.video.ME[mixEffectId].transitionSettings

		if (newTransitionSettings.dip) {
			const dipProperties: Partial<VideoState.DipTransitionSettings> = {}
			for (let key in oldTransitionSettings.dip) {
				if (oldTransitionSettings.dip[key as keyof VideoState.DipTransitionSettings] !== newTransitionSettings.dip[key as keyof VideoState.DipTransitionSettings]) {
					dipProperties[key as keyof VideoState.DipTransitionSettings] = newTransitionSettings.dip[key as keyof VideoState.DipTransitionSettings]
				}
			}
			if (Object.keys(dipProperties).length > 0) {
				let command = new AtemCommands.TransitionDipCommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps(dipProperties)
				commands.push(command)
			}
		}

		if (newTransitionSettings.DVE) {
			const dveProperties: Partial<VideoState.DVETransitionSettings> = {}
			for (const key in oldTransitionSettings.DVE) {
				const typedKey = key as keyof VideoState.DVETransitionSettings
				if (oldTransitionSettings.DVE[typedKey] !== newTransitionSettings.DVE[typedKey]) {
					dveProperties[typedKey] = newTransitionSettings.DVE[typedKey] as any
				}
			}
			if (Object.keys(dveProperties).length > 0) {
				let command = new AtemCommands.TransitionDVECommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps(dveProperties)
				commands.push(command)
			}
		}

		if (newTransitionSettings.mix) {
			const mixProperties: Partial<VideoState.MixTransitionSettings> = {}
			for (const key in oldTransitionSettings.mix) {
				const typedKey = key as keyof VideoState.MixTransitionSettings
				if (oldTransitionSettings.mix[typedKey] !== newTransitionSettings.mix[typedKey]) {
					mixProperties[typedKey] = newTransitionSettings.mix[typedKey] as any
				}
			}
			if (Object.keys(mixProperties).length > 0) {
				let command = new AtemCommands.TransitionMixCommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps(mixProperties)
				commands.push(command)
			}
		}

		if (newTransitionSettings.stinger) {
			const stingerProperties: Partial<VideoState.StingerTransitionSettings> = {}
			for (let key in oldTransitionSettings.stinger) {
				const typedKey = key as keyof VideoState.StingerTransitionSettings
				if (oldTransitionSettings.stinger[typedKey] !== newTransitionSettings.stinger[typedKey]) {
					stingerProperties[typedKey] = newTransitionSettings.stinger[typedKey] as any
				}
			}
			if (Object.keys(stingerProperties).length > 0) {
				let command = new AtemCommands.TransitionStingerCommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps(stingerProperties)
				commands.push(command)
			}
		}

		if (newTransitionSettings.wipe) {
			const wipeProperties: Partial<VideoState.WipeTransitionSettings> = {}
			for (let key in oldTransitionSettings.wipe) {
				const typedKey = key as keyof VideoState.WipeTransitionSettings
				if (oldTransitionSettings.wipe[typedKey] !== newTransitionSettings.wipe[typedKey]) {
					wipeProperties[typedKey] = newTransitionSettings.wipe[typedKey] as any
				}
			}
			if (Object.keys(wipeProperties).length > 0) {
				let command = new AtemCommands.TransitionWipeCommand()
				command.mixEffect = Number(mixEffectId)
				command.updateProps(wipeProperties)
				commands.push(command)
			}
		}

	}

	return commands
}
