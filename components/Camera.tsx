'use client'
import React from 'react'
import { useEffect,useState,useRef } from 'react'
import { loadModels, detectFaces } from '../app/utils/facetracking';

export default function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
     const combinedCanvasRef = useRef<HTMLCanvasElement>(null);
     const [recordingTime, setRecordingTime] = useState(0);


    const [isRecording, setisRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    
    const [isPreviewing, setIsPreviewing] = useState(false);
    

useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const setupCamera = async () => {
      await loadModels();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      intervalId = setInterval(() => {
  if (
    videoRef.current &&
    canvasRef.current &&
    combinedCanvasRef.current
  ) {
    detectFaces(videoRef.current, canvasRef.current, combinedCanvasRef.current);
  }
}, 200);

    };

    setupCamera();

    // Clean-up: clear interval & stop camera on unmount
   return () => {
  clearInterval(intervalId);
  if (videoRef.current?.srcObject) {
    const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    tracks.forEach(t => t.stop());
  }
}

  }, []);


  useEffect(() => {
  let timerInterval: NodeJS.Timeout;

  if (isRecording) {
    setRecordingTime(0); // Reset timer when recording starts
    timerInterval = setInterval(() => {
      setRecordingTime((time) => time + 1);
    }, 1000);
  }

  return () => {
    clearInterval(timerInterval);
  };
}, [isRecording]);

const startRecording = () => {
  const canvasStream = combinedCanvasRef.current?.captureStream();
  if (!canvasStream) {
    alert("No combined canvas stream available.");
    return;
  }

  try {
    const recorder = new MediaRecorder(canvasStream);
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
   recorder.onstop = () => {
  if (chunksRef.current.length === 0) {
    console.warn("No recorded chunks found.");
    return;
  }

  const blob = new Blob(chunksRef.current, { type: 'video/webm; codecs=vp8' });
  sessionStorage.setItem('recordedVideoURL', URL.createObjectURL(blob));
  setIsPreviewing(true);
  chunksRef.current = [];
};

    recorder.start();
    mediaRecorderRef.current = recorder;
    setisRecording(true);
    console.log("Recording started from combined canvas");
  } catch (err) {
    console.error("Failed to start recording:", err);
  }
};




  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setisRecording(false);
  };

const previewUrl = sessionStorage.getItem('recordedVideoURL') || null;

if (isRecording && recordingTime >= 60) {
  stopRecording(); 
}

  return (
    <div className="relative w-full max-w-xl  border-l-amber-300">
      {isPreviewing && previewUrl && (
  <div className="mt-6 flex flex-col items-center">
    <h2 className="text-xl font-semibold mb-2">▶️ Preview:</h2>
    
    <video
      controls
      src={previewUrl}
      key={previewUrl} 
      className="rounded w-full shadow"
      autoPlay
    />
    
    <button
      onClick={() => {
        sessionStorage.removeItem('recordedVideoURL');
        setIsPreviewing(false);
        setisRecording(false);
        chunksRef.current = [];
      }}
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-purple-700"
    >
      Record Again
    </button>
  </div>
)}

    {!isPreviewing && (
      <>
     <div className="relative w-full max-w-xl">
    <video ref={videoRef} autoPlay muted className="rounded w-full border-2" />
  <canvas
  ref={canvasRef}
  className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"/>
  <canvas ref={combinedCanvasRef} className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none" />
   </div>

    <div className="mt-4 relative flex gap-4 items-center justify-center z-20 ">
      {!isRecording ? (
        <button onClick={startRecording} className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 ">
          Start Recording
        </button>
      ) : (
        <>
        <button onClick={stopRecording} className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer ">
          Stop Recording
        </button>

    <p className="text-red-400 text-lg font-mono mt-2">
    ⏱ Recording: {recordingTime}s
  </p>
</>
      )}
    </div>
    </>
)}

  </div>

    )}




