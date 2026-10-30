import Link from "next/link";

import {
  DEFAULT_PROJECT_ID,
  projectSupportPath,
} from "@/modules/projects/lib/applications";

export default function UnavailablePage() {
  return (
    <section>
      <h1>Không thể truy cập trang này</h1>
      <p>
        Tài khoản của bạn có thể không có quyền truy cập. Thông tin bị hạn chế
        sẽ không được hiển thị.
      </p>
      <Link href="/">Về trang chủ</Link>
      {" · "}
      <Link href={projectSupportPath(DEFAULT_PROJECT_ID)}>Về hỗ trợ</Link>
    </section>
  );
}
