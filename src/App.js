import React, {Component} from 'react';
import './CSS/App.css';
import Header from './Header'
import CardSection from './CardSection'
import './assets/tomato.jpg'

class App extends Component {  
  constructor() {
    super();
    this.state = {
      movies: null
    }
  }

  componentDidMount() {
    fetch('https://rancid-tomatillos.herokuapp.com/api/v2/movies')
      .then(response => response.json())
      .then(movies => this.setState({ movies }))
      .then(movies => console.log(this.state))
      .catch(error => console.log('Movie not found'))
  }
  
  render() {
    return (
      <main className="App">
        <Header />
        <CardSection movies={this.state}/>              
      </main>
    )
  };
}

export default App;
