// setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
//  ...............................................................................................................

// ! dimensions of canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//........................................................................................................


console.log(ctx);
/****************************************************************************************************** */

// ! gradient method color effect (method 2)
//! isme changes kiye toh neeche bhi same changes kariyo
/* isme hum ek diagonal bana dete hai fir uss hisab se color hota hai
   sabse uooer , beech me , aur fir akhir me kona hoga wo choose karte hai
    */

const gradient = ctx.createLinearGradient(0,0,canvas.width, canvas.height);
gradient.addColorStop(0, 'green');
gradient.addColorStop(0.5, 'pink');
gradient.addColorStop(1, 'blue');
ctx.fillStyle = gradient;


//************************************************************************************************ */

// !particles ke beech ki line aur border ka color dne ke liye
ctx.strokeStyle = 'white';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ! border ki width ke liye(blur sa aa rah tha iss se)
// ctx.lineWidth =11
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

class Particle {
    constructor(effect){
        this.effect = effect;

        // ! radius of our circles
        // this.radius = Math.random() * 20 + 1;
        this.radius = Math.floor(Math.random() * 11 + 1);
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);


             // ! isse particles bilkul ek jagah se nikalna start hote hai
        // this.x = this.radius + Math.random() * (50% - this.radius * 2);
        // this.y = this.radius + Math.random() * (50% - this.radius * 2);

         // ! speed
        this.vx = Math.random() * 2 - 0.5;
        this.vy = Math.random() * 2 - 0.5;
        this.pushX = 0;
        this.pushY = 0;
        this.friction = 0.95;
    }


    // ! how particle will look
    draw(context){

        // !  want to create a shape in js
        context.beginPath();

        // ! defines the path 
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);


        // ! custom color ke liye 
        // context.fillStyle="hsl("+this.x *0.5+",100%,50%)" //! isse x -axis jesse jesse shift h gaya wese color change hoga
        // context.fillStyle="hsl("+this.x*10+",100%,50%)" //! sparkling effect bana raha hai
        // context.fillStyle="hsl("+this.x*0.75+",100%,50%)" //! bahut soothing sa solor effect hai


        context.fill();

        // ! filling the shape and highlight it (default black hai uper se cgange kar lena)
        // context.stroke();



    }
    update(){
        if (this.effect.mouse.pressed){
            
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const distance = Math.hypot(dx, dy);
            const force = (this.effect.mouse.radius / distance);
            if (distance < this.effect.mouse.radius){
                const angle = Math.atan2(dy, dx);
                this.pushX += Math.cos(angle) * force;
                this.pushY += Math.sin(angle) * force;
            }
        }

        this.x += (this.pushX *= this.friction) + this.vx;
        this.y += (this.pushY *= this.friction) + this.vy;

        if (this.x < this.radius){
            this.x = this.radius;
        
            this.vx *= -1;
        } else if (this.x > this.effect.width - this.radius){
            this.x = this.effect.width - this.radius;
   
            this.vx *= -1;
        }
        if (this.y < this.radius){
            this.y = this.radius;

            this.vy *= -1;
        } else if (this.y > this.effect.height - this.radius){
            this.y = this.effect.height - this.radius;
           
            this.vy *= -1;
        }
    }
    reset(){
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    }
}

class Effect {
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];


        // ! no particles will be created here
        this.numberOfParticles = 500;




        this.createParticles();

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            //! mouse ka radius
            radius: 210
        }

        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
        });
        window.addEventListener('mousemove', e => {
            if (this.mouse.pressed){
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
        });
        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        });
    }
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this));
        }
    }
    handleParticles(context){
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }
    connectParticles(context){
        // ! connecting the particles 

        const maxDistance = 50;//! isse particles ke attach hone pe kya farak padega yee pata chalega

        for (let a = 0; a < this.particles.length; a++){
            for (let b = a; b < this.particles.length; b++){
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance){
                    context.save();
                    const opacity = 1 - (distance/maxDistance);//! isse ke karan smooth tareke se particle line ban rahi hai
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
    resize(width, height){

        //! bock ka size
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        const gradient = this.context.createLinearGradient(0,0, width, height);
        // ! isme changes kiye toh upper bhi kar diyo
        gradient.addColorStop(0, 'green');
        gradient.addColorStop(0.5, 'pink');
        gradient.addColorStop(1, 'blue');
        this.context.fillStyle = gradient;
        this.context.strokeStyle = 'white';
        this.particles.forEach(particle => {
            particle.reset();
        });
    }
}
const effect = new Effect(canvas, ctx);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();