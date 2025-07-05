import '../style.css';
import Konva from 'konva';
import type {KonvaEventObject} from "konva/lib/Node";

const soundpack = import.meta.glob('../public/audio/*.mp3', {eager: true})
const resource: { [key: string]: string } = {};

for (const path in soundpack) {
    const filename = path.split('/').pop()!;
    // @ts-ignore
    resource[filename] = soundpack[path].default;
}

interface Area {
    x1: number,
    y1: number,
    x2?: number,
    y2?: number,
}

const stage = new Konva.Stage({
    container: 'app',
    width: 500,
    height: 500,
})

let coor: Area | null = null;
let isMouseDown: boolean = false;
let isMouseMove: boolean = false;
let areaRect: Konva.Rect | null = null

const layer = new Konva.Layer();

const rects: Konva.Rect[] = []
for (let i = 0; i < 5; ++i) {
    rects.push(new Konva.Rect({
        x: Math.floor(Math.random() * stage.width()) - 50,
        y: Math.floor(Math.random() * stage.height()) - 50,
        width: 50,
        height: 50,
        fill: '#6393dc',
    }))
    // @ts-ignore
    layer.add(rects.at(i))
}

let selectedRect: Konva.Rect | null = null
// moc ban dau cua chuot
let pos: { x: number, y: number } | null = null;
// moc ban dau cua shape (rect)
let posRect: { x: number, y: number } | null = null;
// flag kiem tra copy
let isCopy: boolean = false;
// shape da copy
let copyRect: Konva.Rect | null = null;
layer.on('mousedown', (ev) => {
    selectedRect = checkPositionInside(ev)
    const {x, y} = ev.target.getStage()?.getRelativePointerPosition()!;
    if (!selectedRect) {
        isMouseDown = true;
        coor = {
            x1: x,
            y1: y,
        }
        // neu ton tai rect cu thi remove no di
        if (areaRect) {
            areaRect.destroy();
            areaRect = null;
        }

        areaRect = new Konva.Rect({
            x: x,
            y: y,
            width: 0,
            height: 0,
            opacity: 0.3,
            fill: '#a6a6a6'
        })
        layer.add(areaRect)
    } else {
        pos = {x: x, y: y}
        posRect = {x: selectedRect.x(), y: selectedRect.y()}
        isMouseMove = true;
    }
})


layer.on('mousemove', (ev) => {
    const {x, y} = ev.target.getStage()?.getRelativePointerPosition()!;
    if (isMouseDown && coor && areaRect) {
        coor.x2 = x;
        coor.y2 = y;

        const width = x - coor.x1;
        const height = y - coor.y1;
        areaRect.x(coor.x1)
        areaRect.y(coor.y1)
        areaRect.width(width)
        areaRect.height(height)

        layer.batchDraw();
    } else if (isMouseMove) {
        if (!posRect || !pos) return;
        // movement
        const {vx, vy} = {vx: x - pos?.x, vy: y - pos?.y};
        if (keydown === null) {
            selectedRect?.x(posRect?.x + vx)
            selectedRect?.y(posRect?.y + vy)
            layer.batchDraw();
        } else if (keydown === 'Alt') {
            if (!isCopy) {
                copyRect = new Konva.Rect({
                    x: posRect?.x + vx,
                    y: posRect?.y + vy,
                    width: 50,
                    height: 50,
                    fill: '#6393dc'
                })
                isCopy = true;
                layer.add(copyRect);
                rects.push(copyRect)
            } else {
                copyRect?.x(posRect?.x + vx);
                copyRect?.y(posRect?.y + vy);
            }
            layer.batchDraw()
        }
    }
})

layer.on('mouseup', () => {
    if (!coor) return;
    if (isMouseDown) {
        isMouseDown = false;
        checkInside(coor)
        coor = null;
        if (areaRect) {
            areaRect.destroy();
            areaRect = null;
            layer.draw();
        }
    } else if (isMouseMove) {
        isMouseMove = false;
        selectedRect = null;
        isCopy = false;
        copyRect = null;
    }
})

function checkInside(area: Area) {
    if (!area) return
    // dieu chinh thu tu
    reverbArea(area)
    for (const rect of rects) {
        const x1 = rect.x();
        const y1 = rect.y();
        const x2 = x1 + rect.width();
        const y2 = y1 + rect.height();
        if (x2 >= area.x1 && x1 <= area.x2 && y2 >= area.y1 && y1 <= area.y2) {
            rect.stroke("#ce38d7");
            rect.strokeWidth(3)
        } else {
            rect.stroke("")
        }
    }
}

function checkPositionInside(ev: KonvaEventObject<MouseEvent, Node>): Konva.Rect | null {
    const {x, y} = ev.target.getStage()?.getRelativePointerPosition()!;
    for (const rect of rects) {
        const x1 = rect.x();
        const y1 = rect.y();
        const x2 = x1 + rect.width();
        const y2 = y1 + rect.height();
        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
            return rect;
        }
    }
    return null;
}

function reverbArea(area: Area) {
    if (!area) return;
    if (area.x2! < area.x1) [area.x1, area.x2] = [area.x2, area.x1];
    if (area.y2! < area.y1) [area.y1, area.y2] = [area.y2, area.y1];
}

layer.add(new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    stroke: '#000000'
}))

let keydown: string | null = null;
window.addEventListener('keydown', (event: KeyboardEvent) => {
    keydown = event.key;
})
window.addEventListener('keyup', () => {
    keydown = null;
})

layer.draw();
stage.add(layer);
