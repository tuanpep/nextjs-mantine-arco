import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentBookPreview } from "@/modules/ui/component-book/component-book-preview";
import { components } from "@/modules/ui/component-book/component-catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return components.map(({ slug }) => ({ slug }));
}

async function getComponent(params: Props["params"]) {
  const { slug } = await params;
  const component = components.find((entry) => entry.slug === slug);
  if (!component) notFound();
  return component;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await getComponent(params);
  return { title: name };
}

export default async function Page({ params }: Props) {
  const { name } = await getComponent(params);
  return <ComponentBookPreview key={name} name={name} />;
}
