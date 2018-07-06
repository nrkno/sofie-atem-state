import * as CK from '../chromaKeyer'
import { State as StateObject, Defaults } from '../../../'
import { Commands } from 'atem-connection'

const STATE1 = new StateObject()
STATE1.video.ME[0] = JSON.parse(JSON.stringify(Defaults.Video.MixEffect))
STATE1.video.ME[0].upstreamKeyers[0] = JSON.parse(JSON.stringify(Defaults.Video.UpstreamKeyer(0)))
const STATE2 = new StateObject()
STATE2.video.ME[0] = JSON.parse(JSON.stringify(Defaults.Video.MixEffect))
STATE2.video.ME[0].upstreamKeyers[0] = JSON.parse(JSON.stringify(Defaults.Video.UpstreamKeyer(0)))

test('Unit: upstream keyers: chroma keyer undefined gives no error', function () {
	// same state gives no commands:
	let ck = STATE2.video.ME[0].upstreamKeyers[0].chromaSettings
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings = undefined
	const commands = CK.resolveChromaKeyerState(STATE1, STATE2)
	expect(commands.length).toEqual(0)
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings = ck
})

test('Unit: upstream keyers: chroma keyer', function () {
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings.gain = 1
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings.hue = 2
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings.lift = 3
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings.narrow = true
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings.ySuppress = 4
	const commands = CK.resolveChromaKeyerState(STATE1 as StateObject, STATE2 as StateObject) as [Commands.MixEffectKeyChromaCommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyChromaCommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(5)
	expect(commands[0].properties).toMatchObject({
		gain: 1,
		hue: 2,
		lift: 3,
		narrow: true,
		ySuppress: 4
	})

	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings.gain = 0
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings.hue = 0
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings.lift = 0
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings.narrow = false
	STATE2.video.ME[0].upstreamKeyers[0].chromaSettings.ySuppress = 0
})
