const particleFragmentShader =  `
  precision highp float;

    vec2 center = vec2(0.5, 0.5);
    void main() {
      if (distance(center, gl_PointCoord) > 0.5) {
        discard;
      }
      gl_FragColor = vec4(1, 0, 0, 1);
    }
`;