
export type HeraldMapping = Record<
    string,
    {
        readonly hid: string;
        readonly name: string;
        readonly link: string;
        readonly filePatterns: Array<{
            readonly isRegex: boolean;
            readonly path: string;
        }>;
    }
>;


export const fetchHeraldRuleLinks = async () => {
    const links = [
        'https://phabricator.rubrik.com/herald/query/6ddP0QLHUa_y',
        'https://phabricator.rubrik.com/herald/query/6ddP0QLHUa_y/?after=274'
    ];
    return Promise.all(links.map(link => fetch(link).then(res => res.text())));
}

export const fetchHeraldRules = async (link: string) => fetch(`https://phabricator.rubrik.com${link}`).then(res => res.text()).then(text => [link.slice(1), text]);

export const fetchHeraldMapping = async () =>
    fetchHeraldRuleLinks()
        .then((texts) =>
            texts.reduce((linkEls: Array<Element>, text) => {
                var wrapper = document.createElement('div');
                wrapper.innerHTML = text;
                return linkEls.concat(
                    Array.from(wrapper.querySelectorAll('.phui-oi-link'))
                );
            }, [])
        )
        .then((linkEls) => {
            return linkEls.map((linkEl) =>
                fetchHeraldRules(linkEl.getAttribute('href') ?? '')
            );
        })
        .then((promises) => {
            return Promise.all(promises);
        })
        .then((response) => {
            return response.reduce(
                (heraldMapping: HeraldMapping, [hid, heraldHtmlText]) => {
                    var wrapper = document.createElement('div');
                    wrapper.innerHTML = heraldHtmlText;

                    const listEls = Array.from(
                        wrapper.querySelectorAll('.herald-list-item')
                    );
                    const groups = listEls
                        .filter(listEl => listEl.textContent?.includes('Add reviewers') || listEl.textContent?.includes('Add blocking reviewers'))
                        .map(listEl => {
                            const linkEl = listEl.querySelector('a');
                            return { name: linkEl?.textContent?.trim(), link: linkEl?.getAttribute('href') }
                        });

                    const filePatterns =
                        listEls.filter((listEl) =>
                            listEl.textContent?.includes('Affected files')
                        )
                            .map((el) => {
                                const isRegex = Boolean(el.lastChild?.textContent?.includes('matches') || el.lastChild?.textContent?.includes('regexp'));
                                const path = el.lastChild?.textContent?.split(' ').pop() ?? '';
                                return { isRegex, path };
                            });
                    groups.forEach(({ name, link }) => {
                        if (name && link) {
                            heraldMapping[name] = {
                                hid,
                                name,
                                link,
                                filePatterns,
                            };
                        }
                    })
                    return heraldMapping;
                },
                {}
            );
        });