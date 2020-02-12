

export default class House extends Phaser.GameObjects.Container {
    base: Phaser.GameObjects.Sprite;
    wall: Phaser.GameObjects.Sprite;
    roof: Phaser.GameObjects.Sprite;
    door: Phaser.GameObjects.Sprite;
    window: Phaser.GameObjects.Sprite;
    decor: Phaser.GameObjects.Sprite;
    unlocked: number;

    constructor(scene: Phaser.Scene, x: number, y: number, baseKey: string, biome: string ) {
        super(scene, x, y);
        
        this.base = this.scene.add.sprite(0, 600, baseKey).setOrigin(0, 0);
        this.base.y -= this.base.height;
        this.add(this.base);
        this.wall = this.initializeElement(this.wall, biome+'_wall1', 0, 150);
       this.roof = this.initializeElement(this.roof, biome+'_roof1', 0, 0);
        this.door = this.initializeElement(this.door, biome+'_door1', 0, 218);
        this.window = this.initializeElement(this.window, biome+'_window1', 424, 244);
        this.decor = this.initializeElement(this.decor, biome+'_decor1', 0, 50);
        this.unlocked = 1;
        scene.add.existing(this);
    }


    setWall(key: string) {
        this.wall.setTexture(key, 0);
        this.wall.visible = true;
        this.updateUnlocked(2);
    }

    setRoof(key: string): boolean {
        this.updateUnlocked(3);
        return this.updateElementIfUnlocked(this.wall, this.roof, key);
    }

    setDoor(key: string) {
        this.updateUnlocked(4);
        return this.updateElementIfUnlocked(this.roof, this.door, key);
    }

    setWindow(key: string) {
        this.updateUnlocked(5);
        return this.updateElementIfUnlocked(this.door, this.window, key);
    }

    setDecor(key: string) {
        return this.updateElementIfUnlocked(this.window, this.decor, key);
    }

    initializeElement(element: Phaser.GameObjects.Sprite, key: string, x: number, y: number) : Phaser.GameObjects.Sprite {
        element = this.scene.add.sprite(x, y, key);
        element.visible = false;
        element.setOrigin(0, 0);
        this.add(element);

        return element;
    }
    updateElementIfUnlocked(decider: Phaser.GameObjects.Sprite, element: Phaser.GameObjects.Sprite, key: string) {
        if (decider.visible) {
            element.setTexture(key, 0);
            element.visible = true;
            return true;
        }
        else {
            return false;
        }
    }

    updateUnlocked(val: number){
        if(val > this.unlocked){
            this.unlocked = val;
        }
    }

}