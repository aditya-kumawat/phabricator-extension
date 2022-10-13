import { fetchGetFileReviewers, FileMapping, FileReviewersMapping, getIsAuthor, ReviewerFilesMapping } from './modules/diff';

console.log('Content script works!');

// const diffId = window.location.pathname.slice(1);
(window as any).isAuthor = getIsAuthor();
(window as any).activeGroups = new Set();

const addOverlay = (fileReviewersMapping: FileReviewersMapping, reviewerFilesMapping: ReviewerFilesMapping, fileMapping: FileMapping) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('Overlay');

  const tocAnchorEl = document.createElement('a');
  tocAnchorEl.setAttribute('href', '#toc');
  tocAnchorEl.innerHTML = 'Navigate to files list';
  wrapper.appendChild(tocAnchorEl);

  const checkboxWrapperEl = document.createElement('div');
  checkboxWrapperEl.classList.add('Checkbox-wrapper');
  Object.entries(reviewerFilesMapping).forEach(([name, files]) => {
    const checkbox = document.createElement('div');
    checkbox.classList.add('Checkbox');

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'group[]');
    input.setAttribute('value', name);
    input.setAttribute('id', name);
    input.addEventListener('change', (event) => {
      if (event.target.checked) {
        (window as any).activeGroups.add(name);
      } else {
        (window as any).activeGroups.delete(name);
      }

      document.querySelectorAll('.differential-file-icon-header').forEach(headerEl => {
        const filePath = headerEl.childNodes[1].textContent ?? '';
        const viewOptionsEl = headerEl.parentElement?.querySelector('[data-sigil="differential-view-options"]');
        viewOptionsEl?.dispatchEvent(new Event('click'));
        const shouldExpand = (window as any).activeGroups.size === 0 || Array.from(fileReviewersMapping[filePath] ?? [])?.some(reviewer => (window as any).activeGroups.has(reviewer));
        const actionEl = document.querySelector(shouldExpand ? '.fa-expand' : '.fa-compress');
        if (actionEl) {
          actionEl.parentElement?.querySelector('a')?.dispatchEvent(new Event('click'));
        } else {
          viewOptionsEl?.dispatchEvent(new Event('click'));
        }
      });
      document.body.click();
    });

    const label = document.createElement('label');
    label.setAttribute('for', name);
    label.innerHTML = name;

    const actionBtns = document.createElement('div');
    actionBtns.classList.add('NavigationBtns-wrapper');

    const loadBtn = document.createElement('button');
    loadBtn.innerHTML = 'Load';
    loadBtn.addEventListener('click', () => {
      files?.forEach(filePath => {
        document.querySelector(`a[href="#diff-${fileMapping[filePath].link.slice(1)}"]`)?.dispatchEvent(new Event('click'));
      })
    });

    const backBtn = document.createElement('button');
    backBtn.innerHTML = 'Back';
    backBtn.setAttribute('data-id', `${reviewerFilesMapping[name].size - 1}`);
    backBtn.addEventListener('click', () => {
      const index = backBtn.getAttribute('data-id') ?? '';
      const { link } = fileMapping[Array.from(reviewerFilesMapping[name])[+index]];
      window.location.href = link;
      backBtn.setAttribute('data-id', `${(+index - 1) % reviewerFilesMapping[name].size}`);
    });

    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = 'Next';
    nextBtn.setAttribute('data-id', '0');
    nextBtn.addEventListener('click', () => {
      const index = nextBtn.getAttribute('data-id') ?? '';
      const { link } = fileMapping[Array.from(reviewerFilesMapping[name])[+index]];
      window.location.href = link;
      nextBtn.setAttribute('data-id', `${(+index + 1) % reviewerFilesMapping[name].size}`);
    });

    actionBtns.appendChild(loadBtn);
    actionBtns.appendChild(backBtn);
    actionBtns.appendChild(nextBtn);
    label.appendChild(actionBtns);

    checkbox.appendChild(input);
    checkbox.appendChild(label);

    checkboxWrapperEl.append(checkbox)
  });
  wrapper.append(checkboxWrapperEl);
  document.body.append(wrapper);
}

if (!(window as any).isAuthor) {
  fetchGetFileReviewers()
    .then(([fileReviewersMapping, reviewerFilesMapping, fileMapping]) => {
      document.querySelectorAll('.differential-file-icon-header').forEach(headerEl => {
        const filePath = headerEl.textContent ?? '';

        const chipsWrapperEl = document.createElement('div');
        chipsWrapperEl.classList.add('Chips-wrapper');
        fileReviewersMapping[filePath]?.forEach(name => {
          const chipEl = document.createElement('span');
          chipEl.classList.add('Chip');
          chipEl.innerHTML = name;
          chipsWrapperEl.append(chipEl);
        });

        headerEl.appendChild(chipsWrapperEl);
      })

      addOverlay(fileReviewersMapping, reviewerFilesMapping, fileMapping);
    });
}