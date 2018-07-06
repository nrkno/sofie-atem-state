import * as USK from '../index'
import { State as StateObject, Defaults } from '../../../'
import { Commands, Enums } from 'atem-connection'

const STATE1 = new StateObject()
STATE1.video.ME[0] = JSON.parse(JSON.stringify(Defaults.Video.MixEffect))
STATE1.video.ME[0].upstreamKeyers[0] = JSON.parse(JSON.stringify(Defaults.Video.UpstreamKeyer(0)))
const STATE2 = new StateObject()
STATE2.video.ME[0] = JSON.parse(JSON.stringify(Defaults.Video.MixEffect))
STATE2.video.ME[0].upstreamKeyers[0] = JSON.parse(JSON.stringify(Defaults.Video.UpstreamKeyer(0)))

test('Unit: upstream keyers: same state gives no commands', function () {
	// same state gives no commands:
	const commands = USK.resolveUpstreamKeyerState(STATE1, STATE2)
	expect(commands.length).toEqual(0)
})

test('Unit: upstream keyers: undefined gives no error', function () {
	// same state gives no commands:
	let usk = STATE2.video.ME[0].upstreamKeyers[0]
	STATE2.video.ME[0].upstreamKeyers[0] = undefined
	const commands = USK.resolveUpstreamKeyerState(STATE1, STATE2)
	expect(commands.length).toEqual(0)
	STATE2.video.ME[0].upstreamKeyers[0] = usk
})

test('Unit: upstream keyers: sources', function () {
	STATE2.video.ME[0].upstreamKeyers[0].cutSource = 1
	STATE2.video.ME[0].upstreamKeyers[0].fillSource = 2
	const commands = USK.resolveUpstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject) as [ Commands.MixEffectKeyFillSourceSetCommand, Commands.DownstreamKeyCutSourceCommand ]

	expect(commands[0].rawName).toEqual('CKeF')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		fillSource: 2
	})

	expect(commands[1].rawName).toEqual('CKeC')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(1)
	expect(commands[1].properties).toMatchObject({
		cutSource: 1
	})

	STATE2.video.ME[0].upstreamKeyers[0].cutSource = Defaults.Video.defaultInput
	STATE2.video.ME[0].upstreamKeyers[0].fillSource = Defaults.Video.defaultInput
})

test('Unit: upstream keyers: key type', function () {
	STATE2.video.ME[0].upstreamKeyers[0].mixEffectKeyType = Enums.MixEffectKeyType.Pattern
	const commands = USK.resolveUpstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject) as [Commands.MixEffectKeyTypeSetCommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyTypeSetCommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(1)
	expect(commands[0].properties).toMatchObject({
		keyType: 2
	})

	STATE2.video.ME[0].upstreamKeyers[0].mixEffectKeyType = Defaults.Video.UpstreamKeyer(0).mixEffectKeyType
})

test('Unit: upstream keyers: flyKey enabled', function () {
	STATE2.video.ME[0].upstreamKeyers[0].flyEnabled = !Defaults.Video.UpstreamKeyer(0).flyEnabled
	const commands = USK.resolveUpstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject) as [Commands.MixEffectKeyTypeSetCommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyTypeSetCommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(1)
	expect(commands[0].properties).toMatchObject({
		flyEnabled: !Defaults.Video.UpstreamKeyer(0).flyEnabled
	})

	STATE2.video.ME[0].upstreamKeyers[0].flyEnabled = Defaults.Video.UpstreamKeyer(0).flyEnabled
})

test('Unit: upstream keyers: keyer on air', function () {
	STATE2.video.ME[0].upstreamKeyers[0].onAir = !Defaults.Video.UpstreamKeyer(0).onAir
	const commands = USK.resolveUpstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject) as [Commands.MixEffectKeyOnAirCommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyOnAirCommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(1)
	expect(commands[0].properties).toMatchObject({
		onAir: !Defaults.Video.UpstreamKeyer(0).onAir
	})

	STATE2.video.ME[0].upstreamKeyers[0].onAir = Defaults.Video.UpstreamKeyer(0).onAir
})

test('Unit: upstream keyer: mask', function () {
	STATE2.video.ME[0].upstreamKeyers[0].maskEnabled = true
	const commands = USK.resolveUpstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject) as [Commands.MixEffectKeyMaskSetCommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyMaskSetCommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(1)
	expect(commands[0].properties).toMatchObject({
		maskEnabled: true
	})

	STATE2.video.ME[0].upstreamKeyers[0].maskEnabled = false
})

test('Unit: upstream keyer: mask position', function () {
	STATE2.video.ME[0].upstreamKeyers[0].maskBottom = 1
	STATE2.video.ME[0].upstreamKeyers[0].maskTop = 2
	STATE2.video.ME[0].upstreamKeyers[0].maskLeft = 3
	STATE2.video.ME[0].upstreamKeyers[0].maskRight = 4
	const commands = USK.resolveUpstreamKeyerState(STATE1 as StateObject, STATE2 as StateObject) as [Commands.MixEffectKeyMaskSetCommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyMaskSetCommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(4)
	expect(commands[0].properties).toMatchObject({
		maskBottom: 1,
	  	maskTop: 2,
		maskLeft: 3,
		maskRight: 4
	})

	STATE2.video.ME[0].upstreamKeyers[0].maskBottom = 0
	STATE2.video.ME[0].upstreamKeyers[0].maskTop = 0
	STATE2.video.ME[0].upstreamKeyers[0].maskLeft = 0
	STATE2.video.ME[0].upstreamKeyers[0].maskRight = 0
})
