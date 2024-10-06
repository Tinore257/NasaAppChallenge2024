const particleVertexShader =  `
    attribute float id;
    attribute vec3 a_position;
    uniform sampler2D positionTex;
    uniform sampler2D albedoTex;
    uniform sampler2D diameterTex;
    uniform vec2 texDimensions;
    uniform mat4 P;
    uniform mat4 V;
    uniform float heightOfNearPlane;
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

    vec3 up = vec3(0,1,0);
    // do the common matrix math
    //gl_Position = matrix * vec4(position.xy, 0, 1);
    v_albedo = albedo;

    vec4 pos = V * vec4(a_position* diameter * 0.01 + position.xyz, 1.0);
    
    gl_Position = P * pos;

    //float scaledDimater = length(pos.xy-surfacePoint.xy);
    //float scaledDimater = 1.0/ (length(position.xyz)* 1999);

    //gl_PointSize = (heightOfNearPlane * diameter)/ gl_Position.w;
    gl_PointSize = 100.0;

    //gl_PointSize = max(diameter * 1.0/abs(pos.z), 2.0 );
    }
`;

