import React from 'react'
import Pendulum from './Components/Pendulum'
import Interface from './Components/Interface'
import styles from './Components/Styles'


class App extends React.Component
{

	constructor(props)
	{

		super(props);

		this.initialState = 
        {
            animated: false,
            mass: 1,
			stif: 1,
			reset: true
		};
		
		this.state = 
		{
            animated: false,
            mass: 1,
			stif: 1,
			reset: true
		};

		this.handleInterfaceUpdate = this.handleInterfaceUpdate.bind(this);

	}

	handleInterfaceUpdate(source, value)
	{
		this.setState((state) => ({reset: false}))
		switch (source)
		{
			case "mass":
				this.setState((state) => ({mass: value}));
				break;

			case "stif":
				this.setState((state) => ({stif: value}));
				break;

			case "button":
				this.setState((state) => ({animated: !state.animated}));
				break;

			case "reset":
				this.setState((state) => ({reset: true}));
				
				break;

			default:
				break;
		}

		console.log(this.state);
		
	}

	render()
	{

		return (
		<div style={styles.div}>
		

			<Interface handleInterfaceUpdate={this.handleInterfaceUpdate} params={this.state}></Interface>

			<Pendulum params={this.state}></Pendulum>

	

		</div>
		);

	}
}

export default App;
