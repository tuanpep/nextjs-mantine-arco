import Link from "next/link";

import {
  DEFAULT_PROJECT_ID,
  applicationPath,
} from "@/modules/projects/lib/applications";

export default function UnavailablePage() {
  return (
    <section>
      <h1>Không thể truy cập trang này</h1>
      <p>
        Bạn có thể không có quyền truy cập trang này. Nội dung bị hạn chế sẽ
        không được hiển thị.
      </p>
      <Link href="/">Về trang chủ</Link>
      {" · "}
      <Link href={applicationPath(DEFAULT_PROJECT_ID)}>Về tổng quan</Link>
    </section>
  );
}
