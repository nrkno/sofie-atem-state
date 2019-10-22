import * as PatternKeyer from '../patternKeyer'
import { State as StateObject, Defaults } from '../../../'
import { Commands, Enums } from 'atem-connection'
import { jsonClone } from '../../../util'

const STATE1 = new StateObject()
const ME1 = STATE1.video.getMe(0)
const USK1 = ME1.getUpstreamKeyer(0)

const STATE2 = new StateObject()
const ME2 = STATE2.video.getMe(0)
const USK2 = ME2.getUpstreamKeyer(0)

test('Unit: upstream keyers: pattern keyer undefined gives no error', function () {
	USK1.patternSettings = jsonClone(Defaults.Video.UpstreamKeyerPatternSettings)

	// same state gives no commands:
	let patternKeyer = USK2.patternSettings
	delete USK2.patternSettings
	const commands = PatternKeyer.resolvePatternKeyerState(0, 0, USK1, USK2)
	expect(commands).toHaveLength(0)
	USK2.patternSettings = patternKeyer
})

test('Unit: upstream keyers: pattern keyer', function () {
	USK2.patternSettings = {
		style: Enums.Pattern.BottomRightBox,
		size: 1,
		symmetry: 2500,
		softness: 2,
		positionX: 300,
		positionY: 700,
		invert: true
	}
	const commands = PatternKeyer.resolvePatternKeyerState(0, 0, USK1, USK2) as [Commands.MixEffectKeyPatternCommand]

	expect(commands[0].constructor.name).toEqual('MixEffectKeyPatternCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		style: Enums.Pattern.BottomRightBox,
		size: 1,
		symmetry: 2500,
		softness: 2,
		positionX: 300,
		positionY: 700,
		invert: true
	})

	USK2.patternSettings = jsonClone(USK1.patternSettings)
})

test('Unit: upstream keyers: pattern keyer: new pattern, no position / symmetry', function () {
	USK2.patternSettings!.positionX = 300
	USK2.patternSettings!.style = Enums.Pattern.BottomRightBox
	const commands = PatternKeyer.resolvePatternKeyerState(0, 0, USK1, USK2) as [Commands.MixEffectKeyPatternCommand]

	expect(commands[0].constructor.name).toEqual('MixEffectKeyPatternCommand')
	expect(commands[0].mixEffect).toEqual(0)
	expect(commands[0].upstreamKeyerId).toEqual(0)
	expect(commands[0].properties).toEqual({
		style: Enums.Pattern.BottomRightBox,
		symmetry: 5000,
		positionX: 300,
		positionY: 500
	})

	USK2.patternSettings!.positionX = 500
	USK2.patternSettings!.style = Enums.Pattern.LeftToRightBar
})
