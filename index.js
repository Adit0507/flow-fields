const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

console.log(ctx)
// ctx.fillStyle = 'white'
ctx.strokeStyle = 'red'
ctx.lineWidth = 1

class Particle {
    constructor(effect) {
        this.effect = effect
        this.x = Math.floor(Math.random() * this.effect.width)
        this.y = Math.floor(Math.random() * this.effect.height)
        this.speedX
        this.speedY
        this.speedModifier = Math.floor(Math.random() * 4 + 2)
        this.history = [{ x: this.x, y: this.y }]
        this.maxLength = Math.floor(Math.random() * 200 + 10)
        this.angle = 0
        this.timer = this.maxLength * 2
        this.colors = ["#F3B95F", "#4c026b", "#0B60B0", "#720455", "#D04848"]
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    }

    draw(context) {
        // context.fillRect(this.x, this.y, 10, 10)
        context.beginPath()
        context.moveTo(this.history[0].x, this.history[0].y)
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y)
        }
        context.strokeStyle = this.color
        context.stroke()
    }
    update() {
        // reducing the timer at each animation
        this.timer--
        if (this.timer >= 1) {
            let x = Math.floor(this.x / this.effect.cellSize)
            let y = Math.floor(this.y / this.effect.cellSize)
            let index = y * this.effect.cols + x
            this.angle = this.effect.flowField[index]

            this.speedX = Math.cos(this.angle)
            this.speedY = Math.sin(this.angle)
            this.x += this.speedX * this.speedModifier
            this.y += this.speedY * this.speedModifier

            this.history.push({ x: this.x, y: this.y })
            if (this.history.length > this.maxLength) {
                this.history.shift()
            }
        } else if (this.history.length > 1) {
            this.history.shift()
        } else {
            this.reset()
        }
    }

    reset() {
        this.x = Math.floor(Math.random() * this.effect.width)
        this.y = Math.floor(Math.random() * this.effect.height)
        this.history = [{ x: this.x, y: this.y }]
        this.timer = this.maxLength * 2
    }
}

class Effect {
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.particles = []
        this.numberOfParticles = 2000
        this.cellSize = 25
        this.rows
        this.cols
        this.flowField = []
        this.curve = 7
        this.zoom = 0.05
        this.debug = false
        this.init()

        window.addEventListener("keydown", e => {
            if (e.key === 'd') this.debug = !this.debug
        })

        window.addEventListener("resize", e => {
            this.resize(e.target.innerWidth, e.target.innerHeight)
        })
    }

    init() {
        // create flow field
        this.rows = Math.floor(this.height / this.cellSize)
        this.cols = Math.floor(this.width / this.cellSize)
        this.flowField = []
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let angle = this.curve + (Math.cos(x * this.zoom) + Math.sin(y + this.zoom))
                this.flowField.push(angle)
            }
        }

        // create particles
        this.particles = []
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this))
        }
    }

    drawGrid(context) {
        context.save()
        context.strokeStyle = 'white'
        context.lineWidth = 0.3
        for (let i = 0; i < this.cols; i++) {
            context.beginPath()
            context.moveTo(this.cellSize * i, 0)
            context.lineTo(this.cellSize * i, this.height)
            // context.stroke()
        }
        for (let r = 0; r < this.rows; r++) {
            context.beginPath()
            context.moveTo(0, this.cellSize * r)
            context.lineTo(this.width, this.cellSize * r)
            context.stroke()
        }
        context.restore()
    }

    resize(width, height) {
        this.canvas.width = width
        this.canvas.height = height
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.init()
    }

    render(context) {
        if (this.debug) this.drawGrid(context)
        this.particles.forEach(particle => {
            particle.draw(context)
            particle.update()
        })
    }
}

const effect = new Effect(canvas)

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.render(ctx)
    requestAnimationFrame(animate)
}
animate()

// ctx.beginPath()
// ctx.moveTo(100, 400)
// ctx.lineTo(200, 100)
// ctx.stroke()