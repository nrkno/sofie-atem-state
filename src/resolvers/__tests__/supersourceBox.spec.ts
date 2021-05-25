/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as supersource from '../supersource'
import * as Defaults from '../../defaults'
import { Commands, Enums, AtemStateUtil } from 'atem-connection'
import { jsonClone } from '../../util'

const STATE1 = AtemStateUtil.Create()
const SSRC1 = AtemStateUtil.getSuperSource(STATE1, 0)
SSRC1.boxes[0] = jsonClone(Defaults.Video.SuperSourceBox)
SSRC1.boxes[1] = jsonClone(Defaults.Video.SuperSourceBox)
SSRC1.boxes[2] = jsonClone(Defaults.Video.SuperSourceBox)
SSRC1.boxes[3] = jsonClone(Defaults.Video.SuperSourceBox)
SSRC1.border = jsonClone(Defaults.Video.SuperSourceBorder)
SSRC1.properties = jsonClone(Defaults.Video.SuperSourceProperties)

const STATE2 = AtemStateUtil.Create()
const SSRC2 = AtemStateUtil.getSuperSource(STATE2, 0)
SSRC2.boxes[0] = {
	enabled: true,
	source: 1,
	x: 1,
	y: 1,
	size: 1,
	cropped: true,
	cropTop: 1,
	cropBottom: 1,
	cropLeft: 1,
	cropRight: 1,
}
;(SSRC2.boxes[1] = jsonClone(Defaults.Video.SuperSourceBox)),
	(SSRC2.boxes[2] = jsonClone(Defaults.Video.SuperSourceBox)),
	(SSRC2.boxes[3] = jsonClone(Defaults.Video.SuperSourceBox))
SSRC2.border = jsonClone(Defaults.Video.SuperSourceBorder)
SSRC2.properties = jsonClone(Defaults.Video.SuperSourceProperties)

test('Unit: super source boxes: same state gives no commands', function () {
	// same state gives no commands:
	const commands = supersource.resolveSuperSourceState(STATE1, STATE1, Enums.ProtocolVersion.V7_2)
	expect(commands).toHaveLength(0)
})

test('Unit: super source boxes: status command', function () {
	const commands = supersource.resolveSuperSourceState(
		STATE1,
		STATE2,
		Enums.ProtocolVersion.V7_2
	) as Array<Commands.SuperSourceBoxParametersCommand>

	expect(commands[0].constructor.name).toEqual('SuperSourceBoxParametersCommand')
	expect(commands[0].boxId).toEqual(0)
	expect(commands[0].flag).toEqual(1023)
	expect(commands[0].properties).toEqual({
		enabled: true,
		source: 1,
		x: 1,
		y: 1,
		size: 1,
		cropped: true,
		cropTop: 1,
		cropBottom: 1,
		cropLeft: 1,
		cropRight: 1,
	})
})

test('Unit: super source boxes: box removed', function () {
	const ssBox = SSRC2.boxes[0]
	delete SSRC2.boxes[0]
	const commands = supersource.resolveSuperSourceState(
		STATE1,
		STATE2,
		Enums.ProtocolVersion.V7_2
	) as Array<Commands.SuperSourceBoxParametersCommand>

	expect(commands).toHaveLength(0)

	SSRC2.boxes[0] = ssBox
})

test('Unit: super source boxes: new box', function () {
	AtemStateUtil.getSuperSource(STATE1, 0).boxes[0] = jsonClone(Defaults.Video.SuperSourceBox)
	const commands = supersource.resolveSuperSourceState(
		STATE1,
		STATE2,
		Enums.ProtocolVersion.V7_2
	) as Array<Commands.SuperSourceBoxParametersCommand>

	expect(commands[0].constructor.name).toEqual('SuperSourceBoxParametersCommand')
	expect(commands[0].boxId).toEqual(0)
	expect(commands[0].flag).toEqual(1023)
	expect(commands[0].properties).toEqual({
		enabled: true,
		source: 1,
		x: 1,
		y: 1,
		size: 1,
		cropped: true,
		cropTop: 1,
		cropBottom: 1,
		cropLeft: 1,
		cropRight: 1,
	})

	AtemStateUtil.getSuperSource(STATE1, 0).boxes[0] = AtemStateUtil.getSuperSource(STATE2, 0).boxes[0]
})

test('Unit: super source properties: same state gives no commands', function () {
	// same state gives no commands:
	const commands = supersource.resolveSuperSourcePropertiesState(STATE1, STATE1)
	expect(commands).toHaveLength(0)
})

test('Unit: super source properties: some properties changed', function () {
	SSRC2.properties!.artFillSource = 3010
	SSRC2.properties!.artOption = 1 // foreground
	const commands = supersource.resolveSuperSourcePropertiesState(
		STATE1,
		STATE2
	) as Array<Commands.SuperSourcePropertiesCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('SuperSourcePropertiesCommand')
	expect(commands[0].flag).toEqual(5)
	expect(commands[0].properties).toEqual({
		artFillSource: 3010,
		artOption: 1,
	})

	SSRC2.properties!.artFillSource = SSRC1.properties!.artFillSource
	SSRC2.properties!.artOption = SSRC1.properties!.artOption
})

test('Unit: super source properties v8: some properties changed', function () {
	SSRC2.properties!.artFillSource = 3010
	SSRC2.properties!.artOption = 1 // foreground
	const commands = supersource.resolveSuperSourcePropertiesV8State(
		STATE1,
		STATE2
	) as Array<Commands.SuperSourcePropertiesV8Command>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('SuperSourcePropertiesV8Command')
	expect(commands[0].flag).toEqual(5)
	expect(commands[0].properties).toEqual({
		artFillSource: 3010,
		artOption: 1,
	})

	SSRC2.properties!.artFillSource = SSRC1.properties!.artFillSource
	SSRC2.properties!.artOption = SSRC1.properties!.artOption
})
test('Unit: super source properties v8: no properties changed', function () {
	const commands = supersource.resolveSuperSourceState(STATE1, STATE2, Enums.ProtocolVersion.V8_0)
	expect(commands).toHaveLength(0)
})

test('Unit: super source border v8: some properties changed', function () {
	SSRC2.border!.borderOuterWidth = 3010
	SSRC2.border!.borderEnabled = true

	const commands = supersource.resolveSuperSourceBorderV8State(
		STATE1,
		STATE2
	) as Array<Commands.SuperSourceBorderCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('SuperSourceBorderCommand')
	expect(commands[0].flag).toEqual(5)
	expect(commands[0].properties).toEqual({
		borderOuterWidth: 3010,
		borderEnabled: true,
	})

	SSRC2.border!.borderOuterWidth = SSRC1.border!.borderOuterWidth
	SSRC2.border!.borderEnabled = SSRC1.border!.borderEnabled
})

test('Unit: super source box v8: 2 super sources', function () {
	STATE1.video.superSources[1] = jsonClone(AtemStateUtil.getSuperSource(STATE1, 0))
	const newSSrc = (STATE2.video.superSources[1] = jsonClone(AtemStateUtil.getSuperSource(STATE1, 0)))
	newSSrc.boxes[0]!.cropped = false

	const commands = supersource.resolveSuperSourceBoxState(
		STATE1,
		STATE2,
		Enums.ProtocolVersion.V8_0
	) as Array<Commands.SuperSourceBoxParametersCommand>
	expect(commands).toHaveLength(1)

	expect(commands[0].constructor.name).toEqual('SuperSourceBoxParametersCommand')
	expect(commands[0].flag).toEqual(32)
	expect(commands[0].ssrcId).toEqual(1)
	expect(commands[0].properties).toEqual({
		cropped: false,
	})

	newSSrc.boxes[0]!.cropped = true
})
