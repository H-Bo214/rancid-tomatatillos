import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardSection from './CardSection';
import '@testing-library/jest-dom'
import App from '../App'
import { BrowserRouter, Route } from 'react-router-dom'

describe('CardSection', () => {

  
  it('render a number of cards equal to the length of the array that is being passed in', () => {

    const movies = [
        {
          "id": 1,
          "poster_path": "https://image.tmdb.org/t/p/original//sA154deR0X51EcR2lm2FfDczryg.jpg",
          "backdrop_path": "https://image.tmdb.org/t/p/original//juzEhsX92if2lJ2CSqKAI4RQswt.jpg",
          "title": "Greenland",
          "average_rating": 9,
          "release_date": "2020-07-29"
        },
        {
          "id": 2,
          "poster_path": "https://image.tmdb.org/t/p/original//eDnHgozW8vfOaLHzfpHluf1GZCW.jpg",
          "backdrop_path": "https://image.tmdb.org/t/p/original//u9YEh2xVAPVTKoaMNlB5tH6pXkm.jpg",
          "title": "Archive",
          "average_rating": 8.5,
          "release_date": "2020-08-13"
        },
        {
          "id": 3,
          "poster_path": "https://image.tmdb.org/t/p/original//5KlRFKKSbyCiyYpZSS3A6G5bW0K.jpg",
          "backdrop_path": "https://image.tmdb.org/t/p/original//qZ4NYuwME0j6QgJmIE6AZMgmCaj.jpg",
          "title": "Akira",
          "average_rating": 9,
          "release_date": "1988-07-16"
        }
      ]

    render(
      <CardSection allMovies={movies}/>
    )
    
    const titleOne = screen.getByText( "Greenland")
    const titleTwo = screen.getByText( "Archive")
    const titleThree = screen.getByText( "Akira")

    expect(titleOne).toBeInTheDocument()
    expect(titleTwo).toBeInTheDocument()
    expect(titleThree).toBeInTheDocument()

  })
})