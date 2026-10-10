// A selector written inside :not() names an element the rule does not style
export default function isNegatedSelectorNode(node) {
  let current = node.parent;

  while (current) {
    if (current.type === 'pseudo' && current.value.toLowerCase() === ':not') {
      return true;
    }

    current = current.parent;
  }

  return false;
}
