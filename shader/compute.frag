const computeFragmentShader =  `
  precision highp float;

    uniform sampler2D positionTex;
    uniform sampler2D velocityTex;
    uniform vec2 texDimensions;
    uniform vec2 canvasDimensions;
    uniform float deltaTime;

    vec3 calculatePlanetPosition(float e, float a, float q, float i, float node, float peri, float M0, float n, float t0, float t) {

      // Mean anomaly at time t
      float M = M0 + n * (t - t0);

      // Solve Kepler's equation for Eccentric Anomaly E
      float E = M;
      float deltaE;
      for (int i = 0; i < 10; i++){
        if(abs(deltaE) < 1e-6){
          break;
        }
        deltaE = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
        E += deltaE;
      }
      // True anomaly ν
      float ν = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));

      // Heliocentric distance r
      float r = a * (1 - e * Math.cos(E));

      // Heliocentric coordinates
      float x = r * (Math.cos(node) * Math.cos(peri + ν) - Math.sin(node) * Math.sin(peri + ν) * Math.cos(i));
      float y = r * (Math.sin(node) * Math.cos(peri + ν) + Math.cos(node) * Math.sin(peri + ν) * Math.cos(i));
      float z = r * (Math.sin(peri + ν) * Math.sin(i));

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

    vec2 position = texture2D(positionTex, texcoord).xy;
    vec2 velocity = texture2D(velocityTex, texcoord).xy;
    vec2 newPosition = position;

    gl_FragColor = vec4(newPosition, 0, 1);
    }
`;