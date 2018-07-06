import * as DVE from '../dveKeyer'
import { State as StateObject, Defaults } from '../../../'
import { Commands, Enums } from 'atem-connection'

const STATE1 = new StateObject()
STATE1.video.ME[0] = JSON.parse(JSON.stringify(Defaults.Video.MixEffect))
STATE1.video.ME[0].upstreamKeyers[0] = JSON.parse(JSON.stringify(Defaults.Video.UpstreamKeyer(0)))
const STATE2 = new StateObject()
STATE2.video.ME[0] = JSON.parse(JSON.stringify(Defaults.Video.MixEffect))
STATE2.video.ME[0].upstreamKeyers[0] = JSON.parse(JSON.stringify(Defaults.Video.UpstreamKeyer(0)))

test('Unit: upstream keyers: chroma keyer undefined gives no error', function () {
	// same state gives no commands:
	let dveKeyer = STATE2.video.ME[0].upstreamKeyers[0].dveSettings
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings = undefined
	const commands = DVE.resolveDVEKeyerState(STATE1, STATE2)
	expect(commands.length).toEqual(0)
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings = dveKeyer
})

test('Unit: upstream keyers: dve keyer: general props', function () {
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings = {
		...STATE2.video.ME[0].upstreamKeyers[0].dveSettings,
		rate: 2,
		sizeX: 3,
		sizeY: 4,
		positionX: 5,
		positionY: 6,
		rotation: 7,
		lightSourceDirection: 8,
		lightSourceAltitude: 9
	}
	const commands = DVE.resolveDVEKeyerState(STATE1 as StateObject, STATE2 as StateObject) as [Commands.MixEffectKeyDVECommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyDVECommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(8)
	expect(commands[0].properties).toMatchObject({
		rate: 2,
		sizeX: 3,
		sizeY: 4,
		positionX: 5,
		positionY: 6,
		rotation: 7,
		lightSourceDirection: 8,
		lightSourceAltitude: 9
	})

	STATE2.video.ME[0].upstreamKeyers[0].dveSettings = JSON.parse(JSON.stringify(Defaults.Video.UpstreamKeyer(0))).dveSettings
})

test('Unit: upstream keyers: dve keyer: border', function () {
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderEnabled = true
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderBevel = Enums.BorderBevel.InOut
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderOuterWidth = 1
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderInnerWidth = 2
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderOuterSoftness = 3
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderInnerSoftness = 4
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderBevelSoftness = 5
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderBevelPosition = 6
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderOpacity = 7
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderHue = 8
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderSaturation = 9
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings.borderLuma = 10
	const commands = DVE.resolveDVEKeyerState(STATE1 as StateObject, STATE2 as StateObject) as [Commands.MixEffectKeyDVECommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyDVECommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(12)
	expect(commands[0].properties).toMatchObject({
		borderEnabled: true,
		borderBevel: Enums.BorderBevel.InOut,
		borderOuterWidth: 1,
		borderInnerWidth: 2,
		borderOuterSoftness: 3,
		borderInnerSoftness: 4,
		borderBevelSoftness: 5,
		borderBevelPosition: 6,
		borderOpacity: 7,
		borderHue: 8,
		borderSaturation: 9,
		borderLuma: 10
	})

	STATE2.video.ME[0].upstreamKeyers[0].dveSettings = JSON.parse(JSON.stringify(Defaults.Video.UpstreamKeyer(0))).dveSettings
})

test('Unit: upstream keyers: dve keyer: general props', function () {
	STATE2.video.ME[0].upstreamKeyers[0].dveSettings = {
		...STATE2.video.ME[0].upstreamKeyers[0].dveSettings,

		maskEnabled: true,
		maskTop: 1,
		maskBottom: 2,
		maskLeft: 3,
		maskRight: 4
	}
	const commands = DVE.resolveDVEKeyerState(STATE1 as StateObject, STATE2 as StateObject) as [Commands.MixEffectKeyDVECommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyDVECommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(5)
	expect(commands[0].properties).toMatchObject({
		maskEnabled: true,
		maskTop: 1,
		maskBottom: 2,
		maskLeft: 3,
		maskRight: 4
	})

	STATE2.video.ME[0].upstreamKeyers[0].dveSettings = JSON.parse(JSON.stringify(Defaults.Video.UpstreamKeyer(0))).dveSettings
})
