import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Route, Switch, Redirect} from 'react-router-dom'
import { authorizeUser, getMovies, findMovie, getRatings, postRating, removeRating, postFavorite, getFavorites} from './APICalls'

import Header from './Header/Header'
import CardSection from './CardSection/CardSection'
import DetailsPage from './DetailsPage/DetailsPage'
import Login from './Login/Login'


import './App-resources/App.css';
import './assets/tomato.jpg'

class App extends Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      error: '',
      user:{},
      userRatings: [],
      favorites: []
    }
    
    this.getMovies = getMovies
    this.authorizeUser = authorizeUser
    this.findMovie = findMovie
    this.postRating = postRating
    this.getRatings = getRatings
    this.removeRating = removeRating
    this.postFavorite = postFavorite
  }

  componentDidMount = async () => {
    try {
      const allMovies = await this.getMovies()
      this.setState({movies: allMovies.movies})
    } catch (error) {
      this.setState({ error: 'An error has occurred getting movies!'}) 
    }
  }

  getUser = async (username, password) => {
    const data = await this.authorizeUser(username, password).catch(() => {
      this.setState({ error: 'Please check your login information' })
    })

    if (data) {
      this.setState({ user: data.user })
      this.getRatings(this.state.user.id)
      await this.findFavorites()
    }
  }    

  postUserRating = async (userId, movieId, userRating) => {
    await this.postRating(userId, movieId, userRating)
      .then(data => this.setState({ userRatings: [...this.state.userRatings, data.rating] }))
      .catch(error => {
        this.setState({ error: 'Error posting ratings' })
      })
  }

  deleteRating = async (movieId, ratingId) => {
    await removeRating(this.state.user.id, ratingId)
    const updatedRatings = this.state.userRatings.filter(movie => movie.movie_id !== movieId)
    this.setState({ userRatings: updatedRatings })
  }

  logoutUser = () => {
    this.setState({ user: {}, userRatings: [], favorites: [] })
    return <Redirect to='/' />
  }

  toggleFavorite = async (movieId) => {
    if (this.state.user.name) {
      try {
        await this.postFavorite(movieId)
        await this.findFavorites()
      } catch (error) {
        this.setState({ error: 'Error posting favorites' })
      }
    }
  }

  findFavorites = async () => {
    try {
      const allFavs = await getFavorites() 
      this.setState({favorites: allFavs})
    } catch(error) {
      this.setState({ error: 'Error posting favorites' })
    }
  }

  filterFavs = () => {
    return this.state.movies.reduce((favoriteMovies, movie) => {
      this.state.favorites.forEach(favoritedMovieId => {
        if (favoritedMovieId === movie.id) 
          favoriteMovies.push(movie)
        })
      return favoriteMovies
    },[])
  }

  render() {
    return (
      <main className="App">
        <Header user={this.state.user} resetter={this.logoutUser} />
        <Switch>
          <Route 
            exact path='/' 
            render={() => {
              return (
                <CardSection 
                  movies={this.state.movies} 
                  userRatings={this.state.userRatings}
                  favorites={this.state.favorites}
                  toggleFavorite={this.toggleFavorite}
                  userInfo={this.state.user}
                  favoriteMovies={this.findFavs}
                />
              )
            }}
          />
          <Route
            exact path='/favorites'
            render={() => {
              return (
                <CardSection
                  filterFavorites={this.filterFavs}
                  allMovies={this.state.movies}
                  userRatings={this.state.userRatings}
                  favorites={this.state.favorites}
                  toggleFavorite={this.toggleFavorite}
                  userInfo={this.state.user}
                  movies={this.filterFavs()}
                />
              )
            }}
          />
          <Route 
            exact path='/login' 
            render={() => {
              return this.state.user.name ? <Redirect to='/'/> : 
                <Login 
                  getUser={this.getUser} 
                  error={this.state.error} 
                  user={this.state.user}
                />
            }} 
          />
          <Route 
            exact path='/movies/:id' 
            render={({ match }) => {
              return (
                <DetailsPage 
                  movieId={match.params.id}
                  userId={this.state.user.id} 
                  userName={this.state.user.name}
                  deleteRating={this.deleteRating} 
                  submitRating={this.postUserRating} 
                  error={this.state.error}
                  userRatings={this.state.userRatings}
                  favorites={this.state.favorites}
                  toggleFavorite={this.toggleFavorite}
                />
              )
            }}
          />
        </Switch>
      </main>
    )
  };
}

App.propTypes = {
  name: PropTypes.string.isRequired,
  movies: PropTypes.array.isRequired,
  error: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  userRatings: PropTypes.array.isRequired,
  favorites: PropTypes.array.isRequired,
}

App.defaultProps = {
  name: '',
  movies: [],
  error: '',
  user: {},
  userRatings: [],
  favorites: []
}

export default App;
