const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80)*(canvas.width/80)
}

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

class particle {
    constructor(x,y,directionX,directionY, size, color)
    {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        //start drawing the particles using canvas variable defined above,
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.size, 0, Math.PI*2, false);
        ctx.fillstyle = '#FFFFFF';
        ctx.fill();
    }

    update() {
        //if particle is in the range of the canvas,
        //if not revert its direction
        if(this.x > canvas.width || this.x<0)
        {
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y <0)
        {
            this.directionY = -this.directionY;
        }

        //check for the collision detection
        let dx = mouse.x - this.x;          // difference b/w mouse and current partticle position x cordinate
        let dy = mouse.y - this.y;          // difference b/w mouse and current particle position y cordinate
        let distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < mouse.radius + this.size)
        {
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10)
            {
                this.x +=10;
            }
            if(mouse.x>this.x && this.x > this.size *10)
            {
                this.x -=10;
            }
            if(mouse.y < this.y && this.y < canvas.height-this.size*10)
            {
                this.y +=10;
            }
            if(mouse.y > this.y && this.y > this.size*10)
            {
                this.y -=10;
            }
        }
        //move other particles that are not colliding
        this.x +=this.directionX;
        this.y +=this.directionY;
        //draw particles
        this.draw();
    }

}
//create particle array
function init()
{
    particlesArray = [];
    //declaring the number of particles in the canvas
    let numberOfParticles = (canvas.height*canvas.width) / 9000;

    for(let i=0;i<numberOfParticles*2;i++)
    {
        let size = (Math.random()*5)+1;
        let x = (Math.random()*((innerWidth - size*2) - (size*2))+size*2);
        let y = (Math.random()*((innerHeight - size*2) - (size*2))+size*2);
        let directionX = (Math.random()*5)-2.5;
        let directionY = (Math.random()*5)-2.5;
        let color = '#FFFFFF';

        particlesArray.push(new particle(x,y, directionX, directionY, size, color));

    }
}

//check if particles are close enough to connect
function connect(){
    let opacityValue =1;
    for(let a = 0; a<particlesArray.length;a++)
    {
       for(let b=a; b< particlesArray.length; b++)
       {
            let distance = ((particlesArray[a].x - particlesArray[b].x)*(particlesArray[a].x - particlesArray[b].x))+((particlesArray[a].y - particlesArray[b].y)* 
            (particlesArray[a].y - particlesArray[b].y));
            if(distance<(canvas.width/7)*(canvas.height/7))
            {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(192,192,192,' + opacityValue+ ')';
                ctx.lineWidth =1;
                ctx. beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x,particlesArray[b].y);
                ctx.stroke();
            }
       }
    }
}

//animation loop
function animate()
{
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for(let i=0;i<particlesArray.length; i++)
    {
        particlesArray[i].update();
    }
    connect();
}

//resize event
window.addEventListener('resize',
    function()
    {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80)* (canvas.width/80));
        init();
    }
)

//mouse out event listner
window.addEventListener('mouseout',
    function()
    {
        mouse.x = undefined;
        mouse.y = undefined;
    }
)

init();
animate();