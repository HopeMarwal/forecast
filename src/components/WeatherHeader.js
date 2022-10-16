import React from 'react'
import { days, months } from '../data/DataList'

export default function WeatherHeader(props) {

  const dateBuilder = (d) => {

    let day = days[d.getDay()]
    let date = d.getDate()
    let month = months[d.getMonth()]
    let year = d.getFullYear()

    return `${day} ${date} ${month} ${year}`

  }
  return (
    <div className='location-box'>
      <div className='location-country'>{props.country},</div>
      <div className='location'>{props.city}</div>
      <img src={`http://openweathermap.org/img/w/${props.icon}.png`} alt={props.city} />
      <div className='date'>{dateBuilder(new Date())}</div>
    </div>
  )
}
