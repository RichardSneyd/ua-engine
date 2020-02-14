import SceneComponent from "../SceneComponent";

class ActivityScript extends SceneComponent {
    public name: string;
    protected activity_code: string;
    protected json: any;
    constructor(){
        super('activityScript');
    }
    public update() {
        throw new Error("Method not implemented.");
    }
}

export default ActivityScript;