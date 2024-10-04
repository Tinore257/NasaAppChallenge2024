'use strict';

/* eslint no-alert: 0 */

function main() {

    let Eccentricity = [0.9679, 0.8484, 0.7513, 0.8098, 0.6376, 0.8198, 0.9546, 0.9298, 0.7202, 0.6426, 0.9198, 0.7105, 0.972, 0.7048, 0.6391, 0.9193, 0.7607, 0.974, 0.6613, 0.824, 0.6588, 0.9056, 0.7866, 0.6409, 0.8205, 0.6855, 0.6957, 0.6933, 0.6922, 0.6939, 0.6934, 0.6936, 0.6915, 0.6935, 0.6947, 0.6939, 0.6923, 0.6956, 0.6986, 0.6941, 0.6934, 0.693, 0.6894, 0.6935, 0.6983, 0.6954, 0.7181, 0.6934, 0.6806, 0.6912, 0.6954, 0.6934, 0.6967, 0.6763, 0.6958, 0.6934, 0.6982, 0.6624, 0.6934, 0.6998, 0.6934, 0.6948, 0.6938, 0.7014, 0.6959, 0.6958, 0.7011, 0.6869, 0.6928, 0.6934, 0.6482, 0.6925, 0.664, 0.6441, 0.6824, 0.6824, 0.7005, 0.6824, 0.6824, 0.6857, 0.6848, 0.6824, 0.6825, 0.6911, 0.6915, 0.6962, 0.6824, 0.6918, 0.6918, 0.6825, 0.6925, 0.6852, 0.6986, 0.6856, 0.6677, 0.6892, 0.7778, 0.6873, 0.6799, 0.5941, 0.6023, 0.5996, 0.7812, 0.9592, 0.6938, 0.6655, 0.9632, 0.9627, 0.7367, 0.7505, 0.7511, 0.7365, 0.6275, 0.8351, 0.5961, 0.7668, 0.9544, 0.7073, 0.6663, 0.6988, 0.5976, 0.6299, 0.6485, 0.7591, 0.6819, 0.8317, 0.6896, 0.7268, 0.8187, 0.6731, 0.672, 0.8154, 0.5878, 0.9753, 0.6851, 0.5986, 0.6916, 0.5983, 0.5802, 0.665, 0.6824, 0.9807, 0.9787, 0.9848, 0.9843, 0.9811, 0.6243, 0.736, 0.9826, 0.7226, 0.6154, 0.736, 0.6891, 0.8117, 0.6663, 0.8253, 0.7786, 0.8476, 0.7861, 0.5836, 0.652, 0.9528, 0.9038, 0.9931, 0.9347, 0.9806, 0.9268, 0.9303, 0.6652, 0.9781, 0.9289, 0.9842, 0.6508, 0.9253, 0.9414, 0.9853, 0.9848, 0.7762, 0.9304, 0.8431, 0.775, 0.9788, 0.7403, 0.9042, 0.9316, 0.8481, 0.8459, 0.9943, 0.9777, 0.9391, 0.8707, 0.6485, 0.6958, 0.9887, 0.8596, 0.9527, 0.9092, 0.9394, 0.8102, 0.6768, 0.6708, 0.6242, 0.9469, 0.9708, 0.6984];
    //semi-major-axis
    let a = [17.93, 2.22, 3.535, 3.101, 3.419, 5.7, 17.18, 16.66, 3.49, 3.56, 15.64, 3.5, 17.07, 4.086, 3.027, 9.093, 4.944, 28.84, 3.085, 3.026, 3.093, 10.34, 6.023, 3.462, 4.347, 3.091, 3.067, 3.062, 3.063, 3.062, 3.063, 3.065, 3.044, 3.064, 3.076, 3.068, 3.052, 3.085, 3.118, 3.07, 3.334, 3.061, 3.024, 3.002, 3.112, 3.083, 3.332, 3.073, 2.941, 3.042, 3.083, 3.068, 3.096, 2.908, 3.087, 3.075, 3.111, 2.786, 3.058, 3.128, 3.036, 3.076, 3.072, 3.144, 3.088, 3.087, 3.141, 3.001, 3.058, 3.062, 2.678, 3.05, 2.8, 2.647, 2.961, 2.968, 3.134, 2.979, 2.958, 2.989, 2.98, 2.959, 2.96, 3.041, 3.045, 3.091, 2.959, 3.047, 3.048, 2.96, 3.054, 2.984, 3.115, 3.092, 2.888, 3.134, 4.502, 3.116, 3.034, 3.031, 3.004, 2.981, 5.185, 3.035, 3.475, 3.208, 26.09, 17.68, 3.055, 3.01, 3.009, 3.066, 3.368, 7.73, 3.053, 2.606, 24.3, 3.839, 2.931, 3.1, 2.918, 2.867, 3.234, 3.872, 2.949, 3.176, 3.944, 2.857, 2.77, 3.047, 3.025, 6.935, 3.06, 32.83, 3.045, 3.194, 2.699, 3.104, 2.957, 3.573, 3.103, 2.427, 2.516, 2.582, 2.888, 2.61, 3.406, 4.223, 3.043, 2.878, 2.907, 4.799, 3.607, 2.795, 3.022, 2.976, 5.62, 2.665, 3.153, 3.073, 3.729, 23.56, 7.053, 27.4, 17.1, 31.97, 17.61, 15.03, 3.29, 19.2, 13.81, 3.099, 3.527, 13.3, 17.93, 3.216, 3.224, 2.568, 9.324, 7.818, 3.093, 3.078, 3.08, 8.26, 16.31, 8.503, 7.482, 4.989, 15.55, 19.55, 9.865, 3.025, 2.998, 22.64, 3.603, 26.82, 1.02, 1.391, 4.196, 2.977, 3.746, 3.285, 19.33, 28.47, 2.229];
    //Inclination
    let i = [162.2, 11.48, 13.22, 29.38, 22.33, 54.98, 74.19, 44.63, 6.8, 17.76, 40.89, 32.0, 19.33, 11.73, 22.47, 29.22, 11.73, 64.21, 9.23, 4.25, 11.75, 162.49, 18.67, 7.04, 9.23, 11.24, 11.42, 11.4, 11.38, 11.41, 11.39, 11.39, 11.38, 11.39, 11.4, 11.39, 11.38, 11.41, 11.42, 11.39, 11.05, 11.4, 11.36, 11.57, 11.42, 11.4, 11.55, 11.34, 11.3, 11.37, 11.41, 11.37, 11.41, 11.24, 11.41, 11.33, 11.43, 11.14, 11.43, 11.44, 11.54, 11.41, 11.33, 11.47, 11.41, 11.41, 11.46, 11.33, 11.38, 11.4, 10.98, 11.43, 11.13, 10.93, 11.27, 11.19, 11.46, 10.97, 11.32, 11.32, 11.32, 11.29, 11.3, 11.37, 11.37, 11.41, 11.29, 11.38, 11.38, 11.29, 11.39, 11.32, 11.44, 11.24, 11.05, 11.24, 11.61, 11.26, 11.2, 2.89, 2.94, 2.94, 4.3, 58.14, 13.61, 5.7, 113.45, 85.38, 13.98, 12.79, 12.81, 13.95, 11.18, 95.7, 27.82, 11.3, 31.22, 16.98, 16.91, 14.0, 20.4, 25.56, 33.2, 10.19, 21.33, 10.22, 12.88, 5.15, 8.4, 10.42, 18.33, 29.08, 11.54, 136.4, 5.9, 18.54, 5.68, 8.36, 11.96, 15.07, 4.89, 19.74, 12.59, 5.37, 5.43, 5.26, 16.33, 131.88, 13.27, 12.15, 7.28, 8.9, 9.37, 23.38, 18.92, 29.44, 15.39, 7.87, 1.55, 5.47, 2.99, 40.07, 76.86, 32.69, 22.35, 26.01, 37.86, 151.17, 5.95, 83.06, 19.19, 26.63, 8.19, 80.25, 115.91, 14.12, 13.58, 11.48, 160.04, 31.88, 9.9, 23.35, 9.59, 147.05, 17.57, 84.38, 172.51, 69.62, 149.26, 155.28, 27.59, 12.28, 24.64, 44.82, 18.47, 23.47, 28.15, 37.56, 12.17, 11.51, 20.02, 10.73, 38.31, 140.5, 10.05];
    //Longitude of ascending node
    let omega = [59.07, 334.29, 250.67, 102.97, 93.42, 270.34, 255.86, 85.84, 13.75, 240.88, 348.01, 195.4, 311.59, 79.67, 211.66, 250.96, 67.92, 355.98, 141.06, 88.93, 82.16, 235.27, 22.0, 50.14, 35.44, 69.66, 69.94, 69.89, 69.84, 69.92, 69.91, 69.91, 69.83, 69.9, 69.94, 69.91, 69.9, 69.96, 70.14, 69.91, 81.99, 69.89, 69.83, 66.63, 70.04, 69.94, 70.63, 70.58, 69.57, 69.86, 69.93, 70.22, 69.97, 69.85, 69.96, 70.71, 69.97, 69.39, 69.38, 69.98, 68.12, 69.89, 70.39, 69.97, 69.92, 69.97, 69.98, 69.85, 69.91, 69.87, 69.48, 69.47, 69.59, 69.5, 69.92, 70.47, 69.96, 71.42, 69.69, 69.83, 69.72, 69.8, 69.75, 69.88, 69.9, 69.97, 69.78, 69.88, 69.89, 69.81, 69.87, 69.83, 69.94, 69.66, 70.74, 69.52, 67.33, 69.49, 69.77, 307.84, 309.38, 309.31, 359.4, 94.25, 219.75, 207.21, 139.38, 79.62, 241.88, 246.16, 246.14, 241.82, 289.43, 1.4, 31.24, 176.19, 272.07, 37.68, 75.1, 214.1, 282.2, 66.4, 204.38, 198.34, 62.88, 93.87, 125.62, 7.13, 239.85, 190.95, 279.78, 218.01, 105.81, 320.43, 68.92, 314.34, 95.69, 341.5, 275.69, 111.37, 295.96, 165.27, 359.52, 324.23, 323.7, 324.67, 258.85, 115.56, 43.4, 46.22, 354.39, 259.36, 3.31, 257.79, 180.53, 283.72, 295.85, 76.26, 134.47, 6.75, 171.75, 158.95, 2.4, 88.67, 67.13, 58.27, 172.29, 177.29, 132.25, 28.44, 329.43, 81.6, 148.45, 10.56, 113.36, 13.21, 50.19, 176.47, 25.42, 309.95, 4.0, 312.57, 31.76, 206.47, 288.07, 315.76, 277.08, 95.88, 287.74, 191.11, 153.87, 307.6, 139.38, 120.58, 240.11, 71.25, 173.43, 165.26, 262.4, 301.16, 99.63, 239.78, 164.57, 233.83, 139.78];
    //Argument of perihelion
    let w = [112.21, 187.03, 221.66, 14.95, 172.51, 207.51, 198.99, 64.58, 347.63, 166.05, 57.08, 172.81, 129.61, 58.0, 1.8, 195.96, 209.16, 29.3, 62.17, 326.34, 356.34, 172.5, 257.34, 12.8, 338.47, 199.39, 198.83, 198.8, 198.87, 198.77, 198.77, 198.77, 198.87, 198.79, 198.75, 198.78, 198.76, 198.72, 198.5, 198.77, 181.56, 198.81, 198.84, 203.11, 198.63, 198.74, 198.01, 197.91, 199.11, 198.82, 198.75, 198.37, 198.71, 198.72, 198.71, 197.74, 198.73, 199.21, 199.33, 198.72, 201.09, 198.8, 198.17, 198.74, 198.77, 198.71, 198.72, 198.81, 198.76, 198.86, 199.09, 199.25, 199.02, 199.04, 198.69, 197.93, 198.75, 196.46, 199.0, 198.81, 198.95, 198.84, 198.91, 198.8, 198.78, 198.7, 198.86, 198.79, 198.77, 198.85, 198.82, 198.84, 198.77, 199.35, 199.85, 199.39, 198.68, 199.38, 199.46, 253.27, 251.57, 251.72, 37.62, 14.79, 181.3, 227.25, 152.98, 13.0, 153.62, 149.24, 149.29, 153.57, 157.44, 47.09, 356.32, 217.96, 60.45, 333.8, 51.43, 181.94, 15.31, 188.75, 181.36, 273.0, 152.64, 345.77, 246.77, 345.43, 64.81, 343.31, 179.59, 171.17, 34.57, 20.19, 9.85, 234.17, 222.87, 0.77, 334.74, 203.68, 0.67, 172.41, 49.05, 353.17, 354.85, 354.65, 347.0, 26.15, 58.7, 211.97, 37.38, 162.78, 112.29, 210.74, 351.9, 215.91, 263.49, 178.7, 225.02, 301.05, 167.78, 358.16, 265.28, 121.31, 97.48, 31.46, 335.57, 138.76, 240.46, 194.77, 41.48, 21.95, 219.86, 116.42, 142.09, 45.73, 52.17, 217.67, 41.44, 117.41, 358.55, 146.62, 118.02, 214.76, 192.19, 338.41, 249.62, 234.96, 13.39, 20.4, 67.53, 332.52, 2.27, 177.8, 207.64, 328.45, 171.61, 116.42, 46.09, 21.19, 210.45, 180.89, 105.89, 281.57, 53.71];

    const updatePositionVS = computeVertexShader;

    const updatePositionFS = computeFragmentShader;

    const drawParticlesVS = particleVertexShader;

    const drawParticlesFS = particleFragmentShader;

    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) {
    return;
    }
    // check we can use floating point textures
    const ext1 = gl.getExtension('OES_texture_float');
    if (!ext1) {
    alert('Need OES_texture_float');
    return;
    }
    // check we can render to floating point textures
    const ext2 = gl.getExtension('WEBGL_color_buffer_float');
    if (!ext2) {
    alert('Need WEBGL_color_buffer_float');
    return;
    }
    // check we can use textures in a vertex shader
    if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 1) {
    alert('Can not use textures in vertex shaders');
    return;
    }

    const updatePositionProgram = webglUtils.createProgramFromSources(
        gl, [updatePositionVS, updatePositionFS]);
    const drawParticlesProgram = webglUtils.createProgramFromSources(
        gl, [drawParticlesVS, drawParticlesFS]);

    const updatePositionPrgLocs = {
    position: gl.getAttribLocation(updatePositionProgram, 'position'),
    positionTex: gl.getUniformLocation(updatePositionProgram, 'positionTex'),
    velocityTex: gl.getUniformLocation(updatePositionProgram, 'velocityTex'),
    texDimensions: gl.getUniformLocation(updatePositionProgram, 'texDimensions'),
    canvasDimensions: gl.getUniformLocation(updatePositionProgram, 'canvasDimensions'),
    deltaTime: gl.getUniformLocation(updatePositionProgram, 'deltaTime'),
    };

    const drawParticlesProgLocs = {
    id: gl.getAttribLocation(drawParticlesProgram, 'id'),
    positionTex: gl.getUniformLocation(drawParticlesProgram, 'positionTex'),
    texDimensions: gl.getUniformLocation(drawParticlesProgram, 'texDimensions'),
    matrix: gl.getUniformLocation(drawParticlesProgram, 'matrix'),
    };


    // setup a full canvas clip space quad
    const updatePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, updatePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
        1, -1,
    -1,  1,
    -1,  1,
        1, -1,
        1,  1,
    ]), gl.STATIC_DRAW);

    // setup an id buffer
    const particleTexWidth = 100;
    const particleTexHeight = 100;
    const numParticles = particleTexWidth * particleTexHeight;
    const ids = new Array(numParticles).fill(0).map((_, i) => i);
    const idBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ids), gl.STATIC_DRAW);

    // we're going to base the initial positions on the size
    // of the canvas so lets update the size of the canvas
    // to the initial size we want
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // create random positions and velocities.
    const rand = (min, max) => {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min;
    };
    const positions = new Float32Array(
        ids.map(_ => [rand(canvas.width), rand(canvas.height), 0, 0]).flat());
    const velocities = new Float32Array(
        ids.map(_ => [rand(-300, 300), rand(-300, 300), 0, 0]).flat());

    function createTexture(gl, data, width, height) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,        // mip level
        gl.RGBA,  // internal format
        width,
        height,
        0,        // border
        gl.RGBA,  // format
        gl.FLOAT, // type
        data,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
    }

    // create a texture for the velocity and 2 textures for the positions.
    const velocityTex = createTexture(gl, velocities, particleTexWidth, particleTexHeight);
    const positionTex1 = createTexture(gl, positions, particleTexWidth, particleTexHeight);
    const positionTex2 = createTexture(gl, null, particleTexWidth, particleTexHeight);

    function createFramebuffer(gl, tex) {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return fb;
    }

    // create 2 framebuffers. One that renders to positionTex1 one
    // and another that renders to positionTex2

    const positionsFB1 = createFramebuffer(gl, positionTex1);
    const positionsFB2 = createFramebuffer(gl, positionTex2);

    let oldPositionsInfo = {
    fb: positionsFB1,
    tex: positionTex1,
    };
    let newPositionsInfo = {
    fb: positionsFB2,
    tex: positionTex2,
    };

    let then = 0;
    function render(time) {
    // convert to seconds
    time *= 0.001;
    // Subtract the previous time from the current time
    const deltaTime = time - then;
    // Remember the current time for the next frame.
    then = time;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // render to the new positions
    gl.bindFramebuffer(gl.FRAMEBUFFER, newPositionsInfo.fb);
    gl.viewport(0, 0, particleTexWidth, particleTexHeight);

    // setup our attributes to tell WebGL how to pull
    // the data from the buffer above to the position attribute
    // this buffer just contains a -1 to +1 quad for rendering
    // to every pixel
    gl.bindBuffer(gl.ARRAY_BUFFER, updatePositionBuffer);
    gl.enableVertexAttribArray(updatePositionPrgLocs.position);
    gl.vertexAttribPointer(
        updatePositionPrgLocs.position,
        2,         // size (num components)
        gl.FLOAT,  // type of data in buffer
        false,     // normalize
        0,         // stride (0 = auto)
        0,         // offset
    );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, oldPositionsInfo.tex);
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, velocityTex);

    gl.useProgram(updatePositionProgram);
    gl.uniform1i(updatePositionPrgLocs.positionTex, 0);  // tell the shader the position texture is on texture unit 0
    gl.uniform1i(updatePositionPrgLocs.velocityTex, 1);  // tell the shader the position texture is on texture unit 1
    gl.uniform2f(updatePositionPrgLocs.texDimensions, particleTexWidth, particleTexHeight);
    gl.uniform2f(updatePositionPrgLocs.canvasDimensions, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(updatePositionPrgLocs.deltaTime, deltaTime);

    gl.drawArrays(gl.TRIANGLES, 0, 6);  // draw 2 triangles (6 vertices)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // setup our attributes to tell WebGL how to pull
    // the data from the buffer above to the id attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
    gl.enableVertexAttribArray(drawParticlesProgLocs.id);
    gl.vertexAttribPointer(
        drawParticlesProgLocs.id,
        1,         // size (num components)
        gl.FLOAT,  // type of data in buffer
        false,     // normalize
        0,         // stride (0 = auto)
        0,         // offset
    );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, newPositionsInfo.tex);

    gl.useProgram(drawParticlesProgram);
    gl.uniform2f(drawParticlesProgLocs.texDimensions, particleTexWidth, particleTexWidth);
    gl.uniform1i(drawParticlesProgLocs.positionTex, 0);  // tell the shader the position texture is on texture unit 0
    gl.uniformMatrix4fv(
        drawParticlesProgLocs.matrix,
        false,
        m4.orthographic(0, gl.canvas.width, 0, gl.canvas.height, -1, 1));

    gl.drawArrays(gl.POINTS, 0, numParticles);

    // swap which texture we will read from
    // and which one we will write to
    {
        const temp = oldPositionsInfo;
        oldPositionsInfo = newPositionsInfo;
        newPositionsInfo = temp;
    }

    requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();