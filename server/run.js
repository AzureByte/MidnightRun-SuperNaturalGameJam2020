var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1000 },
        debug: false
      }
    },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var cursors;
var player;
var score = 0;
var scoreText;
var gameOverText;
var platforms;
var floors;
var gameOver = false;

var ticks = 0;

var game = new Phaser.Game(config);


function preload ()
{
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('floor', 'assets/floor.png');
  this.load.spritesheet('werewolf',
      'sprites/werewolf.png',
      { frameWidth: 64, frameHeight: 64 }
  );
}

function create ()
{
  //Background
  this.add.image(400,300, 'sky');

  //Floor
  floors = this.physics.add.staticGroup();
  floors.create(400,600, 'floor').setScale(2).refreshBody();

  //Platforms
  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, 'ground').setScale(1).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');


  //Player character and animations
  player = this.physics.add.sprite(400, 450, 'werewolf');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('werewolf', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'werewolf', frame: 4 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('werewolf', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });

  //Physics colliders
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(player, floors, fallDown, null, this);

  //Texts
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  gameOverText = this.add.text(230, 300, '', { fontSize: '64px', fill: '#000' });

  //Input
  cursors = this.input.keyboard.createCursorKeys();

}

function update (time, delta)
{
  ticks+=1;

  //Game Over
  if (gameOver)
  {
    return;
  }

  //Input
  if (cursors.left.isDown)
  {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
    player.setVelocityX(160);

    player.anims.play('right', true);
  }
  else
  {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down)
  {
    player.setVelocityY(-800);
  }

  //Score update
  IncreaseScoreForSurviving(time, delta);
  UpdateScoreUI();
}

function fallDown (player, floor)
{
  this.physics.pause();

  gameOverText.setText("Game Over");

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;
}

function IncreaseScoreForSurviving (time, delta) {
  score += 10;
}
function UpdateScoreUI(){
  scoreText.setText('Score: ' + score);
}
