import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProjectOverview } from "./project-overview";
import { SupportProvider } from "@/modules/support/components/support-provider";

const meta = {
  title: "Projects/Overview",
  component: ProjectOverview,
  decorators: [
    (Story) => (
      <SupportProvider>
        <Story />
      </SupportProvider>
    ),
  ],
} satisfies Meta<typeof ProjectOverview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
