import { AtemState, State } from '../'

test('Unit test: Atem State: Set State', function () {
	const state = new AtemState()
	state.setState({ video: { auxilliaries: [0, 0, 1] } } as State)

	expect(state.getState()).toMatchObject({ video: { auxilliaries: [0, 0, 1] } })
})

test('Unit test: Atem State: Diff State', function () {
	const state = new AtemState()
	state.setState({ video: { auxilliaries: [0, 0, 1] } } as State)

	const commands = state.diffState({ video: { auxilliaries: [0, 0, 2] } } as State)

	expect(commands.length).toEqual(1)
	expect(commands[0].rawName).toEqual('AuxS')
})
