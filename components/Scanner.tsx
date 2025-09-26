import React, { useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { CloseIcon } from './icons';

interface ScannerProps {
    onClose: () => void;
    onScanSuccess: (data: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onClose, onScanSuccess }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();

    const tick = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });

                    if (code) {
                        onScanSuccess(code.data);
                        return; // Stop scanning
                    }
                }
            }
        }
        requestRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        const constraints = {
            video: { facingMode: "environment" }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.setAttribute("playsinline", "true"); // Required for iOS
                    videoRef.current.play();
                    requestRef.current = requestAnimationFrame(tick);
                }
            })
            .catch(err => {
                console.error("Error accessing camera:", err);
                alert("Could not access camera. Please grant permission and try again.");
                onClose();
            });

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
            <video ref={videoRef} className="absolute object-cover w-full h-full" />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="absolute inset-0 z-10 bg-black bg-opacity-50 scanner-overlay"></div>
            <div className="relative z-20 text-center text-white">
                <h2 className="text-2xl font-bold">Scan QR Code</h2>
                <p>Align the QR code within the frame</p>
            </div>
            <button
                onClick={onClose}
                className="absolute z-20 p-2 text-white bg-black bg-opacity-50 rounded-full top-5 right-5"
                aria-label="Close scanner"
            >
                <CloseIcon className="w-8 h-8" />
            </button>
            <style>{`
                .scanner-overlay {
                    clip-path: polygon(
                        0% 0%, 100% 0%, 100% 100%, 0% 100%,
                        0% 30%, 20% 30%, 20% 70%, 80% 70%,
                        80% 30%, 0% 30%
                    );
                    border: 2px solid white;
                    box-shadow: 0 0 0 2000px rgba(0,0,0,0.5);
                    border-radius: 8px;
                    width: min(80vw, 80vh);
                    height: min(80vw, 80vh);
                    max-width: 400px;
                    max-height: 400px;
                }
            `}</style>
        </div>
    );
};

export default Scanner;
