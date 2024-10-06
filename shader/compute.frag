const computeFragmentShader =  `
  precision highp float;

/* eTex ,aTex, qTex, iTex, nodeTex, periTex, M0Tex, nTex, t0Tex
*/


    uniform sampler2D eTex;
    uniform sampler2D aTex;
    uniform sampler2D qTex;
    uniform sampler2D iTex;
    uniform sampler2D nodeTex;
    uniform sampler2D periTex;
    uniform sampler2D M0Tex;
    uniform sampler2D nTex;
    uniform sampler2D t0Tex;

    uniform vec2 texDimensions;
    uniform vec2 canvasDimensions;
    uniform float deltaTime;

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

    float e = texture2D(eTex, texcoord).x;
    float a = texture2D(aTex, texcoord).x;
    float q = texture2D(qTex, texcoord).x;
    float i = texture2D(iTex, texcoord).x;
    float node = texture2D(nodeTex, texcoord).x;
    float peri = texture2D(periTex, texcoord).x;
    float M0 = texture2D(M0Tex, texcoord).x;
    float n = texture2D(nTex, texcoord).x;
    float t0 = texture2D(t0Tex, texcoord).x;

    vec3 pos = calculatePlanetPosition(e, a, q, i, node, peri, M0, n, t0, deltaTime);
    gl_FragColor = vec4(pos, 1.0);
    }
`;