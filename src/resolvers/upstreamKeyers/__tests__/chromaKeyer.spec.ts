import * as CK from '../chromaKeyer'
import { State as StateObject, Defaults } from '../../../'
import { Commands } from 'atem-connection'
import { jsonClone } from '../../../util'

const STATE1 = new StateObject()
const ME1 = STATE1.video.getMe(0)
const USK1 = ME1.getUpstreamKeyer(0)

const STATE2 = new StateObject()
const ME2 = STATE2.video.getMe(0)
const USK2 = ME2.getUpstreamKeyer(0)

test('Unit: upstream keyers: chroma keyer undefined gives no error', function () {
	USK1.chromaSettings = jsonClone(Defaults.Video.UpstreamKeyerChromaSettings)

	// same state gives no commands:
	let ck = USK2.chromaSettings
	delete USK2.chromaSettings
	const commands = CK.resolveChromaKeyerState(0, 0, USK1, USK2)
	expect(commands).toHaveLength(0)
	USK2.chromaSettings = ck
})

test('Unit: upstream keyers: chroma keyer', function () {
	USK2.chromaSettings = {
		gain: 1,
		hue: 2,
		lift: 3,
		narrow: true,
		ySuppress: 4
	}
	const commands = CK.resolveChromaKeyerState(0, 0, USK1, USK2) as Array<Commands.MixEffectKeyChromaCommand>

	expect(commands[0].constructor.name).toEqual('MixEffectKeyChromaCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		gain: 1,
		hue: 2,
		lift: 3,
		narrow: true,
		ySuppress: 4
	})

	USK2.chromaSettings = jsonClone(Defaults.Video.UpstreamKeyerChromaSettings)
})
