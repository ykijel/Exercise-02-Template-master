class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        //add ball
        this.ball = this.physics.add.sprite(width/2, height - height/10, 'ball')
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.setDamping(true).setDrag(0.5)

        //add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2,width - wallA.width/2))
        wallA.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2,width - wallB.width/2))
        wallB.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])
        
        //one-way wall
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2 , width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

            // Add a shot counter
            this.shotCounter = 0;

            // Add a score ("hole-in") counter
            this.score = 0;

            // Add a variable to count successful shots
            this.successfulShots = 0;

            // Create text objects to display the counters
            this.shotCounterText = this.add.text(20, 20, 'Shots: 0', { fontSize: '24px', fill: '#fff' });
            this.scoreText = this.add.text(20, 50, 'Hole-in: 0', { fontSize: '24px', fill: '#fff' });
            this.successfulShotText = this.add.text(20, 80, 'Success: 0%', { fontSize: '24px', fill: '#fff' });

        //variables for velocity
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        this.input.on('pointerdown', (pointer)=>{
            const velocityY = Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX);
            const relativeX = pointer.x - this.ball.x;
            const velocityX = relativeX * this.SHOT_VELOCITY_X / (width / 2);
            this.shotCounter++;
            this.shotCounterText.setText('Shots: ' + this.shotCounter);
    
            this.ball.body.setVelocityX(velocityX);
            this.ball.body.setVelocityY(velocityY);
        })

        //colliders
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.score++;
            this.successfulShots++;
            // Update the score text
            this.scoreText.setText('Hole-in: ' + this.score);
        
            // Calculate the successful shot percentage
            const successPercentage = (this.successfulShots / this.shotCounter) * 100;
        
            // Update the successful shot percentage text
            this.successfulShotText.setText('Success: ' + successPercentage.toFixed(2) + '%');
            this.ball.x = width/2;
            this.ball.y = height - height/10;
            
        })
        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        
    }
}