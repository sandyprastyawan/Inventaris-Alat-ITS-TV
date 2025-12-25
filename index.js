document.getElementById('inventoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
});

function handleFormSubmit() {
    const btn = document.getElementById('submitBtn');
    
    const payload = {
        kode: document.getElementById('kode_alat').value,
        nama: document.getElementById('nama_alat').value,
        jumlah: document.getElementById('jumlah_alat').value,
        status: document.getElementById('status').value
    };

    btn.innerText = "Memproses...";
    btn.disabled = true;

    // Simulasi jeda 1 detik
    setTimeout(() => {
        tampilkanHasil(payload);
    }, 3000);
}

function tampilkanHasil(data) {
    // Isi data ke halaman hasil
    document.getElementById('resKode').innerText = data.kode;
    document.getElementById('resNama').innerText = data.nama;
    document.getElementById('resJumlah').innerText = data.jumlah;
    document.getElementById('resStatus').innerText = data.status;
    document.getElementById('resSisa').innerText = "6"; // Simulasi angka stok akhir

    // Transisi halaman
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
}

function resetHalaman() {
    document.getElementById('inventoryForm').reset();
    document.getElementById('formPage').classList.remove('hidden');
    document.getElementById('resultPage').classList.add('hidden');
    
    const btn = document.getElementById('submitBtn');
    btn.innerText = "SUBMIT DATA";
    btn.disabled = false;
}

// Ganti URL ini dengan URL Web App (GAS) yang baru setelah di-deploy
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyJ7eGgLLkGacT4c--BPeeoO1sBbpnS9f_NkL8AAwHDYHWO3v0V5sLLiCcLfV-a4Yg8Gg/exec"; 

async function handleFormSubmit() {
    const btn = document.getElementById('submitBtn');
    const payload = {
        kode: document.getElementById('kode_alat').value,
        nama: document.getElementById('nama_alat').value,
        jumlah: document.getElementById('jumlah_alat').value,
        status: document.getElementById('status').value
    };

    btn.innerText = "Memproses...";
    btn.disabled = true;

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.success) {
            // Mengirim data input dan nilai stokSisa dari spreadsheet
            tampilkanHasil(payload, result.stokSisa);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal mengirim data. Cek koneksi atau URL Apps Script.");
        btn.disabled = false;
        btn.innerText = "SUBMIT DATA";
    }
}

function tampilkanHasil(data, stokSisa) {
    document.getElementById('resKode').innerText = data.kode;
    document.getElementById('resNama').innerText = data.nama;
    document.getElementById('resJumlah').innerText = data.jumlah;
    document.getElementById('resStatus').innerText = data.status; // Menampilkan IN/OUT
    document.getElementById('resSisa').innerText = stokSisa; // Menampilkan angka dari spreadsheet

    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
}

const kodeInput = document.getElementById('kode_alat'); // Sesuaikan ID-nya
const namaInput = document.getElementById('nama_alat'); // Sesuaikan ID-nya

kodeInput.addEventListener('input', function() {
    const value = kodeInput.value;
    
    // Cek jika ada karakter pemisah '|'
    if (value.includes('|')) {
        const parts = value.split('|');
        kodeInput.value = parts[0]; // Isi Kode Alat dengan bagian pertama
        namaInput.value = parts[1]; // Isi Nama Alat dengan bagian kedua
        
        // Opsional: pindahkan fokus kursor ke kolom 'Jumlah Alat'
        document.getElementById('jumlah_alat').focus();
    }
});