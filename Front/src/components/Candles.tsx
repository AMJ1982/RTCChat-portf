import React from 'react'

// An animated candelabrum for Christmas theme.
const Candles: React.FC  = () => {
    
  const calculateLitCandles = () => {
    // Determining the amount of lit candles by counting sundays till current date.
    const now = new Date()
    let sundays = 0
    let date = new Date(`${now.getFullYear()}-12-01`)
    
    // Iterating elapsed days of December. If the index of day is 0 (sunday), the value of sundays
    // is increased by 1.
    for (let day = 0; day < now.getDate(); day++) {
      if (date.getDay() === 0) sundays++
      date.setDate(date.getDate() + 1)
    }
    return sundays
  }

  const litCandles = calculateLitCandles()

  return (
    <div id='candle-box'>
      {
        [1, 2, 3, 4].map((candle, index) => {
          return (
            <div className='candle' key={candle}>
              {litCandles > index && <div className='flame'></div>}
            </div>
          )
        })
      }
    </div>
  )
  
}

export default Candles