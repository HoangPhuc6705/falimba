import * as Tone from 'tone'
// import type { KalimbaDot } from '../model/KalimbaDot';
import type { TempNote } from '../model/KalimbaClockwiseAnimation';

async function startSimpleSound(sound: Tone.Player, volume: number) {
  await Tone.start()
  sound.volume.value = volume;
  sound.start()
}

async function startMultiSound(notes: TempNote[], volume: number) {
  await Tone.start()
  
  notes.forEach(note => {
    const s = note.sound;
    if (s) {
      s.volume.value = volume;
      s.start()
    }
  })
}

export { startSimpleSound, startMultiSound }