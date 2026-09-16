export const dict = {
  "profileImport.mode": "Mode impor",
  "profileImport.chats": "Hanya obrolan",
  "profileImport.everything": "Semua (penyiapan lengkap)",
  "profileImport.description":
    "Menyalin penyiapan OpenCode Anda yang kompatibel ke profil desktop Classic yang kosong: obrolan, informasi masuk penyedia, akun cloud, izin, konfigurasi global, agen, skills, plugin, rencana, snapshot, dan file ruang kerja. Sumber tetap tidak berubah. Pratinjau tidak menjalankan perintah yang diimpor dan tidak menghubungi penyedia.",
  "profileImport.boundaries":
    "Tutup OpenCode terlebih dahulu dan berhenti mengedit filenya. Folder proyek di luar penyimpanan OpenCode tetap berada di jalur aslinya. Variabel lingkungan, alat yang terinstal di sistem, dan preferensi jendela desktop upstream tidak disalin. Log, cache, dan kunci proses dibuat ulang. Penyedia OAuth mungkin memerlukan masuk kembali. Folder kustom dipilih dalam urutan ini: data, konfigurasi, lalu status.",
  "profileImport.detect": "Pratinjau penyiapan bawaan",
  "profileImport.browse": "Pilih folder penyiapan",
  "profileImport.busy":
    "Penyiapan lengkap sedang divalidasi atau disiapkan. Biarkan Classic tetap terbuka hingga ini selesai.",
  "profileImport.cancelled":
    "Tidak ada sumber kompatibel yang ditemukan, atau pemilihan folder dibatalkan.",
  "profileImport.staged":
    "Penyiapan telah disiapkan dan diverifikasi. Mulai ulang Classic untuk mengaktifkannya sebelum servernya mulai berjalan. Jangan menambahkan data ke Classic sebelum mulai ulang; aktivasi memeriksa kembali bahwa tujuannya kosong.",
  "profileImport.activated":
    "Penyiapan lengkap berhasil diaktifkan. Folder proyek Anda tetap tersedia di jalur aslinya; ruang kerja internal yang diimpor memiliki salinan independen.",
  "profileImport.data": "Folder data sumber",
  "profileImport.config": "Folder konfigurasi sumber",
  "profileImport.state": "Folder status sumber",
  "profileImport.providers": "Informasi masuk penyedia yang disimpan",
  "profileImport.accounts": "Akun cloud",
  "profileImport.workspaces": "Ruang kerja",
  "profileImport.files": "File dan tautan",
  "profileImport.bytes": "Ukuran salinan (bita)",
  "profileImport.plugins": "Plugin yang dikonfigurasi",
  "profileImport.mcp": "Entri MCP",
  "profileImport.commands": "Perintah proyek",
  "profileImport.permissions": "Catatan izin",
  "profileImport.pending": "Perintah tertunda",
  "profileImport.git": "Checkout Git",
  "profileImport.consent":
    "Saya telah menutup OpenCode dan mempercayai penyiapan lengkap ini, termasuk informasi masuk, pembaruan akun, dependensi, plugin, server MCP, perintah proyek, hook Git, dan izin yang ada. Semua ini dapat berjalan selama penggunaan normal setelah aktivasi. Perintah tertunda tetap dalam antrean hingga dilanjutkan.",
  "profileImport.confirm": "Siapkan penyiapan lengkap",
  "profileImport.restart": "Mulai ulang dan aktifkan penyiapan",
  "profileImport.error.unavailable":
    "Impor lengkap memerlukan server desktop Linux bawaan dan konfigurasi berbasis file. Konfigurasi atau pengabaian autentikasi yang disediakan lingkungan harus dihapus sebelum mengimpor.",
  "profileImport.error.nonempty":
    "Classic sudah berisi data penyiapan. Impor lengkap tidak menimpanya. Gunakan Hanya obrolan untuk menggabungkan percakapan yang kompatibel, atau mulailah dengan profil Classic yang kosong.",
  "profileImport.error.incompatible":
    "Skema basis data sumber tidak cocok dengan versi Classic ini. Impor lengkap memerlukan penyiapan SQLite yang kompatibel; tidak ada migrasi sumber yang dicoba.",
  "profileImport.error.invalid":
    "Penyiapan tidak dapat divalidasi. Periksa izin file, integritas basis data, dan sintaks konfigurasi. Profil Classic yang sedang berjalan tidak diganti.",
  "profileImport.error.changed":
    "Sumber berubah atau pratinjau ini kedaluwarsa. Tutup OpenCode dan proses penulis lain, lalu pratinjau kembali.",
  "profileImport.error.busy":
    "Impor lain, kunci file aktif, atau aktivasi yang tertunda menghalangi operasi ini. Tutup OpenCode dan mulai ulang Classic sebelum mencoba lagi.",
  "profileImport.liveWarning":
    "OpenCode tampaknya sedang berjalan sekarang. Basis datanya terus berubah, sehingga penyiapan mungkin gagal. Tutup OpenCode (semua jendela) dan hentikan servernya sebelum mengonfirmasi, untuk impor yang andal.",
  "profileImport.detail.count": "Item yang terdampak: {{count}}",
  "profileImport.materialized": "Tautan eksternal yang disalin",
  "profileImport.skipped": "File runtime yang dilewati",
  "profileImport.error.source-busy":
    "Sumber terus ditulis (kemungkinan sebuah instance OpenCode sedang berjalan). Tutup OpenCode dan servernya, lalu lakukan pratinjau dan konfirmasi kembali.",
  "profileImport.error.links":
    "Penyiapan berisi tautan yang tidak dapat disalin: siklus tautan simbolik, atau tautan di dalam metadata Git yang salinannya harus tetap persis.",
  "profileImport.error.git-objects":
    "Metadata Git dari penyiapan menggunakan tata letak yang tidak didukung (entri alternates, penunjuk worktree, atau penyimpanan objek yang tidak dapat diprivatisasi dengan aman).",
  "profileImport.error.special-files":
    "Penyiapan berisi simpul perangkat atau file khusus lain yang tidak dapat disalin dengan aman.",
  "profileImport.error.limit":
    "Penyiapan melebihi batas impor (50 GiB atau 500.000 item). Hapus file cadangan besar atau persempit foldernya, lalu pratinjau kembali.",
  "profileImport.error.oversized-file":
    "File konfigurasi atau metadata melebihi batas bacaannya (64 MB untuk konfigurasi, 16 MB untuk metadata Git). Bagi atau perkecil, lalu pratinjau kembali.",
  "profileImport.error.unsupported":
    "Penyiapan ini berisi tautan yang tidak didukung, alternates objek Git siklik, file khusus, atau melebihi batas impor (50 GiB / 500.000 item). Tautan simbolik eksternal harus dimaterialisasi sebelum impor; file sumber tidak diubah.",
  "profileImport.error.space":
    "Tidak ada cukup ruang disk kosong untuk menyiapkan penyiapan ini. Kosongkan ruang dan pratinjau kembali.",
  "chatImport.tab": "Impor obrolan",
  "chatImport.title": "Impor obrolan dari OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop menyimpan basis data obrolan terpisah. Pratinjau dan salin obrolan lokal yang kompatibel dari OpenCode tanpa mengubah sumber atau mengganti obrolan Classic yang ada. Anda dapat kembali ke sini dari pengaturan kapan saja.",
  "chatImport.scope":
    "Tutup OpenCode sebelum mengimpor. Ini menyalin obrolan lokal yang telah selesai beserta riwayatnya. Obrolan dalam antrean, yang sedang berjalan, dan sesi ruang kerja dikecualikan. Informasi masuk, izin, perintah proyek, file eksternal, dan snapshot pembatalan tidak diimpor. Masuk secara terpisah dan pertahankan folder proyek Anda di jalur aslinya.",
  "chatImport.localOnly":
    "Pilih server desktop lokal bawaan untuk mengimpor obrolan. Pengimpor ini tidak mendukung koneksi server jarak jauh dan server latar belakang.",
  "chatImport.detect": "Periksa basis data OpenCode bawaan",
  "chatImport.browse": "Pilih file basis data",
  "chatImport.confirm": "Impor obrolan yang memenuhi syarat",
  "chatImport.busy":
    "Memeriksa atau mengimpor obrolan. Tunggu sebelum menutup aplikasi.",
  "chatImport.noSource":
    "Tidak ada basis data yang ditemukan atau dipilih. Pilih file OpenCode .db Anda untuk melanjutkan.",
  "chatImport.complete":
    "Impor selesai. Buka folder proyek asal untuk menemukan obrolannya. Impor berulang melewati ID obrolan yang sudah ada di Classic.",
  "chatImport.source": "Basis data sumber",
  "chatImport.destination": "Basis data Classic",
  "chatImport.total": "Obrolan di sumber",
  "chatImport.eligible": "Siap diimpor",
  "chatImport.existing": "Sudah ada",
  "chatImport.excluded": "Dikecualikan (dalam antrean, berjalan, atau ruang kerja)",
  "chatImport.imported": "Diimpor",
  "chatImport.error.unavailable":
    "Impor hanya tersedia untuk server desktop Linux bawaan setelah selesai memulai.",
  "chatImport.error.incompatible":
    "Basis data memiliki skema yang berbeda atau tidak didukung. Gunakan versi OpenCode dan Classic yang kompatibel dan terbaru, lalu pratinjau kembali. Penyimpanan JSON lama tidak didukung; sumber tidak dimigrasikan.",
  "chatImport.error.invalid":
    "Basis data tidak dapat dibaca atau divalidasi. Periksa file yang dipilih, izin, dan ruang disk yang tersedia. Impor yang belum dikonfirmasi digulirkan balik; pratinjau kembali sebelum mencoba lagi.",
  "chatImport.error.sameFile":
    "Sumber dan tujuan adalah basis data yang sama. Tidak perlu menyalin.",
  "chatImport.error.conflict":
    "ID proyek atau pesan yang bertentangan menghalangi impor ini. Tidak ada impor parsial yang dikonfirmasi. Obrolan Classic yang ada dipertahankan.",
  "chatImport.error.busy":
    "Basis data sibuk atau operasi memakan waktu terlalu lama. Tutup OpenCode, tunggu impor lain selesai, lalu pratinjau kembali. Percobaan ulang melewati obrolan yang sudah dikonfirmasi.",
  "chatImport.error.expired":
    "Pratinjau ini kedaluwarsa atau sumbernya telah berubah. Pratinjau kembali basis data sebelum mengimpor.",
}
