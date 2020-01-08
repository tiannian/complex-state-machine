const StateMachine = require('javascript-state-machine');

let fsm = new StateMachine({
    init: 'a',
    transitions: [
        { name: 'a2b', from: 'a', to: 'b' },
        { name: 'a2c', from: 'a', to: 'c' },
        { name: 'b2c', from: 'b', to: 'c' },
        { name: 'c2end', from: 'c', to: 'end' },
    ]
})

fsm.observe({
    onEnterState(data) {
        console.log(data);
    }
})

fsm.a2b();
fsm.init('end')


