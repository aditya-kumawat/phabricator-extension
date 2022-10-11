import { fetchHeraldRuleLinks, fetchHeraldRules, HeraldMapping } from './modules/heraldRules';

console.log('Content script works!');

const diffId = window.location.pathname.slice(1);
console.log(diffId);

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

        const groupLinkEl = wrapper.querySelector(
          '.herald-list-item .phui-handle'
        );
        const name = groupLinkEl?.innerHTML;
        const link = groupLinkEl?.getAttribute('href');
        const filePatterns = Array.from(
          wrapper.querySelectorAll('.herald-list-item')
        )
          .filter((listEl) =>
            listEl.textContent?.includes('Affected files matches')
          )
          .map((el) => el.lastChild?.textContent?.split(' ').pop() ?? '');
        if (name && link) {
          heraldMapping[name] = {
            hid,
            name,
            link,
            filePatterns,
          };
        }
        return heraldMapping;
      },
      {}
    );
  })
  .then(console.log);