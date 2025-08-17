import { ModelView } from "../ModelView";
import { CanvasRecorder, CanvasRecordOptions } from "./Video/CanvasRecorder";
import testUtils from "../../../utils/testUtils";
import { emitEvent } from "../../../utils/WebWorker/initWebWorker";
import { CONVERTING_VIDEO_EVENT } from "./ExportModel";

export class ExportVideo {

    /**
     * Export video file
     * @param durationSeconds in seconds
     * @param rotationCount
     * @param useColor
     * @param color
     * @param emulation
     */
    public static async export(
        durationSeconds: number,
        rotationCount: number,
        useColor: boolean,
        color: string,
        emulation: boolean = false
    ) : Promise<Record<string, Blob|null>> {
        if (ModelView.Instance.record.isRecording) return {};

        ModelView.Instance.setClearColor(color, useColor ? 1 : 0);

        ModelView.Instance.record.rotationCount = rotationCount;
        ModelView.Instance.record.duration = durationSeconds;

        const canvas = ModelView.Instance.Renderer.domElement;
        const options: CanvasRecordOptions = {
            // the number of times you want to record per duration
            timeslice: (durationSeconds * 1000) * 0.5,
            // the length of video you would like to record
            duration: durationSeconds * 1000,
            mimeType: testUtils.Safari ? 'video/mp4' : `video/webm`,
            audioBitsPerSecond: 0,
        };


        ModelView.Instance.update(0);
        ModelView.Instance.startRecord();

        let webm: Blob|null = null;
        let mp4: Blob|null = null;

        if (!emulation) {
            if (testUtils.Safari) {
                options.timeslice = (durationSeconds * 1000) * 0.5;
            }

            console.log(`record start timeslice: ${options.timeslice}`);
            console.log(options);

            const canvasRecorder = new CanvasRecorder(canvas, options, testUtils.iOSSafari ? 30 : 60);
            const video: Blob = await canvasRecorder.record();

            console.log('record end');
            emitEvent(CONVERTING_VIDEO_EVENT, 'start');

            // todo return after release
            // webm = video;

            // if (!testUtils.Safari) {
            //     console.log('convert...');
            //     video = await this.convertAsync(video);
            //     mp4 = video;
            // } else {
            //     mp4 = webm;
            // }

            mp4 = video;
            webm = video;

            emitEvent(CONVERTING_VIDEO_EVENT, 'end');
        }

        // todo return after release
        // return testUtils.Safari ? {mp4} : {webm, mp4};
        return testUtils.Safari ? { mp4 } : { webm };
    }

    // todo return after release
    // private static async convertAsync(video: Blob) {
    //     const payload = new FormData();
    //     payload.append('video', video);
    //
    //     const res = await fetch(API_MEDIA_ENDPOINT, {
    //         method: 'POST',
    //         body: payload,
    //     });
    //
    //     if (!res.ok) {
    //         throw new Error('Creating video failed');
    //     }
    //
    //     return await res.blob();
    // }


}