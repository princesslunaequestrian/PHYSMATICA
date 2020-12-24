import React from 'react'

import styles from './Styles'


class Interface extends React.Component
{

    constructor(props)
    {

        super(props);

        this.onParametersUpdate = this.onParametersUpdate.bind(this);
        this.onPush = this.onPush.bind(this);
        this.onRelease = this.onRelease.bind(this);

    }

    componentDidUpdate()
    {

    }

    onParametersUpdate(e)
    {
        switch (e.target.className)
        {
            case "massInput":
                this.props.handleInterfaceUpdate("mass", parseFloat(e.target.value));
                break;

            case "stifInput":
                this.props.handleInterfaceUpdate("stif", parseFloat(e.target.value));
                break;

            case "startstop":
                this.props.handleInterfaceUpdate("startstop", 0);
                break;

            default:
                break;
        }

    }

    onPush()
    {
        this.props.handleInterfaceUpdate("push", 1);
    }

    onRelease()
    {
        this.props.handleInterfaceUpdate("push", 0);
    }

    render()
    {
        return (
            <div>
            <li style={styles.li}>

                <strong style={styles.strong}>Масса, кг: </strong>
                <input
                    className="massInput"
                    type="number"
                    style={styles.inp}
                    onChange={this.onParametersUpdate}
                    value={this.props.params.mass.toString()}
                    />

                <strong style={styles.strong}>Жесткость, Н/м: </strong>
                <input
                    className="stifInput"
                    type="number"
                    style={styles.inp}
                    onChange={this.onParametersUpdate}
                    value={this.props.params.stif.toString()}
                    />

                <button
                    className="startstop"
                    onClick={this.onParametersUpdate}
                    style={styles.btn}>
                    
                    {this.props.params.animated? 'СТОП' : 'СТАРТ'}

                </button>

                <button
                    className="push"
                    onMouseDown={this.onPush}
                    onMouseUp={this.onRelease}
                    style={styles.btn}
                >
                    ПОДНЯТЬ
                </button>



            </li>
            </div>
        );
    }
}



export default Interface;