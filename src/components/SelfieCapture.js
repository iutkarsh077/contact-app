"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { btnGhost, btnPrimary, labelClass } from "@/components/ui";

export default function SelfieCapture({ t, photo, onPhotoChange }) {
  const [internalPhoto, setInternalPhoto] = useState(null);
  const currentPhoto = photo !== undefined ? photo : internalPhoto;

  const updatePhoto = (val) => {
    if (onPhotoChange) onPhotoChange(val);
    else setInternalPhoto(val);
  };

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsLoading(false);
    setIsVideoReady(false);
  }, []);

  // Cleanup stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
      }
    };
  }, []);

  const setVideoRef = useCallback((element) => {
    videoRef.current = element;
    if (element && streamRef.current) {
      if (element.srcObject !== streamRef.current) {
        element.srcObject = streamRef.current;
      }
      element.onloadedmetadata = () => {
        element.play().catch(console.warn);
      };
      element.play().catch(console.warn);
    }
  }, []);

  const startCamera = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCameraError(null);
    setIsLoading(true);
    setIsVideoReady(false);

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("NOT_SUPPORTED");
      }

      // Stop existing tracks before opening new stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      let stream;
      try {
        // Front-facing selfie camera with standard 4:3 / 16:9 constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (err) {
        console.warn("Front camera constraints failed, trying basic video:", err);
        // Fallback constraint for older or desktop webcams
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      setIsCameraActive(true);
      setIsLoading(false);

      // Attach immediately if video is already mounted
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.warn);
      }
    } catch (err) {
      console.warn("Camera start error:", err);
      setIsLoading(false);
      setIsCameraActive(false);

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError(t("signup.cameraPermissionDenied"));
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError(t("signup.cameraNotFound"));
      } else {
        setCameraError(t("signup.cameraError"));
      }
    }
  };

  const takePhoto = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      console.warn("Camera frame is not ready yet");
      return;
    }

    setIsFlashing(true);

    try {
      const canvas = document.createElement("canvas");
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      // Mirror horizontally so the captured photo matches the mirrored preview
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

      setTimeout(() => {
        setIsFlashing(false);
        stopCamera();
        updatePhoto(dataUrl);
      }, 150);
    } catch (err) {
      console.error("Failed to capture snapshot:", err);
      setIsFlashing(false);
    }
  };

  const handleRetake = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updatePhoto(null);
    startCamera(e);
  };

  const handleRemove = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updatePhoto(null);
    stopCamera();
    setCameraError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={labelClass}>
          {t("signup.selfieTitle")} <span className="text-red-600 font-bold">*</span>
        </span>
        <span className="text-xs font-semibold text-teal-800">
          {currentPhoto ? "Captured" : "Required"}
        </span>
      </div>

      {/* VIEW 1: Captured Selfie Result */}
      {currentPhoto ? (
        <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 transition shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 border-teal-700 bg-slate-900 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPhoto}
                alt="Captured selfie"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-700 text-white shadow">
                <svg
                  className="h-2.5 w-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-teal-900">
                <svg
                  className="h-4 w-4 text-teal-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t("signup.selfieSuccess")}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("signup.selfieLead")}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-teal-950 underline"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {t("signup.retakeSelfie")}
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs font-medium text-slate-500 hover:text-red-700"
                >
                  {t("signup.removeSelfie")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : isCameraActive ? (
        /* VIEW 2: Active Camera Viewfinder */
        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-3 text-white shadow-inner">
          {/* Live camera stream container */}
          <div className="relative mx-auto aspect-square max-h-72 w-full overflow-hidden rounded-lg bg-black">
            <video
              ref={setVideoRef}
              autoPlay
              playsInline
              muted
              onLoadedData={() => setIsVideoReady(true)}
              onCanPlay={() => setIsVideoReady(true)}
              onPlaying={() => setIsVideoReady(true)}
              className="h-full w-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />

            {/* Shutter flash overlay */}
            {isFlashing && (
              <div className="absolute inset-0 bg-white transition-opacity duration-150" />
            )}

            {/* Oval Face Guide Overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-44 w-36 rounded-full border-2 border-dashed border-white/40 shadow-sm" />
            </div>

            {/* Live Indicator Badge */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {isVideoReady ? "LIVE" : "STARTING..."}
            </div>
          </div>

          <p className="mt-2 text-center text-xs text-slate-300">
            {t("signup.alignFace")}
          </p>

          {/* Action buttons */}
          <div className="mt-3 flex items-center justify-between px-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopCamera();
              }}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {t("signup.cancelCamera")}
            </button>

            {/* Shutter Button */}
            <button
              type="button"
              onClick={takePhoto}
              disabled={!isVideoReady}
              className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-white p-1 shadow-lg transition active:scale-95 ${
                !isVideoReady ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              title={t("signup.captureSelfie")}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-teal-800 bg-white transition group-hover:bg-teal-50">
                <span className="h-9 w-9 rounded-full bg-teal-800 transition group-hover:scale-90" />
              </span>
            </button>

            {/* Spacer for symmetrical balance */}
            <div className="w-16" />
          </div>
        </div>
      ) : (
        /* VIEW 3: Idle / Prompt State */
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4 transition hover:border-teal-700/50 hover:bg-teal-50/20">
          {cameraError ? (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              <p className="font-semibold">{cameraError}</p>
            </div>
          ) : null}

          <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {t("signup.selfieTitle")} <span className="text-red-600">*</span>
                </p>
                <p className="text-xs text-slate-500">
                  {t("signup.selfieLead")}
                </p>
              </div>
            </div>

            <div className="pt-1 sm:pt-0">
              <button
                type="button"
                onClick={startCamera}
                disabled={isLoading}
                className={`flex items-center gap-1.5 ${btnPrimary}`}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {isLoading ? t("shell.loading") : t("signup.openCamera")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
