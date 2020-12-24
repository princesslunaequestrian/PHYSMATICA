import React from 'react'
import Pendulum from './Components/Pendulum'
import Interface from './Components/Interface'
import styles from './Components/Styles'


class App extends React.Component
{

	constructor(props)
	{

		super(props);
		
		this.state = 
		{
            animated: false,
            mass: 1,
			stif: 1,
			pushed: false
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

			case "startstop":
				this.setState((state) => ({animated: !state.animated}));
				break;

			case "push":
				value === 1
				? this.setState(() => ({pushed: true}))
				: this.setState(() => ({pushed: false}));
				break;

			default:
				break;
		}
		
	}

	componentDidUpdate()
	{
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
