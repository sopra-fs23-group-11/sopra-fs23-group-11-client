import waterSound from "../assets/sounds/water.mp3"
import bigSplash1 from "../assets/sounds/bigSplash1.mp3"
import bigSplash2 from "../assets/sounds/bigSplash2.mp3"
import bigSplash3 from "../assets/sounds/bigSplash3.mp3"
import arcadeGameExplosion from "../assets/sounds/arcadeGameExplosion.mp3"
import sinkingShipSound from "../assets/sounds/sinkingShipSound.mp3"
import morseSound from "../assets/sounds/morse-code-131798.mp3"


export function smallSplash() {
    const audio = new Audio(waterSound)
    audio.play()
  }

  export function morse(){
    const audio = new Audio(morseSound)
      audio.play()
  }


export function bigSplash() {
    const audio1 = new Audio(bigSplash1)
    const audio2 = new Audio(bigSplash2)
    const audio3 = new Audio(bigSplash3)
    const randomNumber = Math.random()
    if (randomNumber < 0.33) {
      audio1.play()
    } else if (randomNumber < 0.66) {
      audio2.play()
    } else {
      audio3.play()
    }
  }

export function sinkShipSound() {
    const audio = new Audio(sinkingShipSound)
    audio.play()
}

export function explosionSound() {
    const audio = new Audio(arcadeGameExplosion)
    audio.play()
}