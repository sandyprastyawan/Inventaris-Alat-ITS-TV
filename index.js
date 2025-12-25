document.getElementById('inventoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
});

async function handleFormSubmit() {
    const btn = document.getElementById('submitBtn');
    const payload = {
        kode: document.getElementById('kode_alat').value,
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
            // PENTING: Panggil satu kali dengan urutan yang benar
            // payload (data input), result.namaBarang (dari MASTER), result.stokSisa (hasil hitung)
            tampilkanHasil(payload, result.namaBarang, result.stokSisa);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal mengirim data.");
        btn.disabled = false;
        btn.innerText = "SUBMIT DATA";
    }
}

function tampilkanHasil(data, namaDariMaster, stokAkhir) {
    document.getElementById('resKode').innerText = data.kode;
    document.getElementById('resNama').innerText = namaDariMaster; // Nama asli dari MASTER
    document.getElementById('resJumlah').innerText = data.jumlah;
    document.getElementById('resStatus').innerText = data.status;
    document.getElementById('resSisa').innerText = stokAkhir; // Stok terbaru dari MASTER

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
            tampilkanHasil(payload, result.namaBarang);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal mengirim data. Cek koneksi atau URL Apps Script.");
        btn.disabled = false;
        btn.innerText = "SUBMIT DATA";
    }
}

function tampilkanHasil(data, namaAlat, stokAkhir) {
    // 1. Isi Nama Barang (menggantikan 'undefined')
    const elementNama = document.getElementById('resNama');
    if (elementNama) elementNama.innerText = namaAlat;

    // 2. Isi Kode, Jumlah, dan Status
    document.getElementById('resKode').innerText = data.kode;
    document.getElementById('resJumlah').innerText = data.jumlah;
    document.getElementById('resStatus').innerText = data.status;

    // 3. Isi Stok Akhir (menggantikan 'A73')
    const elementSisa = document.getElementById('resSisa');
    if (elementSisa) elementSisa.innerText = stokAkhir;

    // Transisi halaman
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
}


const kodeInput = document.getElementById('kode_alat'); // Sesuaikan ID-nya

kodeInput.addEventListener('change', function() {
    const value = kodeInput.value;
        
       if (value) {
        // JIKA SCANNER MENGHASILKAN FORMAT: KODE|NAMA
        if (value.includes('|')) {
            const parts = value.split('|');
            kodeInput.value = parts[0]; // Isi Kode
            if (namaInput) namaInput.value = parts[1]; // Isi Nama
        }
        
        // Pindahkan fokus ke 'jumlah_alat' setelah data kode terisi lengkap
        const jumlahInput = document.getElementById('jumlah_alat');
        if (jumlahInput) {
            jumlahInput.focus();
        }
    }
});