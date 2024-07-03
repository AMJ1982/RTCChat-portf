import React, { useEffect, useRef } from 'react'

// A class representing a single snowflake.
class Flake {
	x: number
	y: number
	size: number
	stepY: number
	c: CanvasRenderingContext2D

  constructor(x: number, y: number, size: number, stepY: number, c: CanvasRenderingContext2D) {
		this.x = x
		this.y = y
		this.size = size
		this.stepY = stepY
		this.c = c
	}

	// Draws the flake to the canvas after calculating its position.
	draw(): void {
		this.c.fillStyle = 'white'
		this.c.beginPath()
		this.c.ellipse(this.x, this.y, this.size, this.size, 0, 0, Math.PI * 2)
		this.c.fill()
	}

	// Calculating the position for this Flake instance. In addition to y-axis velocity sine wave is used to alter the
	// x-axis position of the flake to enhance the floating effect.
	update(): void {		
		if (this.y > this.c.canvas.height) this.y = 0
		this.y += this.stepY
		this.x += Math.sin(this.y / 20) * 0.2
		this.draw()
	}
}

// A component used as a background view for Christmas theme. Returns a canvas element, which is also stored by using
// the useRef hook. After initialization the component keeps re-rendering in useEffect hook every 30 ms. The render
// method clears the canvas, calls the update method of each Flake instance to update its position, and resets timeout
// for the next call of render method.
const Snowfall = () => {
  const canvRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canv: HTMLCanvasElement | null = canvRef.current
		if (!canv) return

		canv.height = window.innerHeight
		canv.width = window.innerWidth
		const c: CanvasRenderingContext2D = canv.getContext('2d') as CanvasRenderingContext2D
    let timeout: NodeJS.Timeout
		const flakes: Flake[] = []

		// Generating an array of 50 snowflakes. The size is randomized between 2 and 3 pixels, and the velocity is determined
		// by the size of the flake: smaller ones are decending slower to generate a coarse depth effect.
		for (let i = 0; i < 50; i++) {
			const size = Math.random() > 0.5 ? 3 : 2
			const step = size === 2 ? 1 : 2
			const flake = new Flake(Math.random() * canv.width, Math.random() * canv.height, size, step, c)
			flakes.push(flake)
		}

    const render = async () => {
      clearTimeout(timeout)
			c.clearRect(0, 0, c.canvas.width, c.canvas.height)
      flakes.forEach(flake => flake.update())
      timeout = setTimeout(render, 30)
    }
    timeout = setTimeout(render, 0)
    
    return () => clearTimeout(timeout)
  }, [])

  return <canvas id='snowfall' ref={canvRef}></canvas>
}

export default Snowfall