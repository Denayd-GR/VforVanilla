import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'generated'] },
  ...tseslint.configs.recommended,
)
