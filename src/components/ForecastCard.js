import React, { useEffect, useState } from 'react'

export default function ForecastCard(props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, 100);
  }, [])

  const dayBuilder = () => {
    switch (props.forecast.day) {
      case 'Monday': return 'Mon';
      case 'Tuesday': return 'Tue';
      case 'Wednesday': return 'Wed'
      case 'Thursday': return 'Thu';
      case 'Friday': return 'Fri'
      case 'Saturday': return 'Sat';
      default: return 'Sun'
    }
  }

  const dateBuilder = () => {
    let month = null
    if (props.forecast.month < 10) {
      month = `0${props.forecast.month}`
    } else {
      month = props.forecast.month
    }
    return `${props.forecast.date}.${month}`
  }

  return (
    <div className={`${isVisible ? 'visible' : ''} forecast-card`}>

      <div className='forecast-card_box'>

        <div className='date-box'>
          <div className='day'>{dayBuilder()}</div>
          <div className='date'>{dateBuilder()}</div>
        </div>

        <img src={`http://openweathermap.org/img/w/${props.forecast.iconDay}.png`} alt="weather_icon" />
        <div className='weather_day'>{props.forecast.tempDay}°C</div>
        <div className='weather_night'>{props.forecast.tempNight}°C</div>
        <img src={`http://openweathermap.org/img/w/${props.forecast.iconNight}.png`} alt="weather_icon" />
      </div>

    </div>
  )
}
