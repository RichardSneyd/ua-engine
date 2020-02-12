import SceneComponentStateful from "./SceneComponentStateful";


export default abstract class SceneBehaviorState {
    component: SceneComponentStateful;
    
    public abstract update();
  
}