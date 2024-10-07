const particleVertexShader =  `
    uniform sampler2D positionTex;
    uniform sampler2D albedoTex;
    uniform sampler2D diameterTex;
    uniform vec2 texDimensions;
    uniform mat4 P;
    uniform mat4 V;
    uniform float isEllipsis;
    attribute vec3 a_position;
    attribute float id;
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
    v_albedo = albedo + (a_position * 0.0001);

    float dia = max(0.001, diameter * (1.0/149597871.0));
    vec4 pos = vec4(vec3(0.0), 1.0);
    if(isEllipsis < 0.5) {
        pos = V * vec4(a_position*  dia + position.xyz, 1.0);
    } else {
        pos = V * vec4(position.xyz, 1.0);
        //pos = V * vec4(a_position*  dia + position.xyz, 1.0);
        gl_PointSize = 100.0;
    }
    
    gl_Position = P * pos;

    //float scaledDimater = length(pos.xy-surfacePoint.xy);
    //float scaledDimater = 1.0/ (length(position.xyz)* 1999);

    //gl_PointSize = (heightOfNearPlane * diameter)/ gl_Position.w;

    //gl_PointSize = max(diameter * 1.0/abs(pos.z), 2.0 );
    }
`;

