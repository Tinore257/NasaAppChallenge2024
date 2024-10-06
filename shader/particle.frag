const particleFragmentShader =  `
  precision highp float;
    varying vec3 v_albedo;

    //vec2 center = vec2(0.5, 0.5);
    void main() {
      /*if (distance(center, gl_PointCoord) > 0.5) {
        discard;
      }*/
      gl_FragColor = vec4(v_albedo, 1);
    }
`;