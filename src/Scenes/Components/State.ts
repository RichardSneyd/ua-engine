import SceneComponentStateful from "./SceneComponentStateful";


abstract class SceneBehaviorState {
    component: SceneComponentStateful;
    
    public abstract update();
  
}

export default SceneBehaviorState;