import * as THREE from 'three'

/**
 * 曲面世界。
 *
 * 不做真的球體，而是在 vertex shader 裡把離原點越遠的頂點壓得越低，
 * 視覺上就是「感受得到弧度的大平面」。這樣移動與區域判定都還是單純的 2D，
 * 不必處理球面座標與一直在變的 up 向量。
 *
 * 角色永遠固定在世界原點（移動的是世界而不是角色），
 * 所以曲率中心就是原點，shader 只需要「距原點多遠」這一個輸入。
 */
export const curveUniforms = {
  uCurvature: { value: 0.0042 },
}

const VERTEX_HEAD = /* glsl */ `
uniform float uCurvature;
`

// three 的 <project_vertex> 原本直接用 modelViewMatrix 一次算到底，
// 這裡拆成 model -> world（彎曲）-> view，才能在世界座標上施加曲率
const PROJECT_VERTEX = /* glsl */ `
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
vec4 curvedWorldPosition = modelMatrix * mvPosition;
float curveDistance = length( curvedWorldPosition.xz );
curvedWorldPosition.y -= curveDistance * curveDistance * uCurvature;
mvPosition = viewMatrix * curvedWorldPosition;
gl_Position = projectionMatrix * mvPosition;
`

/**
 * 讓材質吃到曲率。法線不跟著彎，遠處的打光會略有偏差，
 * 但這個畫風看不太出來，換來的是完全不用改幾何體。
 */
export const applyCurvature = <T extends THREE.Material>(material: T): T => {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCurvature = curveUniforms.uCurvature
    shader.vertexShader = VERTEX_HEAD + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      PROJECT_VERTEX
    )
  }
  // 沒有這行的話 three 會把彎曲與未彎曲的材質視為同一個 program
  material.customProgramCacheKey = () => 'curved-world'
  return material
}
