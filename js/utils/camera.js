// Camera Utility for Face Recognition
const Camera = {
    // Start camera stream
    async start(videoElementId) {
        try {
            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera tidak didukung di browser ini');
            }

            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user' // Front camera preferred
                },
                audio: false
            });

            // Get video element and set stream
            const videoElement = document.getElementById(videoElementId);
            if (!videoElement) {
                throw new Error('Video element tidak ditemukan');
            }

            videoElement.srcObject = stream;
            
            // Wait for video to be ready
            await new Promise((resolve, reject) => {
                videoElement.onloadedmetadata = resolve;
                videoElement.onerror = reject;
                
                // Timeout after 10 seconds
                setTimeout(() => reject(new Error('Timeout menunggu kamera')), 10000);
            });

            return stream;
        } catch (error) {
            console.error('Error starting camera:', error);
            
            // Provide user-friendly error messages
            let errorMessage = 'Gagal mengakses kamera';
            
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Akses kamera ditolak. Silakan izinkan akses kamera di browser.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'Kamera tidak ditemukan di perangkat ini.';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Kamera sedang digunakan oleh aplikasi lain.';
            } else if (error.name === 'OverconstrainedError') {
                errorMessage = 'Kamera tidak mendukung resolusi yang diminta.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            throw new Error(errorMessage);
        }
    },

    // Stop camera stream
    stop(stream) {
        try {
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => {
                    track.stop();
                });
            }
        } catch (error) {
            console.error('Error stopping camera:', error);
        }
    },

    // Capture image from video element
    capture(videoElementId, canvasElementId, quality = 0.8) {
        try {
            const videoElement = document.getElementById(videoElementId);
            const canvasElement = document.getElementById(canvasElementId);
            
            if (!videoElement || !canvasElement) {
                throw new Error('Video atau canvas element tidak ditemukan');
            }

            // Set canvas size to match video
            const videoWidth = videoElement.videoWidth;
            const videoHeight = videoElement.videoHeight;
            
            if (videoWidth === 0 || videoHeight === 0) {
                throw new Error('Video belum siap untuk capture');
            }

            canvasElement.width = videoWidth;
            canvasElement.height = videoHeight;

            // Draw video frame to canvas
            const context = canvasElement.getContext('2d');
            context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

            // Convert to data URL
            const dataUrl = canvasElement.toDataURL('image/jpeg', quality);
            
            return dataUrl;
        } catch (error) {
            console.error('Error capturing image:', error);
            throw new Error('Gagal mengambil foto: ' + error.message);
        }
    },

    // Check camera availability
    async checkAvailability() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                return false;
            }

            // Try to enumerate devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            return videoDevices.length > 0;
        } catch (error) {
            console.error('Error checking camera availability:', error);
            return false;
        }
    },

    // Get available cameras
    async getAvailableCameras() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                return [];
            }

            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            return videoDevices.map(device => ({
                deviceId: device.deviceId,
                label: device.label || `Camera ${videoDevices.indexOf(device) + 1}`,
                groupId: device.groupId
            }));
        } catch (error) {
            console.error('Error getting available cameras:', error);
            return [];
        }
    },

    // Start camera with specific device
    async startWithDevice(videoElementId, deviceId) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: deviceId },
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            });

            const videoElement = document.getElementById(videoElementId);
            if (!videoElement) {
                throw new Error('Video element tidak ditemukan');
            }

            videoElement.srcObject = stream;
            
            await new Promise((resolve, reject) => {
                videoElement.onloadedmetadata = resolve;
                videoElement.onerror = reject;
                setTimeout(() => reject(new Error('Timeout')), 10000);
            });

            return stream;
        } catch (error) {
            console.error('Error starting camera with device:', error);
            throw new Error('Gagal mengakses kamera yang dipilih: ' + error.message);
        }
    },

    // Request camera permissions
    async requestPermissions() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });
            
            // Immediately stop the stream as we just wanted permissions
            this.stop(stream);
            
            return true;
        } catch (error) {
            console.error('Error requesting camera permissions:', error);
            return false;
        }
    }
};
