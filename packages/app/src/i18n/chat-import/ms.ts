export const dict = {
  "profileImport.mode": "Mod import",
  "profileImport.chats": "Sembang sahaja",
  "profileImport.everything": "Semua (persediaan penuh)",
  "profileImport.description":
    "Menyalin persediaan OpenCode anda yang serasi ke dalam profil desktop Classic yang kosong: sembang, maklumat daftar masuk penyedia, akaun awan, kebenaran, konfigurasi global, ejen, skills, pemalam, pelan, snapshot dan fail ruang kerja. Sumber kekal tidak berubah. Pratonton tidak melaksanakan arahan yang diimport dan tidak menghubungi penyedia.",
  "profileImport.boundaries":
    "Tutup OpenCode terlebih dahulu dan berhenti menyunting failnya. Folder projek di luar storan OpenCode kekal di laluan asalnya. Pemboleh ubah persekitaran, alatan yang dipasang pada sistem dan keutamaan tetingkap desktop huluan tidak disalin. Log, cache dan kunci proses dijana semula. Penyedia OAuth mungkin memerlukan daftar masuk semula. Folder tersuai dipilih mengikut urutan ini: data, konfigurasi, kemudian keadaan.",
  "profileImport.detect": "Pratonton persediaan lalai",
  "profileImport.browse": "Pilih folder persediaan",
  "profileImport.busy":
    "Persediaan penuh sedang disahkan atau disediakan. Kekalkan Classic terbuka sehingga ini selesai.",
  "profileImport.cancelled":
    "Tiada sumber serasi ditemui, atau pemilihan folder dibatalkan.",
  "profileImport.staged":
    "Persediaan telah disediakan dan disahkan. Mulakan semula Classic untuk mengaktifkannya sebelum pelayannya bermula. Jangan tambah data ke Classic sebelum memulakan semula; pengaktifan menyemak semula bahawa destinasi kosong.",
  "profileImport.activated":
    "Persediaan penuh berjaya diaktifkan. Folder projek anda kekal boleh diakses di laluan asalnya; ruang kerja dalaman yang diimport mempunyai salinan bebas.",
  "profileImport.data": "Folder data sumber",
  "profileImport.config": "Folder konfigurasi sumber",
  "profileImport.state": "Folder keadaan sumber",
  "profileImport.providers": "Maklumat daftar masuk penyedia yang disimpan",
  "profileImport.accounts": "Akaun awan",
  "profileImport.workspaces": "Ruang kerja",
  "profileImport.files": "Fail dan pautan",
  "profileImport.bytes": "Saiz salinan (bait)",
  "profileImport.plugins": "Pemalam yang dikonfigurasikan",
  "profileImport.mcp": "Entri MCP",
  "profileImport.commands": "Arahan projek",
  "profileImport.permissions": "Rekod kebenaran",
  "profileImport.pending": "Promp tertunda",
  "profileImport.git": "Checkout Git",
  "profileImport.consent":
    "Saya telah menutup OpenCode dan mempercayai persediaan penuh ini, termasuk maklumat daftar masuk, penyegaran akaun, kebergantungan, pemalam, pelayan MCP, arahan projek, cangkuk Git dan kebenaran sedia ada. Semua ini boleh berjalan semasa penggunaan biasa selepas pengaktifan. Promp tertunda kekal dalam barisan sehingga disambung semula.",
  "profileImport.confirm": "Sediakan persediaan penuh",
  "profileImport.restart": "Mulakan semula dan aktifkan persediaan",
  "profileImport.error.unavailable":
    "Import penuh memerlukan pelayan desktop Linux terbina dalam dan konfigurasi berasaskan fail. Konfigurasi atau penggantian pengesahan yang dibekalkan oleh persekitaran mesti dibuang sebelum mengimport.",
  "profileImport.error.nonempty":
    "Classic sudah mengandungi data persediaan. Import penuh tidak menulis gantinya. Gunakan Sembang sahaja untuk menggabungkan perbualan yang serasi, atau mulakan dengan profil Classic yang kosong.",
  "profileImport.error.incompatible":
    "Skema pangkalan data sumber tidak sepadan dengan versi Classic ini. Import penuh memerlukan persediaan SQLite yang serasi; tiada penghijrahan sumber dicuba.",
  "profileImport.error.invalid":
    "Persediaan tidak dapat disahkan. Semak kebenaran fail, integriti pangkalan data dan sintaks konfigurasi. Profil Classic yang sedang berjalan tidak diganti.",
  "profileImport.error.changed":
    "Sumber telah berubah atau pratonton ini telah tamat tempoh. Tutup OpenCode dan penulis lain, kemudian pratonton semula.",
  "profileImport.error.busy":
    "Import lain, kunci fail aktif atau pengaktifan tertunda menghalang operasi ini. Tutup OpenCode dan mulakan semula Classic sebelum mencuba lagi.",
  "profileImport.liveWarning":
    "OpenCode kelihatan sedang berjalan sekarang. Pangkalan datanya berubah secara berterusan, jadi penyediaan mungkin gagal. Tutup OpenCode (semua tetingkap) dan hentikan pelayannya sebelum mengesahkan, untuk import yang boleh dipercayai.",
  "profileImport.detail.count": "Item yang terjejas: {{count}}",
  "profileImport.materialized": "Pautan luar yang disalin",
  "profileImport.skipped": "Fail masa jalan yang dilangkau",
  "profileImport.error.source-busy":
    "Sumber ditulis secara berterusan (kemungkinan satu tika OpenCode sedang berjalan). Tutup OpenCode dan pelayannya, kemudian lakukan pratonton dan pengesahan semula.",
  "profileImport.error.links":
    "Persediaan mengandungi pautan yang tidak boleh disalin: kitaran pautan simbolik, atau pautan dalam metadata Git yang salinannya mesti kekal tepat.",
  "profileImport.error.git-objects":
    "Metadata Git persediaan menggunakan susun atur yang tidak disokong (entri alternates, penunjuk worktree atau stor objek yang tidak boleh diprivatkan secara selamat).",
  "profileImport.error.special-files":
    "Persediaan mengandungi nod peranti atau fail istimewa lain yang tidak boleh disalin secara selamat.",
  "profileImport.error.limit":
    "Persediaan melebihi had import (50 GiB atau 500,000 item). Buang fail sandaran besar atau sempitkan folder, kemudian pratonton semula.",
  "profileImport.error.oversized-file":
    "Fail konfigurasi atau metadata melebihi had bacaannya (64 MB untuk konfigurasi, 16 MB untuk metadata Git). Bahagikan atau kecilkannya, kemudian pratonton semula.",
  "profileImport.error.unsupported":
    "Persediaan ini mengandungi pautan yang tidak disokong, alternates objek Git kitaran, fail istimewa, atau melebihi had import (50 GiB / 500,000 item). Pautan simbolik luar mesti dimaterialkan sebelum import; fail sumber tidak diubah.",
  "profileImport.error.space":
    "Tiada cukup ruang cakera kosong untuk menyediakan persediaan ini. Kosongkan ruang dan pratonton semula.",
  "chatImport.tab": "Import sembang",
  "chatImport.title": "Import sembang daripada OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop menyimpan pangkalan data sembang yang berasingan. Pratonton dan salin sembang setempat yang serasi daripada OpenCode tanpa mengubah sumber atau menggantikan sembang Classic sedia ada. Anda boleh kembali ke sini dari tetapan pada bila-bila masa.",
  "chatImport.scope":
    "Tutup OpenCode sebelum mengimport. Ini menyalin sembang setempat yang selesai dan sejarahnya. Sembang dalam barisan, sedang berjalan dan sesi ruang kerja dikecualikan. Maklumat daftar masuk, kebenaran, arahan projek, fail luaran dan snapshot buat asal tidak diimport. Daftar masuk secara berasingan dan kekalkan folder projek anda di laluan asalnya.",
  "chatImport.localOnly":
    "Pilih pelayan desktop setempat terbina dalam untuk mengimport sembang. Pengimport ini tidak menyokong sambungan pelayan jauh dan pelayan latar belakang.",
  "chatImport.detect": "Semak pangkalan data OpenCode lalai",
  "chatImport.browse": "Pilih fail pangkalan data",
  "chatImport.confirm": "Import sembang yang layak",
  "chatImport.busy":
    "Menyemak atau mengimport sembang. Tunggu sebelum menutup aplikasi.",
  "chatImport.noSource":
    "Tiada pangkalan data ditemui atau dipilih. Pilih fail OpenCode .db anda untuk meneruskan.",
  "chatImport.complete":
    "Import selesai. Buka folder projek asal untuk mencari sembangnya. Import berulang melangkau ID sembang yang sudah ada dalam Classic.",
  "chatImport.source": "Pangkalan data sumber",
  "chatImport.destination": "Pangkalan data Classic",
  "chatImport.total": "Sembang dalam sumber",
  "chatImport.eligible": "Sedia untuk diimport",
  "chatImport.existing": "Sudah wujud",
  "chatImport.excluded": "Dikecualikan (dalam barisan, berjalan atau ruang kerja)",
  "chatImport.imported": "Diimport",
  "chatImport.error.unavailable":
    "Import hanya tersedia untuk pelayan desktop Linux terbina dalam selepas ia selesai dimulakan.",
  "chatImport.error.incompatible":
    "Pangkalan data mempunyai skema yang berbeza atau tidak disokong. Gunakan versi OpenCode dan Classic yang serasi dan terkini, kemudian pratonton semula. Storan JSON lama tidak disokong; sumber tidak dihijrahkan.",
  "chatImport.error.invalid":
    "Pangkalan data tidak dapat dibaca atau disahkan. Semak fail yang dipilih, kebenaran dan ruang cakera yang tersedia. Import yang tidak disahkan dikembalikan; pratonton semula sebelum mencuba lagi.",
  "chatImport.error.sameFile":
    "Sumber dan destinasi adalah pangkalan data yang sama. Tiada salinan diperlukan.",
  "chatImport.error.conflict":
    "ID projek atau mesej yang berkonflik menghalang import ini. Tiada import separuh disahkan. Sembang Classic sedia ada dikekalkan.",
  "chatImport.error.busy":
    "Pangkalan data sibuk atau operasi mengambil masa terlalu lama. Tutup OpenCode, tunggu import lain selesai, kemudian pratonton semula. Percubaan semula melangkau sembang yang sudah disahkan.",
  "chatImport.error.expired":
    "Pratonton ini telah tamat tempoh atau sumbernya telah berubah. Pratonton semula pangkalan data sebelum mengimport.",
}
