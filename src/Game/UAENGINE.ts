import World from './Core/Engine/World';
import Entity from './Core/Engine/Entity';
import Loop from './Core/Engine/Loop';
import Loader from './Core/Engine/Loader';
import Events from './Core/Engine/Events';
import LevelManager from './Core/Engine/LevelManager';

namespace UAENGINE {
  let world: World;
  let entity: Entity;
  let loop: Loop;
  let loader: Loader;
  let events: Events;
  let levelManager: LevelManager;

  function foo() {
      world;
      entity;
      loop;
      loader;
      events;
      levelManager;
  }
}
export default UAENGINE;