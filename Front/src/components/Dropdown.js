import React, { useState, lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Component for dropdown menus.
const Dropdown = (props) => {

  return (
    <div className='dropdown-menu'>
      {props.children}
    </div>
  )
}

export default Dropdown