import { KalimbaSheet, KalimbaInit, KalimbaStyle, KalimbaTimeline, Falimba } from "../../core/model";


const app: HTMLElement | null = document.getElementById('app')!
const kalimbaInit: KalimbaInit = new KalimbaInit()
const kalimbaSheet: KalimbaSheet = new KalimbaSheet(kalimbaInit.getTypesMap().get("Kalimba 88")!)
const kalimbaTimeline = new KalimbaTimeline({
    keys: {
        heightPerKey: 30,
        widthPerKey: 120,
        height: 0,
    },
    center: {
        timelineHeight: 0,
        timelineWidth: 30,
    },
    ruler: {
        rulerHeight: 20,
        rulerWidth: 0,
    },
    style: new KalimbaStyle({
        main: '#00bbfe',
        clockwise: 'red',
        line: '#ffffff',
        select: '#7c3aed',
        stroke: '#ffffff',
        active: '#0284c7'
    })
})

kalimbaTimeline.setSize({ width: app.clientWidth, height: app.clientHeight })
kalimbaTimeline.setKalimbaTimeModel(kalimbaSheet)
const falimba = new Falimba();
falimba.setTimeline(kalimbaTimeline)
falimba.use(app)

export { kalimbaTimeline, kalimbaSheet, falimba };