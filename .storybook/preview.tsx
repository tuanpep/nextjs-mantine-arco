import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import type { Preview } from "@storybook/nextjs-vite";

import { theme } from "../theme";

const preview: Preview = {
  decorators: [
    (Story) => (
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Story />
      </MantineProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
