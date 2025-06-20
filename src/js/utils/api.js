const API_BASE_URL = "https://backend-mediface.vercel.app/api";

async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login gagal");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

export async function getPatientByName(name, token) {
  const response = await fetch(`${API_BASE_URL}/patients`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mengambil data pasien");
  }

  const patients = await response.json();
  return patients.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

async function addPatient(patientData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menambahkan pasien");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function getPatients(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengambil data pasien");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function getPatientById(id, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengambil data pasien");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function deletePatient(id, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menghapus pasien");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function getUsers(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengambil data user");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function getQueues(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/queues`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengambil data antrian");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function getDoctors(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengambil data dokter");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function addDoctor(doctorData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(doctorData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menambahkan dokter");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function updateDoctor(id, doctorData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(doctorData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memperbarui data dokter");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menghapus dokter");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function addQueue(queueData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/queues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(queueData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menambahkan antrian");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function updateQueue(id, queueData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/queues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(queueData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memperbarui data antrian");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Gagal menghubungi server. Periksa koneksi jaringan atau konfigurasi CORS.");
    }
    throw error;
  }
}

async function recognizeFace(photo) {
  const RECOGNIZE_API_URL = "https://web-production-9ea44.up.railway.app/recognize";

  try {
    const response = await fetch(RECOGNIZE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ photo }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || "Gagal mengenali wajah");
    }

    return await response.json();
  } catch (error) {
    console.error("recognizeFace error:", error);
    throw error;
  }
}

async function generateFaceEmbedding({ patient_id, name, photos }) {
  const EMBEDDING_API_URL = "https://web-production-9ea44.up.railway.app/generate-embedding";

  try {
    const response = await fetch(EMBEDDING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patient_id, name, photos }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || "Gagal generate embedding");
    }

    return await response.json();
  } catch (error) {
    console.error("generateFaceEmbedding error:", error);
    throw error;
  }
}

export {
  loginUser,
  addPatient,
  getPatients,
  getPatientById,
  deletePatient,
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  getUsers,
  getQueues,
  addQueue,
  updateQueue,
  generateFaceEmbedding,
  recognizeFace,
};
