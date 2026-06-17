export type SplitTextMode = 'chars' | 'words';

export type SplitTextResult = {
  targets: HTMLElement[];
  revert: () => void;
};

function createSplitNodes(text: string, mode: SplitTextMode) {
  const nodes: Node[] = [];
  const targets: HTMLElement[] = [];

  if (mode === 'chars') {
    for (const part of text.split(/(\s+)/)) {
      if (!part) {
        continue;
      }

      if (/^\s+$/.test(part)) {
        nodes.push(document.createTextNode(part));
        continue;
      }

      const word = document.createElement('span');
      word.className = 'split-word-group';

      for (const char of Array.from(part)) {
        const span = document.createElement('span');
        span.className = 'split-char';
        span.textContent = char;
        word.append(span);
        targets.push(span);
      }

      nodes.push(word);
    }

    return { nodes, targets };
  }

  for (const part of text.split(/(\s+)/)) {
    if (!part) {
      continue;
    }

    if (/^\s+$/.test(part)) {
      nodes.push(document.createTextNode(part));
      continue;
    }

    const span = document.createElement('span');
    span.className = 'split-word';
    span.textContent = part;
    nodes.push(span);
    targets.push(span);
  }

  return { nodes, targets };
}

function processNode(node: Node, mode: SplitTextMode, targets: HTMLElement[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    const result = createSplitNodes(node.textContent ?? '', mode);
    targets.push(...result.targets);

    return result.nodes;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [node.cloneNode(true)];
  }

  const source = node as HTMLElement;
  const clone = source.cloneNode(false) as HTMLElement;

  for (const child of Array.from(source.childNodes)) {
    const childNodes = processNode(child, mode, targets);
    clone.append(...childNodes);
  }

  return [clone];
}

export function splitTextDom(element: HTMLElement, mode: SplitTextMode): SplitTextResult {
  const originalHtml = element.innerHTML;
  const targets: HTMLElement[] = [];
  const nextChildren: Node[] = [];

  for (const child of Array.from(element.childNodes)) {
    nextChildren.push(...processNode(child, mode, targets));
  }

  element.replaceChildren(...nextChildren);

  return {
    targets,
    revert: () => {
      element.innerHTML = originalHtml;
    }
  };
}
