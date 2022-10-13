export const fetchAlfredMapping = async () =>
  Array.from(document.body.querySelectorAll('.transaction-comment'))
    .filter((comment) =>
      comment?.textContent?.includes('Please have this diff reviewed by')
    )
    .reduce((mapping: Record<string, Array<string>>, comment) => {
      const name = comment.querySelector('.phui-tag-core')?.textContent ?? '';
      const files = Array.from(comment.querySelectorAll('tt')).map(
        (filesEl) => filesEl.textContent ?? ''
      );
      mapping[name] = files;
      return mapping;
    }, {});
