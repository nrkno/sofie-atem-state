import * as LK from '../lumaKeyer'
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
	let lk = STATE2.video.ME[0].upstreamKeyers[0].lumaSettings
	delete STATE2.video.ME[0].upstreamKeyers[0].lumaSettings
	const commands = LK.resolveLumaKeyerState(STATE1, STATE2)
	expect(commands.length).toEqual(0)
	STATE2.video.ME[0].upstreamKeyers[0].lumaSettings = lk
})

test('Unit: upstream keyers: luma keyer', function () {
	STATE2.video.ME[0].upstreamKeyers[0].lumaSettings = {
		preMultiplied: true,
		clip: 1,
		gain: 2,
		invert: true
	}
	const commands = LK.resolveLumaKeyerState(STATE1, STATE2) as [Commands.MixEffectKeyLumaCommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyLumaCommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(4)
	expect(commands[0].properties).toMatchObject({
		preMultiplied: true,
		clip: 1,
		gain: 2,
		invert: true
	})

	STATE2.video.ME[0].upstreamKeyers[0].lumaSettings = JSON.parse(JSON.stringify(STATE1.video.ME[0].upstreamKeyers[0].lumaSettings))
})
