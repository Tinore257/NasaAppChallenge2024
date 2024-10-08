const particleFragmentShader =  `
  precision highp float;
    varying vec3 v_albedo;

    void main() {
      gl_FragColor = vec4(v_albedo, 1);
    }
`;