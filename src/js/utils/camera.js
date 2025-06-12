export const Camera = {
    async start(videoElementId) {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera tidak didukung di browser ini');
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
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
                
                setTimeout(() => reject(new Error('Timeout menunggu kamera')), 10000);
            });

            return stream;
        } catch (error) {
            console.error('Error starting camera:', error);
            
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

    capture(videoElementId, canvasElementId, quality = 0.8) {
        try {
            const videoElement = document.getElementById(videoElementId);
            const canvasElement = document.getElementById(canvasElementId);
            
            if (!videoElement || !canvasElement) {
                throw new Error('Video atau canvas element tidak ditemukan');
            }

            const videoWidth = videoElement.videoWidth;
            const videoHeight = videoElement.videoHeight;
            
            if (videoWidth === 0 || videoHeight === 0) {
                throw new Error('Video belum siap untuk capture');
            }

            canvasElement.width = videoWidth;
            canvasElement.height = videoHeight;

            const context = canvasElement.getContext('2d');
            context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

            const dataUrl = canvasElement.toDataURL('image/jpeg', quality);
            
            return dataUrl;
        } catch (error) {
            console.error('Error capturing image:', error);
            throw new Error('Gagal mengambil foto: ' + error.message);
        }
    },

    async checkAvailability() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                return false;
            }

            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            return videoDevices.length > 0;
        } catch (error) {
            console.error('Error checking camera availability:', error);
            return false;
        }
    },

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

    async requestPermissions() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });
            
            this.stop(stream);
            
            return true;
        } catch (error) {
            console.error('Error requesting camera permissions:', error);
            return false;
        }
    }
};
