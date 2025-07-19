
class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('chicken', 'assets/chicken.png');
    this.load.image('car', 'assets/car.png');
    this.load.audio('jump', 'assets/jump.mp3');
    this.load.audio('hit', 'assets/hit.mp3');
  }

  create() {
    this.score = 0;
    this.bestScore = localStorage.getItem('bestChicken') || 0;
    this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });

    this.chicken = this.physics.add.sprite(200, 550, 'chicken').setScale(0.2);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.cars = this.physics.add.group();
    this.time.addEvent({ delay: 1000, callback: this.spawnCar, callbackScope: this, loop: true });

    this.physics.add.collider(this.chicken, this.cars, this.hitCar, null, this);

    this.jumpSound = this.sound.add('jump');
    this.hitSound = this.sound.add('hit');

    this.input.on('pointerup', pointer => {
      if (pointer.y < this.chicken.y) {
        this.jumpSound.play();
        this.chicken.y -= 50;
        this.updateScore();
      }
    });
  }

  update() {
    if (this.cursors.up.isDown) {
      this.chicken.y -= 5;
      this.updateScore();
      this.jumpSound.play();
    }
    if (this.cursors.left.isDown) this.chicken.x -= 5;
    if (this.cursors.right.isDown) this.chicken.x += 5;
    if (this.cursors.down.isDown) this.chicken.y += 5;
  }

  updateScore() {
    this.score++;
    this.scoreText.setText('Score: ' + this.score);
  }

  spawnCar() {
    const x = Phaser.Math.Between(50, 350);
    const car = this.cars.create(x, 0, 'car').setScale(0.1);
    car.setVelocityY(100 + Math.random() * 100);
  }

  hitCar() {
    this.hitSound.play();
    if (this.score > this.bestScore) {
      localStorage.setItem('bestChicken', this.score);
    }
    this.scene.restart();
  }
}

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: '#222',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: MainScene
};

new Phaser.Game(config);
