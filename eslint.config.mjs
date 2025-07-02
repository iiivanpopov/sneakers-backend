import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import unused from 'eslint-plugin-unused-imports'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
				sourceType: 'module'
			},
			globals: {
				...globals.node,
				...globals.jest
			}
		},
		plugins: {
			'@typescript-eslint': tseslint,
			'unused-imports': unused,
			import: importPlugin
		},
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'unused-imports/no-unused-imports': 'warn',
			'import/order': [
				'warn',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
						'type'
					],
					alphabetize: { order: 'asc', caseInsensitive: true },
					'newlines-between': 'always'
				}
			]
		}
	}
]
