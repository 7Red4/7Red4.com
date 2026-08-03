/**
 * 2027 版的配色：低彩度陶土沙色。
 *
 * 地面是很淺的淡米黃，積木大多是深淺不一的淺木色，
 * 偶爾穿插幾塊全漆無木紋的經典積木紅與大黃色，以及少數咖啡色木紋。
 */

export const SKY_TOP = '#F2EADC'
export const SKY_BOTTOM = '#DFE3E0'

export const GROUND = 0xefe7d6
export const GRASS = [0x88a06b, 0x7c9562] as const

/** 大部分的積木：淺木色，深淺不一 */
export const LIGHT_WOOD = [0xdfccaa, 0xd6bf9c, 0xe5d5b8, 0xcdb58f, 0xd9c6a4] as const

/** 少數幾塊咖啡色木紋 */
export const BROWN_WOOD = [0x9a7247, 0x8a6440] as const

/** 全漆、無木紋的強調色 */
export const PAINTED_RED = 0xc4402e
export const PAINTED_YELLOW = 0xe9b429

export const TRUNK = 0xa8845c
export const FOLIAGE = [0x6a8850, 0x5f7e48, 0x74915a] as const

/** 建築用的次要色 */
export const WALL = 0xdccaa8
export const WINDOW = 0xbcd0d6

export const CHARACTER_BODY = PAINTED_RED
export const CHARACTER_HEAD = 0xe8d9bd
export const CHARACTER_LIMB = 0x6d5a44

/** 遠處淡出用，與天空下緣同色才不會有突兀的邊界 */
export const FOG = 0xdfe3e0
