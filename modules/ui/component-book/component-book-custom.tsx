import { Avatar, Button, Stack, Text } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Comment } from "../components/display/comment";
import { DataTable } from "../components/display/data-table";
import { ResizeBox } from "../components/display/resize-box";
import { Statistic } from "../components/display/statistic";
import { Watermark } from "../components/display/watermark";
import { Message } from "../components/feedback/message";
import { Result } from "../components/feedback/result";
import { Mentions } from "../components/inputs/mentions";
import { Transfer } from "../components/inputs/transfer";
import { Upload } from "../components/inputs/upload";
import { BackTop } from "../components/navigation/back-top";
import { PageHeader } from "../components/navigation/page-header";
import { Popconfirm } from "../components/overlays/popconfirm";
import { Trigger } from "../components/overlays/trigger";

const people = [
  { value: "morgan", label: "Morgan Lee" },
  { value: "alex", label: "Alex Chen" },
  { value: "samira", label: "Samira Khan" },
];

function BackTopPreview() {
  const t = useTranslations("ComponentBook.extensions");
  const [active, setActive] = useState(false);

  return (
    <Stack align="flex-start">
      <Button
        variant="default"
        aria-pressed={active}
        onClick={() => setActive(!active)}
      >
        {t("showBackTop")}
      </Button>
      {active && (
        <BackTop
          label={t("backTop")}
          threshold={0}
          focusTargetId="main-content"
        />
      )}
    </Stack>
  );
}

function MentionsPreview() {
  const t = useTranslations("ComponentBook.extensions");
  const [value, setValue] = useState("");

  return (
    <Mentions
      label={t("mentions")}
      value={value}
      onChange={setValue}
      suggestions={people}
      nothingFoundMessage={t("empty")}
    />
  );
}

function TransferPreview() {
  const t = useTranslations("ComponentBook.extensions");
  const [members, setMembers] = useState(["morgan"]);

  return (
    <Transfer
      items={people}
      value={members}
      onChange={setMembers}
      labels={{
        source: t("available"),
        target: t("members"),
        search: t("search"),
        moveToTarget: t("add"),
        moveToSource: t("remove"),
      }}
    />
  );
}

function PopconfirmPreview() {
  const t = useTranslations("ComponentBook.extensions");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Stack align="flex-start" gap="sm">
      <Popconfirm
        title={t("question")}
        confirmLabel={t("confirm")}
        cancelLabel={t("cancel")}
        onConfirm={() => setConfirmed(true)}
      >
        <Button>{t("action")}</Button>
      </Popconfirm>
      {confirmed && <Message tone="success">{t("confirmed")}</Message>}
    </Stack>
  );
}

export function useCustomPreviews() {
  const t = useTranslations("ComponentBook.extensions");
  const locale = useLocale();

  return {
    BackTop: <BackTopPreview />,
    Comment: (
      <Comment
        author="Morgan Lee"
        avatar={<Avatar aria-hidden>ML</Avatar>}
        content={t("comment")}
      />
    ),
    DataTable: (
      <DataTable
        data={people}
        rowKey={(row) => row.value}
        label={t("directory")}
        filterLabel={t("searchPeople")}
        selectRowLabel={(row) => t("selectPerson", { name: row.label })}
        selectPageLabel={t("selectPage")}
        pageSize={2}
        emptyText={t("empty")}
        columns={[
          {
            id: "name",
            header: t("name"),
            render: (row) => row.label,
            filterValue: (row) => row.label,
            compare: (a, b) => a.label.localeCompare(b.label, locale),
          },
        ]}
      />
    ),
    Mentions: <MentionsPreview />,
    Message: <Message tone="success">{t("complete")}</Message>,
    PageHeader: (
      <PageHeader title={t("directory")} subtitle={t("members")} order={4} />
    ),
    Popconfirm: <PopconfirmPreview />,
    ResizeBox: (
      <ResizeBox
        label={t("resize")}
        defaultSize={210}
        minSize={150}
        maxSize={320}
      >
        <Text p="md" bg="var(--arco-fill-1)">
          {t("sample")}
        </Text>
      </ResizeBox>
    ),
    Result: <Result status="success" title={t("confirmed")} />,
    Statistic: (
      <Statistic label={t("members")} value={people.length} locale={locale} />
    ),
    Transfer: <TransferPreview />,
    Trigger: (
      <Trigger label={t("details")} content={t("comment")}>
        <Button variant="default">{t("details")}</Button>
      </Trigger>
    ),
    Upload: (
      <Stack gap="xs">
        <Text c="dimmed" size="sm">
          {t("localOnly")}
        </Text>
        <Upload
          label={t("upload")}
          labels={{
            cancel: t("cancel"),
            remove: t("removeFile"),
            retry: t("retry"),
            progress: (name) => t("progress", { name }),
            status: {
              uploading: t("uploading"),
              success: t("complete"),
              error: t("failed"),
              cancelled: t("cancelled"),
            },
          }}
          onUpload={async (_file, { signal, onProgress }) => {
            signal.throwIfAborted();
            onProgress(100);
          }}
        />
      </Stack>
    ),
    Watermark: (
      <Watermark text={t("sample")}>
        <Text p="xl">{t("comment")}</Text>
      </Watermark>
    ),
  };
}
