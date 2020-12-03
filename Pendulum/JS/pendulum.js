console.log("start");

// Initialising ineractive objects
//var ball = document.getElementById('ball');
var spring = document.getElementById('spring-img');
var springheight = parseFloat(spring.getAttribute('height', 30)); //getting standart height of the spring
var springdiv = document.getElementById('spring') //spring container resizes also
var button = document.getElementById('start-button');
var mass = document.getElementById('mass-input');
var stif = document.getElementById('stif-input');

//console.log(spring);
//console.log(parseFloat(spring.getAttribute('height')));
//console.log(springdiv);

//global animation tracker
let anim = false;

//amplitude may be changed
A = 0.25;

//default period, may be ditched
T = 1000;




button.onclick = function() {

    if (!anim) {

        anim = true;


        //Parsing user input
        var M = parseFloat(mass.value);
        var K = parseFloat(stif.value);

        //console.log(K);
        //console.log(typeof(K));


        //Checking for <0 or NaNs
        if (M <= 0 || M != M|| K <= 0 || K != K) { //For some reason Number.isNaN is not working, spitting "Number.isNan is not a function"

            //Breaking out
            console.log("User durachok");
            alert("Масса или коэффициент жёсткости должны быть больше 0!")
            anim = false;
            return;
        }

        button.textContent = 'СТОП';

        //Calculating period
        T = 2*Math.PI*Math.sqrt(M/K)*1000;
        console.log("Period: " + String(T) + " sec");


        startTime = Date.now();

        //console.log('Starting animation at '+Date.now().toString());

        //Running timer
        var timer = setInterval(function() {
            
            timePassed = Date.now() - startTime;

            animate(timePassed);

            if (!anim) {

                //Resetting everything back as the animation has been stopped by the user
                clearInterval(timer);
                console.log('Animation stopped');
                spring.setAttribute('height', springheight);
                springdiv.setAttribute('height', springheight);
                button.textContent = 'СТАРТ';
            }

        }, 20)

        

    }

    else {
        console.log('Stopping animation');

        anim = false;
    }

    return;

}



function animate(time) {

    //Calculating phase and the coefficient of spring scaling (contraction/strtching)

    let phase = time*2*Math.PI/T;

    let coef = (1 - A*Math.sin(phase));

    newheight = coef*springheight;

    spring.setAttribute('height', newheight);

    springdiv.setAttribute('height', newheight);

    
}