import { kalimbaTimeline, kalimbaSheet } from "../../engine/setup"

const toolbar: HTMLElement = document.getElementById('toolbar')!
toolbar.innerHTML = `
    <div class="tool play-pause">
        <div class="icon">
            <i class="fa fa-play"></i>
        </div>
    </div>
    <div class="vertical-line"></div>
    <div class="tool tools">
        <div class="icon">
            <i class="fa fa-edit"></i>
        </div>
        <div class="icon">
            <i class="fa fa-arrow-pointer"></i>
        </div>
        <div class="icon">
            <i class="fa fa-eraser"></i>
        </div>
    </div>
    <div class="vertical-line"></div>
    <div class="tool copy-cut-paste">
        <div class="icon" id="copy">
            <i class="fa fa-copy"></i>
        </div>
        <div class="icon" id="cut">
            <i class="fa-solid fa-scissors"></i>
        </div>
        <div class="icon" id="paste">
            <i class="fa fa-paste"></i>
        </div>
    </div>
    <div class="vertical-line"></div>
    <div class="tool align">
        <div class="icon">
            <i class="fa-solid fa-align-left" id="align-left"></i>
        </div>
    </div>
`

const playPause: HTMLElement = document.querySelector('.play-pause')!
playPause.addEventListener('click', () => {
    handlePlayButton()
})

document.querySelector('.tools .icon')?.classList.add('selectedTool')
const toolIcon = document.querySelectorAll('.tools .icon');
for (let index = 0; index < toolIcon.length; ++index) {
    const element = toolIcon[index] as HTMLElement;
    element.addEventListener('click', () => {
        kalimbaSheet.setToolIndex(index + 1)
        for (const div of toolIcon) {
            (div as HTMLElement).classList.remove('selectedTool')
        }
        element.classList.add('selectedTool')
    });
}
window.addEventListener('keydown', (event) => {
    const key = event.key;

    if (!isNaN(Number(key)) && Number(key) !== 0) {
        if (key === '1') {
            kalimbaSheet.setToolIndex(1)
        } else if (key === '2') {
            kalimbaSheet.setToolIndex(2)
        } else if (key === '3') {
            kalimbaSheet.setToolIndex(3)
        }
        for (let idx = 0; idx < toolIcon.length; ++idx) {
            (toolIcon[idx] as HTMLElement).classList.remove('selectedTool')
        }
        (toolIcon[Number(key) - 1] as HTMLElement).classList.add('selectedTool')
    }
    if (key === ' ') {
        handlePlayButton()
    }

})

function handlePlayButton() {
    kalimbaTimeline.setIsPlay(!kalimbaTimeline.getIsPlay());
    if (kalimbaTimeline.getIsPlay()) {
        playPause.innerHTML = `
        <div class="icon">
            <i class="fa fa-pause"></i>
        </div>
        `
    } else {
        playPause.innerHTML = `
        <div class="icon">
            <i class="fa fa-play"></i>
        </div>
        `
    }
}

const copyButton = document.getElementById('copy')!
const cutButton = document.getElementById('cut')!
const pasteButton = document.getElementById('paste')!

copyButton.addEventListener('click', () => kalimbaSheet.setCopyAndCutStack('copy'))
cutButton.addEventListener('click', () => kalimbaSheet.setCopyAndCutStack('cut'))
pasteButton.addEventListener('click', () => kalimbaTimeline.paste())


const alignLeftButton: HTMLElement | null = document.getElementById('align-left')
alignLeftButton?.addEventListener('click', () => kalimbaTimeline.align('left'))