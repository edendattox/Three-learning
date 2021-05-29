
uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main()
{

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x + uTime * 3.) * 0.1;
    elevation += modelPosition.z += sin(modelPosition.x * uFrequency.y + uTime * 3.) * 0.1;

    modelPosition.z += elevation; 


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
     

    gl_Position = projectionPosition;

    vUv = uv;
    vElevation = elevation;

}

// website to know about shaders
// Shaderific
// kronos grouop reistery
//  Book of shaders glossary

// gl_Position = projectionMatrix * viewMatrix *modelMatrix * vec4(position, 1.0);

// effects wavey

// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

// attribute vec3 position;
// attribute float aRandom;

// varying float vRandom;

// void main()
// {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     //  
       // modelPosition.z += aRandom + 0.1; 
       
    
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectionPosition = projectionMatrix * viewPosition; 

//     gl_Position = projectionPosition;

//     vRandom = aRandom;
// }