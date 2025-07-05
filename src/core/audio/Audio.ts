const soundPackage = import.meta.glob('../../../public/audio/*.mp3', { eager: true })

let audioSource: { [p: string]: string } = {};


for (const pathName in soundPackage) {
    let fileName = pathName.split('/').pop()!;
    fileName = fileName.split('.')[0]
    // @ts-ignore
    audioSource[fileName] = soundPackage[pathName]!.default;
}
export default audioSource;