function spiralSearch(
  matrix: number[][],
  target: number,
  startX: number,
  startY: number,
  radius: number
): [number, number] | null {
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]; // Right, Down, Left, Up
  let x = startX;
  let y = startY;
  let step = 1;
  let stepsCount = 0;
  let directionIndex = 0;

  while (step <= radius) {
    for (let i = 0; i < step; i++) {
      if (matrix[x][y] === target) {
        return [x, y];
      }

      x += directions[directionIndex][0];
      y += directions[directionIndex][1];
      stepsCount++;

      if (stepsCount === matrix.length * matrix[0].length) {
        // The search has covered the entire matrix without finding the target value
        return null;
      }
    }

    directionIndex = (directionIndex + 1) % 4; // Move to the next direction
    if (directionIndex % 2 === 0) {
      // Increase the step size every two directions
      step++;
    }
  }

  return null; // The target value was not found within the specified radius
}

// Example usage
const matrix = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

const targetValue = 11;
const startX = 1;
const startY = 1;
const radius = 2;

const result = spiralSearch(matrix, targetValue, startX, startY, radius);
if (result) {
  const [x, y] = result;
  console.log(`Found target value ${targetValue} at position (${x}, ${y}).`);
} else {
  console.log(
    `Target value ${targetValue} was not found within the specified radius.`
  );
}
