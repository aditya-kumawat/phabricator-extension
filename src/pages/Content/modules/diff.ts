import { fetchHeraldMapping } from "./heraldRules";

interface FileDetails {
    readonly path: string;
    readonly link: string;
}
export type FileMapping = Record<string, FileDetails>;
export type FileReviewersMapping = Record<string, Array<string>>;
export type ReviewerFilesMapping = Record<string, Array<FileDetails>>;

export const fetchGroupReviewers = async () => {
    const wrapper = document.querySelectorAll('.phui-status-list-view')[1];
    const reviewers = Array.from(wrapper.querySelectorAll('a')).map(reviewerEl => ({
        name: reviewerEl.textContent ?? '',
        link: reviewerEl.getAttribute('href') ?? ''
    }));
    return reviewers;
}

export const fetchGetFileReviewers = async () =>
    Promise.all([fetchHeraldMapping(), fetchGroupReviewers()]).then(([heraldMapping, groupReviewers]) => {
        const fileMapping: FileMapping = {};
        const fileReviewersMapping: FileReviewersMapping = {};
        const reviewerFilesMapping: ReviewerFilesMapping = {};

        const fileListEls = document.querySelectorAll('.differential-toc-file');
        fileListEls.forEach((fileListEl, index) => {
            if (index > 0) {
                const chipsWrapperEl = document.createElement('div');
                chipsWrapperEl.classList.add('Chips-wrapper');

                const anchorEl = fileListEl.querySelector('a');

                const filePath = anchorEl?.textContent ?? '';
                const fileLink = anchorEl?.getAttribute('href');
                fileMapping[filePath] = {
                    path: filePath ?? '',
                    link: fileLink ?? ''
                };
                fileReviewersMapping[filePath] = [];
                groupReviewers.forEach(({ name }) => {
                    const isInvolved = heraldMapping[name]?.filePatterns.some(({ isRegex, path }) => {
                        if (isRegex) {
                            return new RegExp(path.slice(0, -1)).test(filePath);
                        }
                        return filePath?.includes(path);
                    });
                    if (isInvolved) {
                        const chipEl = document.createElement('span');
                        chipEl.classList.add('Chip');
                        chipEl.innerHTML = name;
                        chipsWrapperEl.append(chipEl);

                        fileReviewersMapping[filePath].push(name);
                        if (reviewerFilesMapping[name]) reviewerFilesMapping[name].push(fileMapping[filePath]);
                        else reviewerFilesMapping[name] = [fileMapping[filePath]];
                    }
                })
                fileListEl.append(chipsWrapperEl);
            }
        })
        return [fileReviewersMapping, reviewerFilesMapping, fileMapping] as const;
    })