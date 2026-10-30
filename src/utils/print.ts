/**
 * Prints only the .print-area preview: a copy goes straight under <body> (#print-root) and the
 * print CSS hides everything else. The document title becomes the suggested PDF file name.
 */
export function printDocument(fileName: string) {
  const area = document.querySelector('.print-area');
  if (!area) return;
  const root = document.createElement('div');
  root.id = 'print-root';
  root.appendChild(area.cloneNode(true));
  document.body.appendChild(root);
  const previous = document.title;
  document.title = fileName;
  try {
    window.print(); // blocks until the dialog closes
  } finally {
    document.title = previous;
    root.remove();
  }
}
