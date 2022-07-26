varying vec2 vUv;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // float elevation =  cos(0.1*modelPosition.x * uTime);

    // modelPosition.y += elevation;
    // modelPosition.x -= 0.5*cos(0.5*modelPosition.z);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}