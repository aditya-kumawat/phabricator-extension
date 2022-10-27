export const fetchAlfredMapping = async () =>
  new Promise((resolve) => {
    let prevOldLinkEl: Element | null = null;
    const intervalId = setInterval(() => {
      const currOldLinEl = document.querySelector(
        'a[data-sigil="show-older-link"]'
      );
      if (currOldLinEl) {
        if (currOldLinEl !== prevOldLinkEl) {
          document
            .querySelector('a[data-sigil="show-older-link"]')
            ?.dispatchEvent(new Event('click'));
          prevOldLinkEl = currOldLinEl;
        }
      } else {
        resolve(true);
        clearInterval(intervalId);
      }
    }, 100);
  })
    .then(() => {
      return Array.from(document.body.querySelectorAll('.transaction-comment'))
        .filter((comment) => {
          return comment?.textContent?.includes(
            'This comment was made because the diff touches the following files'
          );
        })
        .reduce((mapping: Record<string, Array<string>>, comment) => {
          const name =
            comment.querySelector('.phui-tag-core')?.textContent ?? '';
          const files = Array.from(comment.querySelectorAll('tt')).map(
            (filesEl) => filesEl.textContent ?? ''
          );
          if (mapping[name]) mapping[name].push(...files);
          else mapping[name] = files;
          return mapping;
        }, {});
    })
    .catch(() => {
      console.log('Fetching alfred mapping failed');
    });
