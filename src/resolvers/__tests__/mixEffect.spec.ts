import * as ME from '../mixEffect'
import { State as StateObject, MixEffect, Enums, Defaults } from '../../'
import { Commands, Enums as AtemEnums } from 'atem-connection'

// const STATE1 = {
// 	video: {
// 		ME: [
// 			JSON.parse(JSON.stringify(Defaults.Video.MixEffect)) as MixEffect
// 		]
// 	}
// }
const STATE1 = new StateObject()
STATE1.video.ME[0] = JSON.parse(JSON.stringify(Defaults.Video.MixEffect)) as MixEffect
const STATE2 = new StateObject()
STATE2.video.ME[0] = JSON.parse(JSON.stringify(Defaults.Video.MixEffect)) as MixEffect

test('Unit: mix effect: same state gives no commands', function () {
	// same state gives no commands:
	const commands = ME.resolveMixEffectsState(STATE1, STATE1)
	expect(commands.length).toEqual(0)
})

test('Unit: mix effect: same input gives no commands', function () {
	STATE1.video.ME[0].input = 1
	STATE1.video.ME[0].transition = Enums.TransitionStyle.CUT

	STATE2.video.ME[0].input = 1
	STATE2.video.ME[0].transition = Enums.TransitionStyle.CUT

	const commands = ME.resolveMixEffectsState(STATE1, STATE1)
	expect(commands.length).toEqual(0)

	delete STATE1.video.ME[0].input
	delete STATE1.video.ME[0].transition
	delete STATE2.video.ME[0].input
	delete STATE2.video.ME[0].transition
})

test('Unit: mix effect: program input', function () {
	STATE2.video.ME[0].programInput = 1
	const commands = ME.resolveMixEffectsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual('CPgI')
	expect((commands[0] as Commands.ProgramInputCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		source: 1
	})

	STATE2.video.ME[0].programInput = 0
})

test('Unit: mix effect: preview input', function () {
	STATE2.video.ME[0].previewInput = 1
	const commands = ME.resolveMixEffectsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual('CPvI')
	expect((commands[0] as Commands.PreviewInputCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		source: 1
	})

	STATE2.video.ME[0].previewInput = 0
})

test('Unit: mix effect: cut command', function () {
	STATE2.video.ME[0].input = 1
	STATE2.video.ME[0].transition = Enums.TransitionStyle.CUT
	const commands = ME.resolveMixEffectsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual('CPvI')
	expect((commands[0] as Commands.PreviewInputCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		source: 1
	})

	expect(commands[1].rawName).toEqual('DCut')
	expect((commands[1] as Commands.CutCommand).mixEffect).toEqual(0)

	delete STATE2.video.ME[0].input
	delete STATE2.video.ME[0].transition
})

test('Unit: mix effect: auto command', function () {
	STATE2.video.ME[0].input = 1
	STATE2.video.ME[0].transition = Enums.TransitionStyle.MIX
	const commands = ME.resolveMixEffectsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual('CPvI')
	expect((commands[0] as Commands.PreviewInputCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		source: 1
	})

	expect(commands[1].rawName).toEqual('CTPs')
	expect((commands[1] as Commands.TransitionPositionCommand).mixEffect).toEqual(0)
	expect((commands[1] as Commands.TransitionPositionCommand).properties.handlePosition).toEqual(0)

	expect(commands[2].rawName).toEqual('DAut')
	expect((commands[2] as Commands.AutoTransitionCommand).mixEffect).toEqual(0)

	STATE2.video.ME[0].input = 0
})

test('Unit: mix effect: auto command, new transition', function () {
	STATE2.video.ME[0].input = 1
	STATE2.video.ME[0].transition = Enums.TransitionStyle.WIPE
	const commands = ME.resolveMixEffectsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual(new Commands.PreviewInputCommand().rawName)
	expect((commands[0] as Commands.PreviewInputCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		source: 1
	})

	expect(commands[1].rawName).toEqual(new Commands.TransitionPropertiesCommand().rawName)
	expect((commands[1] as Commands.TransitionPropertiesCommand).mixEffect).toEqual(0)
	expect(commands[1].properties).toMatchObject({
		style: Enums.TransitionStyle.WIPE
	})

	expect(commands[2].rawName).toEqual(new Commands.TransitionPositionCommand().rawName)
	expect((commands[2] as Commands.TransitionPositionCommand).mixEffect).toEqual(0)
	expect((commands[2] as Commands.TransitionPositionCommand).properties.handlePosition).toEqual(0)

	expect(commands[3].rawName).toEqual('DAut')
	expect((commands[3] as Commands.AutoTransitionCommand).mixEffect).toEqual(0)

	STATE2.video.ME[0].input = 0
})

test('Unit: mix effect: transition preview', function () {
	STATE2.video.ME[0].transitionPreview = true
	const commands = ME.resolveMixEffectsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual(new Commands.PreviewTransitionCommand().rawName)
	expect((commands[0] as Commands.PreviewTransitionCommand).mixEffect).toEqual(0)

	STATE2.video.ME[0].transitionPreview = false
})

test('Unit: mix effect: transition position', function () {
	STATE2.video.ME[0].inTransition = true
	STATE2.video.ME[0].transitionPosition = 500
	const commands = ME.resolveMixEffectsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual(new Commands.TransitionPositionCommand().rawName)
	expect((commands[0] as Commands.TransitionPositionCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		handlePosition: 500
	})

	STATE2.video.ME[0].inTransition = false
	STATE2.video.ME[0].transitionPosition = 0
})

test('Unit: mix effect: from transition, to no transition', function () {
	STATE1.video.ME[0].inTransition = true
	STATE1.video.ME[0].transitionPosition = 500
	const commands = ME.resolveMixEffectsState(STATE1, STATE2)

	// console.log(commands)

	expect(commands[0].rawName).toEqual(new Commands.TransitionPositionCommand().rawName)
	expect((commands[0] as Commands.TransitionPositionCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		handlePosition: 10000
	})

	STATE1.video.ME[0].inTransition = false
	STATE1.video.ME[0].transitionPosition = 0
})

test('Unit: mix effect: transition properties', function () {
	STATE2.video.ME[0].transitionProperties.selection = 3
	STATE2.video.ME[0].transitionProperties.style = 1
	const commands = ME.resolveTransitionPropertiesState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual(new Commands.TransitionPropertiesCommand().rawName)
	expect((commands[0] as Commands.TransitionPropertiesCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		selection: 3,
		style: 1
	})

	STATE2.video.ME[0].transitionProperties.selection = 1
	STATE2.video.ME[0].transitionProperties.style = 0
})

test('Unit: mix effect: transition settings: dip', function () {
	STATE2.video.ME[0].transitionSettings.dip.input = 1
	STATE2.video.ME[0].transitionSettings.dip.rate = 50
	const commands = ME.resolveTransitionSettingsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual(new Commands.TransitionDipCommand().rawName)
	expect((commands[0] as Commands.TransitionDipCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		input: 1,
		rate: 50
	})

	STATE2.video.ME[0].transitionSettings.dip.input = 0
	STATE2.video.ME[0].transitionSettings.dip.rate = 25
})

test('Unit: mix effect: transition settings: DVE', function () {
	STATE2.video.ME[0].transitionSettings.DVE = {
		rate: 50,
		logoRate: 50,
		style: AtemEnums.DVEEffect.PushBottom,
		fillSource: 2,
		keySource: 4,

		enableKey: true,
		preMultiplied: true,
		clip: 1,
		gain: 1,
		invertKey: true,
		reverse: true,
		flipFlop: true
	}
	const commands = ME.resolveTransitionSettingsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual('CTDv')
	expect((commands[0] as Commands.TransitionDVECommand).mixEffect).toEqual(0)
	expect(commands[0].flag).toEqual(4095)
	expect(commands[0].properties).toMatchObject({
		rate: 50,
		logoRate: 50,
		style: AtemEnums.DVEEffect.PushBottom,
		fillSource: 2,
		keySource: 4,

		enableKey: true,
		preMultiplied: true,
		clip: 1,
		gain: 1,
		invertKey: true,
		reverse: true,
		flipFlop: true
	} as {})

	STATE2.video.ME[0].transitionSettings.DVE = {
		rate: 25,
		logoRate: 25,
		style: AtemEnums.DVEEffect.PushLeft,
		fillSource: 0,
		keySource: 0,

		enableKey: false,
		preMultiplied: false,
		clip: 0,
		gain: 0,
		invertKey: false,
		reverse: false,
		flipFlop: false
	}
})

test('Unit: mix effect: transition settings: mix', function () {
	STATE2.video.ME[0].transitionSettings.mix.rate = 50
	const commands = ME.resolveTransitionSettingsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual('CTMx')
	expect((commands[0] as Commands.TransitionMixCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		rate: 50
	})

	STATE2.video.ME[0].transitionSettings.mix.rate = 25
})

test('Unit: mix effect: transition settings: stinger', function () {
	STATE2.video.ME[0].transitionSettings.stinger = {
		source: 1,
		preMultipliedKey: true,

		clip: 1,
		gain: 1, // 0...1000
		invert: true,

		preroll: 10,
		clipDuration: 50,
		triggerPoint: 25,
		mixRate: 25
	}
	const commands = ME.resolveTransitionSettingsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual('CTSt')
	expect((commands[0] as Commands.TransitionStingerCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		source: 1,
		preMultipliedKey: true,

		clip: 1,
		gain: 1, // 0...1000
		invert: true,

		preroll: 10,
		clipDuration: 50,
		triggerPoint: 25,
		mixRate: 25
	})

	STATE2.video.ME[0].transitionSettings.stinger = {
		source: 0,
		preMultipliedKey: false,

		clip: 0,
		gain: 0, // 0...1000
		invert: false,

		preroll: 0,
		clipDuration: 25,
		triggerPoint: Math.ceil(25 / 2),
		mixRate: 1
	}
})

test('Unit: mix effect: transition settings: wipe', function () {
	STATE2.video.ME[0].transitionSettings.wipe = {
		rate: 50,
		pattern: AtemEnums.Pattern.HorizontalBarnDoor,
		borderWidth: 1,
		borderInput: 1,
		symmetry: 1,
		borderSoftness: 1,
		xPosition: 1,
		yPosition: 1,
		reverseDirection: true,
		flipFlop: true
	}
	const commands = ME.resolveTransitionSettingsState(STATE1, STATE2)

	expect(commands[0].rawName).toEqual('CTWp')
	expect((commands[0] as Commands.TransitionWipeCommand).mixEffect).toEqual(0)
	expect(commands[0].properties).toMatchObject({
		rate: 50,
		pattern: AtemEnums.Pattern.HorizontalBarnDoor,
		borderWidth: 1,
		borderInput: 1,
		symmetry: 1,
		borderSoftness: 1,
		xPosition: 1,
		yPosition: 1,
		reverseDirection: true,
		flipFlop: true
	})

	STATE2.video.ME[0].transitionSettings.wipe = {
		rate: 25,
		pattern: 1,
		borderWidth: 0,
		borderInput: 0,
		symmetry: 0,
		borderSoftness: 0,
		xPosition: 0,
		yPosition: 0,
		reverseDirection: false,
		flipFlop: false
	}
})
