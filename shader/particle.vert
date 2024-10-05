const particleVertexShader =  `
    attribute float id;
    uniform sampler2D positionTex;
    uniform sampler2D albedoTex;
    uniform sampler2D diameterTex;
    uniform vec2 texDimensions;
    uniform mat4 matrix;
    varying vec3 v_albedo;

    vec4 getValueFrom2DTextureAs1DArray(sampler2D tex, vec2 dimensions, float index) {
    float y = floor(index / dimensions.x);
    float x = mod(index, dimensions.x);
    vec2 texcoord = (vec2(x, y) + 0.5) / dimensions;
    return texture2D(tex, texcoord);
    }

    void main() {
    // pull the position from the texture
    vec4 position = getValueFrom2DTextureAs1DArray(positionTex, texDimensions, id);
    float diameter = getValueFrom2DTextureAs1DArray(diameterTex, texDimensions, id).x;
    vec3 albedo = getValueFrom2DTextureAs1DArray(albedoTex, texDimensions, id).xyz;

    // do the common matrix math
    //gl_Position = matrix * vec4(position.xy, 0, 1);
    v_albedo = albedo;
    gl_Position = matrix * vec4(position.xyz, 1.0);
    float scaledDimater =  length(matrix * vec4(diameter,0, 0,0));
    gl_PointSize = max(scaledDimater, 2.0 );
    }
`;

