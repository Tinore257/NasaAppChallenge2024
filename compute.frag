const computeFragmentShader =  `
  precision highp float;

    uniform sampler2D positionTex;
    uniform sampler2D velocityTex;
    uniform vec2 texDimensions;
    uniform vec2 canvasDimensions;
    uniform float deltaTime;

    vec2 euclideanModulo(vec2 n, vec2 m) {
    return mod(mod(n, m) + m, m);
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
    vec2 newPosition = euclideanModulo(position + velocity * deltaTime * 0.1, canvasDimensions);

    gl_FragColor = vec4(newPosition, 0, 1);
    }
`;