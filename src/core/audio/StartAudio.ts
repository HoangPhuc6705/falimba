import * as Tone from 'tone'
import type { KalimbaDot } from '../model/KalimbaDot';

async function startSimpleSound(sound: Tone.Player, volume: number) {
  await Tone.start()
  sound.volume.value = volume;
  sound.start()
}

async function startMultiSound(notes: KalimbaDot[], volume: number) {
  await Tone.start()
  
  notes.forEach(note => {
    const s = note.getSound();
    if (s) {
      s.volume.value = volume;
      s.start()
    }
  })
}

export { startSimpleSound, startMultiSound }