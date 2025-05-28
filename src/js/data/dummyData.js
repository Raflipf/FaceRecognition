// Dummy Data for Hospital Management System
import { Storage } from '../utils/storage.js';

export const DummyData = {
    // Initialize dummy data if storage is empty
    init() {
        // Only initialize if data doesn't exist
        if (!Storage.get('dataInitialized')) {
            this.initializeDoctors();
            this.initializePatients();
            this.initializeQueue();
            Storage.set('dataInitialized', true);
        }
    },

    // Initialize doctors data
    initializeDoctors() {
        const doctors = [
            {
                id: 1,
                name: "Ahmad Nugroho",
                specialty: "Kardiologi",
                status: "available",
                room: "101",
                phone: "08123456789",
                schedule: {
                    monday: "08:00-16:00",
                    tuesday: "08:00-16:00",
                    wednesday: "08:00-16:00",
                    thursday: "08:00-16:00",
                    friday: "08:00-16:00",
                    saturday: "08:00-12:00",
                    sunday: "off"
                }
            },
            {
                id: 2,
                name: "Siti Rahayu",
                specialty: "Pediatri",
                status: "available",
                room: "102",
                phone: "08123456790",
                schedule: {
                    monday: "09:00-17:00",
                    tuesday: "09:00-17:00",
                    wednesday: "09:00-17:00",
                    thursday: "09:00-17:00",
                    friday: "09:00-17:00",
                    saturday: "09:00-13:00",
                    sunday: "off"
                }
            },
            {
                id: 3,
                name: "Budi Santoso",
                specialty: "Orthopedi",
                status: "available",
                room: "103",
                phone: "08123456791",
                schedule: {
                    monday: "08:00-16:00",
                    tuesday: "08:00-16:00",
                    wednesday: "08:00-16:00",
                    thursday: "08:00-16:00",
                    friday: "08:00-16:00",
                    saturday: "08:00-12:00",
                    sunday: "off"
                }
            },
            {
                id: 4,
                name: "Maya Kusuma",
                specialty: "Dermatologi",
                status: "available",
                room: "104",
                phone: "08123456792",
                schedule: {
                    monday: "10:00-18:00",
                    tuesday: "10:00-18:00",
                    wednesday: "10:00-18:00",
                    thursday: "10:00-18:00",
                    friday: "10:00-18:00",
                    saturday: "10:00-14:00",
                    sunday: "off"
                }
            },
            {
                id: 5,
                name: "Rizki Pratama",
                specialty: "Neurologi",
                status: "available",
                room: "105",
                phone: "08123456793",
                schedule: {
                    monday: "08:00-16:00",
                    tuesday: "08:00-16:00",
                    wednesday: "08:00-16:00",
                    thursday: "08:00-16:00",
                    friday: "08:00-16:00",
                    saturday: "08:00-12:00",
                    sunday: "off"
                }
            },
            {
                id: 6,
                name: "Dewi Lestari",
                specialty: "Obstetri & Ginekologi",
                status: "available",
                room: "106",
                phone: "08123456794",
                schedule: {
                    monday: "09:00-17:00",
                    tuesday: "09:00-17:00",
                    wednesday: "09:00-17:00",
                    thursday: "09:00-17:00",
                    friday: "09:00-17:00",
                    saturday: "09:00-13:00",
                    sunday: "off"
                }
            },
            {
                id: 7,
                name: "Eko Wijaya",
                specialty: "Penyakit Dalam",
                status: "available",
                room: "107",
                phone: "08123456795",
                schedule: {
                    monday: "08:00-16:00",
                    tuesday: "08:00-16:00",
                    wednesday: "08:00-16:00",
                    thursday: "08:00-16:00",
                    friday: "08:00-16:00",
                    saturday: "08:00-12:00",
                    sunday: "off"
                }
            },
            {
                id: 8,
                name: "Indah Permata",
                specialty: "Mata",
                status: "available",
                room: "108",
                phone: "08123456796",
                schedule: {
                    monday: "10:00-18:00",
                    tuesday: "10:00-18:00",
                    wednesday: "10:00-18:00",
                    thursday: "10:00-18:00",
                    friday: "10:00-18:00",
                    saturday: "10:00-14:00",
                    sunday: "off"
                }
            }
        ];

        Storage.set('doctors', doctors);
    },

    // Initialize patients data
    initializePatients() {
        const patients = [
            {
                id: 1,
                name: "Andi Setiawan",
                nik: "3173051234567890",
                birthDate: "1985-03-15",
                gender: "M",
                bloodType: "A",
                phone: "08111234567",
                email: "andi.setiawan@email.com",
                address: "Jl. Merdeka No. 123, Jakarta Pusat, DKI Jakarta",
                emergencyContact: "Siti Setiawan - 08111234568",
                registrationDate: "2023-01-15T08:00:00.000Z",
                status: "active",
                photo: null
            },
            {
                id: 2,
                name: "Bunga Melati",
                nik: "3173052345678901",
                birthDate: "1990-07-22",
                gender: "F",
                bloodType: "B",
                phone: "08211234567",
                email: "bunga.melati@email.com",
                address: "Jl. Sudirman No. 456, Jakarta Selatan, DKI Jakarta",
                emergencyContact: "Mawar Melati - 08211234568",
                registrationDate: "2023-02-20T09:30:00.000Z",
                status: "active",
                photo: null
            },
            {
                id: 3,
                name: "Candra Wijaya",
                nik: "3173053456789012",
                birthDate: "1978-12-10",
                gender: "M",
                bloodType: "O",
                phone: "08311234567",
                email: "candra.wijaya@email.com",
                address: "Jl. Gatot Subroto No. 789, Jakarta Barat, DKI Jakarta",
                emergencyContact: "Dewi Wijaya - 08311234568",
                registrationDate: "2023-03-10T10:15:00.000Z",
                status: "active",
                photo: null
            },
            {
                id: 4,
                name: "Dina Sari",
                nik: "3173054567890123",
                birthDate: "1992-05-18",
                gender: "F",
                bloodType: "AB",
                phone: "08411234567",
                email: "dina.sari@email.com",
                address: "Jl. Thamrin No. 321, Jakarta Pusat, DKI Jakarta",
                emergencyContact: "Eka Sari - 08411234568",
                registrationDate: "2023-04-05T11:00:00.000Z",
                status: "active",
                photo: null
            },
            {
                id: 5,
                name: "Eko Prasetyo",
                nik: "3173055678901234",
                birthDate: "1987-09-25",
                gender: "M",
                bloodType: "A",
                phone: "08511234567",
                email: "eko.prasetyo@email.com",
                address: "Jl. Kuningan No. 654, Jakarta Selatan, DKI Jakarta",
                emergencyContact: "Fitri Prasetyo - 08511234568",
                registrationDate: "2023-05-12T14:20:00.000Z",
                status: "active",
                photo: null
            },
            {
                id: 6,
                name: "Fatimah Zahra",
                nik: "3173056789012345",
                birthDate: "1995-11-08",
                gender: "F",
                bloodType: "B",
                phone: "08611234567",
                email: "fatimah.zahra@email.com",
                address: "Jl. Casablanca No. 987, Jakarta Timur, DKI Jakarta",
                emergencyContact: "Gina Zahra - 08611234568",
                registrationDate: "2023-06-18T15:45:00.000Z",
                status: "active",
                photo: null
            },
            {
                id: 7,
                name: "Galih Nugroho",
                nik: "3173057890123456",
                birthDate: "1983-04-30",
                gender: "M",
                bloodType: "O",
                phone: "08711234567",
                email: "galih.nugroho@email.com",
                address: "Jl. Senayan No. 147, Jakarta Selatan, DKI Jakarta",
                emergencyContact: "Hana Nugroho - 08711234568",
                registrationDate: "2023-07-22T16:30:00.000Z",
                status: "active",
                photo: null
            },
            {
                id: 8,
                name: "Hesti Ramadhani",
                nik: "3173058901234567",
                birthDate: "1989-01-14",
                gender: "F",
                bloodType: "AB",
                phone: "08811234567",
                email: "hesti.ramadhani@email.com",
                address: "Jl. Kemang No. 258, Jakarta Selatan, DKI Jakarta",
                emergencyContact: "Irfan Ramadhani - 08811234568",
                registrationDate: "2023-08-30T08:15:00.000Z",
                status: "active",
                photo: null
            },
            {
                id: 9,
                name: "Irwan Setiadi",
                nik: "3173059012345678",
                birthDate: "1991-06-03",
                gender: "M",
                bloodType: "A",
                phone: "08911234567",
                email: "irwan.setiadi@email.com",
                address: "Jl. Pancoran No. 369, Jakarta Selatan, DKI Jakarta",
                emergencyContact: "Joko Setiadi - 08911234568",
                registrationDate: "2023-09-15T09:45:00.000Z",
                status: "active",
                photo: null
            },
            {
                id: 10,
                name: "Kartika Sari",
                nik: "3173050123456789",
                birthDate: "1986-08-27",
                gender: "F",
                bloodType: "B",
                phone: "08101234567",
                email: "kartika.sari@email.com",
                address: "Jl. Menteng No. 741, Jakarta Pusat, DKI Jakarta",
                emergencyContact: "Liana Sari - 08101234568",
                registrationDate: "2023-10-20T13:30:00.000Z",
                status: "active",
                photo: null
            }
        ];

        Storage.set('patients', patients);
    },

    // Initialize sample queue data
    initializeQueue() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const sampleQueue = [
            {
                id: 1,
                patientId: 1,
                patientName: "Andi Setiawan",
                doctorId: 1,
                doctorName: "Ahmad Nugroho",
                doctorSpecialty: "Kardiologi",
                complaint: "Nyeri dada dan sesak napas",
                priority: "urgent",
                status: "completed",
                timestamp: new Date(today.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 AM
                queueNumber: 1,
                examinationStartTime: new Date(today.getTime() + 8 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
                completionTime: new Date(today.getTime() + 9 * 60 * 60 * 1000).toISOString(),
                diagnosis: "Angina pektoris stabil",
                prescription: "Aspirin 100mg 1x1, Simvastatin 20mg 1x1",
                notes: "Kontrol rutin setiap 3 bulan, hindari aktivitas berat"
            },
            {
                id: 2,
                patientId: 2,
                patientName: "Bunga Melati",
                doctorId: 2,
                doctorName: "Siti Rahayu",
                doctorSpecialty: "Pediatri",
                complaint: "Demam tinggi dan batuk pada anak",
                priority: "normal",
                status: "completed",
                timestamp: new Date(today.getTime() + 9 * 60 * 60 * 1000).toISOString(), // 9 AM
                queueNumber: 1,
                examinationStartTime: new Date(today.getTime() + 9 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
                completionTime: new Date(today.getTime() + 9 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
                diagnosis: "ISPA (Infeksi Saluran Pernapasan Atas)",
                prescription: "Paracetamol sirup 3x1 sendok teh, OBH sirup 3x1 sendok teh",
                notes: "Banyak minum air putih, istirahat cukup"
            },
            {
                id: 3,
                patientId: 3,
                patientName: "Candra Wijaya",
                doctorId: 3,
                doctorName: "Budi Santoso",
                doctorSpecialty: "Orthopedi",
                complaint: "Nyeri lutut kanan setelah jatuh",
                priority: "normal",
                status: "examining",
                timestamp: new Date(today.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 10 AM
                queueNumber: 1,
                examinationStartTime: new Date(today.getTime() + 10 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString()
            },
            {
                id: 4,
                patientId: 4,
                patientName: "Dina Sari",
                doctorId: 1,
                doctorName: "Ahmad Nugroho",
                doctorSpecialty: "Kardiologi",
                complaint: "Kontrol rutin hipertensi",
                priority: "normal",
                status: "waiting",
                timestamp: new Date(today.getTime() + 11 * 60 * 60 * 1000).toISOString(), // 11 AM
                queueNumber: 2
            },
            {
                id: 5,
                patientId: 5,
                patientName: "Eko Prasetyo",
                doctorId: 4,
                doctorName: "Maya Kusuma",
                doctorSpecialty: "Dermatologi",
                complaint: "Ruam kulit dan gatal-gatal",
                priority: "normal",
                status: "waiting",
                timestamp: new Date(today.getTime() + 11 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 11:30 AM
                queueNumber: 1
            },
            {
                id: 6,
                patientId: 6,
                patientName: "Fatimah Zahra",
                doctorId: 6,
                doctorName: "Dewi Lestari",
                doctorSpecialty: "Obstetri & Ginekologi",
                complaint: "Kontrol kehamilan trimester kedua",
                priority: "normal",
                status: "waiting",
                timestamp: new Date(today.getTime() + 12 * 60 * 60 * 1000).toISOString(), // 12 PM
                queueNumber: 1
            }
        ];

        Storage.set('queue', sampleQueue);
    },

    // Reset all data (useful for testing)
    reset() {
        Storage.remove('dataInitialized');
        Storage.remove('doctors');
        Storage.remove('patients');
        Storage.remove('queue');
        this.init();
    },

    // Add more doctors
    addDoctor(doctorData) {
        const doctors = Storage.get('doctors') || [];
        const newDoctor = {
            id: Math.max(...doctors.map(d => d.id), 0) + 1,
            ...doctorData,
            status: doctorData.status || 'available'
        };
        doctors.push(newDoctor);
        Storage.set('doctors', doctors);
        return newDoctor;
    },

    // Add more patients
    addPatient(patientData) {
        const patients = Storage.get('patients') || [];
        const newPatient = {
            id: Math.max(...patients.map(p => p.id), 0) + 1,
            ...patientData,
            registrationDate: new Date().toISOString(),
            status: 'active'
        };
        patients.push(newPatient);
        Storage.set('patients', patients);
        return newPatient;
    },

    // Get statistics
    getStats() {
        const doctors = Storage.get('doctors') || [];
        const patients = Storage.get('patients') || [];
        const queue = Storage.get('queue') || [];
        
        const today = new Date().toDateString();
        const todayQueue = queue.filter(q => new Date(q.timestamp).toDateString() === today);
        
        return {
            totalDoctors: doctors.length,
            availableDoctors: doctors.filter(d => d.status === 'available').length,
            totalPatients: patients.length,
            activePatients: patients.filter(p => p.status === 'active').length,
            queueToday: todayQueue.length,
            waitingToday: todayQueue.filter(q => q.status === 'waiting').length,
            examiningToday: todayQueue.filter(q => q.status === 'examining').length,
            completedToday: todayQueue.filter(q => q.status === 'completed').length
        };
    },

    // Get medical specialties
    getSpecialties() {
        const doctors = Storage.get('doctors') || [];
        const specialties = [...new Set(doctors.map(d => d.specialty))];
        return specialties.sort();
    },

    // Generate random patient data (for testing)
    generateRandomPatient() {
        const firstNames = ["Ahmad", "Siti", "Budi", "Dewi", "Eko", "Fitri", "Galih", "Hana", "Irfan", "Joko"];
        const lastNames = ["Setiawan", "Rahayu", "Santoso", "Kusuma", "Pratama", "Lestari", "Wijaya", "Permata", "Nugroho", "Sari"];
        const bloodTypes = ["A", "B", "AB", "O"];
        const genders = ["M", "F"];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const birthYear = 1960 + Math.floor(Math.random() * 40); // Ages 23-63
        const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        
        return {
            name: `${firstName} ${lastName}`,
            nik: `317305${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
            birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
            gender: genders[Math.floor(Math.random() * genders.length)],
            bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
            phone: `081${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
            address: `Jl. ${lastName} No. ${Math.floor(Math.random() * 999) + 1}, Jakarta`,
            emergencyContact: `Contact ${firstName} - 081${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
        };
    }
};
