import Debug from "../Debug";
import BaseLevel from "./BaseLevel";

class BaseGamifiedLevel extends BaseLevel {
    protected _score: number;
    protected _roundEnded: boolean = false;
    protected _currentRound: number;
    protected _selectedRounds: number[];

    get score() {
        return this._score;
    }

    /**
     * @description returns the max score for this activity. override for activities which involve more than 1 point per round
     */
    get maxScore() {
        return this.configRow.config.rounds;
    }

    init(scriptName: string, parseCols: string[], objectifyCols: string[], processText?: string[] | undefined): void {
        super.init(scriptName, parseCols, objectifyCols, processText);
        this._score = 0;
        this._currentRound = 0;
    }

    protected _onActivityScriptInitialized(scriptName: string, script: any) {
        // configRow is set in BaseLevel.start - it's undefined at the init stage
        // UAE.debug.info('rounds..');
        // UAE.debug.info('rounds: ', this.manager.script.rounds);
        this._selectedRounds = this.manager.utils.coll.shuffle(this._manager.script.rounds).splice(0, this.maxRounds); // return random selection of rounds

        super._onActivityScriptInitialized(scriptName, script);
    }

    onInstructionAudioComplete() {
        if (this.activeRow.label == 'begin_session' && this._currentRound < 1) this._beginSession();
        super.onInstructionAudioComplete();
    }

    /**
     * @description begin the play session - this will load the first round in the selectedRounds array
     */
    protected _beginSession() {
        Debug.info('begin session!');
        this._newRound();
    }

    /**
     * @description select a new round from the pool of selected rounds for this session, and call _startNewRound to launch it
     */
    protected _newRound() {
        // override
        this._roundEnded = false;
        //  Debug.info('selected: ', this._selectedRounds);
        let row = this._selectedRounds.pop();
        if (row) {
            this._startNewRound(row);
        }
        else {
            this._manager.script.goTo(this._manager.script.rowByCellVals(['label'], ['outro']));
        }
    }

    /**
     * @description launch the selected row as a new round
     * @param row the round row to execute
     */
    protected _startNewRound(row: any) {
        this._manager.script.goTo(row);
        this._currentRound = this.activeRow.round;
    }

    protected _winRound() {
        // override
    }

    protected _loseRound() {
        // override
    }

    protected _endRound(...args: any[]) {
        // override
    }

}

export default BaseGamifiedLevel;