document.getElementById('inventoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
});



// Ganti URL ini dengan URL Web App (GAS) yang baru setelah di-deploy
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTf6xR2x2wMtaXD6XYnRyj97sTvkAiy3rPXoJX39UPEJ2tP8G2GUsTEDIrEfgGo8uA5g/exec"; 

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
            tampilkanHasil(payload, result.stokBaru);
            tampilkanHasil(payload, result.namaBarang);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal mengirim data. Cek koneksi atau URL Apps Script.");
        btn.disabled = false;
        btn.innerText = "SUBMIT DATA";
    }
}

function tampilkanHasil(data, namaAlat, stokSisa) {
    // Menampilkan Nama Barang di sebelah tulisan "Barang"
    document.getElementById('resNama').innerText = namaBarang; 
    
    // Menampilkan Kode, Status, dan Jumlah
    document.getElementById('resKode').innerText = data.kode;
    document.getElementById('resStatus').innerText = data.status;
    document.getElementById('resJumlah').innerText = data.jumlah;

    // Menampilkan Angka Stok Akhir di sebelah tulisan "Stok Akhir"
    document.getElementById('resSisa').innerText = stokBaru;

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

function resetHalaman() {
    document.getElementById('inventoryForm').reset();
    document.getElementById('formPage').classList.remove('hidden');
    document.getElementById('resultPage').classList.add('hidden');
    
    const btn = document.getElementById('submitBtn');
    btn.innerText = "SUBMIT DATA";
        btn.disabled = false;}