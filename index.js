document.getElementById('inventoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
});



// Ganti URL ini dengan URL Web App (GAS) yang baru setelah di-deploy
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx31bZnXhIFkRvoSCdJTnertxHV1uSKRWEOmelo8OVtf_-QKdWWXcSRkIz0wBPmUksqKw/exec"; 

async function handleFormSubmit() {
    const btn = document.getElementById('submitBtn');
    const payload = {
        kode: document.getElementById('kode_alat').value,
        jumlah: document.getElementById('jumlah_alat').value,
        status: document.getElementById('status').value,
        crew : document.getElementById('nama_crew').value,
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
            tampilkanHasil(payload, result.namaBarang, result.stokSisa, payload.crew, result.posisi);
        } else {
            // PERINGATAN ALAT TIDAK TERSEDIA
            alert("⚠️ PERINGATAN: " + result.message);
            btn.disabled = false;
            btn.innerText = "SUBMIT DATA";
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal menampilkan hasil: " + error.message);
        btn.disabled = false;
        btn.innerText = "SUBMIT DATA";
    }
}

function tampilkanHasil(data, namaAlat, stokSisa, namaCrew, posisi) {

    const judulElemen = document.getElementById('resJudul');
    if (data.status === "IN") {
        judulElemen.innerText = "✅ Check In Berhasil";
        judulElemen.style.color = "#10b981"; // Warna Hijau
    } else {
        judulElemen.innerText = "✅ Check Out Berhasil";
        judulElemen.style.color = "#10b981"; // Warna Merah (opsional)
    }
    // Memasukkan data ke ID yang benar agar tidak undefined
    document.getElementById('resNama').innerText = namaAlat; 
    document.getElementById('resKode').innerText = data.kode;
    document.getElementById('resPosisi').innerText = posisi; // Tampilkan posisi
    document.getElementById('resStatus').innerText = data.status;
    document.getElementById('resJumlah').innerText = data.jumlah;
    document.getElementById('resSisa').innerText = stokSisa;
    document.getElementById('resCrew').innerText = namaCrew;

    const elementCrew = document.getElementById('resCrew');
    if (elementCrew) elementCrew.innerText = namaCrew; 

    const elementPosisi = document.getElementById('resPosisi');
    if (elementPosisi) elementPosisi.innerText = posisi; // letakAlat diambil dari argumen ke-5
    
    // Pindah halaman
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('resultPage').classList.remove('hidden');
}



const inputKode = document.getElementById('kode_alat');

        
inputKode.addEventListener('input', function() {
    // 1. Data dari scanner otomatis muncul di sini karena scanner 'mengetik' ke dalam field
    const value = this.value;

    // 2. Jika kode mengandung pemisah '|' (dari QR lama), kita pecah secara otomatis
    if (value.includes('|')) {
        const parts = value.split('|');
        this.value = parts[0]; // Kode tetap tampil di kolom
        document.getElementById('nama_alat').value = parts[1]; // Nama alat terisi
    }

    // 3. Pindah fokus otomatis ke kolom berikutnya tanpa tekan ENTER
    // Kita beri jeda sedikit agar scanner selesai 'mengetik' semua karakter
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
        if (this.value.length > 0) {
            inputCrew.focus(); // Pindah otomatis ke kolom Nama Crew
        }
    }, 500); // Jeda 500ms
});

function resetHalaman() {
    document.getElementById('inventoryForm').reset();
    document.getElementById('formPage').classList.remove('hidden');
    document.getElementById('resultPage').classList.add('hidden');
    
    const btn = document.getElementById('submitBtn');
    btn.innerText = "SUBMIT DATA";
        btn.disabled = false;}


