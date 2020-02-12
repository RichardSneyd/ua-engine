export default class Jukebox extends Phaser.GameObjects.Sprite {
    songs: string[] = [];
    songIndex: number = 0;
    song: Phaser.Sound.BaseSound;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, songs: string[]){
        super(scene, x, y, texture, 0);
        this.songs = songs;
        this.setInteractive();
        this.scene.add.existing(this);
        this.setOrigin(0.5, 1);
        this.on('pointerdown', this.down.bind(this));
        this.changeSongIndex(0);
    }

    down(){
        if(this.scene.input.activePointer.x < this.getLeftCenter().x + 100){
            this.goBack();
        }
        else if(this.scene.input.activePointer.x < this.getRightCenter().x - 400) {
            this.changeSong();
        }
        else {
            this.goForward();
        }
    }

    goBack(){
        if(this.songIndex == 0){
            this.songIndex = this.songs.length - 1;
        }
        else {
            this.songIndex--;
        }
        this.changeSongIndex(this.songIndex);
    }

    goForward(){
        if(this.songIndex == this.songs.length - 1){
            this.songIndex = 0;
        }
        else {
            this.songIndex++;
        }
        this.changeSongIndex(this.songIndex);
    }

    changeSongIndex(index: number){
        this.setFrame(index);
    }

    changeSong(){
        if(this.song !== null && this.song !== undefined){
            this.song.stop();
            this.song.destroy();
        }
        this.song = this.scene.sound.add(this.songs[this.songIndex]);
        this.song.play();
    }
}