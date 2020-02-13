class Scenes {
    
    private constructor() { }

    /**
     * @description retrieve a list of all scene keys in the current game instance
     * @param manager a reference to the scene manager, which is a game level system, responsible for handling all scenes in the
     * game instace
     */
    public static getSceneKeys(manager: Phaser.Scenes.SceneManager): string[] {
        let scenes = manager.getScenes(false);
        let keys: string[] = [];
        for (let x = 0; x < scenes.length; x++) {
            keys.push(scenes[x].scene.key);
        }

        return keys;
    }

}

export default Scenes;