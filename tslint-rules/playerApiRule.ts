import * as ts from 'typescript';
import * as Lint from 'tslint';

import { getDecoratorArguments } from './utils/ast';

import isPlayerApiDecorator, {
  PLAYER_API_DECORATOR_NAME,
} from './utils/isPlayerApiDecorator';

const OPTION_REQUIRE_JSDOC = 'require-jsdoc';

/**
 * Enforce format rules for playerApi methods
 *
 * You can optionally specify the option `require-jsdoc`
 * to enforce JSDoc comments be provided before playerAPI method
 *
 * @example
 * "player-api": true
 *
 * @example
 * "player-api": [true, "require-jsdoc"]
 */
export class Rule extends Lint.Rules.AbstractRule {
  public static DECORATOR_MAME_FAILURE_STRING = `"${PLAYER_API_DECORATOR_NAME}" decorator argument should be string literal or undefined`;
  public static REQUIRE_JSDOC_FAILURE_STRING = `"${PLAYER_API_DECORATOR_NAME}" method should have valid JSDoc comment`;

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new PlayerApiMethodWalker(sourceFile, this.getOptions()),
    );
  }
}

class PlayerApiMethodWalker extends Lint.RuleWalker {
  public visitMethodDeclaration(method) {
    const decorator: any =
      method.decorators && method.decorators.find(isPlayerApiDecorator);

    if (decorator) {
      this.visitPlayerApiDecorator(decorator);
      this.visitPlayerApiMethod(method);
    }

    super.visitMethodDeclaration(method);
  }

  private visitPlayerApiDecorator(decorator) {
    const decoratorArguments = getDecoratorArguments(decorator);

    // NOTE: ensure first argument is string literal or undefined
    if (
      decoratorArguments[0] &&
      decoratorArguments[0].kind !== ts.SyntaxKind.StringLiteral
    ) {
      this.addFailureAtNode(decorator, Rule.DECORATOR_MAME_FAILURE_STRING);
    }
  }

  private visitPlayerApiMethod(method) {
    if (!method.jsDoc && this.hasOption(OPTION_REQUIRE_JSDOC)) {
      this.addFailureAtNode(method, Rule.REQUIRE_JSDOC_FAILURE_STRING);
    }
  }
}
