import * as faceapi from 'face-api.js';

export const loadModels = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');

};

export const detectFaces = async (
  video: HTMLVideoElement,
  overlayCanvas: HTMLCanvasElement,
  combinedCanvas: HTMLCanvasElement
) => {
  const detections = await faceapi.detectAllFaces(
    video,
    new faceapi.TinyFaceDetectorOptions()
  );

  const resized = faceapi.resizeResults(detections, {
    width: video.videoWidth,
    height: video.videoHeight
  });

 
  const overlayCtx = overlayCanvas.getContext('2d');
  overlayCanvas.width = video.videoWidth;
  overlayCanvas.height = video.videoHeight;
  overlayCtx?.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  faceapi.draw.drawDetections(overlayCanvas, resized);

 
  const combinedCtx = combinedCanvas.getContext('2d');
  combinedCanvas.width = video.videoWidth;
  combinedCanvas.height = video.videoHeight;
  combinedCtx?.clearRect(0, 0, combinedCanvas.width, combinedCanvas.height);
  combinedCtx?.drawImage(video, 0, 0);
  combinedCtx?.drawImage(overlayCanvas, 0, 0);
};
