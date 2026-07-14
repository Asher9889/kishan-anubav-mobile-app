import { Skia } from "@shopify/react-native-skia";

export const orbShader = Skia.RuntimeEffect.Make(`

uniform float2 resolution;
uniform float time;
uniform int state;

const float PI = 3.14159265359;

//==============================================================================
// Math Utilities
//==============================================================================

float hash(float2 p) {
  return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453123);
}

float noise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + float2(1.0, 0.0));
  float c = hash(i + float2(0.0, 1.0));
  float d = hash(i + float2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(float2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

//==============================================================================
// Domain Warp - Multi-Scale Flow Field
//==============================================================================

float2 domainWarp(float2 uv, float t) {
  float2 p = uv;

  // Stage 1: Large slow currents
  float f1 = fbm(p * 0.8 + float2(t * 0.04, t * 0.02));
  p += 0.25 * float2(cos(f1 * 6.283), sin(f1 * 6.283));

  // Stage 2: Medium currents
  float f2 = fbm(p * 1.5 + float2(t * 0.06, -t * 0.03));
  p += 0.12 * float2(sin(f2 * 6.283), cos(f2 * 6.283));

  // Stage 3: Tiny turbulence
  float f3 = fbm(p * 3.0 + float2(t * 0.10, t * 0.05));
  p += 0.04 * float2(cos(f3 * 6.283), sin(f3 * 6.283));

  return p;
}

//==============================================================================
// Geometry - Perfect Circle
//==============================================================================

float circleMask(float radius) {
  return 1.0 - smoothstep(0.48, 0.485, radius);
}

//==============================================================================
// Sphere Lighting
//==============================================================================

float sphereShading(float radius) {
  float light = 1.0 - smoothstep(0.0, 0.50, radius);
  return mix(0.25, 1.0, pow(light, 1.45));
}

float coreBloom(float radius) {
  return exp(-radius * 8.0);
}

float rimLight(float radius) {
  float rim = smoothstep(0.36, 0.48, radius);
  rim *= 1.0 - smoothstep(0.48, 0.485, radius);
  return rim;
}

float specularHighlight(float2 uv) {
  float2 lightPos = float2(-0.18, -0.18);
  return exp(-length(uv - lightPos) * 18.0);
}

float outerGlow(float radius) {
  float d = max(radius - 0.42, 0.0);
  return exp(-d * 10.0);
}

//==============================================================================
// Color Gradient - Static in UV Space
//==============================================================================

float gradientSample(float2 uv) {
  float r = length(uv);
  float a = atan(uv.y, uv.x);

  float g = 0.0;
  g += sin(a * 1.0 + r * 2.5) * 0.35;
  g += sin(a * 3.0 - r * 1.5 + 0.8) * 0.25;
  g += sin(a * 5.0 + r * 4.0 + 1.2) * 0.15;
  g += (1.0 - r * 1.2) * 0.25;
  g = g * 0.5 + 0.5;

  return g;
}

//==============================================================================
// Micro Detail - High-Frequency Energy
//==============================================================================

float microDetail(float2 uv, float t) {
  float2 p = uv * 4.0 + float2(t * 0.08, -t * 0.06);
  return fbm(p);
}

//==============================================================================
// State Parameters - Configuration Only, No Rendering
//==============================================================================

struct StateParams {
  float3 color1;
  float3 color2;
  float3 color3;
  float flowSpeed;
  float flowIntensity;
  float brightness;
  float pulseAmount;
  float pulseSpeed;
  float glowIntensity;
};

StateParams getStateParams(int s) {
  StateParams p;
  p.color1 = float3(0.30, 0.30, 0.35);
  p.color2 = float3(0.20, 0.30, 0.40);
  p.color3 = float3(0.30, 0.30, 0.35);
  p.flowSpeed = 1.0;
  p.flowIntensity = 0.25;
  p.brightness = 0.60;
  p.pulseAmount = 0.05;
  p.pulseSpeed = 1.0;
  p.glowIntensity = 0.20;

  if (s == 0) {
    p.color1 = float3(0.18, 0.65, 1.00);
    p.color2 = float3(0.52, 0.22, 1.00);
    p.color3 = float3(0.15, 0.90, 1.00);
    p.flowSpeed = 0.80;
    p.flowIntensity = 0.70;
    p.brightness = 0.90;
    p.pulseAmount = 0.10;
    p.pulseSpeed = 0.45;
    p.glowIntensity = 0.30;
  } else if (s == 1) {
    p.color1 = float3(0.08, 0.82, 0.84);
    p.color2 = float3(0.18, 1.00, 0.50);
    p.color3 = float3(1.00, 1.00, 1.00);
    p.flowSpeed = 1.20;
    p.flowIntensity = 0.80;
    p.brightness = 1.00;
    p.pulseAmount = 0.15;
    p.pulseSpeed = 1.80;
    p.glowIntensity = 0.40;
  } else if (s == 2) {
    p.color1 = float3(1.00, 0.74, 0.18);
    p.color2 = float3(1.00, 0.56, 0.05);
    p.color3 = float3(0.95, 0.34, 0.05);
    p.flowSpeed = 0.60;
    p.flowIntensity = 0.60;
    p.brightness = 0.95;
    p.pulseAmount = 0.08;
    p.pulseSpeed = 0.35;
    p.glowIntensity = 0.35;
  } else if (s == 3) {
    p.color1 = float3(1.00, 0.25, 0.65);
    p.color2 = float3(0.95, 0.10, 0.85);
    p.color3 = float3(1.00, 1.00, 1.00);
    p.flowSpeed = 1.50;
    p.flowIntensity = 0.90;
    p.brightness = 1.00;
    p.pulseAmount = 0.20;
    p.pulseSpeed = 3.00;
    p.glowIntensity = 0.45;
  } else if (s == 4) {
    p.color1 = float3(0.06, 0.06, 0.08);
    p.color2 = float3(0.04, 0.04, 0.06);
    p.color3 = float3(0.06, 0.06, 0.08);
    p.flowSpeed = 0.50;
    p.flowIntensity = 0.10;
    p.brightness = 0.15;
    p.pulseAmount = 0.0;
    p.pulseSpeed = 0.50;
    p.glowIntensity = 0.05;
  } else if (s == 5) {
    p.color1 = float3(0.90, 0.70, 0.20);
    p.color2 = float3(0.95, 0.50, 0.10);
    p.color3 = float3(1.00, 0.85, 0.30);
    p.flowSpeed = 1.80;
    p.flowIntensity = 0.75;
    p.brightness = 0.90;
    p.pulseAmount = 0.25;
    p.pulseSpeed = 2.50;
    p.glowIntensity = 0.40;
  } else if (s == 6) {
    p.color1 = float3(0.10, 0.75, 0.55);
    p.color2 = float3(0.20, 0.90, 0.70);
    p.color3 = float3(0.60, 1.00, 0.85);
    p.flowSpeed = 0.90;
    p.flowIntensity = 0.50;
    p.brightness = 0.85;
    p.pulseAmount = 0.05;
    p.pulseSpeed = 0.60;
    p.glowIntensity = 0.25;
  }

  return p;
}

float3 applyPalette(float t, StateParams p) {
  float t1 = min(t * 2.0, 1.0);
  float t2 = max(t * 2.0 - 1.0, 0.0);
  float3 c = mix(p.color1, p.color2, t1);
  c = mix(c, p.color3, t2);
  return c;
}

//==============================================================================
// Main - Rendering Pipeline
//==============================================================================

half4 main(float2 fragCoord) {
  // 1. Normalize UV
  float2 uv = fragCoord / resolution;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;

  // 2. Geometry
  float radius = length(uv);
  float angle = atan(uv.y, uv.x);

  // 3. Perfect Circle Mask
  float mask = circleMask(radius);

  // 4. State Parameters
  StateParams params = getStateParams(state);

  // 5. Flow Field - Domain Warp
  float2 flowUV = domainWarp(uv, time * params.flowSpeed);
  flowUV = mix(uv, flowUV, params.flowIntensity);

  // 6. Large Color Gradient
  float gradPos = gradientSample(flowUV);

  // 7. Gradient Advection (implicit - sampled at flowUV)

  // 8. Micro Detail Layer
  float detail = microDetail(uv, time);
  gradPos += (detail - 0.5) * 0.12;

  // 9. State Color Mapping
  float3 paletteColor = applyPalette(gradPos, params);
  float3 color = paletteColor;

  // 10. Sphere Lighting
  color *= sphereShading(radius);

  // 11. Breathing Pulse
  float pulse = 1.0 + params.pulseAmount * sin(time * params.pulseSpeed);
  color *= pulse * params.brightness;

  // 12. Core Bloom
  float bloom = coreBloom(radius);
  color += color * bloom * 0.28;

  // 13. Rim Light
  float rim = rimLight(radius);
  color += float3(1.0) * rim * 0.15;

  // 14. Specular Highlight
  float spec = specularHighlight(uv);
  color += float3(1.0) * spec * 0.22;

  // 16. Final RGBA
  float finalAlpha = mask;
  float3 finalColor = color * mask;

  return half4(finalColor, finalAlpha);
}
`);

