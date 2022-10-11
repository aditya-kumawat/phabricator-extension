
export type HeraldMapping = Record<
    string,
    {
        readonly hid: string;
        readonly name: string;
        readonly link: string;
        readonly filePatterns: Array<string>;
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