/**
 * ESLint replacement for tslint-rules/playerApiRule.ts (RuleWalker-based).
 *
 * Use this when migrating from TSLint to ESLint. Requires:
 *   - eslint
 *   - @typescript-eslint/parser
 *   - @typescript-eslint/utils
 *
 * In your ESLint config, use with @typescript-eslint/parser and add the rule
 * (e.g. via a small plugin that exports this rule as 'player-api').
 */

import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

const PLAYER_API_DECORATOR_NAME = 'playerAPI';

const OPTION_REQUIRE_JSDOC = 'require-jsdoc';

type MessageIds = 'decorator-arg' | 'require-jsdoc';
type Options = [{ requireJsdoc?: boolean }];

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/wix/playable/docs/eslint-rules/${name}`,
);

function getDecoratorCallArgs(decorator: TSESTree.Decorator): TSESTree.CallExpression['arguments'] {
  const expr = decorator.expression;
  if (expr.type !== AST_NODE_TYPES.CallExpression) {
    return [];
  }
  return expr.arguments;
}

function isPlayerApiDecorator(decorator: TSESTree.Decorator): boolean {
  const expr = decorator.expression;
  if (expr.type !== AST_NODE_TYPES.CallExpression) {
    return false;
  }
  const callee = expr.callee;
  if (callee.type !== AST_NODE_TYPES.Identifier) {
    return false;
  }
  return callee.name === PLAYER_API_DECORATOR_NAME;
}

function hasJSDocComment(
  context: Readonly<import('@typescript-eslint/utils').TSESLint.Rule.RuleContext<MessageIds, Options>>,
  node: TSESTree.MethodDefinition,
): boolean {
  const sourceCode = context.getSourceCode();
  const comments = sourceCode.getCommentsBefore(node);
  return comments.some((c) => c.type === 'Block' && c.value.startsWith('*'));
}

export const playerApiRule = createRule<Options, MessageIds>({
  name: 'player-api',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce format rules for playerApi methods: decorator argument must be string literal or undefined; optionally require JSDoc.',
    },
    messages: {
      'decorator-arg': `"${PLAYER_API_DECORATOR_NAME}" decorator argument should be string literal or undefined`,
      'require-jsdoc': `"${PLAYER_API_DECORATOR_NAME}" method should have valid JSDoc comment`,
    },
    schema: [
      {
        type: 'object',
        properties: {
          [OPTION_REQUIRE_JSDOC]: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const requireJsdoc = options?.requireJsdoc === true;

    return {
      MethodDefinition(node: TSESTree.MethodDefinition) {
        const decorators = node.decorators ?? [];
        const playerApiDecorator = decorators.find(isPlayerApiDecorator);
        if (!playerApiDecorator) {
          return;
        }

        // Check first argument is string literal or undefined
        const args = getDecoratorCallArgs(playerApiDecorator);
        const firstArg = args[0];
        if (
          firstArg &&
          !(
            firstArg.type === AST_NODE_TYPES.Literal &&
            typeof firstArg.value === 'string'
          )
        ) {
          context.report({
            node: playerApiDecorator,
            messageId: 'decorator-arg',
          });
        }

        if (requireJsdoc && !hasJSDocComment(context, node)) {
          context.report({
            node: node.key,
            messageId: 'require-jsdoc',
          });
        }
      },
    };
  },
});
