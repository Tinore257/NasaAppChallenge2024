const computeFragmentShader =  `
  precision highp float;

/* eTex ,aTex, qTex, iTex, nodeTex, periTex, M0Tex, nTex, t0Tex
*/


    uniform sampler2D eaqiTex;
    uniform sampler2D nodeperiM0nTex;
    uniform sampler2D t0Tex;
    uniform sampler2D TTex;
	  uniform sampler2D indexTex;

    uniform float isEllipsis;

    uniform vec2 texDimensions;
    uniform vec2 canvasDimensions;
    uniform float deltaTime;

    uniform vec2 texIndexDimensions;
    uniform vec2 planetId;

    vec3 calculatePlanetPosition(float e, float a, float q, float i, float node, float peri, float M0, float n, float t0, float t) {

      // Mean anomaly at time t
      float M = M0 + n * (t) * (3.14159) / 180.0;

      // Solve Kepler's equation for Eccentric Anomaly E
      float E = M;
      float deltaE;
      for (int i = 0; i < 10; i++){
        if(abs(deltaE) < 1e-6){
          break;
        }
        deltaE = (M - (E - e * sin(E))) / (1.0 - e * cos(E));
        E += deltaE;
      }
      // True anomaly ν
      float v = 2.0 * atan((sqrt(1.0 + e) * sin(E / 2.0)), (sqrt(1.0 - e) * cos(E / 2.0)));

      // Heliocentric distance r
      float r = a * (1.0 - e * cos(E));

      // Heliocentric coordinates
      float x = r * (cos(node) * cos(peri + v) - sin(node) * sin(peri + v) * cos(i));
      float y = r * (sin(node) * cos(peri + v) + cos(node) * sin(peri + v) * cos(i));
      float z = r * (sin(peri + v) * sin(i));

      return vec3(x, y, z);
  }



    void main() {
    // there will be one velocity per position
    // so the velocity texture and position texture
    // are the same size.

    // further, we're generating new positions
    // so we know our destination is the same size
    // as our source so we only need one set of 
    // shared texture dimensions

    // compute texcoord from gl_FragCoord;
    vec2 planetTexCoord = vec2(0.0);
    if(isEllipsis < 0.5){
      planetTexCoord = gl_FragCoord.xy / texDimensions;
    } else {
      planetTexCoord = planetId / texDimensions;
    }
    vec2 indexTexCoord = gl_FragCoord.xy / texIndexDimensions;

    float e = texture2D(eaqiTex, planetTexCoord).x;
    float a = texture2D(eaqiTex, planetTexCoord).y;
    float q = texture2D(eaqiTex, planetTexCoord).z;
    float i = texture2D(eaqiTex, planetTexCoord).w;
    float node = texture2D(nodeperiM0nTex, planetTexCoord).x;
    float peri = texture2D(nodeperiM0nTex, planetTexCoord).y;
    float M0 = texture2D(nodeperiM0nTex, planetTexCoord).z;
    float n = texture2D(nodeperiM0nTex, planetTexCoord).w;
    float t0 = texture2D(t0Tex, planetTexCoord).x;
    float T = texture2D(TTex, planetTexCoord).x;
	  float index = texture2D(indexTex, indexTexCoord).x;

    vec3 pos = vec3(0.0);// vec3(planetId.xy, 0.0);
    if(isEllipsis < 0.5){
      //
      pos = calculatePlanetPosition(e, a, q, i, node, peri, M0, n, t0, deltaTime);
    } else {
      //ellipsis
      //pos = calculatePlanetPosition(e, a, q, i, node, peri, M0, n, t0, ((2460589.908218 + (T / (index) - 2451545.0) /36525.0)));
      float yearPart = 0.0;
      if(index != texIndexDimensions.x * texIndexDimensions.y){
        yearPart = index / (texIndexDimensions.x * (texIndexDimensions.y-1.0));
      } else {
        yearPart = 0.0;
      }
      float date = (2440587.5 / 60000.0) + (T * yearPart);
      pos = calculatePlanetPosition(e, a, q, i, node, peri, M0, n, t0, date) ;
    }
    gl_FragColor = vec4(pos, 1.0);
    }
`;