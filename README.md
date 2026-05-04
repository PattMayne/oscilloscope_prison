# CONSCIOUSNESS ENERGY GRID ANIMATION

https://25scripts.com/tutorial/building-3d-projections-with-javascript-and-html

## TO DO:
- make guy wobble
- allow resize of canvas
- put on website
- make webpage-based oscilloscope
    - replace lines with sound wave on each iteration
    - tilt changes based on (bass, amplitude, etc) (from getByteFrequencyData)


## FOR THE OSCILLOSCOPE:
- get the length of each line as the hypoteneuse
    - use the x, y of the line's end points and do pythagoras' theorum
- for each iteration, split the sound wave in half (two arrays)
    - each line is actually split into two lines, remember (for the effect of being drawn behind the face)
    - each line must have MARKED whether it's A or B, and that's permanent
    - for each iteration, we will have the split sound wave array (A & B) to match with the split lines.
- based on the z-index, make the amplitude appear smaller when further away (only slightly)
- Some lines are amplified by BASS, others by TREBLE
- Face in the middle rotates according to amplitude
- For both of the above we need the average over a certain amount of time... can't be jolting around with each peak
    - OR just make it accumulate somewhere, rather than calculate some averageq


### PROBLEM:
How to do the vertial lines?

then amplitude must be represented with horizontal spikes.

We should make a decision based on difference between x's vs y's. 
One a horizontal line the Y values will be the same, so they should represent the spikes.
On a vertial line the X values will be the same, so they should represent the spikes.

Get the percentage of the WAVE POINTS we've cleared in the array,
and apply that to the percentage of difference between y1 and y2,
and add that percentage of the difference.