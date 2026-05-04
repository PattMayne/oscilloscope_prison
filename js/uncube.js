/* 
 * 
 * 
 * 
 * 
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ~~~~~                         ~~~~~
 * ~~~~~  AUDIO WAVE INIT STUFF  ~~~~~
 * ~~~~~                         ~~~~~
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 * 
 * 
 * 
*/


const audioContext = new (window.AudioContext || window.webkitAudioContext)()


// Access the canvas element and its 2D rendering context
const canvas = document.getElementById("canvas")
const width = canvas.width
const height = canvas.height

let conguy = new Image()

const ctx = canvas.getContext('2d')
ctx.strokeStyle = "#ff3700"
ctx.lineWidth = 2
let bass_color = document.getElementById("bass_color").value
let amp_color = document.getElementById("amp_color").value
let analyser, data_array, frequency_array, audioBuffer, source, playing = false
let bass_thickness = 2
let half_bass_thickness = 1

document.getElementById('play_btn').addEventListener('click', function() {
    if (playing) return

    // get the image, if they chose one
    const file = document.getElementById('image_file').files[0]
    !!file && (conguy.src = URL.createObjectURL(file))

    source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    analyser = audioContext.createAnalyser()
    source.connect(analyser)
    analyser.connect(audioContext.destination)
    analyser.fftSize = 2048
    data_array = new Uint8Array(analyser.fftSize)
    frequency_array = new Uint8Array(analyser.frequencyBinCount)
    source.start()
    playing = true
    bass_color = document.getElementById("bass_color").value
    amp_color = document.getElementById("amp_color").value
    source.onended = () => { playing = false }
})
document.getElementById('audio_file').addEventListener('change', function(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function(ev) {
        audioContext.decodeAudioData(ev.target.result, (buffer) => {
            audioBuffer = buffer
            document.getElementById('play_btn').disabled = false
        })
    }
    reader.readAsArrayBuffer(file)
})


/** OBSOLETE. We will scavenge wave-drawing logic from this function.
 * This USED to just draw the wave in a straight path across the canvas.
 * 
 * oldraw
 */
function draw() {
    if (!playing) return
    analyser.getByteTimeDomainData(data_array)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()

    data_array.forEach((element, i) => {
        let x = (i / data_array.length) * canvas.width

        // the 255 can be modified by the z-axis to make the waves appear smaller in the distance
        let y = (data_array[i] / 500) * canvas.height

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
    })
    
    ctx.stroke()
    requestAnimationFrame(draw)
}


// For now each line (each half line) draws the whole wave.
// Later we will split the wave in two and share between the two lines.

// ALSO we're giving the whole delta to each axis.
// Whichever axis is more straight should get that much more of the change to display.
const draw_wave = (xy_start, xy_end, array_half, taper_start = false) => {
    if (!playing) return
    
    ctx.beginPath()

    const array_length = array_half.length
    const y_diff = xy_end.y - xy_start.y
    const x_diff = xy_end.x - xy_start.x

    ctx.lineWidth = 2

    // store this elsewhere
    const taper_cutoff_fraction = 1.0 / 3

    array_half.forEach((node, i) => {

        const levelled_node = node - 128
        const y_diff_is_greater = Math.abs(y_diff) > Math.abs(x_diff)
        const fraction_cleared = i / array_length
        const fraction_remaining = 1.0 - fraction_cleared
        const scale_max = 15

        const scale_down = fraction_cleared < taper_cutoff_fraction && !taper_start ?
        5 + scale_max - (fraction_cleared / taper_cutoff_fraction) * scale_max :
        fraction_cleared > (1.0 - taper_cutoff_fraction) && taper_start ?
        5 + scale_max - (fraction_remaining / taper_cutoff_fraction) * scale_max :
        5

        const y_adjustment = y_diff * fraction_cleared
        const x_adjustment =
            y_diff_is_greater ? x_diff * fraction_cleared + (node - 128) / scale_down:
            fraction_cleared * (xy_end.x - xy_start.x)

        const x = xy_start.x + x_adjustment
        const y =
            xy_start.y +
            y_adjustment + // move up y-axis along with the wave.
            levelled_node / scale_down // max amp is 255, so center at 128 and scale down by 5

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
    })
    
    ctx.stroke()
}

/* 
 * 
 * 
 * 
 * 
 * ###########################
 * ###########################
 * #####                 #####
 * #####  CONGRID STUFF  #####
 * #####                 #####
 * ###########################
 * ###########################
 * 
 * 
 * 
 * 
*/

const img_draw_data = {
    x: canvas.width / 4,
    y: canvas.height / 4,
    width: canvas.width / 2,
    height: canvas.height / 2
}

const fake_title = true
const tilt = 0.2

const guy_is_cool = true
const dotted_lines = false
const include_inner_edges = false

conguy.src = guy_is_cool ? "./img/coolconguy.png" : "./img/conguy.png"

const timeout = 60 // Timeout for animation update
const f = 500  // Focal length for 3D projection (larger values make objects smaller)
const D = 410  // Distance from the viewer (larger values make objects appear smaller)

const clearScreen = () => ctx.clearRect(0, 0, width, height) // Clear the canvas to prepare for the next frame

function point(x, y) {
    ctx.fillStyle = bass_color 
    ctx.beginPath()
    ctx.arc(x, y, half_bass_thickness, 0, 2 * Math.PI, true)
    ctx.fill()
    ctx.closePath()
}


const get_bass_thickness = () => {
    if (!playing) return 2

    const bass_bins = frequency_array.slice(0, 10) // First 10 bins
    const bass_average =
        bass_bins.reduce((sum, val) => sum + val, 0) / bass_bins.length
    
    const max_thickness = 12
    const thickness = (bass_average / 255) * max_thickness
    return thickness < 2 ? 2 : thickness
}

const set_bass_thickness = () => {
    bass_thickness = get_bass_thickness()
    half_bass_thickness = bass_thickness / 2
}

function line(x1, y1, x2, y2, array_half, taper_start) {

    const xy_start = { x: x1, y: y1 }
    const xy_end = { x: x2, y: y2 }

    // draw bass line:
    if (!playing || true) {
        // draw the normal lines (BASS LINES)
        ctx.lineWidth = bass_thickness
        ctx.strokeStyle = bass_color
        ctx.beginPath()  // Start a new drawing path
        ctx.moveTo(x1, y1)  // Move to the start point
        ctx.lineTo(x2, y2)  // Draw a line to the end point
        ctx.stroke()  // Apply the stroke to render the line
    }

    ctx.strokeStyle = amp_color
    draw_wave(xy_end, xy_start, array_half, taper_start)
}


// the vector class to represent a 3D vector (point)
class vector {
    constructor(x, y, z) {
        this.x = x // x-coordinate
        this.y = y // y-coordinate
        this.z = z // z-coordinate
    }


    // Convert a 3D point to a 2D point for drawing
    get_point2d() {
        return project3Dto2D(this.x, this.y, this.z)
    }

    // Draw the point on the canvas
    draw() {
        const pt2d = this.get_point2d() // Get the 2D coordinates
        point(pt2d.x, pt2d.y) // Draw the point on the canvas
    }

    // Rotate the vector around the X-axis
    rotateX(theta) {
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)
        const yNew = this.y * cosTheta - this.z * sinTheta
        const zNew = this.y * sinTheta + this.z * cosTheta
        this.y = yNew
        this.z = zNew
    }

    // Rotate the vector around the Y-axis
    rotateY(theta) {
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)
        const xNew = this.x * cosTheta + this.z * sinTheta
        const zNew = -this.x * sinTheta + this.z * cosTheta
        this.x = xNew
        this.z = zNew
    }

    // Rotate the vector around the Z-axis
    rotateZ(theta) {
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)
        const xNew = this.x * cosTheta - this.y * sinTheta
        const yNew = this.x * sinTheta + this.y * cosTheta
        this.x = xNew
        this.y = yNew
    }

    // Scale the vector by a factor relative to the center
    scale(scaleFactor, center) {
        this.x = (this.x - center.x) * scaleFactor + center.x
        this.y = (this.y - center.y) * scaleFactor + center.y
        this.z = (this.z - center.z) * scaleFactor + center.z
    }
}


function project3Dto2D(x, y, z) {
    const x2D = (x / (z + D)) * f + width / 2
    const y2D = fake_title ? -((y + tilt * z) / (z + D)) * f + height / 2 : (-(y / (z + D)) * f + height / 2)
    return { x: x2D, y: y2D }  // Return the 2D coordinates
}


// Class to represent a 3D model (collection of points and edges)
class model {
    constructor(name, points, edges = [], dotted_edges = []) {
        this.name = name // Name of the model
        this.points = points // Array of 3D points
        this.edges = edges // Array of edges connecting the points
        this.dotted_edges = dotted_edges // Array of dotted edges
    }

    // Draw the model on the canvas
    draw() {

        set_bass_thickness()
        // Draw the same data array on every line
        if (playing) {
            analyser.getByteTimeDomainData(data_array)
            analyser.getByteFrequencyData(frequency_array)
        }
        
        const half_length = playing ? Math.floor(data_array.length / 2) : 0;
        const first_half = playing ? data_array.slice(0, half_length) : [];
        const second_half = playing ? data_array.slice(half_length) : [];
        
        // First, draw the points (guarantees rounded corners)
        if (playing && bass_thickness > 2) {
            this.points.forEach(this_point => this_point.draw())
        }

        // Draw the edges BEHIND the guy
        this.edges.forEach(this_edge => {
            const edge_points = this_edge.points
            if (edge_points[0].z < 0 && edge_points[1].z < 0) return
            const array_half = this_edge.start_0 ? first_half : second_half
            const start = edge_points[0].get_point2d() // Start point of the edge
            const end = edge_points[1].get_point2d() // End point of the edge
            line(start.x, start.y, end.x, end.y, array_half, this_edge.start_0) // Draw the line between the two points
        })


        if (dotted_lines) {
            ctx.setLineDash([5, 15]); // 5px dash, 15px gap
            this.dotted_edges.forEach(this_edge => {
                const edge_points = this_edge.points
                if (edge_points[0].z < 0 && edge_points[1].z < 0) return
                const array_half = this_edge.start_0 ? first_half : second_half
                const start = edge_points[0].get_point2d() // Start point of the edge
                const end = edge_points[1].get_point2d() // End point of the edge
                line(start.x, start.y, end.x, end.y, array_half, this_edge.start_0)
            })
            ctx.setLineDash([]); // Reset to solid line
        }


        // draw face
        ctx.drawImage(
            conguy,
            img_draw_data.x,
            img_draw_data.y,
            img_draw_data.width,
            img_draw_data.height
        )

        // Draw the edges in FRONT of the guy
        this.edges.forEach(this_edge => {
            const edge_points = this_edge.points
            if (edge_points[0].z < 5 || edge_points[1].z < 5) {    
                const array_half = this_edge.start_0 ? first_half : second_half            
                const start = edge_points[0].get_point2d() // Start point of the edge
                const end = edge_points[1].get_point2d() // End point of the edge
                line(start.x, start.y, end.x, end.y, array_half, this_edge.start_0)
            }
        })

        if (dotted_lines) {
            ctx.setLineDash([5, 15]); // 5px dash, 15px gap
            this.dotted_edges.forEach(this_edge => {
                const edge_points = this_edge.points                
                if (edge_points[0].z < 5 || edge_points[1].z < 5) {
                    const array_half = this_edge.start_0 ? first_half : second_half
                    const start = edge_points[0].get_point2d() // Start point of the edge
                    const end = edge_points[1].get_point2d() // End point of the edge
                    line(start.x, start.y, end.x, end.y, array_half, this_edge.start_0)
                }
            })
            ctx.setLineDash([]); // Reset to solid line
        }
    }

    // Rotate the model around the X-axis
    rotateX(theta) {
        theta = theta * Math.PI / 180
        this.points.forEach(this_point => this_point.rotateX(theta))
    }

    // Rotate the model around the Y-axis
    rotateY(theta) {
        theta = theta * Math.PI / 180
        this.points.forEach(this_point => this_point.rotateY(theta))
    }

    // Rotate the model around the Z-axis
    rotateZ(theta) {
        theta = theta * Math.PI / 180
        this.points.forEach(this_point => this_point.rotateZ(theta))
    }

    // Scale the model by a factor relative to the center of the model
    scale(scaleFactor) {
        this.points.forEach(this_point => this_point.scale(scaleFactor, this.getCenter()))
    }

    // Get the center of the model by averaging all points
    getCenter() {
        let centerX = 0, centerY = 0, centerZ = 0
        this.points.forEach(this_point => {
            centerX += this_point.x
            centerY += this_point.y
            centerZ += this_point.z
        })

        return new vector(
            centerX / this.points.length,
            centerY / this.points.length,
            centerZ / this.points.length
        )
    }
}


const points = [
    // square facing me
    new vector(-100, -100, 0), // Bottom-left 0
    new vector(0, -100, 0), // Bottom-middle
    new vector(100, -100, 0), // Bottom-right
    new vector(100, 0, 0), // Middle-right

    new vector(100, 100, 0), // Top-right 4
    new vector(0, 100, 0), // Top-Middle (REAL CENTER TOP) 5
    new vector(-100, 100, 0), // Top-left
    new vector(-100, 0, 0), // Middle-left

    new vector(0, 0, 0), // Center 8 // CHANGE "CENTER" TO FAKE CENTER, shorter (each segment needs its OWN)

    // square dissecting me vertically
    new vector(0, -100, -100), // Bottom-front 9
    new vector(0, -100, 0), // Bottom-middle (REAL CENTER BOTTOM) 10
    new vector(0, -100, 100), // Bottom-back
    new vector(0, 0, 100), // Middle-back

    new vector(0, 100, 100), // Top-back 13
    new vector(0, 100, 0), // Top-middle
    new vector(0, 100, -100), // Top-front
    new vector(0, 0, -100), // Middle-front

    // horizontal square
    new vector(-100, 0, -100), // Left-front 17
    new vector(0, 0, -100), // Middle-front 18
    new vector(100, 0, -100), // Right-front 
    new vector(100, 0, 0), // Right-middle 20

    new vector(100, 0, 100), // Right-back 21
    new vector(0, 0, 100), // Middle-back  22
    new vector(-100, 0, 100), // Left-back 
    new vector(-100, 0, 0), // Left-middle  24

    // part-lines for horizontal square
    new vector(0, 0, -30), // Middle-front END 25
    new vector(30, 0, 0), // Right-middle END 26
    new vector(0, 0, 30), // Middle-back END 27
    new vector(-30, 0, 0), // Left-middle END 28
]


const edges = [
    // Square facing me (outside)
    { points: [points[0], points[1]], start_0: true },
    { points: [points[1], points[2]], start_0: false },
    { points: [points[2], points[3]], start_0: true },
    { points: [points[3], points[4]], start_0: false },
    { points: [points[4], points[5]], start_0: true },
    { points: [points[5], points[6]], start_0: false },
    { points: [points[6], points[7]], start_0: true },
    { points: [points[7], points[0]], start_0: false },
    // Square dissecting me vertically (outside)
    { points: [points[9], points[10]], start_0: true },
    { points: [points[10], points[11]], start_0: false },
    { points: [points[11], points[12]], start_0: true },
    { points: [points[12], points[13]], start_0: false },
    { points: [points[13], points[14]], start_0: true },
    { points: [points[14], points[15]], start_0: false },
    { points: [points[15], points[16]], start_0: true },
    { points: [points[16], points[9]], start_0: false },
    // Horizontal square (outside)
    { points: [points[17], points[18]], start_0: true },
    { points: [points[18], points[19]], start_0: false },
    { points: [points[19], points[20]], start_0: true },
    { points: [points[20], points[21]], start_0: false },
    { points: [points[21], points[22]], start_0: true },
    { points: [points[22], points[23]], start_0: false },
    { points: [points[23], points[24]], start_0: true },
    { points: [points[24], points[17]], start_0: false },
]

const inner_edges = [
    { points: [points[8], points[10]], start_0: true },
    { points: [points[8], points[12]], start_0: false },
    { points: [points[8], points[14]], start_0: true },
    { points: [points[8], points[18]], start_0: false },

    { points: [points[8], points[20]], start_0: false },
    { points: [points[8], points[22]], start_0: false },
    { points: [points[8], points[24]], start_0: false },
]

// WILL NOT USE (the illusion doesn't work)
const partial_inner_edges = [
    { points: [points[18], points[25]], start_0: true },
    { points: [points[20], points[26]], start_0: false },
    { points: [points[22], points[27]], start_0: false },
    { points: [points[24], points[28]], start_0: false },
]


!!include_inner_edges && edges.push(...inner_edges)


// Create the model using the points and edges defined above
const mdl = new model("cube", points, edges, inner_edges)
mdl.scale(1)  // Initial scaling of the model

// Function to update the canvas, clear the screen, and draw the model
function update() {
    clearScreen() // Clear the screen before drawing

    // rotate and draw the model
    mdl.rotateY(5)
    mdl.rotateZ(-0.5)
    mdl.rotateX(0.7)
    mdl.draw()

    // Continuously update the canvas at the specified timeout interval
    setTimeout(update, timeout)
}

setTimeout(update, timeout)