import React, { createRef } from 'react'
import styles from './Styles'

class Pendulum extends React.Component
{   
    constructor(props)
    {
        super(props);

        this.canvas = createRef();

        this.RAF = null;

        this.tick = this.tick.bind(this);

        this.settings =
        {
            cwidth: 600,
            cheight: 720,
            seglen: 0.1
        }

        this.phys = 
        {
            G: 9.8
        }

        this.settings.barwidth = this.settings.cwidth;
        this.settings.barheight = (this.settings.cheight-this.settings.cwidth)/2;
        this.settings.footer = this.settings.barheight;
        this.settings.workarea = this.settings.cheight - this.settings.barheight - this.settings.footer;        
 
    }

    resetPhysics()
    {

        this.phys.M = this.props.params.mass;
        this.phys.K = this.props.params.stif;
        this.phys.Eq = this.phys.M*this.phys.G/this.phys.K;
        this.phys.y0 = -this.phys.Eq/2;
        this.phys.y = this.phys.Eq;   
        this.phys.v = 0;
        
        
    }

    updatePhysics(dt)
    {
        let Fm = this.phys.G*this.phys.M,
            Fk = this.phys.K*(this.phys.y0 - this.phys.y),
            Fp = this.props.params.pushed ? -Fm : 0;
            
        this.phys.a = (Fm + Fk + Fp)/this.phys.M;
        this.phys.v += this.phys.a*dt;
        let delta = this.phys.v*dt;

        this.phys.y += delta;

        console.log('debug on physics', this.phys.Eq, this.phys.y, Fm, Fk, Fp)
    }

    componentDidMount()
    {

        this.canv = this.canvas.current;
        this.ctx = this.canv.getContext("2d");
        
        this.canv.width = this.settings.cwidth;
        this.canv.height = this.settings.cheight;

        this.resetPhysics();

        this.settings.ppm = this.settings.workarea/(3*this.phys.Eq);

        this.countSegments();

        this.settings.seglen_p = this.settings.seglen*this.settings.ppm;

        this.drawScene();
        
        //console.log('debug on this', this.phys, this.settings)
    }

    componentDidUpdate()
    {
        this.resetPhysics();

        this.settings.ppm = this.settings.workarea/(3*this.phys.Eq);

        this.countSegments();

        this.settings.seglen_p = this.settings.seglen*this.settings.ppm;

        this.drawScene();

        //console.log('debug on this', this.phys, this.settings);

        if (!!this.props.params.animated)
        {
            this.startAnimation();
            return;
        }
        this.stopAnimation();
        return;

        
    }

    countSegments()
    {
        var segn = Math.round(2*this.phys.Eq*2/Math.sqrt(2)/this.settings.seglen);
        if (segn % 2 === 0) {segn += 1};
        //console.log(segn)
        this.settings.segn = segn;
    }

    drawBar()
    {
        this.ctx.fillStyle = 'whitesmoke';
        this.ctx.strokeStyle = 'darkgrey';
        this.ctx.fillRect(0, 0, this.settings.barwidth, this.settings.barheight);
        this.ctx.strokeRect(0, 0, this.settings.barwidth, this.settings.barheight);

        let lines = 30;

        for (let i = 0; i < this.settings.barwidth/lines; i++)
        {
            this.ctx.strokeStyle = 'gray'
            this.ctx.beginPath();
            this.ctx.moveTo(i*lines, this.settings.barheight-1);
            this.ctx.lineTo((i+1)*lines, this.settings.barheight-this.settings.barheight/3);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        // let fontSize = this.settings.barheight/3
        // this.ctx.font = fontSize.toString()+"px Arial";
        // this.ctx.fillStyle = 'black';
        // this.ctx.textAlign = "center";
        // this.ctx.fillText("1 метр", this.settings.barwidth/2, 5 + fontSize);

        this.ctx.beginPath();
        this.ctx.arc(this.settings.barwidth/2, this.settings.barheight, this.settings.barwidth/100, 0, Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    costructNodes()
    {

        var sin = 2*this.phys.y / ((this.settings.segn+1)*this.settings.seglen);
        var nodes = [];

        nodes.push([this.settings.barwidth/2, this.settings.barheight]);

        nodes.push([
            this.settings.barwidth/2 - this.settings.seglen_p*Math.sqrt(1-sin**2)/2,
            this.settings.barheight + this.settings.seglen_p*sin/2])

        for (let i = 0; i < this.settings.segn; i++)
        {
            var nx =
                i % 2 === 0
                ? this.settings.barwidth/2 + this.settings.seglen_p*Math.sqrt(1-sin**2)/2
                : this.settings.barwidth/2 - this.settings.seglen_p*Math.sqrt(1-sin**2)/2;

            var ny =
                this.settings.barheight + this.settings.seglen_p*sin/2 + (i+1)*this.settings.seglen_p*sin;

            nodes.push([nx, ny]);
        }
        
        var ly = nodes[nodes.length-1][1];

        nodes.push([this.settings.barwidth/2, ly +this.settings.seglen_p*sin/2]);

        nodes.push([this.settings.barwidth/2, ly +this.settings.seglen_p*sin/2 +this.settings.seglen_p/2])

        //console.log('debug on nodes', sin)

        this.nodes = nodes;

        return nodes;
    }

    drawNodes()
    {
        var nodes = this.costructNodes();

        for (let i = 0; i < nodes.length-2; i++)
        {
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(nodes[i][0], nodes[i][1]);
            this.ctx.lineTo(nodes[i+1][0], nodes[i+1][1]);
            this.ctx.arc(nodes[i+1][0], nodes[i+1][1], 2, 0, 2*Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
            //console.log('drawing line');
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = "pink";
        this.ctx.strokeStyle = "purple";
        this.ctx.arc(nodes[nodes.length-1][0], nodes[nodes.length-1][1],this.settings.seglen_p/2, 0, 2*Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawScene()
    {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.current.width, this.canvas.current.height);
        this.drawBar();
        this.drawNodes();
    }
    
    startAnimation()
    {
        this.phys.prevTime = Date.now();
        this.RAF = requestAnimationFrame(this.tick);
    }

    stopAnimation()
    {
        cancelAnimationFrame(this.RAF);
    }

    tick(timestamp)
    {
        var dt = (Date.now() - this.phys.prevTime)/500;
        this.phys.prevTime = Date.now();
        this.updatePhysics(dt);
        this.drawScene();
        if (this.props.params.animated)
        {
            requestAnimationFrame(this.tick);
        }
        //console.log('frame');
    }

    render() {

        //return <div><text>{this.props.params.mass.toString()}</text></div>

        return (
            <div>
            <li style={styles.li}>
                <canvas
                className="canvas"
                ref={this.canvas}
                style={styles.canv}></canvas>
            </li>
            </div>
        )
    }
}

export default Pendulum