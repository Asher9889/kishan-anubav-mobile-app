import { Skia } from "@shopify/react-native-skia";

export const orbShader = Skia.RuntimeEffect.Make(`
uniform float2 resolution;
uniform float time;
uniform int state;

const float PI = 3.14159265359;

float hash(float2 p){
    return fract(
        sin(dot(p, float2(127.1, 311.7)))
        * 43758.5453123
    );
}

float noise(float2 p){
    float2 i = floor(p);
    float2 f = fract(p);

    float a = hash(i);
    float b = hash(i + float2(1.0, 0.0));
    float c = hash(i + float2(0.0, 1.0));
    float d = hash(i + float2(1.0, 1.0));

    float2 u = f * f * (3.0 - 2.0 * f);

    return mix(
        mix(a, b, u.x),
        mix(c, d, u.x),
        u.y
    );
}

float fbm(float2 p){
    float value = 0.0;
    float amplitude = 0.5;

    for(int i = 0; i < 6; i++){
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

float circleMask(float2 uv, float radius, float feather){
    float dist = length(uv);
    return smoothstep(radius - feather, radius + feather, dist);
}

float2 domainWarp(float2 p, float time){
    float2 warp = float2(
        fbm(p * 0.5 + float2(time * 0.07, time * 0.05)),
        fbm(p * 0.5 + float2(time * 0.03, time * 0.09))
    );
    return p + warp * 0.15;
}

float3 getStateColors(int state, float angle, float noiseVal, float time, float radius, float mask){
    float3 color = float3(0.0);

    if (state == 0) {
        float3 blue = float3(0.12, 0.55, 1.00);
        float3 purple = float3(0.48, 0.18, 0.95);
        float3 cyan = float3(0.10, 0.85, 0.95);
        
        float mixVal = 0.5 + 0.5 * sin(angle * 1.5 + noiseVal * 4.0 + time * 0.25);
        color = mix(blue, purple, mixVal);
        color = mix(color, cyan, noiseVal * 0.2);
        color *= 0.7 + 0.3 * sin(time * 0.5 + angle * 2.0);
        
    } else if (state == 1) {
        float3 teal = float3(0.08, 0.75, 0.80);
        float3 green = float3(0.15, 0.95, 0.45);
        float3 white = float3(1.00, 1.00, 1.00);
        
        float pulse = sin(time * 2.5) * 0.5 + 0.5;
        float mixVal = 0.5 + 0.5 * sin(angle * 3.0 + noiseVal * 8.0 + time * 1.2);
        color = mix(teal, green, mixVal);
        color = mix(color, white, pulse * 0.35);
        color *= 0.8 + 0.2 * pulse;
        
    } else if (state == 2) {
        float3 gold = float3(0.98, 0.70, 0.12);
        float3 amber = float3(0.95, 0.50, 0.04);
        float3 deepOrange = float3(0.90, 0.30, 0.03);
        
        float swirl = sin(angle * 4.0 + time * 0.7) * 0.5 + 0.5;
        float mixVal = 0.5 + 0.5 * sin(angle * 2.5 + noiseVal * 5.0 + time * 0.45);
        color = mix(gold, amber, mixVal);
        color = mix(color, deepOrange, swirl * 0.35);
        color *= 0.75 + 0.25 * swirl;
        
    } else if (state == 3) {
        float3 hotPink = float3(0.98, 0.22, 0.60);
        float3 magenta = float3(0.92, 0.08, 0.80);
        float3 white = float3(1.00, 1.00, 1.00);
        
        float audioReact = abs(sin(time * 12.0)) * 0.5 + 0.5;
        float mixVal = 0.5 + 0.5 * sin(angle * 4.0 + noiseVal * 12.0 + time * 2.5);
        color = mix(hotPink, magenta, mixVal);
        color = mix(color, white, audioReact * 0.45);
        color *= 0.85 + 0.15 * audioReact;
        
    } else if (state == 4) {
        float3 darkGray = float3(0.12, 0.12, 0.15);
        float3 dimBlue = float3(0.08, 0.20, 0.35);
        
        float fade = max(0.0, 1.0 - time * 0.3);
        float mixVal = 0.5 + 0.5 * sin(angle * 1.0 + time * 0.15);
        color = mix(darkGray, dimBlue, mixVal * 0.25);
        color *= 0.3 * fade;
        
    } else if (state == 5) {
        float3 softBlue = float3(0.18, 0.60, 1.00);
        float3 softPurple = float3(0.52, 0.22, 1.00);
        float3 softCyan = float3(0.15, 0.85, 1.00);
        
        float mixVal = 0.5 + 0.5 * sin(angle * 1.5 + noiseVal * 4.0 + time * 0.3);
        color = mix(softBlue, softPurple, mixVal);
        color = mix(color, softCyan, noiseVal * 0.25);
        color *= 0.7 + 0.3 * sin(time * 0.5 + angle * 2.0);
        
    } else if (state == 6) {
        float3 connBlue = float3(0.20, 0.65, 1.00);
        float3 connCyan = float3(0.15, 0.90, 1.00);
        
        float pulse = sin(time * 1.2) * 0.5 + 0.5;
        color = mix(connBlue, connCyan, 0.5 + 0.5 * sin(angle * 2.0 + time * 0.4));
        color *= 0.75 + 0.25 * pulse;
    }

    return color * mask;
}

float getCoreBloom(float radius, float mask){
    float core = 1.0 - smoothstep(0.0, 0.35, radius);
    return core * mask * 0.25;
}

float getRimLight(float radius, float mask, float time){
    float rim = smoothstep(0.48, 0.52, radius) * (1.0 - smoothstep(0.52, 0.55, radius));
    float pulse = 0.7 + 0.3 * sin(time * 1.5);
    return rim * mask * pulse * 0.18;
}

float getOuterGlow(float radius, float mask, float time, int state){
    float glowIntensity = 0.15;
    if (state == 1) glowIntensity = 0.22;
    else if (state == 3) glowIntensity = 0.28;
    else if (state == 4) glowIntensity = 0.05;
    
    float glow = smoothstep(0.52, 0.58, radius) * mask;
    float pulse = 0.8 + 0.2 * sin(time * 0.8);
    return glow * pulse * glowIntensity;
}

half4 main(float2 fragCoord){
    float2 uv = fragCoord / resolution;
    uv -= 0.5;
    uv *= float2(1.0, resolution.y / resolution.x);
    uv *= 2.0;

    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    float maskRadius = 0.5;
    float feather = 0.008;
    float mask = 1.0 - circleMask(uv, maskRadius, feather);

    float2 warpedUV = domainWarp(uv, time);
    
    float noiseVal = fbm(warpedUV * 2.5 + float2(time * 0.08, time * 0.06));
    float noiseVal2 = fbm(warpedUV * 5.0 + float2(time * 0.04, time * 0.12));
    float combinedNoise = noiseVal * 0.7 + noiseVal2 * 0.3;

    float3 color = getStateColors(state, angle, combinedNoise, time, radius, mask);

    color += getCoreBloom(radius, mask);
    color += getRimLight(radius, mask, time);
    color += getOuterGlow(radius, mask, time, state);

    float alpha = mask;

    return half4(color, alpha);
}
`)!;