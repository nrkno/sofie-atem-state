import * as PatternKeyer from '../patternKeyer'
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
	let patternKeyer = STATE2.video.ME[0].upstreamKeyers[0].patternSettings
	delete STATE2.video.ME[0].upstreamKeyers[0].patternSettings
	const commands = PatternKeyer.resolvePatternKeyerState(STATE1, STATE2)
	expect(commands.length).toEqual(0)
	STATE2.video.ME[0].upstreamKeyers[0].patternSettings = patternKeyer
})

test('Unit: upstream keyers: pattern keyer', function () {
	STATE2.video.ME[0].upstreamKeyers[0].patternSettings = {
		style: Enums.Pattern.BottomRightBox,
		size: 1,
		symmetry: 2500,
		softness: 2,
		positionX: 300,
		positionY: 700,
		invert: true
	}
	const commands = PatternKeyer.resolvePatternKeyerState(STATE1, STATE2) as [Commands.MixEffectKeyPatternCommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyPatternCommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(7)
	expect(commands[0].properties).toMatchObject({
		style: Enums.Pattern.BottomRightBox,
		size: 1,
		symmetry: 2500,
		softness: 2,
		positionX: 300,
		positionY: 700,
		invert: true
	})

	STATE2.video.ME[0].upstreamKeyers[0].patternSettings = JSON.parse(JSON.stringify(STATE1.video.ME[0].upstreamKeyers[0].patternSettings))
})

test('Unit: upstream keyers: pattern keyer: new pattern, no position / symmetry', function () {
	STATE2.video.ME[0].upstreamKeyers[0].patternSettings.positionX = 300
	STATE2.video.ME[0].upstreamKeyers[0].patternSettings.style = Enums.Pattern.BottomRightBox
	const commands = PatternKeyer.resolvePatternKeyerState(STATE1, STATE2) as [Commands.MixEffectKeyPatternCommand]

	expect(commands[0].rawName).toEqual(new Commands.MixEffectKeyPatternCommand().rawName)
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(Object.keys(commands[0].properties).length).toBe(4)
	expect(commands[0].properties).toMatchObject({
		style: Enums.Pattern.BottomRightBox,
		symmetry: 5000,
		positionX: 300,
		positionY: 500
	})

	STATE2.video.ME[0].upstreamKeyers[0].patternSettings.positionX = 500
	STATE2.video.ME[0].upstreamKeyers[0].patternSettings.style = Enums.Pattern.LeftToRightBar
})
