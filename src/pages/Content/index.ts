import { fetchGetFileReviewers, ReviewerFilesMapping } from './modules/diff';

console.log('Content script works!');

const diffId = window.location.pathname.slice(1);

const addOverlay = (reviewerFilesMapping: ReviewerFilesMapping) => {
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

    const label = document.createElement('label');
    label.setAttribute('for', name);
    label.innerHTML = name;

    const navitgationBtns = document.createElement('div');
    navitgationBtns.classList.add('NavigationBtns-wrapper');

    const backBtn = document.createElement('button');
    backBtn.innerHTML = 'Back';
    backBtn.setAttribute('data-id', `${reviewerFilesMapping[name].length - 1}`);
    backBtn.addEventListener('click', () => {
      const index = backBtn.getAttribute('data-id') ?? '';
      const { link } = reviewerFilesMapping[name][+index];
      window.location.href = link;
      backBtn.setAttribute('data-id', `${(+index - 1) % reviewerFilesMapping[name].length}`);
    });

    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = 'Next';
    nextBtn.setAttribute('data-id', '0');
    nextBtn.addEventListener('click', () => {
      const index = nextBtn.getAttribute('data-id') ?? '';
      const { link } = reviewerFilesMapping[name][+index];
      window.location.href = link;
      nextBtn.setAttribute('data-id', `${(+index + 1) % reviewerFilesMapping[name].length}`);
    });

    navitgationBtns.appendChild(backBtn);
    navitgationBtns.appendChild(nextBtn);
    label.appendChild(navitgationBtns);

    checkbox.appendChild(input);
    checkbox.appendChild(label);

    checkboxWrapperEl.append(checkbox)
  });
  wrapper.append(checkboxWrapperEl);
  document.body.append(wrapper);
}

fetchGetFileReviewers()
  .then(([fileReviewersMapping, reviewerFilesMapping]) => {
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

      const viewOptionsEl = headerEl.parentElement?.querySelector('[data-sigil="differential-view-options"]');
      viewOptionsEl?.dispatchEvent(new Event('click'));
      const collapseFileEl = document.querySelector('.fa-compress')?.parentElement?.querySelector('a');
      console.log({ headerEl, viewOptionsEl, collapseFileEl });
      collapseFileEl?.dispatchEvent(new Event('click'));
    })

    addOverlay(reviewerFilesMapping);
  })