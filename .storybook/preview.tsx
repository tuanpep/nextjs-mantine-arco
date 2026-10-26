import "@mantine/core/styles.css";
import "../pajamas.module.css";

import { MantineProvider } from "@mantine/core";
import type { Preview } from "@storybook/nextjs-vite";

import { fontClassName } from "../lib/fonts";
import { cssVariablesResolver, theme } from "../theme";

const preview: Preview = {
  decorators: [
    (Story) => (
      <MantineProvider
        theme={theme}
        cssVariablesResolver={cssVariablesResolver}
        defaultColorScheme="light"
      >
        <div className={fontClassName}>
          <Story />
        </div>
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
