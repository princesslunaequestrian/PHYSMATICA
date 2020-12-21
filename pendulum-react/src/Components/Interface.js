import React from 'react'

import styles from './Styles'


class Interface extends React.Component
{

    constructor(props)
    {

        super(props);

        this.onInterfaceUpdate = this.onInterfaceUpdate.bind(this);

    }

    componentDidUpdate()
    {
        console.log('interface updated');
    }

    onInterfaceUpdate(e)
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

            case "reset":
                this.props.handleInterfaceUpdate("reset", 0);
                break;

            default:
                break;
        }

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
                    onChange={this.onInterfaceUpdate}
                    value={this.props.params.mass.toString()}
                    />

                <strong style={styles.strong}>Жесткость, Н/м: </strong>
                <input
                    className="stifInput"
                    type="number"
                    style={styles.inp}
                    onChange={this.onInterfaceUpdate}
                    value={this.props.params.stif.toString()}
                    />

                <button
                    className="startstop"
                    onClick={this.onInterfaceUpdate}
                    style={styles.btn}>
                    
                    {this.props.params.animated? 'СТОП' : 'СТАРТ'}

                </button>

                <button
                    className="reset"
                    onClick={this.onInterfaceUpdate}
                    style={styles.btn}
                    hidden={this.props.params.reset? true : false}>
                    СБРОСИТЬ
                </button>

            </li>
            </div>
        );
    }
}



export default Interface;