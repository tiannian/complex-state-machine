import _StateMachine from 'javascript-state-machine';
import { StorageInterface } from './storage';

const FACTORY_SPACE = 'factory';
const STATE_SPACE = 'state';

class StateMachineTransition {
    name: string;
    from: string;
    to:   string;
}

class StateMachineDefine {
    init: string;
    transitions: StateMachineTransition[];
}

class StateMachine {
    private _state: _StateMachine;
    public _storage: StorageInterface;
    private _smid: string;
    private _smfid: string;

    constructor (id: string, smfid: string, storage: StorageInterface) {
        this._smid = id;
        this._storage = storage;
        this._smfid = smfid;
    }

    public async init(_init: string, state: _StateMachine) {
        this._state = state;
        // init
        this._state.init(_init);
        this._state.observe({
            onEnterState: async (event: any) => {
                console.log(`from ${event.from} to ${event.to} by ${event.transition}`)
                this._storage.set(STATE_SPACE, this._smid, JSON.stringify({ state: event.to, smid: this._smid, smfid: this._smfid }))
            }
        });
    }
}

class StateMachineFactory {
    private _smfid: string;
    private _factory: _StateMachine;
    private _storage: StorageInterface;
    private _define: StateMachineDefine;

    constructor (id: string, storage: StorageInterface) {
        this._smfid = id;
        this._storage = storage;
    }

    public async init(define: StateMachineDefine): Promise<boolean> {
        this._define = define;
        if (define == null) {
            // read data from storage.
            let result = await this._storage.get(FACTORY_SPACE, this._smfid);
            if (result == null) {
                let fsm_define = JSON.parse(result);
                this._factory = _StateMachine.factory({transitions: fsm_define.transitions});
            } else {
                return false;
            }
        } else {
            // init result and store.
            this._factory = _StateMachine.factory({transitions: define.transitions});
            await this._storage.set(FACTORY_SPACE, this._smfid, JSON.stringify(define));
        }
        return true;
    }

    public async create(smfid: string, smid: string): Promise<StateMachine> {
        let _state = this._factory();
        let state = new StateMachine(smid, smfid, this._storage);
        await state.init(this._define.init, _state);
        return state;
    }
}

export {
    StateMachine,
    StateMachineFactory,
}


