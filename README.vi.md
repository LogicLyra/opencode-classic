<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">Trợ lý lập trình AI mã nguồn mở.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic là một fork không chính thức hướng đến Linux, theo dõi upstream, dùng bố cục desktop cổ điển làm mặc định và vẫn giữ bố cục thiết kế lại trong phần cài đặt. Các bản phát hành và trình cập nhật của nó được duy trì độc lập tại [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic). Các phần riêng của fork và liên kết cài đặt trong mỗi README dịch được đồng bộ với tiếng Anh; nội dung sâu hơn kế thừa từ upstream và có thể chậm hơn.


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

### Đưa thiết lập của bạn từ OpenCode

OpenCode Classic Desktop dùng một hồ sơ riêng cho máy chủ tích hợp sẵn.
**Cài đặt > Nhập cuộc trò chuyện** và hộp thoại khởi động lần đầu cung cấp
**Chỉ cuộc trò chuyện** và **Tất cả (thiết lập đầy đủ)**. Hành vi gộp sau
đây áp dụng cho **Chỉ cuộc trò chuyện**:
Khi khởi động lần đầu, hoặc trong **Cài đặt > Nhập cuộc trò chuyện**, chọn
**Kiểm tra cơ sở dữ liệu OpenCode mặc định** hoặc chọn một tệp `.db`. Hãy
đóng OpenCode trước, xem lại nguồn, đích và số lượng, rồi chọn **Nhập các
cuộc trò chuyện đủ điều kiện**.

- Nguồn mặc định là `$XDG_DATA_HOME/opencode/opencode.db`, thường là
  `~/.local/share/opencode/opencode.db`. Chọn một tệp cho đường dẫn tùy
  chỉnh hoặc cơ sở dữ liệu kênh phát triển. Đích là cơ sở dữ liệu của máy
  chủ desktop tích hợp đang hoạt động, nằm trong thư mục `sidecar` của hồ
  sơ desktop Classic. Trình nhập này không hỗ trợ kết nối từ xa và máy chủ
  nền thử nghiệm.
- Trình nhập ban đầu hỗ trợ schema SQLite và lịch sử di trú khớp nhau.
  Nó không di trú tệp nguồn và không nhập kho JSON cũ. Nếu kiểm tra tính
  tương thích thất bại, hãy dùng phiên bản OpenCode và Classic tương thích
  rồi xem trước lại.
- Các cuộc trò chuyện cục bộ đã hoàn tất giữ nguyên ID, tiêu đề, dấu thời
  gian, tin nhắn, phần, lịch sử v2, việc cần làm và đường dẫn dự án gốc.
  ID cuộc trò chuyện đã tồn tại bị bỏ qua toàn bộ; nhập lại không cập nhật
  cuộc trò chuyện đã nhập. Nguồn ở chế độ chỉ đọc, bao gồm lịch sử WAL,
  và mỗi lần nhập được ghi nguyên tử.
- Các cuộc trò chuyện có prompt đang xếp hàng, công việc chưa hoàn tất
  hoặc vị trí vùng làm việc tường minh bị loại trừ và được đếm. Việc nhập
  không bao giờ khởi chạy prompt hay chạy lệnh. Thông tin đăng nhập, trạng
  thái tài khoản, các quyền đã cấp, lệnh dự án, quyền sở hữu chia sẻ, tệp
  đính kèm ngoài, ảnh chụp Git và bản nháp desktop không được sao chép.
  Hãy đăng nhập riêng và giữ các thư mục dự án ở đường dẫn gốc. Ảnh chụp
  hoàn tác lịch sử không khả dụng; dữ liệu đính kèm nhúng vẫn nằm trong
  bản ghi, còn các tệp ngoài phải tiếp tục tồn tại.
- Mở thư mục dự án gốc trong Classic để xem các cuộc trò chuyện đã nhập.
  Đây là bản sao một lần, không phải đồng bộ liên tục giữa các ứng dụng.

#### Tất cả (thiết lập đầy đủ)

Đóng OpenCode và dừng các tiến trình ghi khác trước. Chọn **Xem trước
thiết lập mặc định**, hoặc **Chọn thư mục thiết lập** và chọn các thư mục
**dữ liệu**, **cấu hình** rồi **trạng thái** của OpenCode. Chúng thường nằm
tại `~/.local/share/opencode`, `~/.config/opencode` và
`~/.local/state/opencode`; các ghi đè XDG được tôn trọng. Xem lại số
lượng, xác nhận rằng bạn tin tưởng thiết lập này, xác nhận trong hộp thoại
hệ thống, rồi khởi động lại Classic để kích hoạt hồ sơ đã dàn dựng.

- Yêu cầu một hồ sơ Linux tích hợp trống của Classic. Các cuộc trò
  chuyện, nhà cung cấp, cài đặt tùy chỉnh, tài khoản và dự án đã đăng ký
  sẵn có không bao giờ bị ghi đè. Các tệp cấu hình/plugin mặc định được
  tạo ra được nhận diện là trạng thái khởi động.
- Sao chép cả 19 bảng cơ sở dữ liệu ứng dụng, `auth.json` của nhà cung
  cấp, tài khoản đám mây, thông tin đăng nhập tích hợp, quyền, siêu dữ
  liệu chia sẻ, tệp cấu hình (bao gồm JSONC), agent, kỹ năng, plugin,
  trạng thái, kế hoạch, đầu ra công cụ, tệp vùng làm việc và ảnh chụp.
  Prompt đang chờ vẫn nằm trong hàng đợi; việc nhập không thực thi chúng.
- Đường dẫn dự án ngoài giữ nguyên trên cùng máy. Đường dẫn nội bộ, mẫu
  quyền và khóa ảnh chụp được ánh xạ lại. Các cây làm việc liên kết nhận
  siêu dữ liệu Git riêng, và các bản thay thế đối tượng ảnh chụp được vật
  chất hóa để các bản sao không phụ thuộc vào kho đối tượng gốc.
- SQLite đọc một bản sao riêng của DB/WAL nguồn. DB nguồn, WAL và các tệp
  bộ nhớ dùng chung được để nguyên. Việc dàn dựng dùng quyền riêng và một
  nhật ký quyền sở hữu bền vững. Việc kích hoạt diễn ra trước khi máy chủ
  tích hợp khởi động và khôi phục các đổi tên thư mục bị gián đoạn. Hồ sơ
  gốc trống/khởi động được giữ dưới `.profile-import-retained-<operation-id>`
  trong hồ sơ desktop của Classic để kiểm tra; nó không tự động bị xóa.
- Thông tin đăng nhập vẫn là các tệp cục bộ được bảo vệ. Thiết lập đầy đủ
  cũng giữ lại hành vi có thể thực thi: làm mới tài khoản, cài đặt phần
  phụ thuộc, plugin, kết nối MCP, lệnh dự án, hook/trợ giúp Git và các
  quyền đã cấp có thể phát huy tác dụng khi sử dụng bình thường sau khi
  kích hoạt. Chỉ nhập thiết lập mà bạn tin tưởng. Việc xoay vòng token
  OAuth có thể yêu cầu đăng nhập lại khi dùng cả hai ứng dụng.
- Nhật ký, bộ nhớ đệm và khóa tiến trình được tạo lại. Các chương trình
  hệ thống, biến môi trường shell, tùy chọn cửa sổ/thanh bên desktop
  của upstream và bản nháp desktop không được sao chép. Các tệp dự án
  ngoài đã được chia sẻ tại đường dẫn gốc. Hãy mở thư mục dự án gốc
  để truy cập các cuộc trò chuyện của nó.
- Yêu cầu lịch sử di trú và schema SQLite khớp nhau. Thiết lập đầy đủ
  hiện đọc `opencode.db`; các ghi đè cơ sở dữ liệu/cấu hình/xác thực do
  môi trường cung cấp phải được gỡ bỏ trước khi dùng. Các kho chỉ JSON
  cũ, tham chiếu đối tượng Git tuần hoàn hoặc không được hỗ trợ, nút
  thiết bị, và hồ sơ vượt quá 50 GiB hoặc 500.000 mục kê khai bị từ chối
  kèm lý do cụ thể. Liên kết tượng trưng ngoài được sao chép nguyên vẹn
  (vật chất hóa); liên kết gãy, socket và fifo bị bỏ qua và đếm trong
  tóm tắt. Hỗ trợ tệp cấu hình tới 64 MB. Cần thêm dung lượng đĩa để dàn
  dựng.
- Đóng OpenCode trước khi nhập. Bản xem trước cảnh báo khi phát hiện
  phiên bản đang chạy, các bản sao ảnh chụp tự động thử lại, và nguồn
  đang được ghi liên tục báo lỗi bận riêng yêu cầu bạn đóng nó.

CLI Classic độc lập vẫn dùng các gốc XDG mặc định của OpenCode trừ khi bạn
ghi đè chúng. Lệnh `uninstall` của nó mặc định giữ lại dữ liệu, thông tin
đăng nhập, cấu hình, bộ nhớ đệm và trạng thái, kể cả với `--force`. Xóa các
gốc dùng chung này cần `--remove-shared-data`; `--keep-data` và
`--keep-config` ghi đè yêu cầu đó cho từng gốc tương ứng. Dùng
`uninstall --dry-run` để xem lại các đường dẫn. Trình gỡ cài đặt riêng của
upstream vẫn có thể xóa dữ liệu CLI dùng chung. Fork từ chối mở cơ sở dữ
liệu chứa các di trú không xác định; hãy cập nhật Classic thay vì chỉnh sửa
hoặc xóa nhật ký di trú.

### Cài đặt

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> Gói npm `opencode-ai` và các gói Homebrew, Scoop, Chocolatey, AUR, Nix hiện có phân phối OpenCode upstream, không phải OpenCode Classic.

### Ứng dụng desktop (BETA)

Các bản dựng desktop của OpenCode Classic chỉ hỗ trợ Linux và có sẵn trên [trang phát hành của fork](https://github.com/LogicLyra/opencode-classic/releases).

| Nền tảng  | Tải về                                                |
| --------- | ----------------------------------------------------- |
| Linux x64 | `opencode-classic-desktop-linux-*` (`.deb` hoặc `.rpm`) |

AppImage cố ý không được phân phối. Ubuntu 24.04 trở lên có thể buộc các AppImage của Electron tắt sandbox Chromium dưới chính sách AppArmor mặc định; các định dạng deb và RPM đã cài đặt giữ lại tích hợp sandbox mà bản phân phối mong đợi.

Người bảo trì có thể tái hiện toàn bộ kiểm tra phát hành — biên dịch, đóng gói, kiểm tra deb đã cài đặt và kiểm tra hình ảnh — bằng [sổ chạy QA phát hành trên VM Linux](docs/linux-vm-qa.md).

#### Thư mục cài đặt

Tập lệnh cài đặt tôn trọng thứ tự ưu tiên sau cho đường dẫn cài đặt:

1. `$OPENCODE_INSTALL_DIR` - Thư mục cài đặt tùy chỉnh
2. `$XDG_BIN_DIR` - Đường dẫn tuân thủ XDG Base Directory Specification
3. `$HOME/bin` - Thư mục nhị phân người dùng chuẩn (nếu tồn tại hoặc có thể tạo)
4. `$HOME/.opencode/bin` - Dự phòng mặc định

```bash
# Ví dụ
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents (Đại diện)

OpenCode bao gồm hai agent được tích hợp sẵn mà bạn có thể chuyển đổi bằng phím `Tab`.

- **build** - Agent mặc định, có toàn quyền truy cập cho công việc lập trình
- **plan** - Agent chỉ đọc dùng để phân tích và khám phá mã nguồn
  - Mặc định từ chối việc chỉnh sửa tệp
  - Hỏi quyền trước khi chạy các lệnh bash
  - Lý tưởng để khám phá các codebase lạ hoặc lên kế hoạch thay đổi

Ngoài ra còn có một subagent **general** dùng cho các tìm kiếm phức tạp và tác vụ nhiều bước.
Agent này được sử dụng nội bộ và có thể gọi bằng cách dùng `@general` trong tin nhắn.

Tìm hiểu thêm về [agents](https://opencode.ai/docs/agents).

### Tài liệu

Để biết thêm thông tin về cách cấu hình OpenCode, [**hãy truy cập tài liệu của chúng tôi**](https://opencode.ai/docs).

### Đóng góp

Nếu bạn muốn đóng góp cho OpenCode, vui lòng đọc [tài liệu hướng dẫn đóng góp](./CONTRIBUTING.md) trước khi gửi pull request.

### Xây dựng trên nền tảng OpenCode

Nếu bạn đang làm việc trên một dự án liên quan đến OpenCode và sử dụng "opencode" như một phần của tên dự án, ví dụ "opencode-dashboard" hoặc "opencode-mobile", vui lòng thêm một ghi chú vào README của bạn để làm rõ rằng dự án đó không được xây dựng bởi đội ngũ OpenCode và không liên kết với chúng tôi dưới bất kỳ hình thức nào.

---

**Tham gia cộng đồng của chúng tôi** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
