<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">Açık kaynaklı yapay zeka kodlama asistanı.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic, Linux odaklı, upstream'i takip eden resmi olmayan bir fork'tur; varsayılan olarak klasik masaüstü düzenini kullanır ve yeniden tasarlanan düzen ayarlarda kullanılabilir kalır. Sürümleri ve güncelleyicisi [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic) içinde bağımsız olarak yürütülür. Çevrilmiş README'lerin fork'a özgü bölümleri ve kurulum bağlantıları İngilizce ile eşit tutulur; daha derin içerik upstream'den devralınır ve gecikebilir.


<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![OpenCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opencode.ai)

---

### Kurulumunuzu OpenCode'dan taşıyın

OpenCode Classic Desktop, yerleşik sunucusu için ayrı bir profil kullanır.
**Ayarlar > Sohbet içe aktarma** ve ilk açılış iletişim kutusu **Yalnızca
sohbetler** ile **Her şey (tam kurulum)** seçeneklerini sunar. Aşağıdaki
birleştirme davranışı **Yalnızca sohbetler** için geçerlidir:
İlk açılışta veya **Ayarlar > Sohbet içe aktarma** altında **Varsayılan
OpenCode veritabanını denetle**yi seçin ya da bir `.db` dosyası seçin. Önce
OpenCode'u kapatın; kaynağı, hedefi ve sayıları inceleyin, ardından **Uygun
sohbetleri içe aktar**ı seçin.

- Varsayılan kaynak `$XDG_DATA_HOME/opencode/opencode.db`, normalde
  `~/.local/share/opencode/opencode.db` dosyasıdır. Özel yollar veya
  geliştirme kanalı veritabanları için bir dosya seçin. Hedef, Classic
  masaüstü profilinin `sidecar` dizini altındaki etkin yerleşik masaüstü
  sunucusunun veritabanıdır. Bu içe aktarıcı uzak ve deneysel arka plan
  sunucusu bağlantılarını desteklemez.
- İlk içe aktarıcı eşleşen SQLite şemalarını ve göç geçmişlerini destekler.
  Kaynak dosyaları göçlendirmez veya eski JSON deposunu içe aktarmaz.
  Uyumluluk denetimleri başarısız olursa uyumlu OpenCode ve Classic
  sürümleri kullanıp önizlemeyi tekrarlayın.
- Tamamlanmış yerel sohbetler kimliklerini, başlıklarını, zaman damgalarını,
  iletilerini, parçalarını, v2 geçmişini, yapılacaklarını ve özgün proje
  yollarını korur. Var olan sohbet kimlikleri bir bütün olarak atlanır;
  yeniden içe aktarmak, daha önce içe aktarılmış bir sohbeti güncellemez.
  Kaynak, WAL geçmişi dahil yalnızca okunurdur ve her içe aktarma atomik
  olarak işlenir.
- Sıraya alınmış istemleri, bitmemiş işleri veya açık çalışma alanı
  yerleşimini içeren sohbetler hariç tutulur ve sayılır. İçe aktarma asla
  bir istem başlatmaz veya komut çalıştırmaz. Kimlik bilgileri, hesap
  durumu, izin atamaları, proje komutları, paylaşım sahipliği, harici
  ekler, Git anlık görüntüleri ve masaüstü taslakları kopyalanmaz. Ayrı
  olarak oturum açın ve proje klasörlerinizi özgün yollarında tutun.
  Geçmiş geri alma anlık görüntüleri kullanılamaz; gömülü ek verileri
  konuşmada kalır, harici dosyalar ise var olmaya devam etmelidir.
- İçe aktarılan sohbetleri görmek için özgün proje klasörünü Classic
  içinde açın. Bu tek seferlik bir kopyadır; uygulamalar arasında sürekli
  eşitleme değildir.

#### Her şey (tam kurulum)

Önce OpenCode'u kapatın ve diğer yazan işlemleri durdurun. **Varsayılan
kurulumu önizle**yi seçin ya da **Kurulum klasörlerini seç**ip OpenCode'un
**veri**, **yapılandırma** ve **durum** klasörlerini seçin. Bunlar normalde
`~/.local/share/opencode`, `~/.config/opencode` ve
`~/.local/state/opencode` konumlarındadır; XDG geçersiz kılmalarına uyulur.
Sayıları inceleyin, kuruma güvendiğinizi onaylayın, yerel iletişim kutusunda
doğrulayın ve hazırlanan profili etkinleştirmek için Classic'i yeniden
başlatın.

- Boş bir yerleşik Classic Linux profili gerektirir. Var olan sohbetler,
  sağlayıcılar, özel ayarlar, hesaplar ve kayıtlı projeler asla üzerine
  yazılmaz. Üretilen varsayılan yapılandırma/eklenti dosyaları önyükleme
  durumu olarak tanınır.
- 19 uygulama veritabanı tablosunun tümünü, sağlayıcı `auth.json` dosyasını,
  bulut hesaplarını, tümleştirme kimlik bilgilerini, izinleri, paylaşım
  üst verilerini, yapılandırma dosyalarını (JSONC dahil), ajanları,
  yetenekleri, eklentileri, durumu, planları, araç çıktısını, çalışma alanı
  dosyalarını ve anlık görüntüleri kopyalar. Bekleyen istemler sırada
  kalır; içe aktarma onları yürütmez.
- Harici proje yolları aynı makinede değişmeden kalır. İç yollar, izin
  desenleri ve anlık görüntü anahtarları yeniden eşlenir. Bağlı çalışma
  ağaçları özel Git üst verisi alır ve anlık görüntü nesnesi alternatifleri
  somutlaştırılır, böylece kopyalar özgün nesne depolarına bağımlı olmaz.
- SQLite, kaynak DB/WAL'ın özel bir kopyasını okur. Kaynak DB, WAL ve
  paylaşılan bellek dosyaları değişmeden bırakılır. Hazırlama özel izinler
  ve kalıcı bir sahiplik günlüğü kullanır. Etkinleştirme, yerleşik sunucu
  başlamadan önce gerçekleşir ve kesintiye uğrayan dizin yeniden
  adlandırmalarını kurtarır. Özgün boş/önyükleme profili inceleme için
  Classic'in masaüstü profili altında
  `.profile-import-retained-<operation-id>` konumunda tutulur; otomatik
  olarak silinmez.
- Kimlik bilgileri korunmuş yerel dosyalar olarak kalır. Tam kurulum
  yürütülebilir davranışı da korur: hesap yenileme, bağımlılık kurulumu,
  eklentiler, MCP bağlantıları, proje komutları, Git kancaları/yardımcıları
  ve izin atamaları etkinleştirmeden sonra normal kullanım sırasında etkili
  olabilir. Yalnızca güvendiğiniz bir kurulumu içe aktarın. Her iki uygulama
  da kullanıldığında OAuth belirteci rotasyonu yeniden oturum açmayı
  gerektirebilir.
- Günlükler, önbellekler ve süreç kilitleri yeniden oluşturulur. Sistem
  programları, kabuk ortam değişkenleri, upstream masaüstü pencere/kenar
  çubuğu tercihleri ve masaüstü taslakları kopyalanmaz. Harici proje
  dosyaları zaten özgün yollarında paylaşılır. Sohbetlerine erişmek için
  özgün proje klasörünü açın.
- Eşleşen SQLite göç geçmişi ve şeması gerektirir. Tam kurulum şu anda
  `opencode.db` dosyasını okur; ortamca sağlanan veritabanı/yapılandırma/
  kimlik doğrulama geçersiz kılmaları kullanılmadan önce kaldırılmalıdır.
  Yalnızca eski JSON depoları, döngüsel veya desteklenmeyen Git nesne
  referansları, aygıt düğümleri ve 50 GiB veya 500.000 envanter girdisi
  üzerindeki profiller belirli bir gerekçeyle reddedilir. Harici sembolik
  bağlantılar olduğu gibi kopyalanır (somutlaştırılır); kopuk bağlantılar,
  yuvalar ve fifolar atlanır ve özet içinde sayılır. 64 MB'a kadar
  yapılandırma dosyaları desteklenir. Hazırlama için ek disk alanı
  gereklidir.
- İçe aktarmadan önce OpenCode'u kapatın. Çalışan bir örnek algılandığında
  önizleme uyarır, anlık görüntü kopyaları otomatik olarak yeniden denenir
  ve sürekli yazılan bir kaynak, onu kapatmanızı isteyen özel bir meşgul
  hatası bildirir.

Bağımsız Classic CLI'si, geçersiz kılmadığınız sürece OpenCode'un varsayılan
XDG köklerini kullanmaya devam eder. `uninstall` komutu verileri, kimlik
bilgilerini, yapılandırmayı, önbelleği ve durumu varsayılan olarak, `--force`
dahil korur. Bu paylaşılan kökleri silmek `--remove-shared-data` gerektirir;
`--keep-data` ve `--keep-config` bu isteği kendi kökleri için geçersiz kılar.
Yolları incelemek için `uninstall --dry-run` kullanın. Upstream'in kendi
kaldırıcısı yine de paylaşılan CLI verilerini silebilir. Fork, bilinmeyen
göçler içeren veritabanlarını açmayı reddeder; bir göç günlüğünü düzenlemek
veya silmek yerine Classic'i güncelleyin.

### Kurulum

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> `opencode-ai` npm paketi ve mevcut Homebrew, Scoop, Chocolatey, AUR ve Nix paketleri upstream OpenCode'u dağıtır; OpenCode Classic'i değil.

### Masaüstü Uygulaması (BETA)

OpenCode Classic masaüstü derlemeleri yalnızca Linux'u destekler ve [fork'un sürümler sayfasından](https://github.com/LogicLyra/opencode-classic/releases) edinilebilir.

| Platform  | İndirme                                              |
| --------- | ---------------------------------------------------- |
| Linux x64 | `opencode-classic-desktop-linux-*` (`.deb` veya `.rpm`) |

AppImage bilinçli olarak dağıtılmaz. Ubuntu 24.04 ve yenileri, varsayılan AppArmor ilkesi altında Electron AppImage'lerinin Chromium korumalı alanını devre dışı bırakmasına zorlayabilir; kurulu deb ve RPM biçimleri dağıtımın beklediği korumalı alan bütünleşmesini korur.

Bakımcılar, eksiksiz derleme, paketleme, kurulu deb ve görsel sürüm denetimini [Linux VM sürüm QA çalışma kılavuzuyla](docs/linux-vm-qa.md) yeniden üretebilir.

#### Kurulum Dizini

Kurulum betiği, kurulum yolu için şu öncelik sırasına uyar:

1. `$OPENCODE_INSTALL_DIR` - Özel kurulum dizini
2. `$XDG_BIN_DIR` - XDG Base Directory Specification ile uyumlu yol
3. `$HOME/bin` - Standart kullanıcı ikili dizini (varsa veya oluşturulabiliyorsa)
4. `$HOME/.opencode/bin` - Varsayılan geri dönüş

```bash
# Örnekler
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Ajanlar

OpenCode, `Tab` tuşuyla aralarında geçiş yapabileceğiniz iki yerleşik (built-in) ajan içerir.

- **build** - Varsayılan, geliştirme çalışmaları için tam erişimli ajan
- **plan** - Analiz ve kod keşfi için salt okunur ajan
  - Varsayılan olarak dosya düzenlemelerini reddeder
  - Bash komutlarını çalıştırmadan önce izin ister
  - Tanımadığınız kod tabanlarını keşfetmek veya değişiklikleri planlamak için ideal

Ayrıca, karmaşık aramalar ve çok adımlı görevler için bir **genel** alt ajan bulunmaktadır.
Bu dahili olarak kullanılır ve mesajlarda `@general` ile çağrılabilir.

[Ajanlar](https://opencode.ai/docs/agents) hakkında daha fazla bilgi edinin.

### Dokümantasyon

OpenCode'u nasıl yapılandıracağınız hakkında daha fazla bilgi için [**dokümantasyonumuza göz atın**](https://opencode.ai/docs).

### Katkıda Bulunma

OpenCode'a katkıda bulunmak istiyorsanız, lütfen bir pull request göndermeden önce [katkıda bulunma dokümanlarımızı](./CONTRIBUTING.md) okuyun.

### OpenCode Üzerine Geliştirme

OpenCode ile ilgili bir proje üzerinde çalışıyorsanız ve projenizin adının bir parçası olarak "opencode" kullanıyorsanız (örneğin, "opencode-dashboard" veya "opencode-mobile"), lütfen README dosyanıza projenin OpenCode ekibi tarafından geliştirilmediğini ve bizimle hiçbir şekilde bağlantılı olmadığını belirten bir not ekleyin.

---

**Topluluğumuza katılın** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
