import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globalSetup: "./__tests__/global.setup.js",
    include: ['__tests__/**/*.test.js', '__tests__/**/*.int.js', '__tests__/**/*.end.js'],
    testTimeout: 10000,
    reporters: ['default'],
  }
})