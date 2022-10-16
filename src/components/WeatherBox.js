import React from 'react'

export default function WeatherBox(props) {
  return (
    <div className='weather-box'>
      <div className='temp'>{Math.round(props.temp)}°C</div>
      <div className='desc'>{props.description}</div>
    </div>
  )
}
