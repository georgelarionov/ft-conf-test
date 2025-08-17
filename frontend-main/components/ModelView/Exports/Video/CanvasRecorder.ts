export interface CanvasRecordOptions extends MediaRecorderOptions
{
    timeslice:number;
    duration:number;
}

export class CanvasRecorder
{
    private readonly canvas: HTMLCanvasElement;
    private readonly options: CanvasRecordOptions;
    private readonly frameRequestRate: number;

    constructor(canvas: HTMLCanvasElement, options: CanvasRecordOptions, frameRequestRate: number) {

        this.canvas = canvas;
        this.options = options;
        this.frameRequestRate = frameRequestRate;
    }

    public async record() : Promise<Blob> {
        const opts = this.options;
        const canvas = this.canvas;
        const frameRequestRate = this.frameRequestRate;

        return new Promise<Blob>(function (resolve, reject) {
            try {
                const stream = canvas.captureStream(frameRequestRate);
                const blobs:Blob[] = [];
                const recorder = new MediaRecorder(stream, {
                    mimeType: opts.mimeType,
                    audioBitsPerSecond: opts.audioBitsPerSecond,
                    videoBitsPerSecond: opts.videoBitsPerSecond,
                });

                recorder.ondataavailable = function (event) {
                    if (event.data && event.data.size > 0) {
                        blobs.push(event.data);
                    }

                    if (blobs.length === opts.duration / opts.timeslice) {

                        stream.getTracks()[0].stop();
                        recorder.stop();

                        resolve(new Blob(blobs, {
                            type: opts.mimeType
                        }));
                    }
                };

                recorder.start(opts.timeslice);

            } catch (e) {
                reject(e);
            }
        });
    }
}