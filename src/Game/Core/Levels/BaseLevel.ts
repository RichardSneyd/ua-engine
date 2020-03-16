import ILevel from '../Engine/ILevel';
import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';
import Utils from '../../Utils/Utils';
import LevelManager from '../../Services/LevelManager';

abstract class BaseLevel implements ILevel {
    protected _manager: LevelManager; _loop: Loop; _player: Entity; _loader: Loader;

    constructor(manager: LevelManager, loop: Loop, player: Entity, loader: Loader) {
        this._manager = manager;
        this._loop = loop;
        this._player = player;
        this._loader = loader;
        // this._utils = utils;
    }

    get manager() : LevelManager {
        return this._manager;
    }

    init(): void {

    }

    update(): void {
        //console.log('updating main');
    }

    shutdown(): void {
        this._loop.removeFunction(this.update);
    }
}

export default BaseLevel;