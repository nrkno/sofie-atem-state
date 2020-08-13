import * as DSK from '../downstreamKeyer'
import { State as StateObject } from '../../'
import { Commands, AtemStateUtil, AtemState, VideoState } from 'atem-connection'
import * as _ from 'underscore'
import { Defaults } from '../../defaults'
import { jsonClone } from '../../util'

function setupDSK (state: StateObject, index: number, props?: Partial<VideoState.DSK.DownstreamKeyer>) {
	const dsk = AtemStateUtil.getDownstreamKeyer(state as AtemState, index)
	dsk.properties = jsonClone({
		...Defaults.Video.DownstreamerKeyerProperties,
		...props
	})
	dsk.sources = jsonClone(Defaults.Video.DownstreamerKeyerSources)
	return dsk
}

const STATE1 = AtemStateUtil.Create()
setupDSK(STATE1, 0)
setupDSK(STATE1, 1)

const STATE2 = AtemStateUtil.Create()
let DSK1 = setupDSK(STATE2, 0)
let DSK2 = setupDSK(STATE2, 1)

test('Unit: Downstream keyer: same state gives no commands', function () {
	const commands = DSK.resolveDownstreamKeyerState(STATE1, STATE1)
	expect(commands).toHaveLength(0)
})

test('Unit: Downstream keyer: auto and onAir commands', function () {
	DSK1.onAir = true
	STATE2.video.downstreamKeyers[1]! = {
		...STATE2.video.downstreamKeyers[1]!,
		isAuto: true
	}

	const commands = DSK.resolveDownstreamKeyerState(STATE1, STATE2)
	expect(commands).toHaveLength(2)

	const firstCommand = commands[0] as Commands.DownstreamKeyOnAirCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyOnAirCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		onAir: true
	})

	const secondCommand = commands[1] as Commands.DownstreamKeyAutoCommand
	expect(secondCommand.constructor.name).toEqual('DownstreamKeyAutoCommand')
	expect(secondCommand.downstreamKeyerId).toEqual(1)
	DSK1.onAir = false
	STATE2.video.downstreamKeyers[1]! = {
		...STATE2.video.downstreamKeyers[1],
		isAuto: false
	}

	DSK2 = STATE2.video.downstreamKeyers[1]
})

test('Unit: Downstream keyer: sources', function () {
	DSK1.sources!.fillSource = 1
	DSK2.sources!.cutSource = 2

	const commands = DSK.resolveDownstreamKeyerState(STATE1, STATE2)
	expect(commands).toHaveLength(2)

	const firstCommand = commands[0] as Commands.DownstreamKeyFillSourceCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyFillSourceCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		input: 1
	})

	const secondCommand = commands[1] as Commands.DownstreamKeyCutSourceCommand
	expect(secondCommand.constructor.name).toEqual('DownstreamKeyCutSourceCommand')
	expect(secondCommand.downstreamKeyerId).toEqual(1)
	expect(secondCommand.properties).toEqual({
		input: 2
	})

	delete DSK1.sources
	delete DSK2.sources
})

test('Unit: Downstream keyer: rate', function () {
	DSK1.properties!.rate = 50
	const commands = DSK.resolveDownstreamKeyerState(STATE1, STATE2)
	expect(commands).toHaveLength(1)

	const firstCommand = commands[0] as Commands.DownstreamKeyRateCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyRateCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		rate: 50
	})
	DSK1.properties!.rate = 25
})

test('Unit: Downstream keyer: tie', function () {
	DSK1.properties!.tie = true
	const commands = DSK.resolveDownstreamKeyerState(STATE1, STATE2)
	expect(commands).toHaveLength(1)

	const firstCommand = commands[0] as Commands.DownstreamKeyTieCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyTieCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		tie: true
	})
	DSK1.properties!.tie = false
})

test('Unit: Downstream keyer: properties', function () {
	DSK1.properties!.preMultiply = true
	DSK1.properties!.clip = 500
	DSK1.properties!.gain = 50
	DSK1.properties!.invert = true
	const commands = DSK.resolveDownstreamKeyerState(STATE1, STATE2)
	expect(commands).toHaveLength(1)

	const firstCommand = commands[0] as Commands.DownstreamKeyGeneralCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyGeneralCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		preMultiply: true,
		clip: 500,
		gain: 50,
		invert: true
	})
	DSK1.properties!.preMultiply = false
	DSK1.properties!.clip = 0
	DSK1.properties!.gain = 0
	DSK1.properties!.invert = false
})

test('Unit: Downstream keyer: mask', function () {
	DSK1.properties!.mask = {
		enabled: true,
		top: 1,
		bottom: 2,
		left: 3,
		right: 4
	}
	const commands = DSK.resolveDownstreamKeyerState(STATE1, STATE2)
	expect(commands).toHaveLength(1)

	const firstCommand = commands[0] as Commands.DownstreamKeyMaskCommand
	expect(firstCommand.constructor.name).toEqual('DownstreamKeyMaskCommand')
	expect(firstCommand.downstreamKeyerId).toEqual(0)
	expect(firstCommand.properties).toEqual({
		enabled: true,
		top: 1,
		bottom: 2,
		left: 3,
		right: 4
	})
	DSK1.properties!.mask = {
		enabled: false,
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	}
})
