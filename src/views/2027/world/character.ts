import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { applyCurvature } from './curvedWorld'
import { createBlobShadowTexture } from './materials'
import * as palette from './palette'

export type CharacterPose = {
  elapsed: number
  moving: boolean
  running: boolean
  /** 離地高度，0 表示站在地上 */
  jump: number
}

export type Character = {
  group: THREE.Group
  update: (pose: CharacterPose) => void
}

/**
 * 角色永遠固定在世界原點（移動的是世界），
 * 所以這裡只處理外觀、朝向與動作。
 *
 * 上帝視角看下來主要看到頭頂與肩膀，光靠身體看不出面向，
 * 因此加了一片朝前的帽簷當方向指示。
 */
export const createCharacter = (): Character => {
  const group = new THREE.Group()

  const bodyMaterial = applyCurvature(
    new THREE.MeshStandardMaterial({ color: palette.CHARACTER_BODY, roughness: 0.65 })
  )
  const headMaterial = applyCurvature(
    new THREE.MeshStandardMaterial({ color: palette.CHARACTER_HEAD, roughness: 0.8 })
  )
  const limbMaterial = applyCurvature(
    new THREE.MeshStandardMaterial({ color: palette.CHARACTER_LIMB, roughness: 0.8 })
  )

  // 跳躍與走路的上下位移都加在 bob 上，影子掛在外層 group，
  // 這樣跳起來時影子會留在地面而不是跟著飛
  const bob = new THREE.Group()
  group.add(bob)

  const body = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.7, 0.44, 4, 0.16), bodyMaterial)
  body.position.y = 0.72
  bob.add(body)

  const head = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.46, 0.46, 4, 0.16), headMaterial)
  head.position.y = 1.3
  bob.add(head)

  // 帽簷：從上往下看時用來判斷面向
  const brim = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.09, 0.22, 3, 0.04), bodyMaterial)
  brim.position.set(0, 1.4, 0.3)
  bob.add(brim)

  const armGeometry = new RoundedBoxGeometry(0.16, 0.52, 0.16, 3, 0.07)
  const leftArm = new THREE.Mesh(armGeometry, limbMaterial)
  leftArm.position.set(-0.4, 0.9, 0)
  bob.add(leftArm)

  const rightArm = new THREE.Mesh(armGeometry, limbMaterial)
  rightArm.position.set(0.4, 0.9, 0)
  bob.add(rightArm)

  const legGeometry = new RoundedBoxGeometry(0.2, 0.42, 0.2, 3, 0.08)
  const leftLeg = new THREE.Mesh(legGeometry, limbMaterial)
  leftLeg.position.set(-0.16, 0.22, 0)
  bob.add(leftLeg)

  const rightLeg = new THREE.Mesh(legGeometry, limbMaterial)
  rightLeg.position.set(0.16, 0.22, 0)
  bob.add(rightLeg)

  /**
   * 被樹或建築擋住時透出來的輪廓。
   *
   * depthFunc 設成 GreaterDepth：只有在「已經有更近的東西擋著」的像素才畫，
   * 沒被擋的時候完全不會出現，所以不需要額外判斷。
   */
  const ghost = new THREE.Mesh(
    new RoundedBoxGeometry(0.66, 1.62, 0.5, 4, 0.2),
    new THREE.MeshBasicMaterial({
      color: palette.CHARACTER_BODY,
      transparent: true,
      opacity: 0.55,
      depthFunc: THREE.GreaterDepth,
      depthWrite: false,
    })
  )
  ghost.position.y = 0.82
  ghost.renderOrder = 10
  bob.add(ghost)

  // 軟陰影，比開 shadow map 便宜太多
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 1.7),
    new THREE.MeshBasicMaterial({
      map: createBlobShadowTexture(),
      transparent: true,
      depthWrite: false,
    })
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.02
  group.add(shadow)

  const shadowMaterial = shadow.material as THREE.MeshBasicMaterial

  const update = ({ elapsed, moving, running, jump }: CharacterPose) => {
    const airborne = jump > 0.02

    if (airborne) {
      // 空中固定一個姿勢：手往上、腳微收，比繼續擺盪好認
      bob.position.y = jump
      leftArm.rotation.x = -1.1
      rightArm.rotation.x = -1.1
      leftLeg.rotation.x = 0.35
      rightLeg.rotation.x = -0.2
    } else if (moving) {
      // 奔跑時步頻加快、擺幅加大
      const speed = running ? 13 : 9
      const swingAmount = running ? 1 : 0.7
      const cycle = elapsed * speed
      bob.position.y = Math.abs(Math.sin(cycle)) * (running ? 0.1 : 0.07)
      const swing = Math.sin(cycle) * swingAmount
      leftArm.rotation.x = swing
      rightArm.rotation.x = -swing
      leftLeg.rotation.x = -swing * 0.8
      rightLeg.rotation.x = swing * 0.8
    } else {
      // 待機時只有很輕微的呼吸
      bob.position.y = Math.sin(elapsed * 1.6) * 0.02
      leftArm.rotation.x = 0
      rightArm.rotation.x = 0
      leftLeg.rotation.x = 0
      rightLeg.rotation.x = 0
    }

    // 跳得越高影子越小越淡，高度感才出得來
    const lift = Math.min(jump / 1.4, 1)
    shadow.scale.setScalar(1 - lift * 0.45)
    shadowMaterial.opacity = 1 - lift * 0.55
  }

  return { group, update }
}
