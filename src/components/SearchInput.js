import React from 'react'

export default function SearchInput(props) {
  return (
    <input 
      type='text'
      className='search-bar'
      placeholder='Search...'
      onChange={props.onChange}
      value={props.query}
      onKeyPress={props.onKeyPress}
    />
  )
}
