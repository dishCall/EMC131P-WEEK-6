var player;
var enemy;
var cursors;
var shoot;
var score = 0;
var scoreText;
var playerTime = 0;
var minutes = 0;
var seconds = 0;
var playerTimeText;
var bullets;
var lastFired = 0;
var bulletCooldown = 200;
class level1 extends Phaser.Scene{
    constructor(){
        super('level1');
    }


preload ()
{
    //change Everything about this
    this.load.image('bg', 'assets/background/bg.png');
    this.load.image('ground', 'assets/misc/platform.png');
    this.load.image('bomb', 'assets/misc/boxBomb.png');
    this.load.image('bullet', 'assets/misc/testbullet.png')
    this.load.spritesheet('dude', 'assets/spritesheet/dude.png', { frameWidth: 32, frameHeight: 48 });
}

create ()
{
    this.add.image(400, 300, 'bg');

    player = this.physics.add.sprite(100, 600, 'dude');
    player.setCollideWorldBounds(true);
    player.setGravity(0,0);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    playerTimeText = this.add.text(420, 16, 'Time: 0:00', { fontSize: '32px', fill: '#fff' });
    
    
    bullets = this.physics.add.group({
        defaultKey: {key: 'bullet'},
        maxSize: 2000,
        allowGravity: true,
        runChildUpdate: true,
        worldBounds: true,
        debug: true  
      });
      //fix enemy spawn rate
      enemy = this.physics.add.sprite(Phaser.Math.Between(0, config.width), -50, 'enemy');
      enemy.setVelocityY(100); // Set the initial velocity of the enemy to make it fall
    
      // Add an event to remove the enemy when it goes outside the world bounds
      this.physics.world.on('worldbounds', function(body) {
        if (body.gameObject === enemy && body.position.x < 0) {
          enemy.destroy();
          // Spawn a new enemy once the previous one has fallen outside the width of the game
          enemy = this.physics.add.sprite(Phaser.Math.Between(0, config.width), -50, 'enemy');
          enemy.setVelocityY(100);
        }
      }, this);

      this.physics.add.overlap(bullets, enemy, onHit, null, this);
      this.physics.add.overlap(player, enemy, bullets, collideEnemyAndBullet, null, this);
      this.physics.add.overlap(player, bullets, collideEnemyAndBullet, null, this);
}

update ()
{
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
    if (cursors.up.isDown && this.time.now > lastFired + bulletCooldown) {
        firedBullet();
        lastFired = this.time.now;
    }
   timer();
}


}

