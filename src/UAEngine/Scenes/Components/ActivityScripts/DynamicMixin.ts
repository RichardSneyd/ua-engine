import ActivityScript from "./ActivityScript";

abstract class DynamicMixin extends ActivityScript {
    allRounds: any[];
    expiredRounds: any[];
    availableRounds: any[];
    currentRound: any;

    /**
     * @description use this method to initialize the properties of this mixin in the client class. 
     * @param rounds this is the raw data that seeds the properties, such as allRounds
     *  .ie this.json.rounds
     */
    initializeRounds(rounds: any[]){
        this.allRounds = rounds;
        this.expiredRounds = [];
        this.availableRounds = this.allRounds;
        this.currentRound = rounds[0];
    }

    getRoundByID(id: number){
        return this.allRounds[id];
    }

    getUsedRounds(){
        return this.expiredRounds;
    }

    expireRound(round: any) : any{
        this.availableRounds.splice(this.allRounds.indexOf(round, -1));
        this.expiredRounds.push(round);
        return round;
    }

    getRandomRound() : any{
        this.expireRound(this.currentRound);
        let index = Math.random() * this.availableRounds.length;
        return this.availableRounds.splice(this.availableRounds[index], 1);
    }

    getNextRound() : any{
        return this.availableRounds[this.availableRounds.indexOf[this.currentRound] + 1];
    }
    
}