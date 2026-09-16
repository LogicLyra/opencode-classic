export const dict = {
  "profileImport.mode": "İçe aktarma modu",
  "profileImport.chats": "Yalnızca sohbetler",
  "profileImport.everything": "Her şey (tam kurulum)",
  "profileImport.description":
    "Uyumlu OpenCode kurulumunuzu boş bir Classic masaüstü profiline kopyalar: sohbetler, sağlayıcı oturum açma bilgileri, bulut hesapları, izinler, genel yapılandırma, ajanlar, skills, eklentiler, planlar, anlık görüntüler ve çalışma alanı dosyaları. Kaynak değişmeden kalır. Önizleme, içe aktarılan komutları çalıştırmaz ve sağlayıcılarla iletişime geçmez.",
  "profileImport.boundaries":
    "Önce OpenCode'u kapatın ve dosyalarını düzenlemeyi bırakın. OpenCode depolaması dışındaki proje klasörleri özgün yollarında kalır. Ortam değişkenleri, sisteme yüklenmiş araçlar ve masaüstü pencere tercihimleri kopyalanmaz. Günlükler, önbellekler ve süreç kilitleri yeniden oluşturulur. OAuth sağlayıcıları yeniden oturum açma gerektirebilir. Özel klasörler bu sırayla seçilir: veriler, yapılandırma, sonra durum.",
  "profileImport.detect": "Varsayılan kurulumu önizle",
  "profileImport.browse": "Kurulum klasörlerini seç",
  "profileImport.busy":
    "Tam kurulum doğrulanıyor veya hazırlanıyor. Bu bitene kadar Classic'i açık tutun.",
  "profileImport.cancelled":
    "Uyumlu bir kaynak bulunamadı veya klasör seçimi iptal edildi.",
  "profileImport.staged":
    "Kurulum hazırlandı ve doğrulandı. Sunucusu başlamadan önce etkinleştirmek için Classic'i yeniden başlatın. Yeniden başlatmadan önce Classic'e veri eklemeyin; etkinleştirme hedefin boş olduğunu yeniden denetler.",
  "profileImport.activated":
    "Tam kurulum başarıyla etkinleştirildi. Proje klasörleriniz özgün yollarında kullanılabilir kalır; içe aktarılan iç çalışma alanları bağımsız kopyalara sahiptir.",
  "profileImport.data": "Kaynak veri klasörü",
  "profileImport.config": "Kaynak yapılandırma klasörü",
  "profileImport.state": "Kaynak durum klasörü",
  "profileImport.providers": "Kayıtlı sağlayıcı oturum açma bilgileri",
  "profileImport.accounts": "Bulut hesapları",
  "profileImport.workspaces": "Çalışma alanları",
  "profileImport.files": "Dosyalar ve bağlantılar",
  "profileImport.bytes": "Kopyalama boyutu (bayt)",
  "profileImport.plugins": "Yapılandırılmış eklentiler",
  "profileImport.mcp": "MCP girişleri",
  "profileImport.commands": "Proje komutları",
  "profileImport.permissions": "İzin kayıtları",
  "profileImport.pending": "Bekleyen istemler",
  "profileImport.git": "Git checkout işlemleri",
  "profileImport.consent":
    "OpenCode'u kapattım ve oturum açma bilgileri, hesap yenileme, bağımlılıklar, eklentiler, MCP sunucuları, proje komutları, Git kancaları ve mevcut izinler dahil bu tam kuruma güveniyorum. Bunlar etkinleştirmeden sonra normal kullanım sırasında çalışabilir. Bekleyen istemler devam ettirilene kadar kuyrukta kalır.",
  "profileImport.confirm": "Tam kurulumu hazırla",
  "profileImport.restart": "Yeniden başlat ve kurulumu etkinleştir",
  "profileImport.error.unavailable":
    "Tam içe aktarma, yerleşik Linux masaüstü sunucusunu ve dosya tabanlı yapılandırmayı gerektirir. Ortam tarafından sağlanan yapılandırma veya kimlik doğrulama geçersiz kılmaları içe aktarmadan önce kaldırılmalıdır.",
  "profileImport.error.nonempty":
    "Classic zaten kurulum verileri içeriyor. Tam içe aktarma bunların üzerine yazmaz. Uyumlu konuşmaları birleştirmek için Yalnızca sohbetler seçeneğini kullanın veya boş bir Classic profiliyle başlayın.",
  "profileImport.error.incompatible":
    "Kaynak veritabanının şeması bu Classic sürümüyle eşleşmiyor. Tam içe aktarma uyumlu bir SQLite kurulumu gerektirir; kaynağın geçişi denenmedi.",
  "profileImport.error.invalid":
    "Kurulum doğrulanamadı. Dosya izinlerini, veritabanı bütünlüğünü ve yapılandırma sözdizimini denetleyin. Çalışmakta olan Classic profili değiştirilmedi.",
  "profileImport.error.changed":
    "Kaynak değişti veya bu önizlemenin süresi doldu. OpenCode'u ve diğer yazan süreçleri kapatın, sonra yeniden önizleyin.",
  "profileImport.error.busy":
    "Başka bir içe aktarma, etkin bir dosya kilidi veya bekleyen bir etkinleştirme bu işlemi engelliyor. Yeniden denemeden önce OpenCode'u kapatın ve Classic'i yeniden başlatın.",
  "profileImport.liveWarning":
    "OpenCode şu anda çalışıyor gibi görünüyor. Veritabanı sürekli değiştiği için hazırlık başarısız olabilir. Güvenilir bir içe aktarma için onaylamadan önce OpenCode'u (tüm pencereler) kapatın ve sunucularını durdurun.",
  "profileImport.detail.count": "Etkilenen öğeler: {{count}}",
  "profileImport.materialized": "Kopyalanan dış bağlantılar",
  "profileImport.skipped": "Atlanan çalışma zamanı dosyaları",
  "profileImport.error.source-busy":
    "Kaynağa sürekli yazılıyor (muhtemelen bir OpenCode örneği çalışıyor). OpenCode'u ve sunucularını kapatın, sonra önizlemeyi ve onayı yineleyin.",
  "profileImport.error.links":
    "Kurulum, kopyalanamayan bir bağlantı içeriyor: bir sembolik bağlantı döngüsü veya kopyaların birebir kalması gereken Git meta verilerinin içinde bir bağlantı.",
  "profileImport.error.git-objects":
    "Kurulumun Git meta verileri desteklenmeyen bir düzen kullanıyor (alternates girişleri, worktree işaretçileri veya güvenle özelleştirilemeyen nesne depoları).",
  "profileImport.error.special-files":
    "Kurulum, güvenle kopyalanamayan aygıt düğümleri veya diğer özel dosyaları içeriyor.",
  "profileImport.error.limit":
    "Kurulum, içe aktarma sınırını aşıyor (50 GiB veya 500.000 öğe). Büyük yedek dosyalarını kaldırın veya klasörleri daraltın, sonra yeniden önizleyin.",
  "profileImport.error.oversized-file":
    "Bir yapılandırma veya meta veri dosyası okuma sınırını aşıyor (yapılandırmalar için 64 MB, Git meta verileri için 16 MB). Bölün veya küçültün, sonra yeniden önizleyin.",
  "profileImport.error.unsupported":
    "Bu kurulum desteklenmeyen bağlantılar, döngüsel Git nesnesi alternates'leri, özel dosyalar içeriyor veya içe aktarma sınırını aşıyor (50 GiB / 500.000 öğe). Dış sembolik bağlantılar içe aktarmadan önce somutlaştırılmalıdır; kaynak dosyalar değiştirilmedi.",
  "profileImport.error.space":
    "Bu kurulumu hazırlamak için yeterli boş disk alanı yok. Alan açın ve yeniden önizleyin.",
  "chatImport.tab": "Sohbet içe aktarma",
  "chatImport.title": "OpenCode'dan sohbetleri içe aktar",
  "chatImport.description":
    "OpenCode Classic Desktop kendi sohbet veritabanını tutar. Kaynağı değiştirmeden ve mevcut Classic sohbetlerinin yerine koymadan OpenCode'dan uyumlu yerel sohbetleri önizleyin ve kopyalayın. Ayarlardan istediğiniz zaman buraya dönebilirsiniz.",
  "chatImport.scope":
    "İçe aktarmadan önce OpenCode'u kapatın. Bu, tamamlanmış yerel sohbetleri ve geçmişlerini kopyalar. Kuyruktaki, devam eden ve çalışma alanı oturumları hariç tutulur. Oturum açma bilgileri, izinler, proje komutları, dış dosyalar ve geri alma anlık görüntüleri içe aktarılmaz. Ayrı olarak oturum açın ve proje klasörlerinizi özgün yollarında tutun.",
  "chatImport.localOnly":
    "Sohbetleri içe aktarmak için yerleşik yerel masaüstü sunucusunu seçin. Bu içe aktarıcı uzak ve arka plan sunucusu bağlantılarını desteklemez.",
  "chatImport.detect": "Varsayılan OpenCode veritabanını denetle",
  "chatImport.browse": "Veritabanı dosyası seç",
  "chatImport.confirm": "Uygun sohbetleri içe aktar",
  "chatImport.busy":
    "Sohbetler denetleniyor veya içe aktarılıyor. Uygulamayı kapatmadan önce bekleyin.",
  "chatImport.noSource":
    "Hiçbir veritabanı bulunamadı veya seçilmedi. Devam etmek için OpenCode .db dosyanızı seçin.",
  "chatImport.complete":
    "İçe aktarma tamamlandı. Sohbetlerini bulmak için özgün proje klasörünü açın. Yinelenen içe aktarma, Classic'te zaten var olan sohbet kimliklerini atlar.",
  "chatImport.source": "Kaynak veritabanı",
  "chatImport.destination": "Classic veritabanı",
  "chatImport.total": "Kaynaktaki sohbetler",
  "chatImport.eligible": "İçe aktarılmaya hazır",
  "chatImport.existing": "Zaten var",
  "chatImport.excluded": "Hariç tutulan (kuyrukta, devam eden veya çalışma alanı)",
  "chatImport.imported": "İçe aktarıldı",
  "chatImport.error.unavailable":
    "İçe aktarma yalnızca yerleşik Linux masaüstü sunucusu için, başlatmayı tamamladıktan sonra kullanılabilir.",
  "chatImport.error.incompatible":
    "Veritabanları farklı veya desteklenmeyen şemalara sahip. Uyumlu ve güncel OpenCode ile Classic sürümlerini kullanın, sonra yeniden önizleyin. Eski JSON depolaması desteklenmez; kaynak taşınmadı.",
  "chatImport.error.invalid":
    "Veritabanı okunamadı veya doğrulanamadı. Seçili dosyayı, izinleri ve kullanılabilir disk alanını denetleyin. Onaylanmayan içe aktarma geri alınır; yeniden denemeden önce yeniden önizleyin.",
  "chatImport.error.sameFile":
    "Kaynak ve hedef aynı veritabanı. Kopyalama gerekmez.",
  "chatImport.error.conflict":
    "Çakışan proje veya ileti kimlikleri bu içe aktarmayı engelledi. Kısmi içe aktarma onaylanmadı. Mevcut Classic sohbetleri korundu.",
  "chatImport.error.busy":
    "Veritabanı meşgul ya da işlem çok uzun sürdü. OpenCode'u kapatın, diğer içe aktarmaların bitmesini bekleyin, sonra yeniden önizleyin. Yeni deneme, zaten onaylanmış sohbetleri atlar.",
  "chatImport.error.expired":
    "Bu önizlemenin süresi doldu veya kaynağı değişti. İçe aktarmadan önce veritabanını yeniden önizleyin.",
}
