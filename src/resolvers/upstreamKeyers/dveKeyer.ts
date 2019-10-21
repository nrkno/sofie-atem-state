import { Commands as AtemCommands, Enums } from 'atem-connection'
import { UpstreamKeyerDVESettings, UpstreamKeyer } from 'atem-connection/dist/state/video/upstreamKeyers'
import { diffObject } from '../../util'

export function resolveDVEKeyerState (mixEffectId: number, upstreamKeyerId: number, oldKeyer: UpstreamKeyer, newKeyer: UpstreamKeyer): Array<AtemCommands.ISerializableCommand> {
	let commands: Array<AtemCommands.ISerializableCommand> = []

	if (!oldKeyer.dveSettings && !newKeyer.dveSettings) return commands

	function defaultDVESettings (): UpstreamKeyerDVESettings {
		return {
			maskEnabled: false,
			maskTop: 0,
			maskBottom: 0,
			maskLeft: 0,
			maskRight: 0,
			sizeX: 0,
			sizeY: 0,
			positionX: 0,
			positionY: 0,
			rotation: 0,
			borderOuterWidth: 0,
			borderInnerWidth: 0,
			borderOuterSoftness: 0,
			borderInnerSoftness: 0,
			borderBevelSoftness: 0,
			borderBevelPosition: 0,
			borderOpacity: 0,
			borderHue: 0,
			borderSaturation: 0,
			borderLuma: 0,
			lightSourceDirection: 0,
			lightSourceAltitude: 0,
			borderEnabled: false,
			shadowEnabled: false,
			borderBevel: Enums.BorderBevel.None,
			rate: 0
		}
	}

	const oldDVEKeyer = oldKeyer.dveSettings || defaultDVESettings()
	const newDVEKeyer = newKeyer.dveSettings || defaultDVESettings()

	const props = diffObject(oldDVEKeyer, newDVEKeyer)
	if (props) {
		const command = new AtemCommands.MixEffectKeyDVECommand(mixEffectId, upstreamKeyerId)
		command.updateProps(props)
		commands.push(command)
	}

	return commands
}
