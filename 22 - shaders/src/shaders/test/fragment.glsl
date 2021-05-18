 uniform vec3 uColor;
 uniform sampler2D uTexture;

 varying float vElevation;

 varying vec2 vUv;

      void main()
      {
        vec4 textureColor = texture2D(uTexture, vUv);
        textureColor.rgb *= vElevation + 0.6 + 0.4; 
        gl_FragColor = textureColor;
      }


//  varying float vRandom;


// websites to check out for
// the book of Shaders
// shader toy
// the art of code youtube channel
// Lewis lepton youtube channel
