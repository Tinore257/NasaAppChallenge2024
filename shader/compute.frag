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
    vec2 texcoord = gl_FragCoord.xy / texDimensions;

    float e = texture2D(eaqiTex, texcoord).x;
    float a = texture2D(eaqiTex, texcoord).y;
    float q = texture2D(eaqiTex, texcoord).z;
    float i = texture2D(eaqiTex, texcoord).w;
    float node = texture2D(nodeperiM0nTex, texcoord).x;
    float peri = texture2D(nodeperiM0nTex, texcoord).y;
    float M0 = texture2D(nodeperiM0nTex, texcoord).z;
    float n = texture2D(nodeperiM0nTex, texcoord).w;
    float t0 = texture2D(t0Tex, texcoord).x;
    float T = texture2D(TTex, planetId).x;
	  float index = texture2D(indexTex, texcoord).x;

    vec3 pos = vec3(0.0);
    if(isEllipsis < 0.5){
      //
      pos = calculatePlanetPosition(e, a, q, i, node, peri, M0, n, t0, deltaTime);
    } else {
      //ellipsis
      pos = calculatePlanetPosition(e, a, q, i, node, peri, M0, n, t0, ((2460589.908218 + (T / texIndexDimensions.x * texIndexDimensions.y * index) - 2451545.0)/36525.0));
    }
    gl_FragColor = vec4(pos, 1.0);
    }
`;