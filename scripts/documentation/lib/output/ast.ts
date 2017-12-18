import * as _ from 'lodash';

export function renderDescription(node) {
  if (_.isString(node)) {
    return node;
  }

  if (_.isEmpty(node)) {
    return '';
  }

  if (['text'].includes(node.type)) {
    return node.value;
  }

  if (['inlineCode'].includes(node.type)) {
    return `<code>${node.value}</code>`;
  }

  return _.map(node.children, children => renderDescription(children)).join('');
}

export function renderPossibleValues(param) {
  if (!_.get(param.type, 'elements')) {
    return '';
  }

  const possibleValues = _.map(
    param.type.elements,
    element => `<code>${element.value}</code>`,
  ).join(', ');

  return ` Possible values are ${possibleValues}.`;
}

export function renderParams(params) {
  if (_.isEmpty(params)) {
    return null;
  }

  return _.map(params, param => {
    return {
      name: param.name,
      type: _.get(param.type, 'name'),
      description:
        renderDescription(param.description) + renderPossibleValues(param),
    };
  });
}

export function renderReturns(returns, interfaces) {
  if (_.isEmpty(returns)) {
    return null;
  }

  const returnName = returns[0].type.name;
  const localInterface = _.find(interfaces, ({ name }) => name === returnName);

  if (!localInterface) {
    return;
  }

  const properties = _.map(localInterface.properties, property => {
    const tag = _.find(
      localInterface.tags,
      ({ name }) => name === property.name,
    );

    return {
      ...property,
      description: _.get(tag, 'description'),
    };
  });

  return renderParams(properties);
}
