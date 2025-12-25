document.getElementById('inventoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
});



// Ganti URL ini dengan URL Web App (GAS) yang baru setelah di-deploy
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuB-9Yg5iezRz5sW0bfrRU0Y8gjnd9Up5HfaFIUiSb8X1uP0ZgfYG9JCKe1czkOLoMUA/exec"; 

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
        
        // Cek jika respon ok
        if (!response.ok) throw new Error('Respon server gagal');
        
        const result = await response.json();

        if (result.success) {
            // result.namaBarang diambil dari MASTER, result.stokSisa adalah hasil hitungan
            tampilkanHasil(payload, result.namaBarang, result.stokSisa);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal menampilkan hasil: " + error.message);
        btn.disabled = false;
        btn.innerText = "SUBMIT DATA";
    }
}

function tampilkanHasil(data, namaAlat, stokSisa) {
    // Memasukkan data ke ID yang benar agar tidak undefined
    document.getElementById('resNama').innerText = namaAlat; 
    document.getElementById('resKode').innerText = data.kode;
    document.getElementById('resStatus').innerText = data.status;
    document.getElementById('resJumlah').innerText = data.jumlah;
    document.getElementById('resSisa').innerText = stokSisa; 

    // Pindah halaman
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