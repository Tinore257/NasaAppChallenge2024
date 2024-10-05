'use strict';

/* eslint no-alert: 0 */

var csv_data_string;

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function calculatePlanetPosition(e, a, q, i, node, peri, M0, n, t0, t) {
    // Constants
    const DEG_TO_RAD = Math.PI / 180;

    // Mean anomaly at time t
    let M = M0 + n * (t - t0);

    // Solve Kepler's equation for Eccentric Anomaly E
    let E = M;
    let deltaE;
    do {
        deltaE = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
        E += deltaE;
    } while (Math.abs(deltaE) > 1e-6);

    // True anomaly ν
    let ν = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));

    // Heliocentric distance r
    let r = a * (1 - e * Math.cos(E));

    // Heliocentric coordinates
    let x = r * (Math.cos(node) * Math.cos(peri + ν) - Math.sin(node) * Math.sin(peri + ν) * Math.cos(i));
    let y = r * (Math.sin(node) * Math.cos(peri + ν) + Math.cos(node) * Math.sin(peri + ν) * Math.cos(i));
    let z = r * (Math.sin(peri + ν) * Math.sin(i));

    return { x: x, y: y, z: z };
}


function main() {

    let dayOfYear = 200;

    let t_eph = 2024 + dayOfYear/356;

    

    let csv_data_array = CSVToArray(csv_data_string);
    csv_data_array = csv_data_array.slice(1,csv_data_array.length-1 );

    let transposed_data_array = csv_data_array[0].map((_, colIndex) => csv_data_array.map(row => row[colIndex]));

    //"spkid","full_name","name","diameter","e","a","q","i","om"(),"w" (peri),"ma","albedo","n","epoch"
    // Example usage
    let e = parseFloat(transposed_data_array[4][0]); // Eccentricity
    let a = parseFloat(transposed_data_array[5][0]); // Semi-major axis in AU
    let q = parseFloat(transposed_data_array[6][0]) // Perihelion distance in AU
    let i = parseFloat(transposed_data_array[7][0]); // Inclination in degrees
    let node = parseFloat(transposed_data_array[8][0]); // Longitude of the ascending node in degrees
    let peri = parseFloat(transposed_data_array[9][0]); // Argument of perihelion in degrees
    let M0 = parseFloat(transposed_data_array[10][0]); // Mean anomaly at epoch in degrees
    let n = parseFloat(transposed_data_array[12][0]); // Mean motion in degrees per day
    let t0 = parseFloat(transposed_data_array[13][0]); // Epoch in Julian days
    //let t = parseFloat(transposed_data_array[13][0]); // Given timestamp in Julian days

    

    for (let day = 0; day < 365; day++){
        let t_temp = ((2024 + 365/day == 0? 1 : day) - 2451545.0)/36525; 
        let position = calculatePlanetPosition(e, a, q, i, node, peri, M0, n, t0, t_temp);
        console.log(position);
    }


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
var client = new XMLHttpRequest();
client.open('GET', 'data/sbdb_query_results.csv');
client.onreadystatechange = function() { 
    if (this.readyState == 4 && this.status == 200) {
        csv_data_string = client.responseText;
        main();
    }   
}
client.send();

