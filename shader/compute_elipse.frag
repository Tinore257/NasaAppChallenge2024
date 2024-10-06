const computeEllipsisFragmentShader = `
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
	uniform sampler2D TTex;
	uniform sampler2D indexTex;

  uniform vec2 texDimensions;
  uniform vec2 canvasDimensions;

	uniform vec2 planetId;

	const float numPoints = 40.0;

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

    // compute texcoord from gl_FragCoord;
    vec2 texcoord = gl_FragCoord.xy / texDimensions;

    float e = texture2D(eTex, planetId).x;
    float a = texture2D(aTex, planetId).x;
    float q = texture2D(qTex, planetId).x;
    float i = texture2D(iTex, planetId).x;
    float node = texture2D(nodeTex, planetId).x;
    float peri = texture2D(periTex, planetId).x;
    float M0 = texture2D(M0Tex, planetId).x;
    float n = texture2D(nTex, planetId).x;
    float t0 = texture2D(t0Tex, planetId).x;
	  float T = texture2D(TTex, planetId).x;
	  float index = texture2D(indexTex, texcoord).x;

	
    //vec3 pos = vec3(1.0);
    vec3 pos = calculatePlanetPosition(e, a, q, i, node, peri, M0, n, t0, ((2460589.908218 + (T / numPoints * index) - 2451545.0)/36525.0));
    gl_FragColor = vec4(pos, 1.0);
  }
`;