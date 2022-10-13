import { fetchHeraldMapping } from "./heraldRules";
import { fetchAlfredMapping } from "./alfredRules";

interface FileDetails {
    readonly path: string;
    readonly link: string;
}
export type FileMapping = Record<string, FileDetails>;
export type FileReviewersMapping = Record<string, Set<string>>;
export type ReviewerFilesMapping = Record<string, Set<string>>;

export const fetchGroupReviewers = async () => {
    const wrapper = document.querySelectorAll('.phui-status-list-view')[1];
    const reviewers = Array.from(wrapper.querySelectorAll('a')).map(reviewerEl => ({
        name: reviewerEl.textContent ?? '',
        link: reviewerEl.getAttribute('href') ?? ''
    }));
    return reviewers;
}

export const fetchGetFileReviewers = async () =>
    Promise.all([fetchHeraldMapping(), fetchAlfredMapping(), fetchGroupReviewers()]).then(([heraldMapping, alfredMapping, groupReviewers]) => {
        const fileMapping: FileMapping = {};
        const [fileReviewersMapping, reviewerFilesMapping] = Object.entries(alfredMapping).reduce(([frMapping, rfMapping]: [FileReviewersMapping, ReviewerFilesMapping], [name, files]) => {
            files.forEach(filePath => {
                if (!frMapping.hasOwnProperty(filePath)) frMapping[filePath] = new Set();
                frMapping[filePath].add(name);
            })
            rfMapping[name] = new Set(files);
            return [frMapping, rfMapping];
        }, [{}, {}]);

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
                if (!fileReviewersMapping.hasOwnProperty(filePath)) fileReviewersMapping[filePath] = new Set();
                groupReviewers.forEach(({ name }) => {
                    const isInvolved = alfredMapping[name]?.includes(filePath) || heraldMapping[name]?.filePatterns.some(({ isRegex, path }) => {
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

                        fileReviewersMapping[filePath].add(name);
                        if (reviewerFilesMapping[name]) reviewerFilesMapping[name].add(filePath);
                        else reviewerFilesMapping[name] = new Set([filePath]);
                    }
                })
                fileListEl.append(chipsWrapperEl);
            }
        })
        return [fileReviewersMapping, reviewerFilesMapping, fileMapping] as const;
    })

export const getIsAuthor = () => document.querySelector(`.phabricator-core-user-menu[href="${document.querySelector('.phui-head-thing-view .phui-handle')?.getAttribute('href')}"]`);