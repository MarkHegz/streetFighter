window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 1.

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 150,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle : {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run : {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump : {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall : {
            imageSrc:'./img/samuraiMack/Fall.png',
            framesMax : 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
        x: 100,
        y: 50,
        },
        width: 150,
        height: 50
    }
})


const enemy = new Fighter({
    position: {
    x: 800,
    y: 0,
    },
    velocity: {
    x: 0,
    y: 0
    },
    colour: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 169
    },
    sprites: {
        idle : {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run : {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump : {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall : {
            imageSrc:'./img/kenji/Fall.png',
            framesMax : 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
        x: -166,
        y: 50,
        },
        width: 166,
        height: 50
    }
})
    


console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed : false
    },
    w: {
        presssed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}


decreaseTimer()

    let spawnBuffer = 500
    let fps = 60
    let fpsInterval = 1000 / fps
    let msPrev = window.performance.now()

function animate(){
    window.requestAnimationFrame(animate)

    const msNow = window.performance.now()
    const elapsed = msNow - msPrev
    if (elapsed < 16.66)
    return

    msPrev = msNow - (elapsed % 16.66) // 3.34

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
// player movement

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -7.5
player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 7.5
player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -7.5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 7.5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
        // jumping
        if (enemy.velocity.y < 0) {
            enemy.switchSprite('jump')
        } else if (enemy.velocity.y > 0) {
            enemy.switchSprite('fall')
        }

    // detect collision & enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === 4
        ) {
            enemy.takeHit()
            player.isAttacking = false
            gsap.to('#enemyHealth', {
                width: enemy.health + '%'
            })
        }

        // if player misses
        if (player.isAttacking && player.framesCurrent === 4) {
            player.isAttacking = false
        }
        // where player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 2
        ) {
            player.takeHit()
            enemy.isAttacking = false
            gsap.to('#playerHealth', {
                width: player.health + '%'
            })
            }

            // if enemy misses
            if (enemy.isAttacking && enemy.framesCurrent === 2) {
                enemy.isAttacking = false
            }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (Event) => {
    if(!player.dead) {

    
    switch (Event.key) {
        case 'd':
            player.lastKey = 'd'
            keys.d.pressed = true
            break
        case 'a':
            player.lastKey = 'a'
            keys.a.pressed = true
            break
        case 'w':
            player.velocity.y = -21
            break
        case ' ':
            player.attack()
            break
    }
}
    if(!enemy.dead) {
    switch(Event.key) {
        case 'ArrowRight':
            enemy.lastKey = 'ArrowRight'
            keys.ArrowRight.pressed = true
            break
        case 'ArrowLeft':
            enemy.lastKey = 'ArrowLeft'
            keys.ArrowLeft.pressed = true
            break
        case 'ArrowUp':
            enemy.velocity.y = -21
            break
        case 'ArrowDown':
            enemy.attack()
        break
    }
}
})

window.addEventListener('keyup', (Event) => {
    switch (Event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }

    // enemy keys
    switch (Event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})
