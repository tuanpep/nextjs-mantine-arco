"use client";

import {
  Alert,
  Button,
  Divider,
  Group,
  Modal,
  NavLink,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery, useMounted } from "@mantine/hooks";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useState, type ReactNode } from "react";

import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { getApplication } from "../lib/applications";
import {
  getRegistryReferences,
  referencesEqual,
  responsibilityFields,
} from "../lib/project-settings";
import { useProjectSettings } from "./project-settings-provider";

const settingsSections = [
  "identity",
  "responsibilities",
  "gaps",
  "archive",
] as const;

type SettingsSection = (typeof settingsSections)[number];

const sectionLabels: Record<SettingsSection, string> = {
  identity: "Thông tin dự án",
  responsibilities: "Thông tin tham chiếu trách nhiệm minh họa",
  gaps: "Thông tin thiết lập",
  archive: "Lưu trữ dự án này",
};

export function ProjectSettings({ projectId }: { projectId: string }) {
  return <ProjectSettingsContent key={projectId} projectId={projectId} />;
}

function ProjectSettingsContent({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const isNarrow = useMediaQuery("(max-width: 74.99em)", false, {
    getInitialValueInEffect: true,
  });
  const application = getApplication(projectId);
  const store = useProjectSettings();
  const state = store.get(projectId);
  const registry = getRegistryReferences(projectId);
  const [section, setSection] = useQueryState(
    "section",
    parseAsStringLiteral(settingsSections),
  );
  const [reviewing, setReviewing] = useState(false);
  const [notice, setNotice] = useState("");

  if (!application || !state || !registry) {
    return (
      <PageFrame>
        <DestinationUnavailable backHref="/" backLabel="Quay lại dự án" />
      </PageFrame>
    );
  }

  const dirty = !referencesEqual(state.applied, state.draft);
  const changes = responsibilityFields.filter(
    ({ key }) => state.applied[key] !== state.draft[key],
  );
  const gaps = responsibilityFields.filter(
    ({ key }) => !state.applied[key].trim(),
  );
  const activeSection: SettingsSection = section ?? "identity";
  const showSectionBack = Boolean(isNarrow && section);

  const nav = (
    <Stack gap={2} component="nav" aria-label="Các mục cài đặt">
      {settingsSections.map((id) => (
        <NavLink
          key={id}
          component="button"
          type="button"
          label={sectionLabels[id]}
          active={activeSection === id}
          aria-current={activeSection === id ? "page" : undefined}
          onClick={() => void setSection(id)}
          py={7}
        />
      ))}
    </Stack>
  );

  const sectionContent: Record<SettingsSection, ReactNode> = {
    identity: (
      <Stack gap="md">
        <Title order={2} size="h3">
          Thông tin dự án
        </Title>
        <Text size="sm">Nguồn: danh mục dự án minh họa chỉ đọc.</Text>
        <TextInput label="Mã dự án" value={application.id} readOnly />
        <TextInput label="Tên dự án" value={application.name} readOnly />
        <TextInput
          label="Đơn vị phụ trách trong danh mục"
          value={application.owner}
          readOnly
        />
        <Text size="sm">{application.description}</Text>
        <Text size="sm">
          Đơn vị phụ trách trong danh mục chỉ là thông tin tham khảo, không phải
          thẩm quyền dịch vụ đã xác minh. Cả bốn phân hệ minh họa vẫn khả dụng.
          Không thể sửa thông tin định danh dự án, tính khả dụng của phân hệ hay
          quy tắc quy trình tại đây.
        </Text>
      </Stack>
    ),
    responsibilities: (
      <Stack gap="md">
        <Title order={2} size="h3">
          Thông tin tham chiếu trách nhiệm minh họa
        </Title>
        <Text size="sm">
          Chỉ nhập tên giả định, đây không phải danh bạ định danh. Nguồn đang áp
          dụng:{" "}
          {state.source === "registry"
            ? "giá trị gốc từ danh mục minh họa"
            : "giá trị minh họa trong phiên hiện tại"}
          .
        </Text>
        {responsibilityFields.map(({ key, label, module }) => (
          <Stack key={key} gap="xs">
            <Title order={3} size="h4">
              {module}
            </Title>
            <TextInput
              disabled={!mounted}
              label={label}
              value={state.draft[key]}
              description={`Giá trị gốc trong danh mục: ${registry[key]}. Đang áp dụng: ${state.applied[key].trim() || "Chưa cung cấp"}.`}
              onChange={(event) => {
                store.edit(projectId, {
                  ...state.draft,
                  [key]: event.currentTarget.value,
                });
                setNotice("");
              }}
            />
          </Stack>
        ))}
        <Text size="sm">
          Có thể để trống thông tin tham chiếu, khi đó thông tin thiết lập sẽ
          báo thiếu. Các thông tin này không phân công công việc mới hay đang xử
          lý, không cấp quyền truy cập, gửi thông báo hay xác lập trách nhiệm.
        </Text>
        <Group>
          <Button
            disabled={!mounted || !dirty}
            onClick={() => setReviewing(true)}
          >
            Xem lại thay đổi
          </Button>
          <Button
            variant="default"
            disabled={!mounted || !dirty}
            onClick={() => {
              store.discard(projectId);
              setNotice(
                "Đã bỏ thay đổi chưa lưu. Thông tin tham chiếu đang áp dụng không thay đổi.",
              );
            }}
          >
            Bỏ thay đổi
          </Button>
        </Group>
      </Stack>
    ),
    gaps: (
      <Stack gap="sm">
        <Title order={2} size="h3">
          Thông tin thiết lập
        </Title>
        <Text size="sm">
          Dựa trên thông tin tham chiếu đang áp dụng, không dùng thay đổi chưa
          lưu.
        </Text>
        {gaps.length === 0 ? (
          <Text size="sm">Không thiếu thông tin tham chiếu minh họa.</Text>
        ) : (
          <ul>
            {gaps.map(({ key, label }) => (
              <li key={key}>Thiếu thông tin tham chiếu: {label}.</li>
            ))}
          </ul>
        )}
        <Alert color="yellow">
          Chưa xác minh khả năng vận hành. Có tên không đồng nghĩa với việc đã
          sẵn sàng. Đơn vị phụ trách dịch vụ, quyền hạn, giờ hỗ trợ, quy trình
          chuyển cấp và chính sách xử lý dữ liệu vẫn chưa được xác định.
        </Alert>
      </Stack>
    ),
    archive: (
      <Stack gap="sm">
        <Title order={2} size="h3">
          Lưu trữ dự án này
        </Title>
        <Text size="sm">
          Chưa thể lưu trữ cho đến khi người phụ trách quyết định cách xử lý các
          yêu cầu, phản hồi, ý tưởng và đợt kiểm thử còn mở. Công việc hiện có
          không thay đổi.
        </Text>
        <Button disabled>Chưa thể lưu trữ</Button>
      </Stack>
    ),
  };

  return (
    <PageFrame
      fullBleed
      panePosition="start"
      paneNarrow="index"
      paneIndexOpen={Boolean(section)}
      paneLabel="Các mục cài đặt"
      pane={nav}
      header={
        <PageHeader
          title={showSectionBack ? sectionLabels[activeSection] : "Cài đặt"}
          description={`${application.name} · ${application.id}`}
          breadcrumbs={
            showSectionBack
              ? [
                  {
                    title: "Cài đặt",
                    href: `/projects/${projectId}/settings`,
                  },
                  { title: sectionLabels[activeSection] },
                ]
              : [
                  { title: "Tổng quan", href: `/projects/${projectId}` },
                  { title: "Cài đặt" },
                ]
          }
          onNavigate={(event) => {
            if (!showSectionBack && !store.confirmLeave(projectId))
              event.preventDefault();
          }}
        />
      }
    >
      <Stack gap="md">
        <Alert color="blue">
          Chỉ dùng để minh họa. Hãy dùng dữ liệu giả định. Thông tin tham chiếu
          đã áp dụng được giữ trong bộ nhớ khi chuyển trang và đặt lại khi tải
          lại. Đây không phải cấu hình dùng chung hay quyền truy cập. Ngôn ngữ
          là tùy chọn cá nhân cho toàn ứng dụng ở thanh đầu trang, không phải
          cài đặt dự án.
        </Alert>
        {dirty && (
          <Alert color="yellow">
            Có thay đổi thông tin tham chiếu chưa lưu cho {application.name}.
            Hãy xem lại và áp dụng hoặc bỏ thay đổi. Những thay đổi này không
            ảnh hưởng hồ sơ công việc.
          </Alert>
        )}
        {notice && (
          <Alert role="status" color="teal">
            {notice}
          </Alert>
        )}
        <Divider />
        {sectionContent[activeSection]}
      </Stack>
      <Modal
        opened={reviewing}
        onClose={() => setReviewing(false)}
        title="Xem lại thay đổi thông tin tham chiếu"
        closeButtonProps={{ "aria-label": "Đóng phần xem lại" }}
        centered
      >
        <Stack gap="md">
          <Text fw={600}>
            {application.name} · {application.id}
          </Text>
          <Text size="sm">
            Chỉ thay đổi thông tin tham chiếu minh họa đang hiển thị của dự án
            này. Không phân công hay thay đổi công việc mới hoặc đang xử lý.
            Không cấp quyền, xác lập trách nhiệm, gửi thông báo hay lưu lâu dài.
          </Text>
          <Table captionSide="top">
            <Table.Caption>Giá trị đang áp dụng và đề xuất</Table.Caption>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Thông tin tham chiếu</Table.Th>
                <Table.Th>Đang áp dụng</Table.Th>
                <Table.Th>Đề xuất</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {changes.map(({ key, label }) => (
                <Table.Tr key={key}>
                  <Table.Th scope="row">{label}</Table.Th>
                  <Table.Td>
                    {state.applied[key].trim() || "Chưa cung cấp"}
                  </Table.Td>
                  <Table.Td>
                    {state.draft[key].trim() || "Chưa cung cấp"}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Group>
            <Button
              data-autofocus
              onClick={() => {
                store.apply(projectId);
                setReviewing(false);
                setNotice(
                  `Đã áp dụng thông tin tham chiếu cho ${application.name} chỉ trong phiên minh họa này. Tải lại trang sẽ đặt lại các giá trị. Hồ sơ công việc, quyền truy cập và trách nhiệm không thay đổi.`,
                );
              }}
            >
              Áp dụng thông tin tham chiếu minh họa
            </Button>
            <Button variant="default" onClick={() => setReviewing(false)}>
              Quay lại chỉnh sửa
            </Button>
            <Button
              variant="subtle"
              onClick={() => {
                store.discard(projectId);
                setReviewing(false);
                setNotice(
                  "Đã hủy thay đổi. Thông tin tham chiếu đang áp dụng không thay đổi.",
                );
              }}
            >
              Hủy thay đổi
            </Button>
          </Group>
        </Stack>
      </Modal>
    </PageFrame>
  );
}
