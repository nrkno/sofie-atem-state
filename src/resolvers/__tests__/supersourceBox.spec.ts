import * as supersource from '../supersource'
import { State as StateObject, Defaults } from '../../'
import { Commands } from 'atem-connection'

const STATE1 = new StateObject()
STATE1.video.superSourceBoxes[0] = JSON.parse(JSON.stringify(Defaults.Video.SuperSourceBox))
STATE1.video.superSourceProperties = JSON.parse(JSON.stringify(Defaults.Video.SuperSourceProperties))
const STATE2 = new StateObject()
STATE2.video.superSourceBoxes[0] = {
	enabled: true,
	source: 1,
	x: 1,
	y: 1,
	size: 1,
	cropped: true,
	cropTop: 1,
	cropBottom: 1,
	cropLeft: 1,
	cropRight: 1
}
STATE2.video.superSourceProperties = JSON.parse(JSON.stringify(Defaults.Video.SuperSourceProperties))

test('Unit: super source boxes: same state gives no commands', function () {
	// same state gives no commands:
	const commands = supersource.resolveSupersourceBoxState(STATE1, STATE1)
	expect(commands.length).toEqual(0)
})

test('Unit: super source boxes: status command', function () {
	const commands = supersource.resolveSupersourceBoxState(STATE1, STATE2) as Array<Commands.SuperSourceBoxParametersCommand>

	expect(commands[0].rawName).toEqual('SSBP')
	expect(commands[0].boxId).toEqual(0)
	expect(commands[0].flag).toEqual(1023)
	expect(commands[0].properties).toMatchObject({
		enabled: true,
		source: 1,
		x: 1,
		y: 1,
		size: 1,
		cropped: true,
		cropTop: 1,
		cropBottom: 1,
		cropLeft: 1,
		cropRight: 1
	})
})

test('Unit: super source boxes: box removed', function () {
	const ssBox = STATE2.video.superSourceBoxes[0]
	delete STATE2.video.superSourceBoxes[0]
	const commands = supersource.resolveSupersourceBoxState(STATE1, STATE2) as Array<Commands.SuperSourceBoxParametersCommand>

	expect(commands.length).toEqual(0)

	STATE2.video.superSourceBoxes[0] = ssBox
})

test('Unit: super source boxes: new box', function () {
	const ssBox = STATE1.video.superSourceBoxes[0]
	delete STATE1.video.superSourceBoxes[0]
	const commands = supersource.resolveSupersourceBoxState(STATE1, STATE2) as Array<Commands.SuperSourceBoxParametersCommand>

	expect(commands[0].rawName).toEqual('SSBP')
	expect(commands[0].boxId).toEqual(0)
	expect(commands[0].flag).toEqual(1023)
	expect(commands[0].properties).toMatchObject({
		enabled: true,
		source: 1,
		x: 1,
		y: 1,
		size: 1,
		cropped: true,
		cropTop: 1,
		cropBottom: 1,
		cropLeft: 1,
		cropRight: 1
	})

	STATE1.video.superSourceBoxes[0] = ssBox
})

test('Unit: super source properties: same state gives no commands', function () {
	// same state gives no commands:
	const commands = supersource.resolveSuperSourcePropertiesState(STATE1, STATE1)
	expect(commands.length).toEqual(0)
})

test('Unit: super source properties: some properties changed', function () {
	STATE2.video.superSourceProperties.artFillSource = 3010
	STATE2.video.superSourceProperties.artOption = 1 // foreground
	const commands = supersource.resolveSuperSourcePropertiesState(STATE1, STATE2)
	expect(commands.length).toEqual(1)

	expect(commands[0].rawName).toEqual('SSrc')
	expect(commands[0].flag).toEqual(5)
	expect(commands[0].properties).toMatchObject({
		artFillSource: 3010,
		artOption: 1
	})

	STATE2.video.superSourceProperties.artFillSource = STATE1.video.superSourceProperties.artFillSource
	STATE2.video.superSourceProperties.artOption = STATE1.video.superSourceProperties.artOption
})
