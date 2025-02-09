import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    // include: ['./__tests__/**/*.test.{js|ts|jsx|tsx}'],
  },
})
