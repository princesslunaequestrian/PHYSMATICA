import React, { createRef } from 'react'
import styles from './Styles'

class Pendulum extends React.Component
{   
    constructor(props)
    {
        super(props);

        this.canvas = createRef();
    }

    componentDidMount()
    {
        this.context = this.canvas.current.getContext("2d");
        console.log(this.context);
        this.context.strokeStyle = 'black';
        this.context.strokeWidth = 10;
        this.context.moveTo(0, 0);
        this.context.beginPath();
        this.context.lineTo(600, 600);
        this.context.stroke();
    }

    updateCanvas(params)
    {

    }

    tick()
    {
        this.updateCanvas(this.props.params);

        requestAnimationFrame(this.tick);
    }

    render() {
        console.log(this.props.params.reset.toString());
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