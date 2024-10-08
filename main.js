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
    if(pressedKeys.includes("w") || pressedKeys.includes("p") ){
        cameraDistance = (cameraDistance + 1 * deltT * 1)
    }
    if(pressedKeys.includes("s")){
        cameraDistance = (cameraDistance - 1 * deltT * 1);
    }

     //forward
     if(pressedKeys.includes("i")){
        cameraDistance = (cameraDistance + 1 * deltT * 0.01)
    }
    if(pressedKeys.includes("k")){
        cameraDistance = (cameraDistance - 1 * deltT * 0.01);
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

function generateSphereVertices(radius, latitudeBands, longitudeBands) {
    const vertices = [];
    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        const theta = latNumber * Math.PI / latitudeBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            const phi = longNumber * 2 * Math.PI / longitudeBands;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;
            vertices.push(radius * x, radius * y, radius * z);
        }
    }
    return new Float32Array(vertices);
}

function generateSphereIndices(latitudeBands, longitudeBands) {
    const indices = [];

    for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
            const first = (latNumber * (longitudeBands + 1)) + longNumber;
            const second = first + longitudeBands + 1;

            indices.push(first);
            indices.push(second);
            indices.push(first + 1);

            indices.push(second);
            indices.push(second + 1);
            indices.push(first + 1);
        }
    }

    return indices;
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
   
    const ellipsisPositionFS = computeEllipsisFragmentShader;

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

    const ext = gl.getExtension('ANGLE_instanced_arrays');
    if (!ext) {
    return alert('need ANGLE_instanced_arrays');
    }

    gl.enable(gl.DEPTH_TEST);

    const updatePositionProgram = webglUtils.createProgramFromSources(
        gl, [updatePositionVS, updatePositionFS]);
    const drawParticlesProgram = webglUtils.createProgramFromSources(
        gl, [drawParticlesVS, drawParticlesFS]);

    //e, a, q ,i ,node, peri ,M0 ,n , t0
    const updatePositionPrgLocs = {
        position: gl.getAttribLocation(updatePositionProgram, 'position'),
        eaqiTex: gl.getUniformLocation(updatePositionProgram, 'eaqiTex'),
        nodeperiM0nTex: gl.getUniformLocation(updatePositionProgram, 'nodeperiM0nTex'),
        t0Tex: gl.getUniformLocation(updatePositionProgram, 't0Tex'),
        TTex: gl.getUniformLocation(updatePositionProgram, 'TTex'),
        indexTex: gl.getUniformLocation(updatePositionProgram, 'indexTex'),
        texDimensions: gl.getUniformLocation(updatePositionProgram, 'texDimensions'),
        canvasDimensions: gl.getUniformLocation(updatePositionProgram, 'canvasDimensions'),
        deltaTime: gl.getUniformLocation(updatePositionProgram, 'deltaTime'),
        texIndexDimensions: gl.getUniformLocation(updatePositionProgram, 'texIndexDimensions'),
        planetId: gl.getUniformLocation(updatePositionProgram, 'planetId'),
        isEllipsis: gl.getUniformLocation(updatePositionProgram, 'isEllipsis'),
    };

    const drawParticlesProgLocs = {
        id: gl.getAttribLocation(drawParticlesProgram, 'id'),
        a_position: gl.getAttribLocation(drawParticlesProgram, 'a_position'),
        positionTex: gl.getUniformLocation(drawParticlesProgram, 'positionTex'),
        albedoTex: gl.getUniformLocation(drawParticlesProgram, 'albedoTex'),
        diameterTex: gl.getUniformLocation(drawParticlesProgram, 'diameterTex'),
        texDimensions: gl.getUniformLocation(drawParticlesProgram, 'texDimensions'),
        perspective: gl.getUniformLocation(drawParticlesProgram, 'P'),
        view: gl.getUniformLocation(drawParticlesProgram, 'V'),
        isEllipsis: gl.getUniformLocation(drawParticlesProgram, 'isEllipsis'),
    };

    let planetVertices = [];
    let planetLats = 20;
    let planetLongs = 20;
    let vertexIndexSphere = generateSphereVertices(0.5, planetLats, planetLongs );
    let indexSphere = generateSphereIndices(planetLats, planetLongs);
    for (let i = 0; i < indexSphere.length; i++){
        let index = indexSphere[i];
        planetVertices.push(vertexIndexSphere[index*3] );
        planetVertices.push(vertexIndexSphere[index*3+1]);
        planetVertices.push(vertexIndexSphere[index*3+2]);
    }

    const planetVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, planetVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planetVertices), gl.STATIC_DRAW);

    // setup a full canvas clip space quad
    const updatePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, updatePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1,  1, -1,  1,  1, -1, 1,  1,]), gl.STATIC_DRAW);

    // setup an id buffer
    const particleTexWidth = 100;
    const particleTexHeight = 100;
    const numParticles = particleTexWidth * particleTexHeight;
    const ids = new Array(numParticles).fill(0).map((_, i) => i);
    const idBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ids), gl.DYNAMIC_DRAW);

    // we're going to base the initial positions on the size
    // of the canvas so lets update the size of the canvas
    // to the initial size we want
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);


    // e 4, a 5, q 6, i 7, node 8, peri 9, M0 10, n 12,  t0 13


    const positions = new Float32Array(
        ids.map(_ => [0.5, 0.5, 0, 0]).flat());
    //e, a, q ,i ,node, peri ,M0 ,n , t0
    const eaqi_array = new Float32Array(
        ids.map(i => [  transposed_data_array[4][i], 
                        transposed_data_array[5][i],
                        transposed_data_array[6][i],
                        transposed_data_array[7][i]]).flat());
    const nodeperiM0n_array = new Float32Array(
        ids.map(i => [  transposed_data_array[8][i],
                        transposed_data_array[8][i], 
                        transposed_data_array[10][i], 
                        transposed_data_array[12][i]]).flat());
    const t0_array = new Float32Array(
        ids.map(i => [transposed_data_array[13][i], 0, 0, 0]).flat());
    const albedo_array = new Float32Array(
        ids.map(i => [transposed_data_array[11][i], 0, 0, 0]).flat());
    const diameter_array = new Float32Array(
        ids.map(i => [transposed_data_array[3][i], 0, 0, 0]).flat());
    const tt_array = new Float32Array(
        ids.map(i => [transposed_data_array[14][i], 0, 0, 0]).flat());

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

    const ellipseTexWidth = 20;
    const ellipseTexHeight = 20;
    const numEllipse = ellipseTexWidth * ellipseTexHeight;
    const ellipsis_ids = new Array(numEllipse).fill(0).map((_, i) => i);
    const ellipsisIdBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, ellipsisIdBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ellipsis_ids), gl.DYNAMIC_DRAW);
    const ellipsis_position = new Float32Array(
        ellipsis_ids.map(i => [i, 0, 0, 0]).flat());
    const ellipsis_index = new Float32Array(
        ellipsis_ids.map(i => [i, 0, 0, 0]).flat())


    const ellipseVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ellipseVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ellipsis_position), gl.STATIC_DRAW);
    
    //e, a, q ,i ,node, peri ,M0 ,n , t0
    // create a texture for the velocity and 2 textures for the positions.
    const eaqiTex = createTexture(gl, eaqi_array, particleTexWidth, particleTexHeight);
    const nodeperiM0nTex = createTexture(gl, nodeperiM0n_array, particleTexWidth, particleTexHeight);
    const t0Tex = createTexture(gl, t0_array, particleTexWidth, particleTexHeight);
    const positionTex1 = createTexture(gl, positions, particleTexWidth, particleTexHeight);
    

    const ellipsisTex1 = createTexture(gl, ellipsis_position, ellipseTexWidth, ellipseTexHeight);
    const indexTex = createTexture(gl, ellipsis_index, ellipseTexWidth, ellipseTexHeight);

    const TTex = createTexture(gl, tt_array, particleTexWidth, particleTexHeight);

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
    
    let planetPositionInfo = {
        fb: positionsFB1,
        tex: positionTex1,
    };


    const ellipsisFB1 = createFramebuffer(gl, ellipsisTex1);
    
    let ellipsisPositionInfo = {
        fb: ellipsisFB1,
        tex: ellipsisTex1,
    };




    let then = 0;
    let globalTime = 0.1;
    let globalDate = new Date('2024-10-05T19:59:34');
    let dayCounter = 0;
    function render(time) {

        
    // convert to seconds
    time *= 0.001;
    // Subtract the previous time from the current time
    const deltaTime = time - then;
    globalTime += deltaTime * 1.0;
    globalDate = addMinutes(globalDate, 10);
    console.log("Global-Date: " + globalDate);
    // Remember the current time for the next frame.
    then = time;

    inputHandler(deltaTime);

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    
    //----------------------------------------------------------------------------
    // compute new orbital positions
    //----------------------------------------------------------------------------
    {

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
        ext.vertexAttribDivisorANGLE(updatePositionPrgLocs.position, 0);

        //e, a, q ,i ,node, peri ,M0 ,n , t0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, eaqiTex);
        gl.activeTexture(gl.TEXTURE0 + 1);
        gl.bindTexture(gl.TEXTURE_2D, nodeperiM0nTex);
        gl.activeTexture(gl.TEXTURE0 + 2);
        gl.bindTexture(gl.TEXTURE_2D, t0Tex);
        //unused but bind anyways
        gl.activeTexture(gl.TEXTURE0 + 3);
        gl.bindTexture(gl.TEXTURE_2D, TTex);
        gl.activeTexture(gl.TEXTURE0 + 4);
        gl.bindTexture(gl.TEXTURE_2D, indexTex);

        gl.useProgram(updatePositionProgram);
        gl.uniform1i(updatePositionPrgLocs.eaqiTex, 0);  // tell the shader the position texture is on texture unit 0
        gl.uniform1i(updatePositionPrgLocs.nodeperiM0nTex, 1);  // tell the shader the position texture is on texture unit 1
        gl.uniform1i(updatePositionPrgLocs.t0Tex, 2);  // tell the shader the position texture is on texture unit 1
        gl.uniform1i(updatePositionPrgLocs.TTex, 3);
        gl.uniform1i(updatePositionPrgLocs.indexTex, 4);
        gl.uniform2f(updatePositionPrgLocs.texDimensions, particleTexWidth, particleTexHeight);
        gl.uniform2f(updatePositionPrgLocs.canvasDimensions, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(updatePositionPrgLocs.deltaTime, (toJulianDay(globalDate)));
        gl.uniform2f(updatePositionPrgLocs.texIndexDimensions, ellipseTexWidth, ellipseTexHeight  );
        gl.uniform2f(updatePositionPrgLocs.planetId, 1.0, 1.0);
        gl.uniform1f(updatePositionPrgLocs.isEllipsis, 0.0 );
        //console.log("cameraRotation "+ cameraRotation + " cameraDistance " + cameraDistance );
        //gl.drawArrays(gl.TRIANGLES, 0, 6);  // draw 2 triangles (6 vertices)
        ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, 1);

    }

    
    //----------------------------------------------------------------------------
    // compute ellipsis
    //----------------------------------------------------------------------------
    {
        // render to the new positions
        gl.bindFramebuffer(gl.FRAMEBUFFER, ellipsisPositionInfo.fb);
        gl.viewport(0, 0, ellipseTexWidth, ellipseTexHeight);

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
        ext.vertexAttribDivisorANGLE(updatePositionPrgLocs.position, 0);

        //e, a, q ,i ,node, peri ,M0 ,n , t0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, eaqiTex);
        gl.activeTexture(gl.TEXTURE0 + 1);
        gl.bindTexture(gl.TEXTURE_2D, nodeperiM0nTex);
        gl.activeTexture(gl.TEXTURE0 + 2);
        gl.bindTexture(gl.TEXTURE_2D, t0Tex);
        gl.activeTexture(gl.TEXTURE0 + 3);
        gl.bindTexture(gl.TEXTURE_2D, TTex);
        gl.activeTexture(gl.TEXTURE0 + 4);
        gl.bindTexture(gl.TEXTURE_2D, indexTex);

        gl.useProgram(updatePositionProgram);
        gl.uniform1i(updatePositionPrgLocs.eaqiTex, 0);  // tell the shader the position texture is on texture unit 0
        gl.uniform1i(updatePositionPrgLocs.nodeperiM0nTex, 1);  // tell the shader the position texture is on texture unit 1
        gl.uniform1i(updatePositionPrgLocs.t0Tex, 2);  // tell the shader the position texture is on texture unit 1
        gl.uniform1i(updatePositionPrgLocs.TTex, 3);
        gl.uniform1i(updatePositionPrgLocs.indexTex, 4);
        gl.uniform2f(updatePositionPrgLocs.texDimensions, particleTexWidth, particleTexHeight);
        gl.uniform2f(updatePositionPrgLocs.canvasDimensions, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(updatePositionPrgLocs.deltaTime, (toJulianDay(globalDate)));
        gl.uniform2f(updatePositionPrgLocs.texIndexDimensions, ellipseTexWidth, ellipseTexHeight );
        gl.uniform2f(updatePositionPrgLocs.planetId, 2.0 , 1.0 );
        gl.uniform1f(updatePositionPrgLocs.isEllipsis, 1.0 );


        //console.log("cameraRotation "+ cameraRotation + " cameraDistance " + cameraDistance );
        //gl.drawArrays(gl.TRIANGLES, 0, 6);  // draw 2 triangles (6 vertices)
        ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, 1);
    }

    //----------------------------------------------
    // Main sphere render call
    //----------------------------------------------
    if(true){ 
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.useProgram(drawParticlesProgram);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, planetPositionInfo.tex);
        gl.activeTexture(gl.TEXTURE0 + 1);
        gl.bindTexture(gl.TEXTURE_2D, albedoTex);
        gl.activeTexture(gl.TEXTURE0 + 2);
        gl.bindTexture(gl.TEXTURE_2D, diameterTex);
        
        
        
        gl.bindBuffer(gl.ARRAY_BUFFER, planetVertexBuffer);
        gl.enableVertexAttribArray(drawParticlesProgLocs.a_position);
        gl.vertexAttribPointer(drawParticlesProgLocs.a_position, 3, gl.FLOAT, false, 0, 0);
        ext.vertexAttribDivisorANGLE(drawParticlesProgLocs.a_position, 0);

        gl.uniform2f(drawParticlesProgLocs.texDimensions, particleTexWidth, particleTexHeight);
        gl.uniform1i(drawParticlesProgLocs.positionTex, 0);  // tell the shader the position texture is on texture unit 0
        gl.uniform1i(drawParticlesProgLocs.albedoTex, 1);
        gl.uniform1i(drawParticlesProgLocs.diameterTex, 2);
        gl.uniform1f(drawParticlesProgLocs.isEllipsis, 0.0);
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
        ext.vertexAttribDivisorANGLE(drawParticlesProgLocs.id, 1);

        ext.drawArraysInstancedANGLE(
            gl.TRIANGLES,
            0,             // offset
            planetVertices.length / 3,   // num vertices per instance
            particleTexHeight * particleTexWidth,  // num instances
        );

    }

    //----------------------------------------------
    // render ellipsis
    //----------------------------------------------
    if(true){ 
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.useProgram(drawParticlesProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, ellipsisPositionInfo.tex);
        gl.activeTexture(gl.TEXTURE0 + 1);
        gl.bindTexture(gl.TEXTURE_2D, albedoTex);
        gl.activeTexture(gl.TEXTURE0 + 2);
        gl.bindTexture(gl.TEXTURE_2D, diameterTex);
        
        
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipseVertexBuffer);
        gl.enableVertexAttribArray(drawParticlesProgLocs.a_position);
        gl.vertexAttribPointer(drawParticlesProgLocs.a_position, 3, gl.FLOAT, false, 0, 0);

        gl.uniform2f(drawParticlesProgLocs.texDimensions, ellipseTexWidth, ellipseTexHeight);
        gl.uniform1i(drawParticlesProgLocs.positionTex, 0);  // tell the shader the position texture is on texture unit 0
        gl.uniform1i(drawParticlesProgLocs.albedoTex, 1);
        gl.uniform1i(drawParticlesProgLocs.diameterTex, 2)
        //gl.uniform2f(updatePositionPrgLocs.planetId, 2.0, 2.0  );
        gl.uniform1f(drawParticlesProgLocs.isEllipsis, 1.0)
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
        // setup our attributes to tell WebGL how to pull
        // the data from the buffer above to the id attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsisIdBuffer);
        gl.enableVertexAttribArray(drawParticlesProgLocs.id);
        gl.vertexAttribPointer(
            drawParticlesProgLocs.id,
            1,         // size (num components)
            gl.FLOAT,  // type of data in buffer
            false,     // normalize
            0,         // stride (0 = auto)
            0,         // offset
        );
        ext.vertexAttribDivisorANGLE(drawParticlesProgLocs.id, 0);

        ext.drawArraysInstancedANGLE(
            gl.LINE_STRIP,
            0,             // offset
            numEllipse,   // num vertices per instance
            1,  // num instances
        );

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

