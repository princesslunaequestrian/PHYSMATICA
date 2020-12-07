console.log("start");

// Initialising ineractive objects

var canv = document.getElementById('canvas');

    canv.width = 375;
    canv.height = 600;

var ctx = canv.getContext('2d');

var button = document.getElementById('start-button');

var mass = document.getElementById('mass-input');

var stif = document.getElementById('stif-input');

var anim = false; //global animation tracker
var RAF = null;
var scale = 100;

var N = 13; //Number of nodes

//Physics

var G = 9.8,
    M = 1,
    K = 1,
    F = M*G,
    a = F/M,
    v = 0,
    Eq = M*G/K,
    delta = 0;


//Creating spring nodes
var pen_length = 300;

function Nodes(length)
{
    var n = [];

    n.push([canv.width/2, 75]);
    n.push([canv.width/2, 75+10]);

    for (let i = 0; i < N; i++)
    {
        var nx = i % 2 == 0 ? canv.width/2 + 35 : canv.width/2 - 35;
        var ny = 75+10+10/300*length + i*20/300*length;
        n.push([nx, ny]);
    }
    
    var ly = n[n.length-1][1];

    n.push([canv.width/2, ly+10]);
    n.push([canv.width/2, ly+20]);
    n.push([canv.width/2, ly+50]);

    return n;

}

//Drawing pendulum stand

var nodes = Nodes(pen_length);

function drawStand(nodes)
{
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canv.width, canv.height);

    ctx.fillStyle = 'brown';
    ctx.fillRect(0, 0, 375, 75);

    ctx.fillStyle = '#ED930C';
    ctx.fillRect(0, 75, 50, canv.height - 75);
    ctx.fillRect(canv.width-50, 75, 50, canv.height - 75);

    for (let i = 0; i < nodes.length-2; i++)
    {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.lineTo(nodes[i][0], nodes[i][1]);
        ctx.lineTo(nodes[i+1][0], nodes[i+1][1]);
        ctx.stroke();
        console.log('drawing line');
    }
    
    ctx.fillStyle = 'magenta';
    ax = canv.width/2;
    ay = nodes[nodes.length-1][1];
    ctx.moveTo(ax, ay);
    ctx.arc(ax, ay, 30, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();
}

drawStand(nodes);


function step(time)
{
    dt = (Date.now() - time)/100000000000000;
    F = -delta*K/scale + M*G;
    a = F/M;
    v += a*dt;
    delta += v*dt*scale;
    if (delta <= -pen_length)
    {
        alert('Вы уничтожили пружину! Теперь покупайте новую!');
        anim = false;
    }

    if (anim)
    {
        time = Date.now()
        console.log('-------');
        console.log(dt);
        console.log(F);
        console.log(a);
        console.log(v);
        console.log(delta);
        console.log('-------');

        drawStand(Nodes(pen_length+delta));
        var RAF = requestAnimationFrame(step);
    }
    else
    {
        console.log('stopping animation');
        drawStand(Nodes(pen_length));
        button.textContent = 'СТАРТ';
        a = 0;
        v = 0;
        F = M*G;
        delta = 0;
    }
}

function onClick()
{

    if (anim)
    {
        cancelAnimationFrame(RAF);
        anim = false;
    }

    else
    {
        console.log('starting animation');

        anim = true;

        button.textContent = 'СТОП';

        var startTime = Date.now();

        M = parseFloat(mass.value);
        K = parseFloat(stif.value);

        if (M <= 0 || M != M|| K <= 0 || K != K)
        { 
            //For some reason Number.isNaN is not working,
            //spitting "Number.isNan is not a function"

            //Breaking out
            console.log("User durachok");
            alert("Масса или коэффициент жёсткости должны быть больше 0!")

            anim = false;

            button.textContent = 'СТАРТ';

            return;
        }
        
        step(startTime);

    }
}

function onChange()
{
    M = parseFloat(mass.value);
    K = parseFloat(stif.value);
    Eq = M*G/K;
    if (!anim)
    {
        drawStand(Nodes(pen_length));
    }
}





