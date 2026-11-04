# Nội dung tiếng Việt

## Phạm vi

Rà soát toàn bộ `messages/vi.json` và các chuỗi tiếng Việt viết trực tiếp trong `app/`, `lib/`, `modules/`. Giữ nguyên tên sản phẩm, mã kỹ thuật, khóa bản dịch và nội dung tiếng Anh. Dữ liệu mẫu hiện viết bằng tiếng Anh, chưa có bản tiếng Việt riêng.

## Cách viết

- Viết theo việc người dùng cần làm, không bám từng chữ của câu tiếng Anh. Dùng “Mô tả lỗi” thay cho “Điều đã xảy ra”, “Nội dung phản hồi” thay cho “Điều bạn quan sát”.
- Dùng “đề xuất tính năng” xuyên suốt danh sách, tìm kiếm, xét duyệt và thông báo lỗi. Không đổi qua lại giữa “yêu cầu tính năng” và “đề xuất tính năng”.
- Dùng “thảo luận” cho chủ đề chung của dự án, “trao đổi” cho phần hội thoại trong báo cáo lỗi, “tin nhắn” cho từng nội dung được gửi.
- Nhãn thao tác bắt đầu bằng động từ khi cần thiết, như “Gửi tin nhắn”, “Lưu quyết định”, “Xóa bộ lọc”. Dùng “Trang trước” và “Trang sau” nhất quán.
- Phân biệt trạng thái “Đang mở” với nhóm “Chưa hoàn tất”. Nhóm này bao gồm cả báo cáo đang mở, đang xử lý và chờ bổ sung thông tin.
- Lỗi phải nói rõ thao tác chưa thành công. Giữ thông tin về nội dung chưa bị mất và cách thử lại nếu có.
- Không bỏ cảnh báo mất dữ liệu khi tải lại trang, giới hạn lưu trong phiên, việc không gửi nội dung hay thông báo ra ngoài, hoặc việc chấp nhận đề xuất không phải cam kết triển khai.
- Giữ nhãn ngắn. Không thêm lời chào, câu quảng cáo hay giải thích một thao tác đã rõ.

## Nguồn tham khảo bên ngoài

Đối chiếu ngày 04/11/2026. Các nguồn dưới đây là ví dụ cách dùng từ trong sản phẩm Việt Nam, không phải quy chuẩn ngôn ngữ hay kết quả kiểm thử với người dùng.

1. [Base Request: Giới thiệu về app và Mục lục tính năng](https://help.base.vn/support/solutions/articles/63000277990-base-request-gi%E1%BB%9Bi-thi%E1%BB%87u-v%E1%BB%81-app-v%C3%A0-m%E1%BB%A5c-l%E1%BB%A5c-t%C3%ADnh-n%C4%83ng). Bài dùng “đề xuất”, “xử lý”, “trao đổi”, “Tạo 1 đề xuất mới” và “duyệt/ từ chối”. Tham khảo cách gọi đề xuất trong môi trường doanh nghiệp. Portal vẫn dùng “chấp nhận” vì đây chỉ là tiếp nhận để xem xét, không phải duyệt triển khai.
2. [Base Inside: Cách tạo thảo luận mới](https://help.base.vn/support/solutions/articles/63000252738-base-inside-c%C3%A1ch-t%E1%BA%A1o-th%E1%BA%A3o-lu%E1%BA%ADn-m%E1%BB%9Bi). Bài dùng “Tạo thảo luận mới”, “nội dung thảo luận” và “thông báo”. Tham khảo cách gọi chủ đề trao đổi chung, không sao chép cách dùng từ tiếng Anh xen kẽ trong bài.

## Một số thay đổi

| Trước                               | Sau                                                |
| ----------------------------------- | -------------------------------------------------- |
| Báo một việc đang bị hỏng.          | Báo lỗi bạn gặp khi sử dụng sản phẩm.              |
| Chưa xong                           | Chưa hoàn tất                                      |
| Gửi thảo luận                       | Gửi tin nhắn                                       |
| Chấp nhận không phải ngày bàn giao. | Đề xuất được chấp nhận chưa có cam kết triển khai. |
| Đã quyết định                       | Đã xét duyệt                                       |
| Không có bản ghi khớp               | Không tìm thấy kết quả phù hợp                     |

Kiểm tra tự động xác nhận khóa bản dịch còn khớp và các thông báo tiếng Việt vẫn định dạng được với tham số. Độ tự nhiên của câu chữ vẫn cần được đánh giá theo ngữ cảnh sử dụng.
