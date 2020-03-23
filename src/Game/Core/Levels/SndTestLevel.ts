import ILevel from '../Engine/ILevel';

import Loader from '../Engine/Loader';
import Loop from '../Engine/Loop';
import Entity from '../Engine/Entity';
import LevelManager from '../Engine/LevelManager';

class SndTestLevel implements ILevel {
    protected _manager: LevelManager; _loop: Loop; _player: Entity; _loader: Loader; _player2: Entity;


    constructor(manager: LevelManager, loop: Loop, loader: Loader, entity: Entity, entity2: Entity) {
        this._manager = manager;
        this._loop = loop;
        this._loader = loader;

        this._player = entity;
        this._player2 = entity2;
        // this._utils = utils;
    }

    get manager(): LevelManager {
        return this._manager;
    }

    init(scriptName: string): void {


        this.manager.events.once('preload', this.preload, this);
        this.manager.events.once('start', this.start, this);
        this.manager.events.on('newRow', this.onNewRow, this);

        this._loader.loadActScript(scriptName, (script: any, data: any) => {

            this.manager.init(scriptName, script, ['images', 'audio_id'], ['settings']);
            this.manager.events.fire('preload');
            console.log('preload fired');

        });

    }

    repeater() {
        console.log('repeater memeber of SndTestLevel is being called every 3 seconds');
    }

    preload() {
    
        setTimeout(() => {
            this.manager.events.fire('start');
            // this.start();
        }, 4000);
    }

    start() {

        this._loop.addFunction(this.update, this);
        this._loop.start();

        // a hack to test the audio management system -- input events will be handled by an input handler ultimately 
        let canvas = document.getElementsByTagName('canvas')[0];
        canvas.addEventListener('click', () => {
            //  this.manager.script.goTo(this.manager.script.rows[0]);
            if (this.manager.events.paused) {
                console.log('Resume! will execute resume(), all timers should start again...')
                this.manager.events.resume();
            }
            else {
                this.manager.events.pause();
                console.log('Pause!! All timers should stop firing...')
            }
        });

        let i = 0;
        let tail ='.';
      
        this.manager.events.timer(1000, function(this: any){
            console.warn('executing callback %s repeat at: ', i, this);
            i++;
            if(i == 3){
                this.manager.events.timer(2000, function(this: any){
                    tail = tail + '.';
                    console.warn('repeat forever %s', tail);
                }, this, -1);
            }
        }, this, 3); 

        /* this.manager.events.timer(2000, () => {
            console.log('timer 1 executed after 2 secs, with this: ', this);
            let i = 1;
            this.manager.events.timer(1000, () => {
                i++;
                console.log('timer 2 executing every every second, 5 times in row, this is time %s', i);
                if (i == 5) {
                    this.manager.events.clearTimers();
                    this.manager.events.timer(3000, this.repeater, this);
                    this.manager.events.timer(3020, () => {
                        console.log('a dummy timer, to see if surgical removal of timers spares the innocent...')
                    }, this);
                    this.manager.events.timer(10000, () => {
                        console.log('attempting to remove repeater listener surgically..');
                        this.manager.events.removeTimer(this.repeater);
                        console.log('these timers remain: ', this.manager.events.timers);
                    }, this);
                }
            }, this, -1);
            console.log(this.manager.events.timers);
            debugger;
        }, this, 0) ; */

    }

    onNewRow() {

        this.manager.audio.playInstructionArr(this.manager.script.active.audio_id, () => {
            this.manager.script.goToAutoNext();
        });
    }


    update(time: number): void {
        //console.log('updating main');
        this._player.update(time);
        this._player2.update(time);
    }

    shutdown(): void {
        this._loop.removeFunction(this.update);
    }
}

export default SndTestLevel;