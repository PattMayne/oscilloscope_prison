
const points = []

// THIS is where I cam make different points and edges.
const points_bigsquares = [
    // square facing me
    new vector(-100, -100, 0), // Bottom-left
    new vector(100, -100, 0), // Bottom-right
    new vector(100, 100, 0), // Top-right
    new vector(-100, 100, 0), // Top-left

    // square dissecting me
    new vector(0, -100, -100), // Bottom-front
    new vector(0, -100, 100), // Bottom-back
    new vector(0, 100, 100), // Top-front
    new vector(0, 100, -100), // Top-back

    // horizontal square
    new vector(-100, 0, -100), // Left-front 8
    new vector(100, 0, -100), // Right-front 9
    new vector(-100, 0, 100), // Left-back 10
    new vector(100, 0, 100), // Right-back 11

    // single vertical line
    new vector(0, -100, -0), // Bottom 12
    new vector(0, 100, 0) // Top 13
]


const edges_bigsquares = [
    [points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]],  // Square facing me,
    [points[4], points[5]], [points[5], points[6]], [points[6], points[7]], [points[7], points[4]],  // Square dissecting me
    [points[8], points[9]], [points[9], points[11]], [points[11], points[10]], [points[10], points[8]],  // Horizontal square
    //[points[12], points[13]]   // Vertical line
]

// ORIGINAL CUBE STUFF IS OBSOLETE
// Define the points for the cube model (8 vertices of a cube in 3D space)
const points_cube = [
    new vector(-100, -100, -100), // Bottom-left-front
    new vector(100, -100, -100), // Bottom-right-front
    new vector(100, 100, -100), // Top-right-front
    new vector(-100, 100, -100), // Top-left-front

    new vector(-100, -100, 100), // Bottom-left-back
    new vector(100, -100, 100), // Bottom-right-back
    new vector(100, 100, 100), // Top-right-back
    new vector(-100, 100, 100) // Top-left-back
]

// Define the edges connecting the points to form a cube (12 edges)
const edges_cube = [
    [points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]],  // Bottom face
    [points[4], points[5]], [points[5], points[6]], [points[6], points[7]], [points[7], points[4]],  // Top face
    [points[0], points[4]], [points[1], points[5]], [points[2], points[6]], [points[3], points[7]]   // Sides
]