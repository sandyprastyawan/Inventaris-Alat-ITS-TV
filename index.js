document.getElementById('inventoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
});

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMpDPoGF5HmRHhFWBHAzLPA6ZT2-q_4DlKI9KsOkd7T0wCxtnaaREfkc5wg5Hcrz2low/exec"; 

async function handleFormSubmit() {
    const btn = document.getElementById('submitBtn');
    btn.innerText = "Mengambil Foto & Memproses..."; 
    btn.disabled = true;
    try {
        let fotoData = "";
        try {
            // Optimasi 1: Turunkan kualitas foto ke 0.3 agar payload ringan
            fotoData = await tangkapFoto();
            console.log("Foto berhasil ditangkap, ukuran Base64: " + fotoData.length);
        } catch (camErr) {
            console.error("Gagal akses kamera:", camErr);
            alert("⚠️ Gagal mengambil foto. Pastikan kamera diizinkan.");
            btn.disabled = false;
            btn.innerText = "SUBMIT DATA";
            return; 
        }
        const payload = {
            kode: document.getElementById('kode_alat').value,
            status: document.getElementById('status').value,
            crew: document.getElementById('nama_crew').value,
            foto: fotoData 
        };

        // Optimasi 2: Gunakan mode 'no-cors' atau pastikan header sesuai jika diperlukan
        // Namun fetch standar biasanya cukup jika Apps Script mengembalikan ContentService
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        
        // Optimasi 3: Cek teks respon terlebih dahulu sebelum parsing JSON
        const responseText = await response.text();
        console.log("Respon Server:", responseText);
        
        const result = JSON.parse(responseText);

        if (result.success) {
            tampilkanHasil(payload, result.namaBarang, result.statusUnit, payload.crew, result.posisi);
        } else {
            alert("⚠️ PERINGATAN: " + result.message);
            resetTombol();
        }
    } catch (error) {
        console.error("Detail Error:", error);
        alert("Gagal menghubungi server. Kemungkinan penyebab:\n1. Ukuran foto terlalu besar\n2. Izin Drive belum di-deploy ke 'New Version'");
        resetTombol();
    }
}

function resetTombol() {
    const btn = document.getElementById('submitBtn');
    btn.disabled = false;
    btn.innerText = "SUBMIT DATA";
}

async function tangkapFoto() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } }); // Batasi resolusi
    const video = document.createElement('video');
    video.srcObject = stream;
    
    await new Promise((resolve) => video.onloadedmetadata = resolve);
    await video.play();

    const canvas = document.createElement('canvas');
    // Kecilkan resolusi kanvas agar data Base64 tidak terlalu panjang
    canvas.width = 400; 
    canvas.height = 300;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Optimasi: Kualitas 0.3 (30%) sangat cukup untuk bukti foto dan sangat ringan
    const dataUrl = canvas.toDataURL('image/jpeg', 0.3); 
    
    stream.getTracks().forEach(track => track.stop());
    return dataUrl.split(',')[1]; 
}

// --- Fungsi tampilkanHasil, Input, Reset (Tetap Sama) ---
function tampilkanHasil(data, namaAlat, statusUnit, namaCrew, posisi) {
    const judulElemen = document.getElementById('resJudul');
    judulElemen.innerText = data.status === "IN" ? "✅ Check In Berhasil" : "✅ Check Out Berhasil";
    judulElemen.style.color = "#10b981"; 

    if(document.getElementById('resNama')) document.getElementById('resNama').innerText = namaAlat; 
    if(document.getElementById('resKode')) document.getElementById('resKode').innerText = data.kode;
    if(document.getElementById('resPosisi')) document.getElementById('resPosisi').innerText = posisi;
    if(document.getElementById('resStatus')) document.getElementById('resStatus').innerText = data.status;
    if(document.getElementById('resCrew')) document.getElementById('resCrew').innerText = namaCrew;

    const elementSisa = document.getElementById('resSisa');
    if (elementSisa) {
        elementSisa.innerText = statusUnit;
        elementSisa.style.color = (statusUnit === "Tersedia") ? "#10b981" : "#ef4444";
    }
    
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
}

const inputKode = document.getElementById('kode_alat');
const inputCrew = document.getElementById('nama_crew'); 

inputKode.addEventListener('input', function() {
    const value = this.value;
    if (value.includes('|')) {
        const parts = value.split('|');
        this.value = parts[0]; 
        if(document.getElementById('nama_alat')) document.getElementById('nama_alat').value = parts[1]; 
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
        if (this.value.length > 0 && inputCrew) inputCrew.focus(); 
    }, 500);
});

function resetHalaman() {
    document.getElementById('inventoryForm').reset();
    document.getElementById('formPage').classList.remove('hidden');
    document.getElementById('resultPage').classList.add('hidden');
    resetTombol();
}