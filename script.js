const dBoard = document.getElementById("app");

///Membuat Section(bagian seperti tugas, catatan, dan cuaca)
const bagianTugas = document.createElement("section");
const bagianCatatan = document.createElement("section");
const bagianKutipan = document.createElement("section");
const bagianCuaca = document.createElement("section");

dBoard.appendChild(bagianTugas);
dBoard.appendChild(bagianCatatan);
dBoard.appendChild(bagianKutipan);
dBoard.appendChild(bagianCuaca);

///1.Bagian Tugas
const judulTugas = document.createElement("h2");
judulTugas.textContent = "Tugas";
bagianTugas.appendChild(judulTugas);

    const formCariTugas = document.getElementById("form-cari-tugas");
    const filterSelesai = document.getElementById("selesai");
    const filterBelum = document.getElementById("belum");
    const filterSemua = document.getElementById("semua");
    const formTugas = document.getElementById("form-tugas");
    const kontainerDaftarTugas = document.getElementById("daftar-tugas");

if (formCariTugas) bagianTugas.appendChild(formCariTugas);

const pembungkusFilter = document.querySelector(".filter-wrapper");
if (pembungkusFilter) bagianTugas.appendChild(pembungkusFilter);

if (formTugas) bagianTugas.appendChild(formTugas);
if (kontainerDaftarTugas) bagianTugas.appendChild(kontainerDaftarTugas);


//Filter
filterSelesai?.addEventListener("click", (e) => {
  e.preventDefault();
  filterAktif = "selesai";
  renderTugas();
});

filterBelum?.addEventListener("click", (e) => {
  e.preventDefault();
  filterAktif = "belum";
  renderTugas();
});

filterSemua?.addEventListener("click", (e) => {
  e.preventDefault();
  filterAktif = "";
  renderTugas();
});

///nambahin tugas
const inputTugas = document.getElementById("nama-tugas");
const tombolTambahTugas = document.getElementById("tambah-tugas");

tombolTambahTugas?.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputTugas && validasiInput(inputTugas.value)) {
    tambahTugas(inputTugas.value);
    inputTugas.value = "";
  }
});

function renderTugas(daftarKustom = null) {
  if (!kontainerDaftarTugas) return;
  kontainerDaftarTugas.innerHTML = "";

  const daftarYangDiTampilkan = daftarKustom || daftarTugas;

  const tugasTersaring = daftarYangDiTampilkan.filter((t) => {
    if (filterAktif === "selesai") return t.selesai;
    if (filterAktif === "belum") return !t.selesai;
    return true;
  });

  tugasTersaring.forEach((tugas) => {
    const li = document.createElement("li");
    li.className = "tugas-item";
    li.dataset.id = tugas.id;

    const teksSpan = document.createElement("span");
    teksSpan.textContent = tugas.nama;
    if (tugas.selesai) teksSpan.style.textDecoration = "line-through";
    li.appendChild(teksSpan);

    ///Mengedit nama tugas dengan cara di klik 2 kali
    li.addEventListener("dblclick", () => {
      const inputEdit = document.createElement("input");
      inputEdit.value = tugas.nama;
      const tombolSimpanEdit = document.createElement("button");
      tombolSimpanEdit.textContent = "Selesai";

      tombolSimpanEdit.addEventListener("click", (e) => {
        e.preventDefault();
        if (validasiInput(inputEdit.value)) {
          editTugas(tugas.id, inputEdit.value);
        }
      });

      li.innerHTML = "";
      li.appendChild(inputEdit);
      li.appendChild(tombolSimpanEdit);
    });

    const tombolHapus = document.createElement("button");
    const tombolSelesai = document.createElement("button");

    tombolHapus.textContent = "Hapus";
    tombolSelesai.textContent = tugas.selesai ? "Batal" : "Selesaikan";

    tombolHapus.addEventListener("click", (e) => {
      e.preventDefault();
      hapusTugas(tugas.id);
    });

    tombolSelesai.addEventListener("click", (e) => {
      e.preventDefault();
      ubahStatusSelesai(tugas.id);
    });

    li.appendChild(tombolHapus);
    li.appendChild(tombolSelesai);
    kontainerDaftarTugas.appendChild(li);
  });

  aktifkanDragAndDrop();
}

function tambahTugas(nama) {
  daftarTugas.push({ id: idTugasBerikutnya++, nama, selesai: false });
  simpanTugasKeStorage();
  renderTugas();
}

function hapusTugas(id) {
  daftarTugas = daftarTugas.filter((t) => t.id !== id);
  simpanTugasKeStorage();
  renderTugas();
}

function ubahStatusSelesai(id) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, selesai: !t.selesai } : t
  );
  simpanTugasKeStorage();
  renderTugas();
}

function editTugas(id, namaBaru) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, nama: namaBaru } : t
  );
  simpanTugasKeStorage();
  renderTugas();
}

function simpanTugasKeStorage() {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muatTugasDariStorage() {
  const data = localStorage.getItem("daftarTugas");
  daftarTugas = data ? JSON.parse(data) : [
    { id: 1, nama: "Belajar Javascript", selesai: false },
    { id: 2, nama: "Olahraga pagi", selesai: false }
  ];
}
let daftarTugas = [];
let idTugasBerikutnya = 1;
let filterAktif = "";
let statusDragDropPernahSet = false;


//2. Bagian Catatan
const judulCatatan = document.createElement("h2");
judulCatatan.textContent = "Catatan";
bagianCatatan.appendChild(judulCatatan);

const formCatatan = document.getElementById("form-catatan");
const inputCatatan = document.getElementById("isi-catatan");
const tombolTambahCatatan = document.getElementById("tambah-catatan");
const kontainerCatatan = document.getElementById("daftar-catatan");

if (formCatatan) bagianCatatan.appendChild(formCatatan);
if (kontainerCatatan) bagianCatatan.appendChild(kontainerCatatan);

let daftarCatatan = [];

tombolTambahCatatan?.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputCatatan && validasiInput(inputCatatan.value)) {
    tambahCatatan(inputCatatan.value);
    inputCatatan.value = "";
  }
});

function tambahCatatan(isi) {
  daftarCatatan.push({
    id: Date.now(),
    isi,
    tanggal: new Date().toLocaleDateString("id-ID"),
  });
  simpanCatatanKeStorage();
  renderCatatan();
}

function renderCatatan() {
  if (!kontainerCatatan) return;
  kontainerCatatan.innerHTML = "";

  daftarCatatan.forEach((catatan) => {
    const div = document.createElement("div");
    div.className = "catatan-item";
    div.innerHTML = `<p>${catatan.isi}</p><small>${catatan.tanggal}</small>`;

    div.addEventListener("dblclick", () => {
      const areaEdit = document.createElement("textarea");
      areaEdit.value = catatan.isi;
      const tombolSimpan = document.createElement("button");
      tombolSimpan.textContent = "Selesai";

      tombolSimpan.addEventListener("click", (e) => {
        e.preventDefault();
        if (validasiInput(areaEdit.value)) {
          editCatatan(catatan.id, areaEdit.value);
        }
      });

      div.innerHTML = "";
      div.appendChild(areaEdit);
      div.appendChild(tombolSimpan);
    });

    kontainerCatatan.appendChild(div);
  });
}

function editCatatan(id, isiBaru) {
  daftarCatatan = daftarCatatan.map((c) =>
    c.id === id ? { ...c, isi: isiBaru } : c
  );
  simpanCatatanKeStorage();
  renderCatatan();
}

function simpanCatatanKeStorage() {
  localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
}

function muatCatatanDariStorage() {
  const data = localStorage.getItem("daftarCatatan");
  daftarCatatan = data ? JSON.parse(data) : [];
}

//3.Bagian Kutipan
const judulKutipan = document.createElement("h2");
judulKutipan.textContent = "Kutipan Hari Ini";
bagianKutipan.appendChild(judulKutipan);

const teksKutipanHarian = document.getElementById("kutipan-harian");
if (teksKutipanHarian) bagianKutipan.appendChild(teksKutipanHarian);

async function ambilKutipan() {
  if (!teksKutipanHarian) return;
  try {
    teksKutipanHarian.textContent = "Memuat kutipan...";
    const respon = await fetch("https://dummyjson.com/quotes/random");
    const data = await respon.json();
    teksKutipanHarian.textContent = `"${data.quote}" - ${data.author}`;
  } catch (kesalahan) {
    teksKutipanHarian.textContent = `Gagal mengambil kutipan: ${kesalahan.message}`;
  }
}

//4.Bagian cuaca
const judulCuaca = document.createElement("h2");
judulCuaca.textContent = "Cuaca";
bagianCuaca.appendChild(judulCuaca);
const formCuaca = document.getElementById("form-cuaca");
const infoCuaca = document.getElementById("info-cuaca");

if (formCuaca) bagianCuaca.appendChild(formCuaca);
if (infoCuaca) bagianCuaca.appendChild(infoCuaca);

async function ambilCuaca(kota) {
  if (!infoCuaca) return;
  const kunciAPI = "a81e320c833e6cc5a3413dcb488398e6";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${kunciAPI}&units=metric`;

  try {
    infoCuaca.innerHTML = "<p>Memuat data cuaca...</p>";
    const respon = await fetch(url);
    if (!respon.ok) throw new Error("Kota tidak ditemukan");
    const data = await respon.json();

    const suhu = Math.round(data.main.temp);
    const deskripsi = data.weather[0].description;

    infoCuaca.innerHTML = `
      <div class="cuaca-container">
        <h3>${suhu}°C</h3>
        <p>Kota: <strong>${data.name}</strong></p>
        <p>Kondisi: ${deskripsi}</p>
      </div>
    `;
  } catch (kesalahan) {
    infoCuaca.innerHTML = `<p style="color: red;">${kesalahan.message}</p>`;
  }
}

const inputKota = document.getElementById("nama-kota");
const tombolCariKota = document.getElementById("cari-kota");

tombolCariKota?.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputKota && inputKota.value.trim() !== "") {
    ambilCuaca(inputKota.value);
  }
});

//Fungsi bantuan
function validasiInput(nilai) {
  if (nilai.trim() === "") {
    alert("Input tidak boleh kosong!");
    return false;
  }
  if (nilai.length > 100) {
    alert("Input maksimal 100 karakter!");
    return false;
  }
  return true;
}

function debounce(fungsi, jeda = 300) {
  let pengukurWaktu;
  return (...argumen) => {
    clearTimeout(pengukurWaktu);
    pengukurWaktu = setTimeout(() => fungsi(...argumen), jeda);
  };
}

//5.Bagian Drag and Drop
function aktifkanDragAndDrop() {
  const itemTugas = document.querySelectorAll(".tugas-item");

  itemTugas.forEach((item) => {
    item.setAttribute("draggable", true);
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", item.dataset.id);
    });
  });

  if (!statusDragDropPernahSet && kontainerDaftarTugas) {
    kontainerDaftarTugas.addEventListener("dragover", (e) => e.preventDefault());

    kontainerDaftarTugas.addEventListener("drop", (e) => {
      e.preventDefault();

      const idYangDiTarik = Number(e.dataTransfer.getData("text/plain"));
      const elemenTarget = e.target.closest(".tugas-item");

      if (idYangDiTarik && elemenTarget) {
        const idTarget = Number(elemenTarget.dataset.id);

        if (idYangDiTarik !== idTarget) {
          const indeksYangDiTarik = daftarTugas.findIndex((t) => t.id === idYangDiTarik);
          const indeksTarget = daftarTugas.findIndex((t) => t.id === idTarget);

          const [itemYangDiTarik] = daftarTugas.splice(indeksYangDiTarik, 1);
          daftarTugas.splice(indeksTarget, 0, itemYangDiTarik);

          simpanTugasKeStorage();
          renderTugas();
        }
      }
    });

    statusDragDropPernahSet = true;
  }
}

//6.Mengganti tema ke mde gelap
const tombolUbahTema = document.getElementById("tombol-tema");

tombolUbahTema?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const modeGelapAktif = document.body.classList.contains("dark-mode");
  localStorage.setItem("tema", modeGelapAktif ? "gelap" : "terang");
});

const inputCariTugas = document.getElementById("cari-tugas");

const pencarianTugasDebounce = debounce((kataKunci) => {
  const hasil = daftarTugas.filter((t) =>
    t.nama.toLowerCase().includes(kataKunci)
  );
  renderTugas(hasil);
}, 300);

inputCariTugas?.addEventListener("input", (e) => {
  pencarianTugasDebounce(e.target.value.toLowerCase());
});

//Inisialisasi aplikasi
async function muatSemuaWidget() {
  const elemenStatus = document.getElementById("status");
  if (elemenStatus) elemenStatus.textContent = "Memuat data...";

  await Promise.all([ambilKutipan(), ambilCuaca("Bandung")]);

  if (elemenStatus) elemenStatus.textContent = "Data berhasil dimuat";
}

window.addEventListener("DOMContentLoaded", () => {
  muatTugasDariStorage();
  muatCatatanDariStorage();
  renderTugas();
  renderCatatan();
  muatSemuaWidget();

  if (localStorage.getItem("tema") === "gelap") {
    document.body.classList.add("dark-mode");
  }
});