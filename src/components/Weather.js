import React, { useState, useEffect } from 'react'
import '../assets/scss/weather.scss'
//import data
import { days, countryList } from '../data/DataList'
//import components
import WeatherHeader from './WeatherHeader';
import WeatherBox from './WeatherBox';
import ForecastCard from './ForecastCard';
import SearchInput from './SearchInput';
import Button from './Button';

const api = {
  key: '83b25da8e549cd6264bcc4affc979f84',
  base: 'https://api.openweathermap.org/data/2.5/'
}

export default function Weather() {
  //state 
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState({})
  const [errorMsg, setErrorMsg] = useState('')
  const [forecast, setForecast] = useState({})
  const [sortedForecast, setSortedForecast] = useState([])
  const [className, setClassName] = useState('')


  useEffect(() => {
    handleSorting()
  }, [forecast])

  useEffect(() => {
    classBuilder()
  }, [weather])

  //functions
  const handleSorting = () => {

    let forecastArr = []

    let cleanObj = {
      date: null,
      month: null,
      day: '',
      tempDay: null,
      iconDay: '',
      tempNight: null,
      iconNight: ''
    }

    let dataObj = { ...cleanObj }

    const today = (new Date()).getDate()
    const currentHour = (new Date()).getHours()

    for (let i = 0; i < forecast.length; i++) {
      //date setting
      let dt = forecast[i].dt * 1000
      let d = new Date(dt)
      let dayMonth = d.getDate()
      let dayWeek = days[d.getDay()]
      let hour = d.getHours()
      let month = d.getMonth() + 1

      //checking if date from forecast is not current date
      if (dayMonth !== today) {
        //night temperature
        if (hour === 1) {
          dataObj.date = dayMonth
          dataObj.month = month
          dataObj.day = dayWeek
          dataObj.tempNight = Math.round(forecast[i].main.temp)
          dataObj.iconNight = forecast[i].weather[0].icon
        }
        //day temperature
        if (hour === 13) {
          dataObj.tempDay = Math.round(forecast[i].main.temp)
          dataObj.iconDay = forecast[i].weather[0].icon
          forecastArr.push(dataObj)
          dataObj = { ...cleanObj }
        }
      }
      //checking last day in forecast 
      if (currentHour < 13) {
        if (dayMonth === today + 5) {
          if (hour === 1) {
            dataObj.date = dayMonth
            dataObj.month = month
            dataObj.day = dayWeek
            dataObj.tempNight = Math.round(forecast[i].main.temp)
            dataObj.iconNight = forecast[i].weather[0].icon
            dataObj.tempDay = Math.round(forecast[forecast.length - 1].main.temp)
            dataObj.iconDay = forecast[forecast.length - 1].weather[0].icon

            forecastArr.push(dataObj)

            dataObj = { ...cleanObj }
          }
        }
      }
    }
    setSortedForecast(forecastArr)
  }

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const countryBuilder = () => {
    if (typeof weather.main == 'undefined') {
      return null
    }
    let countryCode = weather.sys.country
    let country = countryList[countryCode]
    return country
  }

  const timeLocalBiulder = () => {
    let hour = null

    if (typeof weather.main != 'undefined') {
      let d = new Date()
      const utc_offset = d.getTimezoneOffset()
      d.setMinutes(d.getMinutes() + utc_offset + (weather.timezone / 60))
      hour = d.getHours()
    }
    return hour;
  }

  const classBuilder = () => {
    let hour = timeLocalBiulder()

    let newClassName = ''

    if (hour !== null) {
      let weatherType = weather.weather[0].main.toLowerCase()

      if (hour > 6 && hour < 21) {
        switch (weatherType) {
          case 'clouds':
            newClassName = 'day clouds';
            break;
          case 'rain':
            newClassName = 'day rain';
            break;
          case 'thunder':
            newClassName = 'day thunder';
            break;
          case 'snow':
            newClassName = 'day snow';
            break;
          default:
            newClassName = 'day clear'
        }
      } else {
        switch (weatherType) {
          case 'clouds':
            newClassName = 'night clouds';
            break;
          case 'rain':
            newClassName = 'night rain';
            break;
          case 'thunder':
            newClassName = 'night thunder';
            break;
          case 'snow':
            newClassName = 'night snow'
            break;
          default:
            newClassName = 'night clear'
        }
      }
      setClassName(newClassName)
    }
  }

  //api functions call
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  }

  const handleSearch = evt => {
    if (evt.key === 'Enter') {
      setErrorMsg('')
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(handleErrors)
        .then(res => res.json())
        .then(result => {
          setWeather(result)
          setQuery('')
          setForecast([])
        }).catch(error => {
          setErrorMsg('Oops, not found, try again...')
          setQuery('')
          console.log(error)
        })
    }
  }

  const handleForecast = () => {
    fetch(`${api.base}forecast?q=${weather.name}&units=metric&APPID=${api.key}`)
      .then(handleErrors)
      .then(res => res.json())
      .then(result => {
        setForecast(result.list)
      }).catch(error => {
        console.log(error)
      })

  }

  return (
    <div className={`${className} weather`}>
      <main>

        <div className='search-box'>
          <SearchInput
            onChange={handleChange}
            query={query}
            onKeyPress={handleSearch}
          />
        </div>

        {
          (errorMsg !== '') ? (
            <div className='error-box'>{errorMsg}</div>
          ) : ''
        }

        {(typeof weather.main != 'undefined') ? (
          <div>
            <WeatherHeader
              country={countryBuilder()}
              city={weather.name}
              icon={weather.weather[0].icon}

            />

            <WeatherBox
              temp={weather.main.temp}
              description={weather.weather[0].main}
            />

            <div className='btn-box'>
              <Button
                onClick={handleForecast}
                value='Forecast 5day'
              />
            </div>

            <div className='forecast-container'>
              {
                sortedForecast.map((item, index) => {
                  return (
                    <ForecastCard
                      forecast={item}
                      key={index}
                    />
                  )
                })
              }
            </div>
          </div>
        ) : ('')}



      </main>
    </div>
  )
}
