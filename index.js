"use strict";
let particleArray = [];
const gameCircle = [];
let bacteriaArray = [];
const sizeIncrease = 0.17;
const translation = [400, 400];
const rotation = [0, 0];
const body = document.querySelector(".body");
const displayScore = document.querySelector(".score");
const displayHighscore = document.querySelector(".highscore");
const resetButton = document.querySelector(".reset");
const startButton = document.querySelector(".start");
const lose = document.querySelector(".lose");
const loseCondition = 300;
const particleSize = 4;
let game = false;
let score = 0;
let highscore = 0;
let canRotate = false;
let globalx = 0;
let globaly = 0;
function main() {
  /**
   * @param {Array} positionVertex vertex array
   * @param {Array} colorVertex color array
   * @param {indices} index array
   * @param {Number} x center of circle
   * @param {Number} y center of circle
   * @param {Number} x center of circle
   * @param {Number} radius radius
   * @param {number} r number from 0 - 1
   * @param {number} g number from 0 - 1
   * @param {number} b number from 0 - 1
   *
   */
  class sphere {
    constructor(
      positionVertex,
      colorVertex,
      indices,
      x,
      y,
      z,
      radius,
      r,
      g,
      b,
      resolution
    ) {
      this.positionVertex = positionVertex;
      this.colorVertex = colorVertex;
      this.indices = indices;
      this.x = x;
      this.y = y;
      this.z = z;
      this.radius = radius;
      this.r = r;
      this.g = g;
      this.b = b;
      this.resolution = resolution;
    }
    updatePositionVertex = function (positionVertex) {
      this.positionVertex = positionVertex;
    };
    updateColorVertex = function (colorvertex) {
      this.colorvertex = colorvertex;
    };
    updateRadius = function (radiusMultiplier) {
      if (this.radius > gameCircle[0].radius / 3) {
        radiusMultiplier = 0;
      }
      //TODO: implement max size check
      this.radius = this.radius + radiusMultiplier;
      let temp = createSphere(
        this.radius,
        this.resolution,
        this.x,
        this.y,
        this.z,
        this.r,
        this.g,
        this.b
      );

      this.positionVertex = temp.positionVertex;
      this.colorvertex = temp.colorVertex;
      this.indices = temp.indices;
    };
    updateIndices = function (indices) {
      this.indices = indices;
    };
  }
  /**
   * creates a particle
   * @param {number} x x position on screen
   * @param {Number} y y position on screen
   * @param {Number} vX velocity x direction
   * @param {Number} vY velocity y direction
   * @param {Number} r 0-1 color
   * @param {Number} g 0-1 color
   * @param {Number} b 0-1 color
   */
  class Particle {
    constructor(x, y, z, vX, vY, vZ, r, g, b) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.vX = vX;
      this.vY = vY;
      this.vZ = vZ;
      this.r = r;
      this.g = g;
      this.b = b;
      this.iteration = 0;
      this.maxIteration = Math.random() * Math.random() * 95 + 5;
    }
    updateIteration = function () {
      this.iteration++;
      this.x += this.vX;
      this.y += this.vY;
      this.z += this.vZ;
    };
  }

  /**
   * creates a sphere
   * @param {Number} radius radius of circle
   * @param {Number} resolution resolution of sphere, anywhere from 15-20 seems good
   * @param {Number} x center of circle
   * @param {Number} y center of circle
   * @param {Number} z center of circle
   * @param {number} r number from 0 - 1
   * @param {number} g number from 0 - 1
   * @param {number} b number from 0 - 1
   */
  const createSphere = function (
    radius,
    resolution,
    xOffset = 0,
    yOffset = 0,
    zOffset = 0,
    r = 0,
    g = 0,
    b = 0
  ) {
    const colorVertex = [];
    const positionVertex = [];
    const indices = [];
    // does height steps of circle
    for (let i = 0; i <= resolution; i++) {
      const division = (i * Math.PI) / resolution;
      const step = Math.sin(division);
      //calcs x @ Z per iteration
      for (let j = 0; j <= resolution; j++) {
        const xzCircle = (j * 2 * Math.PI) / resolution;
        //push z y z
        positionVertex.push(Math.sin(xzCircle) * step * radius + xOffset);
        positionVertex.push(Math.cos(division) * radius + yOffset);
        positionVertex.push(Math.cos(xzCircle) * step * radius + zOffset);
        // push color
        colorVertex.push(r);
        colorVertex.push(g);
        colorVertex.push(b);
        colorVertex.push(1);
        // FOR TESTING, helps give perspective
        // colorVertex.push(b);
      }
    }
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        let vertex1 = i * (resolution + 1) + j;
        let vertex2 = vertex1 + (resolution + 1);
        // first triangle
        indices.push(vertex1);
        indices.push(vertex2);
        indices.push(vertex1 + 1);
        // second
        indices.push(vertex1 + 1);
        indices.push(vertex2);
        indices.push(vertex2 + 1);
      }
    }

    return new sphere(
      positionVertex,
      colorVertex,
      indices,
      xOffset,
      yOffset,
      zOffset,
      radius,
      r,
      g,
      b,
      resolution
    );
  };

  /**
   * Creates new particles
   * @param {Number} x x position to spawn particles
   * @param {Number} y y position to spawn particles
   * @param {Number} z z position to spawn particles
   */
  const createParticles = function (x, y, z, r, g, b) {
    for (let i = 0; i < 200; i++) {
      let vX = Math.random() * 4 - 2;
      let vY = Math.random() * 4 - 2;
      let vZ = Math.random() * 4 - 2;
      particleArray.push(new Particle(x, y, z, vX, vY, vZ, r, g, b));
    }
  };

  const multiplyMatrix = function (a, b) {
    const newMatrix = [];
    for (let k = 0; k < 4; k++) {
      for (let i = 0; i < 4; i++) {
        let temp = 0;
        for (let j = 0; j < 4; j++) {
          temp += b[k * 4 + j] * a[i + 4 * j];
        }
        newMatrix.push(temp);
      }
    }
    return newMatrix;
  };

  const newMatrix = function (width, height, depth) {
    return [
      2 / width,
      0,
      0,
      0,
      0,
      -2 / height,
      0,
      0,
      0,
      0,
      2 / depth,
      0,
      -1,
      1,
      0,
      1,
    ];
  };

  const translateMatrix = function (matrix, xInPixels, yInpixels) {
    const translation = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      xInPixels,
      yInpixels,
      0,
      1,
    ];
    return multiplyMatrix(matrix, translation);
  };

  const rotationXAxis = function (matrix, radian) {
    const xScale = Math.cos(radian);
    const yScale = Math.sin(radian);
    const multiplyMat = [
      1,
      0,
      0,
      0,
      0,
      xScale,
      yScale,
      0,
      0,
      -yScale,
      xScale,
      0,
      0,
      0,
      0,
      1,
    ];
    return multiplyMatrix(matrix, multiplyMat);
  };

  const rotationYAxis = function (m, radian) {
    const xScale = Math.cos(radian);
    const yScale = Math.sin(radian);
    const multiplyMat = [
      xScale,
      0,
      -yScale,
      0,
      0,
      1,
      0,
      0,
      yScale,
      0,
      xScale,
      0,
      0,
      0,
      0,
      1,
    ];
    return multiplyMatrix(m, multiplyMat);
  };

  const getBacteriaSpawnLocation = function () {
    const vertexArray = gameCircle[0].positionVertex;
    const completeVertex = (vertexArray.length - 3) / 3;
    const vertex = Math.round(Math.random() * completeVertex) * 3;
    const xyz = [
      vertexArray[vertex],
      vertexArray[vertex + 1],
      vertexArray[vertex + 2],
    ];
    return xyz;
  };

  /**
   * @param {number} radius
   * @param {number} resolution
   */
  const createBacteriaSpawn = function () {
    const xyz = getBacteriaSpawnLocation();
    bacteriaArray.push(
      createSphere(
        10,
        15,
        xyz[0],
        xyz[1],
        xyz[2],
        Math.random(),
        Math.random(),
        Math.random()
      )
    );
  };

  const updateBacteria = function () {
    if (bacteriaArray.length === 0) {
      game = false;
      lose.textContent = "You Win!";
      console.log(`you Win`);
    }
    let sizeFlag = true;

    bacteriaArray.forEach((bacteria) => {
      if (bacteria.radius > 75) {
        sizeFlag = false;
      }

      bacteria.updateRadius(sizeIncrease);

      if (sizeFlag) {
        if (bacteria.radius > 75) {
          updateScore(100);
        }
      }
    });

    let count = 0;

    bacteriaArray.forEach((bacteria) => {
      if (bacteria.radius > 250 / 3) {
        count++;
      }
      if (count >= 2) {
        game = false;
        lose.textContent = "You Lose!";
      }
    });
  };

  const attemptBacteriaCreation = function () {
    if (bacteriaArray.length < 10) {
      if (Math.random() > 0.975) {
        createBacteriaSpawn();
      }
    }
  };

  const checkForCircleConflict = function () {
    for (let i = 0; i < bacteriaArray.length - 1; i++) {
      for (let j = i + 1; j < bacteriaArray.length; j++) {
        let firstBacteria = bacteriaArray[i];
        let secondBacteria = bacteriaArray[j];
        if (secondBacteria !== undefined) {
          let bool =
            Math.pow(firstBacteria.x - secondBacteria.x, 2) +
              Math.pow(firstBacteria.y - secondBacteria.y, 2) +
              Math.pow(firstBacteria.z - secondBacteria.z, 2) <
            Math.pow(firstBacteria.radius + secondBacteria.radius, 2);
          if (bool) {
            bacteriaArray.splice(j, 1);
          }
        }
      }
    }
  };
  const getPosition = function (e) {
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = x - translation[0];
    y = y - translation[1];
    clickDetection(x, y);
  };
  document.getElementById("canvas").addEventListener("click", getPosition);

  const clickDetection = function (x, y) {
    for (let i = bacteriaArray.length - 1; i > -1; i--) {
      let bacteria = bacteriaArray[i];
      // rotate x direction
      let rx =
        bacteria.x * Math.cos(rotation[1]) + bacteria.z * Math.sin(rotation[1]);
      // update z reference
      let rz =
        -bacteria.x * Math.sin(rotation[1]) +
        bacteria.z * Math.cos(rotation[1]);
      // rotate y direction
      let ry = -rz * Math.sin(rotation[0]) + bacteria.y * Math.cos(rotation[0]);
      let bool =
        Math.pow(x - rx, 2) + Math.pow(y - ry, 2) <
        Math.pow(bacteria.radius, 2);

      if (bool) {
        updateScore(bacteria.radius);
        bacteriaArray.splice(i, 1);
        drawCircle();
        i = -2;
        createParticles(
          bacteria.x,
          bacteria.y,
          bacteria.z,
          bacteria.r,
          bacteria.g,
          bacteria.b
        );
      }
    }
  };

  gameCircle.push(createSphere(250, 15, 0, 0, 0, 0.5, 0.02, 0.06));

  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // setup GLSL program
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(
    vertexShader,
    `
    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_matrix;
    varying vec4 v_color;
    void main() {
      gl_Position = u_matrix * a_position;
      v_color = a_color;
      gl_PointSize = 5.0;
    }
    `
  );
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(
    fragmentShader,
    `
    precision mediump float;
    varying vec4 v_color;
    void main() {
      gl_FragColor = v_color;
    }
      `
  );
  gl.compileShader(fragmentShader);

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const positionVertex = gl.getAttribLocation(program, "a_position");
  const colorVertex = gl.getAttribLocation(program, "a_color");
  const matrixVertex = gl.getUniformLocation(program, "u_matrix");
  const indicesBuff = gl.createBuffer();
  const positionBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(program);
  //---------------------------------------------------------------//
  const draw = function (sphere) {
    let matrix = newMatrix(gl.canvas.clientWidth, gl.canvas.clientHeight, 1000);
    matrix = translateMatrix(matrix, translation[0], translation[1]);
    matrix = rotationXAxis(matrix, rotation[0]);
    matrix = rotationYAxis(matrix, rotation[1]);
    canvas.width = 1600;
    canvas.height = 1600;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enableVertexAttribArray(positionVertex);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionVertex, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorVertex);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorVertex, 4, gl.FLOAT, true, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(sphere.positionVertex),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(sphere.colorVertex),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuff);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(sphere.indices),
      gl.STATIC_DRAW
    );
    gl.uniformMatrix4fv(matrixVertex, false, matrix);
    gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);
  };

  const drawParticles_efficient = function () {
    if (particleArray.length > 0) {
      let positionVertex = [];
      let colorVertex = [];
      let indicesArray = [];
      for (let i = 0; i < particleArray.length; i++) {
        const particle = particleArray[i];
        colorVertex.push(particle.r);
        colorVertex.push(particle.g);
        colorVertex.push(particle.b);
        colorVertex.push(1);
        positionVertex.push(particle.x);
        positionVertex.push(particle.y);
        positionVertex.push(particle.z);
      }
      for (let i = 0; i < particleArray.length; i++) {
        indicesArray.push(i);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positionVertex),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(colorVertex),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuff);

      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indicesArray),
        gl.STATIC_DRAW
      );
      gl.drawElements(gl.POINTS, indicesArray.length, gl.UNSIGNED_SHORT, 0);
    }
  };

  /**
   * Updates particle array

   */
  const updateParticles = function () {
    for (let i = 0; i < particleArray.length; i++) {
      const particle = particleArray[i];
      particle.updateIteration();
      if (particle.iteration >= particle.maxIteration) {
        particleArray.splice(i, 1);
        i--;
      }
    }
  };

  drawCircle();

  function drawCircle() {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    draw(gameCircle[0]);
    drawParticles_efficient();
    bacteriaArray.forEach((element) => {
      draw(element);
    });
  }
  const setRotation = function (x, y) {
    rotation[1] = rotation[1] + ((x / 5) * Math.PI) / 180;
    rotation[0] = rotation[0] + ((y / 5) * Math.PI) / 180;
    drawCircle();
  };
  setInterval(function () {
    if (game) {
      attemptBacteriaCreation();
      checkForCircleConflict();
      updateBacteria();
    }
    updateParticles();
  }, 33);

  setInterval(function () {
    if (true) {
      drawCircle();
    }
  }, 33);

  /**
   * Updates the score based on the bacteria radius that was clicked
   * @param {number} radius
   */
  const updateScore = function (radius) {
    if (game) {
      let bacteriaScore = (radius * Math.log(radius)) / 5;
      score += Math.round(bacteriaScore);
      if (score > highscore) {
        highscore = score;
      }
      displayScore.textContent = score;
      displayHighscore.textContent = highscore;
    }
  };

  /**
   * Resets the game and scores
   */
  const resetGame = function () {
    bacteriaArray = [];
    particleArray = [];
    game = false;
    drawCircle();
    score = 0;
    highscore = displayHighscore.textContent;
    displayScore.textContent = 0;
    lose.textContent = "";
  };

  /**
   * Starts the game
   */
  const startGame = function () {
    if (lose.textContent == "") {
      game = true;
      createBacteriaSpawn(10, 10);
    }
  };

  const drag = function (e) {
    globalx = e.screenX;
    globaly = e.screenY;
    canRotate = true;
  };
  const unDrag = function (e) {
    canRotate = false;
  };

  const changeRotate = function (e) {
    if (canRotate) {
      let x = e.screenX - globalx;
      let y = e.screenY - globaly;

      globalx = e.screenX;
      globaly = e.screenY;
      setRotation(-x, y);
    }
  };
  body.addEventListener("mousemove", changeRotate);
  body.addEventListener("mousedown", drag);
  body.addEventListener("mousedown", drag);
  body.addEventListener("mouseup", unDrag);
  startButton.addEventListener("click", startGame);
  resetButton.addEventListener("click", resetGame);
}

main();
