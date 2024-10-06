'use strict';

/* eslint no-alert: 0 */

var csv_data_string;


const zip = (a, b) => a.map((k, i) => [k, b[i]]);


var pressedKeys = [];

var cameraRotation = [0,2];

var cameraDistance = 1;




function inputHandler(deltT){
    if(pressedKeys.includes("ArrowRight")){
        cameraRotation[1] = (cameraRotation[1] + 1 * deltT);
    }
    if(pressedKeys.includes("ArrowLeft")){
        cameraRotation[1] = (cameraRotation[1] - 1 * deltT);
    }
    //vertical
    if(pressedKeys.includes("ArrowUp")){
        cameraRotation[0] = (cameraRotation[0] + 1 * deltT)
    }
    if(pressedKeys.includes("ArrowDown")){
        cameraRotation[0] = (cameraRotation[0] - 1 * deltT);
    }

    //forward
    if(pressedKeys.includes("w")){
        cameraDistance = (cameraDistance + 1 * deltT * 5)
    }
    if(pressedKeys.includes("s")){
        cameraDistance = (cameraDistance - 1 * deltT * 5);
    }

    

    while(cameraRotation[1] < 0.0){
        cameraRotation[1] += (Math.PI * 2.0);
    }
    while(cameraRotation[0] < 0.0){
        cameraRotation[0] += (Math.PI * 2.0);
    }
    while(cameraRotation[1] > (Math.PI*2.0)){
        cameraRotation[1] -= (Math.PI * 2.0);
    }
    while(cameraRotation[0] > (Math.PI*2.0)){
        cameraRotation[0] -= (Math.PI * 2.0);
    }

}

function main() {

    document.addEventListener('keydown', (event) => {
        const keyName = event.key;
        if(!pressedKeys.includes(keyName)) {
            pressedKeys.push(keyName);
        }
    });

    document.addEventListener('keyup', (event) => {
        const keyName = event.key;
        while(pressedKeys.includes(keyName)) {
            pressedKeys.pop(keyName);
        }
    }); 

    let csv_data_array = CSVToArray(csv_data_string);
    csv_data_array = csv_data_array.slice(1,csv_data_array.length-1 );

    let transposed_data_array = csv_data_array[0].map((_, colIndex) => csv_data_array.map(row => row[colIndex]));

    //"spkid","full_name","name","diameter","e","a","q","i","om"(),"w" (peri),"ma","albedo","n","epoch"
   
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

    //e, a, q ,i ,node, peri ,M0 ,n , t0
    const updatePositionPrgLocs = {
    position: gl.getAttribLocation(updatePositionProgram, 'position'),
    eTex: gl.getUniformLocation(updatePositionProgram, 'eTex'),
    aTex: gl.getUniformLocation(updatePositionProgram, 'aTex'),
    qTex: gl.getUniformLocation(updatePositionProgram, 'qTex'),
    iTex: gl.getUniformLocation(updatePositionProgram, 'iTex'),
    nodeTex: gl.getUniformLocation(updatePositionProgram, 'nodeTex'),
    periTex: gl.getUniformLocation(updatePositionProgram, 'periTex'),
    M0Tex: gl.getUniformLocation(updatePositionProgram, 'M0Tex'),
    nTex: gl.getUniformLocation(updatePositionProgram, 'nTex'),
    t0Tex: gl.getUniformLocation(updatePositionProgram, 't0Tex'),
    texDimensions: gl.getUniformLocation(updatePositionProgram, 'texDimensions'),
    canvasDimensions: gl.getUniformLocation(updatePositionProgram, 'canvasDimensions'),
    deltaTime: gl.getUniformLocation(updatePositionProgram, 'deltaTime'),
    };

    const drawParticlesProgLocs = {
    id: gl.getAttribLocation(drawParticlesProgram, 'id'),
    positionTex: gl.getUniformLocation(drawParticlesProgram, 'positionTex'),
    albedoTex: gl.getUniformLocation(drawParticlesProgram, 'albedoTex'),
    diameterTex: gl.getUniformLocation(drawParticlesProgram, 'diameterTex'),
    texDimensions: gl.getUniformLocation(drawParticlesProgram, 'texDimensions'),
    perspective: gl.getUniformLocation(drawParticlesProgram, 'P'),
    view: gl.getUniformLocation(drawParticlesProgram, 'V'),
    heightOfNearPlane: gl.getUniformLocation(drawParticlesProgram, 'heightOfNearPlane'),
    };


    // setup a full canvas clip space quad
    const updatePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, updatePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1,  1, -1,  1,  1, -1, 1,  1,]), gl.STATIC_DRAW);

    // setup an id buffer
    const particleTexWidth = 10;
    const particleTexHeight = 10;
    const numParticles = particleTexWidth * particleTexHeight;
    const ids = new Array(numParticles).fill(0).map((_, i) => i);
    const idBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ids), gl.STATIC_DRAW);

    // we're going to base the initial positions on the size
    // of the canvas so lets update the size of the canvas
    // to the initial size we want
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);


    // e 4, a 5, q 6, i 7, node 8, peri 9, M0 10, n 12,  t0 13

    const positions = new Float32Array(
        ids.map(_ => [0.5, 0.5, 0, 0]).flat());
    //e, a, q ,i ,node, peri ,M0 ,n , t0
    const e_array = new Float32Array(
        ids.map(i => [transposed_data_array[4][i], 0, 0, 0]).flat());
    const a_array = new Float32Array(
        ids.map(i => [transposed_data_array[5][i], 0, 0, 0]).flat());
    const q_array = new Float32Array(
        ids.map(i => [transposed_data_array[6][i], 0, 0, 0]).flat());
    const i_array = new Float32Array(
        ids.map(i => [transposed_data_array[7][i], 0, 0, 0]).flat());
    const node_array = new Float32Array(
        ids.map(i => [transposed_data_array[8][i], 0, 0, 0]).flat());
    const peri_array = new Float32Array(
        ids.map(i => [transposed_data_array[9][i], 0, 0, 0]).flat());
    const M0_array = new Float32Array(
        ids.map(i => [transposed_data_array[10][i], 0, 0, 0]).flat());
    const n_array = new Float32Array(
        ids.map(i => [transposed_data_array[12][i], 0, 0, 0]).flat());
    const t0_array = new Float32Array(
        ids.map(i => [transposed_data_array[13][i], 0, 0, 0]).flat());
    const albedo_array = new Float32Array(
        ids.map(i => [transposed_data_array[11][i], 0, 0, 0]).flat());
        //ids.map(i => [0, 0, 1, 0]).flat());
    const diameter_array = new Float32Array(
        ids.map(i => [transposed_data_array[3][i], 0, 0, 0]).flat());

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

    //e, a, q ,i ,node, peri ,M0 ,n , t0
    // create a texture for the velocity and 2 textures for the positions.
    const eTex = createTexture(gl, e_array, particleTexWidth, particleTexHeight);
    const aTex = createTexture(gl, a_array, particleTexWidth, particleTexHeight);
    const qTex = createTexture(gl, q_array, particleTexWidth, particleTexHeight);
    const iTex = createTexture(gl, i_array, particleTexWidth, particleTexHeight);
    const nodeTex = createTexture(gl, node_array, particleTexWidth, particleTexHeight);
    const periTex = createTexture(gl, peri_array, particleTexWidth, particleTexHeight);
    const M0Tex = createTexture(gl, M0_array, particleTexWidth, particleTexHeight);
    const nTex = createTexture(gl, n_array, particleTexWidth, particleTexHeight);
    const t0Tex = createTexture(gl, t0_array, particleTexWidth, particleTexHeight);
    const positionTex1 = createTexture(gl, positions, particleTexWidth, particleTexHeight);

    const albedoTex = createTexture(gl, albedo_array, particleTexWidth, particleTexHeight);
    const diameterTex = createTexture(gl, diameter_array, particleTexWidth, particleTexHeight);

    function createFramebuffer(gl, tex) {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return fb;
    }

    // create 2 framebuffers. One that renders to positionTex1 one
    // and another that renders to positionTex2

    const positionsFB1 = createFramebuffer(gl, positionTex1);
    //const positionsFB2 = createFramebuffer(gl, positionTex2);
    
    let planetPositionInfo = {
        fb: positionsFB1,
        tex: positionTex1,
    };
    /*
    let newPositionsInfo = {
    fb: positionsFB2,
    tex: positionTex2,
    };*/

    let then = 0;
    let globalTime = 0.1;
    let globalDate = new Date('2024-10-05T19:59:34');
    function render(time) {

        
    // convert to seconds
    time *= 0.001;
    // Subtract the previous time from the current time
    const deltaTime = time - then;
    globalTime += deltaTime * 1.0;
    globalDate = addDays(globalDate, 5000*deltaTime);
    // Remember the current time for the next frame.
    then = time;

    inputHandler(deltaTime);

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // render to the new positions
    gl.bindFramebuffer(gl.FRAMEBUFFER, planetPositionInfo.fb);
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

    //e, a, q ,i ,node, peri ,M0 ,n , t0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, eTex);
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, aTex);
    gl.activeTexture(gl.TEXTURE0 + 2);
    gl.bindTexture(gl.TEXTURE_2D, qTex);
    gl.activeTexture(gl.TEXTURE0 + 3);
    gl.bindTexture(gl.TEXTURE_2D, iTex);
    gl.activeTexture(gl.TEXTURE0 + 4);
    gl.bindTexture(gl.TEXTURE_2D, nodeTex);
    gl.activeTexture(gl.TEXTURE0 + 5);
    gl.bindTexture(gl.TEXTURE_2D, periTex);
    gl.activeTexture(gl.TEXTURE0 + 6);
    gl.bindTexture(gl.TEXTURE_2D, M0Tex);
    gl.activeTexture(gl.TEXTURE0 + 7);
    gl.bindTexture(gl.TEXTURE_2D, nTex);
    gl.activeTexture(gl.TEXTURE0 + 8);
    gl.bindTexture(gl.TEXTURE_2D, t0Tex);

    gl.useProgram(updatePositionProgram);
    gl.uniform1i(updatePositionPrgLocs.eTex, 0);  // tell the shader the position texture is on texture unit 0
    gl.uniform1i(updatePositionPrgLocs.aTex, 1);  // tell the shader the position texture is on texture unit 1
    gl.uniform1i(updatePositionPrgLocs.qTex, 2);  // tell the shader the position texture is on texture unit 1
    gl.uniform1i(updatePositionPrgLocs.iTex, 3);  // tell the shader the position texture is on texture unit 1
    gl.uniform1i(updatePositionPrgLocs.nodeTex, 4);  // tell the shader the position texture is on texture unit 1
    gl.uniform1i(updatePositionPrgLocs.periTex, 5);  // tell the shader the position texture is on texture unit 1
    gl.uniform1i(updatePositionPrgLocs.M0Tex, 6);  // tell the shader the position texture is on texture unit 1
    gl.uniform1i(updatePositionPrgLocs.nTex, 7);  // tell the shader the position texture is on texture unit 1
    gl.uniform1i(updatePositionPrgLocs.t0Tex, 8);  // tell the shader the position texture is on texture unit 1
    gl.uniform2f(updatePositionPrgLocs.texDimensions, particleTexWidth, particleTexHeight);
    gl.uniform2f(updatePositionPrgLocs.canvasDimensions, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(updatePositionPrgLocs.deltaTime, (toJulianDay(globalDate) - 2451545.0)/36525.0);
    console.log("cameraRotation "+ cameraRotation + " cameraDistance " + cameraDistance );
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
    gl.bindTexture(gl.TEXTURE_2D, planetPositionInfo.tex);
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, albedoTex);
    gl.activeTexture(gl.TEXTURE0 + 2);
    gl.bindTexture(gl.TEXTURE_2D, diameterTex);
    
    gl.useProgram(drawParticlesProgram);
    gl.uniform2f(drawParticlesProgLocs.texDimensions, particleTexWidth, particleTexWidth);
    gl.uniform1i(drawParticlesProgLocs.positionTex, 0);  // tell the shader the position texture is on texture unit 0
    gl.uniform1i(drawParticlesProgLocs.albedoTex, 1);
    gl.uniform1i(drawParticlesProgLocs.diameterTex, 2)
    let transl = m4.translation(...[0, 0, cameraDistance]);
    
    let view = 
        m4.multiply(
            m4.multiply(transl,
            m4.axisRotation([1,0,0], cameraRotation[0]),
            ),
            m4.axisRotation([0,1,0], cameraRotation[1])
        );
    //perspective
    gl.uniformMatrix4fv(
        drawParticlesProgLocs.perspective,
        false,
        m4.perspective(Math.PI/2, gl.canvas.width/gl.canvas.height, 0.001, 10000)
    );
    //view
    gl.uniformMatrix4fv(
        drawParticlesProgLocs.view,
        false,
        view
    );
    let fovy = 90; // degrees
    let viewport = gl.getParameter(gl.VIEWPORT);
    let heightOfNearPlane = Math.abs(viewport[3]-viewport[1]) / (2*Math.tan(0.5*fovy*Math.PI/180.0));
    //view
    gl.uniform1f(
        drawParticlesProgLocs.heightOfNearPlane,
        false,
        heightOfNearPlane
    );

    gl.drawArrays(gl.POINTS, 0, numParticles);

    // swap which texture we will read from
    // and which one we will write to
    /*{
        const temp = oldPositionsInfo;
        oldPositionsInfo = newPositionsInfo;
        newPositionsInfo = temp;
    }*/

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

