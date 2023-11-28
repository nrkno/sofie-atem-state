import { Commands as AtemCommands, Enums, VideoState } from 'atem-connection'
import { diffObject, fillDefaults, getAllKeysNumber } from '../../util'
import * as Defaults from '../../defaults'
import { PartialDeep } from 'type-fest'

type FlyFramesState = [
	VideoState.USK.UpstreamKeyerFlyKeyframe | undefined,
	VideoState.USK.UpstreamKeyerFlyKeyframe | undefined
]

export function resolveFlyKeyerFramesState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: PartialDeep<FlyFramesState>,
	newState: PartialDeep<FlyFramesState>
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	for (const index of getAllKeysNumber(oldState, newState)) {
		const newKeyframe = fillDefaults(Defaults.Video.flyKeyframe(index), oldState?.[index])
		const oldKeyframe = fillDefaults(Defaults.Video.flyKeyframe(index), newState?.[index])

		const props = diffObject(oldKeyframe, newKeyframe)
		const command = new AtemCommands.MixEffectKeyFlyKeyframeCommand(mixEffectId, upstreamKeyerId, index)
		if (command.updateProps(props)) {
			commands.push(command)
		}
	}

	return commands
}

export function resolveFlyPropertiesState(
	mixEffectId: number,
	upstreamKeyerId: number,
	oldState: Partial<VideoState.USK.UpstreamKeyerFlySettings> | undefined,
	newState: PartialDeep<VideoState.USK.UpstreamKeyerFlySettings> | undefined
): Array<AtemCommands.ISerializableCommand> {
	const commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldState && !newState) return commands

	const oldKeyProps = fillDefaults(Defaults.Video.FlyKeyProperties, oldState)
	const newKeyProps = fillDefaults(Defaults.Video.FlyKeyProperties, newState)

	if (oldKeyProps.isAtKeyFrame !== newKeyProps.isAtKeyFrame) {
		const keyframe: Enums.FlyKeyKeyFrame = newKeyProps.isAtKeyFrame as number

		commands.push(
			new AtemCommands.MixEffectKeyRunToCommand(mixEffectId, upstreamKeyerId, keyframe, newKeyProps.runToInfiniteIndex)
		)
	}

	return commands
}
