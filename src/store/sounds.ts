import { Player } from "tone";
import audioSource from "../core/audio/Audio";
import type { KalimbaAudio } from '../core/types/Kalimba'
import { KalimbaDot } from "../core/model/KalimbaDot";

const kalimbaInit: KalimbaAudio = {
  notes: [], // toan bo not nhac
  notesMap: new Map(), // chua hashmap ve key -> note
  kalimbaTypeMaps: new Map() // chua cac kieu dan
}

let currentId = 1;
for (const pitch in audioSource) {
  // const note: Note = {
  //   id: currentId,
  //   isSelected: false,
  //   note: pitch,
  //   numberNote: "",
  //   sound: new Player(audioSource[pitch]).toDestination()
  // }
  
  // new model
  const note = new KalimbaDot({
    note: pitch,
    sound: new Player(audioSource[pitch]).toDestination(),
  }, {})
  kalimbaInit.notes.push(note)
  kalimbaInit.notesMap.set(pitch, note)
  ++currentId;
}

const sortedNotes = [
  "A0", "Bb0", "B0",
  "C1", "Db1", "D1", "Eb1", "E1", "F1", "Gb1", "G1", "Ab1", "A1", "Bb1", "B1",
  "C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2",
  "C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3",
  "C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4",
  "C5", "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5", "Bb5", "B5",
  "C6", "Db6", "D6", "Eb6", "E6", "F6", "Gb6", "G6", "Ab6", "A6", "Bb6", "B6",
  "C7", "Db7", "D7", "Eb7", "E7", "F7", "Gb7", "G7", "Ab7", "A7", "Bb7", "B7",
  "C8"
]

const kalimba88 = [...sortedNotes];

const kalimba17 = [
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6", "D6", "E6"
]

const kalimba21 = [
  "F3", "G3", "A3", "B3",
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  "C6", "D6", "E6"
]

function initKalimbaNotes(name: string, typeKalimbaArray: string[]) {
  const list: KalimbaDot[] = []
  for (const note of typeKalimbaArray) {
    list.push(kalimbaInit.notesMap.get(note)!)
  }
  kalimbaInit.kalimbaTypeMaps.set(name, list)
}

kalimba17.reverse()
kalimba21.reverse()
kalimba88.reverse()

initKalimbaNotes("Kalimba 17", kalimba17);
initKalimbaNotes("Kalimba 21", kalimba21);
initKalimbaNotes("Kalimba 88", kalimba88);

export default kalimbaInit