import { Skia } from "@shopify/react-native-skia";

export const orbShader = Skia.RuntimeEffect.Make(`
uniform float2 resolution;
uniform float time;

const float PI = 3.14159265359;

float hash(float2 p){
    return fract(
        sin(dot(p,float2(127.1,311.7)))
        *43758.5453123
    );
}

float noise(float2 p){

    float2 i = floor(p);
    float2 f = fract(p);

    float a = hash(i);
    float b = hash(i + float2(1,0));
    float c = hash(i + float2(0,1));
    float d = hash(i + float2(1,1));

    float2 u = f*f*(3.0-2.0*f);

    return mix(
        mix(a,b,u.x),
        mix(c,d,u.x),
        u.y
    );
}

float fbm(float2 p){

    float value = 0.0;
    float amplitude = .5;

    for(int i=0;i<6;i++){

        value += amplitude * noise(p);

        p *= 2.0;

        amplitude *= .5;
    }

    return value;
}

half4 main(float2 fragCoord){

    float2 uv = fragCoord / resolution;

    uv -= .5;

    float radius = length(uv);

    float angle = atan(uv.y,uv.x);

    float wave =
        fbm(
            uv*3.0
            + float2(
                time*.10,
                time*.08
            )
        );

    angle += wave*.75;

    float3 blue = float3(
        0.18,
        0.65,
        1.00
    );

    float3 purple = float3(
        0.55,
        0.22,
        1.00
    );

    float3 cyan = float3(
        0.15,
        0.90,
        1.00
    );

    float mixValue =
        .5
        + .5*sin(
            angle*2.0
            + wave*6.0
            + time*.7
        );

    float3 color =
        mix(
            blue,
            purple,
            mixValue
        );

    color =
        mix(
            color,
            cyan,
            wave*.35
        );

    float glow =
        smoothstep(
            .52,
            .18,
            radius
        );

    color *= glow;

    return half4(
        color,
        glow
    );
}
`)!;