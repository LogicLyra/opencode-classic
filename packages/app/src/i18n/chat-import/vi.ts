export const dict = {
  "profileImport.mode": "Chế độ nhập",
  "profileImport.chats": "Chỉ trò chuyện",
  "profileImport.everything": "Tất cả (thiết lập đầy đủ)",
  "profileImport.description":
    "Sao chép thiết lập OpenCode tương thích của bạn vào một hồ sơ Classic desktop trống: các cuộc trò chuyện, thông tin đăng nhập của nhà cung cấp, tài khoản đám mây, quyền, cấu hình toàn cục, tác nhân, skills, plugin, kế hoạch, ảnh chụp nhanh và tệp không gian làm việc. Nguồn vẫn giữ nguyên. Bản xem trước không thực thi các lệnh đã nhập và không liên hệ với nhà cung cấp.",
  "profileImport.boundaries":
    "Trước tiên hãy đóng OpenCode và ngừng chỉnh sửa tệp của nó. Các thư mục dự án nằm ngoài bộ nhớ OpenCode vẫn giữ nguyên đường dẫn ban đầu. Biến môi trường, công cụ cài đặt toàn hệ thống và tùy chọn cửa sổ desktop thượng nguồn không được sao chép. Nhật ký, bộ nhớ đệm và khóa tiến trình được tạo lại. Các nhà cung cấp OAuth có thể yêu cầu đăng nhập lại. Các thư mục tùy chỉnh được chọn theo thứ tự: dữ liệu, cấu hình, rồi trạng thái.",
  "profileImport.detect": "Xem trước thiết lập mặc định",
  "profileImport.browse": "Chọn thư mục thiết lập",
  "profileImport.busy":
    "Đang xác thực hoặc chuẩn bị thiết lập đầy đủ. Giữ Classic mở cho đến khi quá trình này hoàn tất.",
  "profileImport.cancelled":
    "Không tìm thấy nguồn tương thích, hoặc việc chọn thư mục đã bị hủy.",
  "profileImport.staged":
    "Thiết lập đã được chuẩn bị và xác minh. Khởi động lại Classic để kích hoạt nó trước khi máy chủ của nó khởi động. Không thêm dữ liệu vào Classic trước khi khởi động lại; việc kích hoạt sẽ kiểm tra lại rằng đích đến còn trống.",
  "profileImport.activated":
    "Thiết lập đầy đủ đã được kích hoạt thành công. Các thư mục dự án của bạn vẫn khả dụng tại đường dẫn ban đầu; các không gian làm việc nội bộ đã nhập có bản sao độc lập.",
  "profileImport.data": "Thư mục dữ liệu nguồn",
  "profileImport.config": "Thư mục cấu hình nguồn",
  "profileImport.state": "Thư mục trạng thái nguồn",
  "profileImport.providers": "Thông tin đăng nhập nhà cung cấp đã lưu",
  "profileImport.accounts": "Tài khoản đám mây",
  "profileImport.workspaces": "Không gian làm việc",
  "profileImport.files": "Tệp và liên kết",
  "profileImport.bytes": "Kích thước sao chép (byte)",
  "profileImport.plugins": "Plugin đã cấu hình",
  "profileImport.mcp": "Mục MCP",
  "profileImport.commands": "Lệnh dự án",
  "profileImport.permissions": "Bản ghi quyền",
  "profileImport.pending": "Lời nhắc đang chờ",
  "profileImport.git": "Bản checkout Git",
  "profileImport.consent":
    "Tôi đã đóng OpenCode và tin tưởng thiết lập đầy đủ này, bao gồm thông tin đăng nhập, làm mới tài khoản, các phần phụ thuộc, plugin, máy chủ MCP, lệnh dự án, hook Git và các quyền hiện có. Những thứ này có thể chạy trong quá trình sử dụng bình thường sau khi kích hoạt. Các lời nhắc đang chờ vẫn nằm trong hàng đợi cho đến khi được tiếp tục.",
  "profileImport.confirm": "Chuẩn bị thiết lập đầy đủ",
  "profileImport.restart": "Khởi động lại và kích hoạt thiết lập",
  "profileImport.error.unavailable":
    "Nhập đầy đủ yêu cầu máy chủ desktop Linux tích hợp và cấu hình dựa trên tệp. Cấu hình hoặc ghi đè xác thực do môi trường cung cấp phải được gỡ bỏ trước khi nhập.",
  "profileImport.error.nonempty":
    "Classic đã chứa dữ liệu thiết lập. Nhập đầy đủ sẽ không ghi đè lên đó. Hãy dùng Chỉ trò chuyện để hợp nhất các cuộc trò chuyện tương thích, hoặc bắt đầu với hồ sơ Classic trống.",
  "profileImport.error.incompatible":
    "Lược đồ cơ sở dữ liệu nguồn không khớp với phiên bản Classic này. Nhập đầy đủ yêu cầu thiết lập SQLite tương thích; không cố di chuyển nguồn.",
  "profileImport.error.invalid":
    "Không thể xác thực thiết lập. Kiểm tra quyền tệp, tính toàn vẹn của cơ sở dữ liệu và cú pháp cấu hình. Hồ sơ Classic đang chạy chưa bị thay thế.",
  "profileImport.error.changed":
    "Nguồn đã thay đổi hoặc bản xem trước này đã hết hạn. Đóng OpenCode và các tiến trình ghi khác, rồi xem trước lại.",
  "profileImport.error.busy":
    "Một lần nhập khác, khóa tệp đang hoạt động hoặc việc kích hoạt đang chờ ngăn cản thao tác này. Đóng OpenCode và khởi động lại Classic trước khi thử lại.",
  "profileImport.liveWarning":
    "OpenCode có vẻ đang chạy ngay lúc này. Cơ sở dữ liệu của nó thay đổi liên tục, nên việc chuẩn bị có thể thất bại. Đóng OpenCode (mọi cửa sổ) và dừng các máy chủ của nó trước khi xác nhận, để có lần nhập đáng tin cậy.",
  "profileImport.detail.count": "Mục bị ảnh hưởng: {{count}}",
  "profileImport.materialized": "Liên kết ngoài đã sao chép",
  "profileImport.skipped": "Tệp runtime bị bỏ qua",
  "profileImport.error.source-busy":
    "Nguồn đang được ghi liên tục (có thể một phiên bản OpenCode đang chạy). Đóng OpenCode và các máy chủ của nó, rồi thực hiện lại bản xem trước và xác nhận.",
  "profileImport.error.links":
    "Thiết lập chứa một liên kết không thể sao chép: vòng lặp symlink, hoặc liên kết bên trong siêu dữ liệu Git nơi các bản sao phải giữ nguyên xác.",
  "profileImport.error.git-objects":
    "Siêu dữ liệu Git của thiết lập dùng bố cục không được hỗ trợ (các mục alternates, con trỏ worktree hoặc kho đối tượng không thể tư nhân hóa an toàn).",
  "profileImport.error.special-files":
    "Thiết lập chứa nút thiết bị hoặc các tệp đặc biệt khác không thể sao chép an toàn.",
  "profileImport.error.limit":
    "Thiết lập vượt quá giới hạn nhập (50 GiB hoặc 500.000 mục). Xóa các tệp sao lưu lớn hoặc thu hẹp các thư mục, rồi xem trước lại.",
  "profileImport.error.oversized-file":
    "Tệp cấu hình hoặc siêu dữ liệu vượt quá giới hạn đọc của nó (64 MB cho cấu hình, 16 MB cho siêu dữ liệu Git). Chia nhỏ hoặc giảm dung lượng nó, rồi xem trước lại.",
  "profileImport.error.unsupported":
    "Thiết lập này chứa liên kết không được hỗ trợ, alternates đối tượng Git vòng lặp, tệp đặc biệt, hoặc vượt quá giới hạn nhập (50 GiB / 500.000 mục). Các symlink bên ngoài phải được vật chất hóa trước khi nhập; các tệp nguồn không bị thay đổi.",
  "profileImport.error.space":
    "Không đủ dung lượng đĩa trống để chuẩn bị thiết lập này. Giải phóng dung lượng và xem trước lại.",
  "chatImport.tab": "Nhập trò chuyện",
  "chatImport.title": "Nhập trò chuyện từ OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop giữ một cơ sở dữ liệu trò chuyện riêng biệt. Xem trước và sao chép các cuộc trò chuyện cục bộ tương thích từ OpenCode mà không thay đổi nguồn hay thay thế các cuộc trò chuyện Classic hiện có. Bạn có thể quay lại đây từ phần cài đặt bất cứ lúc nào.",
  "chatImport.scope":
    "Đóng OpenCode trước khi nhập. Thao tác này sao chép các cuộc trò chuyện cục bộ đã hoàn tất và lịch sử của chúng. Các cuộc trò chuyện đang chờ, đang diễn ra và không gian làm việc bị loại trừ. Thông tin đăng nhập, quyền, lệnh dự án, tệp bên ngoài và ảnh chụp nhanh hoàn tác không được nhập. Đăng nhập riêng và giữ các thư mục dự án của bạn tại đường dẫn ban đầu.",
  "chatImport.localOnly":
    "Chọn máy chủ desktop cục bộ tích hợp để nhập trò chuyện. Trình nhập này không hỗ trợ kết nối máy chủ từ xa và máy chủ nền.",
  "chatImport.detect": "Kiểm tra cơ sở dữ liệu OpenCode mặc định",
  "chatImport.browse": "Chọn tệp cơ sở dữ liệu",
  "chatImport.confirm": "Nhập các cuộc trò chuyện đủ điều kiện",
  "chatImport.busy":
    "Đang kiểm tra hoặc nhập các cuộc trò chuyện. Vui lòng đợi trước khi đóng ứng dụng.",
  "chatImport.noSource":
    "Không tìm thấy hoặc chọn cơ sở dữ liệu nào. Chọn tệp OpenCode .db của bạn để tiếp tục.",
  "chatImport.complete":
    "Nhập hoàn tất. Mở thư mục dự án gốc để tìm các cuộc trò chuyện của nó. Nhập lặp lại sẽ bỏ qua các ID trò chuyện đã có trong Classic.",
  "chatImport.source": "Cơ sở dữ liệu nguồn",
  "chatImport.destination": "Cơ sở dữ liệu Classic",
  "chatImport.total": "Cuộc trò chuyện trong nguồn",
  "chatImport.eligible": "Sẵn sàng nhập",
  "chatImport.existing": "Đã tồn tại",
  "chatImport.excluded": "Bị loại trừ (đang chờ, đang diễn ra hoặc không gian làm việc)",
  "chatImport.imported": "Đã nhập",
  "chatImport.error.unavailable":
    "Tính năng nhập chỉ khả dụng cho máy chủ desktop Linux tích hợp sau khi nó khởi động xong.",
  "chatImport.error.incompatible":
    "Các cơ sở dữ liệu có lược đồ khác nhau hoặc không được hỗ trợ. Dùng các phiên bản OpenCode và Classic tương thích và cập nhật, rồi xem trước lại. Không hỗ trợ lưu trữ JSON cũ; nguồn chưa được di chuyển.",
  "chatImport.error.invalid":
    "Không thể đọc hoặc xác thực cơ sở dữ liệu. Kiểm tra tệp đã chọn, quyền và dung lượng đĩa khả dụng. Một lần nhập chưa xác nhận sẽ bị hoàn tác; xem trước lại trước khi thử lại.",
  "chatImport.error.sameFile":
    "Nguồn và đích là cùng một cơ sở dữ liệu. Không cần sao chép.",
  "chatImport.error.conflict":
    "ID dự án hoặc tin nhắn xung đột đã ngăn lần nhập này. Không có lần nhập một phần nào được xác nhận. Các cuộc trò chuyện Classic hiện có được bảo toàn.",
  "chatImport.error.busy":
    "Cơ sở dữ liệu đang bận hoặc thao tác mất quá nhiều thời gian. Đóng OpenCode, đợi các lần nhập khác hoàn tất, rồi xem trước lại. Lần thử lại sẽ bỏ qua các cuộc trò chuyện đã xác nhận.",
  "chatImport.error.expired":
    "Bản xem trước này đã hết hạn hoặc nguồn của nó đã thay đổi. Xem trước lại cơ sở dữ liệu trước khi nhập.",
}
