"use strict";
self["webpackHotUpdatephabricator_extension"]("contentScript",{

/***/ "./src/pages/Content/index.ts":
/*!************************************!*\
  !*** ./src/pages/Content/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_diff__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/diff */ "./src/pages/Content/modules/diff.ts");

console.log('Content script works!');
// const diffId = window.location.pathname.slice(1);
window.isAuthor = (0,_modules_diff__WEBPACK_IMPORTED_MODULE_0__.getIsAuthor)();
window.activeGroups = new Set();
var addOverlay = function (fileReviewersMapping, reviewerFilesMapping, fileMapping) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('Overlay');
    var tocBtn = document.createElement('button');
    tocBtn.innerHTML = 'Navigate to files list';
    tocBtn.addEventListener('click', function () {
        window.location.href = '#toc';
    });
    var checkboxWrapperEl = document.createElement('div');
    checkboxWrapperEl.classList.add('Checkbox-wrapper');
    Object.entries(reviewerFilesMapping).forEach(function (_a) {
        var name = _a[0], files = _a[1];
        var checkbox = document.createElement('div');
        checkbox.classList.add('Checkbox');
        var input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', 'group[]');
        input.setAttribute('value', name);
        input.setAttribute('id', name);
        input.addEventListener('change', function (event) {
            var _a;
            if ((_a = event.target) === null || _a === void 0 ? void 0 : _a.checked) {
                window.activeGroups.add(name);
            }
            else {
                window.activeGroups.delete(name);
            }
            document.querySelectorAll('.differential-file-icon-header').forEach(function (headerEl) {
                var _a, _b, _c, _d, _e, _f;
                var filePath = (_a = headerEl.childNodes[1].textContent) !== null && _a !== void 0 ? _a : '';
                var viewOptionsEl = (_b = headerEl.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector('[data-sigil="differential-view-options"]');
                viewOptionsEl === null || viewOptionsEl === void 0 ? void 0 : viewOptionsEl.dispatchEvent(new Event('click'));
                var shouldExpand = window.activeGroups.size === 0 || ((_d = Array.from((_c = fileReviewersMapping[filePath]) !== null && _c !== void 0 ? _c : [])) === null || _d === void 0 ? void 0 : _d.some(function (reviewer) { return window.activeGroups.has(reviewer); }));
                var actionEl = document.querySelector(shouldExpand ? '.fa-expand' : '.fa-compress');
                if (actionEl) {
                    (_f = (_e = actionEl.parentElement) === null || _e === void 0 ? void 0 : _e.querySelector('a')) === null || _f === void 0 ? void 0 : _f.dispatchEvent(new Event('click'));
                }
                else {
                    viewOptionsEl === null || viewOptionsEl === void 0 ? void 0 : viewOptionsEl.dispatchEvent(new Event('click'));
                }
            });
            document.body.click();
        });
        var label = document.createElement('label');
        label.setAttribute('for', name);
        label.innerHTML = name;
        var actionBtns = document.createElement('div');
        actionBtns.classList.add('NavigationBtns-wrapper');
        var loadBtn = document.createElement('button');
        loadBtn.classList.add('small');
        loadBtn.innerHTML = 'Load';
        loadBtn.addEventListener('click', function () {
            files === null || files === void 0 ? void 0 : files.forEach(function (filePath) {
                var _a;
                (_a = document.querySelector("a[href=\"#diff-".concat(fileMapping[filePath].link.slice(1), "\"]"))) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new Event('click'));
            });
        });
        var backBtn = document.createElement('button');
        backBtn.classList.add('small');
        backBtn.innerHTML = 'Back';
        backBtn.setAttribute('data-id', '0');
        backBtn.addEventListener('click', function () {
            var _a;
            var index = (_a = backBtn.getAttribute('data-id')) !== null && _a !== void 0 ? _a : '';
            var link = fileMapping[Array.from(reviewerFilesMapping[name])[+index]].link;
            window.location.href = link;
            backBtn.setAttribute('data-id', "".concat((+index + 1) % reviewerFilesMapping[name].size));
        });
        var nextBtn = document.createElement('button');
        nextBtn.classList.add('small');
        nextBtn.innerHTML = 'Next';
        nextBtn.setAttribute('data-id', "".concat(reviewerFilesMapping[name].size - 1));
        nextBtn.addEventListener('click', function () {
            var _a;
            var index = (_a = nextBtn.getAttribute('data-id')) !== null && _a !== void 0 ? _a : '';
            var link = fileMapping[Array.from(reviewerFilesMapping[name])[+index]].link;
            window.location.href = link;
            nextBtn.setAttribute('data-id', "".concat((reviewerFilesMapping[name].size + +index - 1) % reviewerFilesMapping[name].size));
        });
        actionBtns.appendChild(loadBtn);
        actionBtns.appendChild(backBtn);
        actionBtns.appendChild(nextBtn);
        label.appendChild(actionBtns);
        checkbox.appendChild(input);
        checkbox.appendChild(label);
        checkboxWrapperEl.append(checkbox);
    });
    wrapper.appendChild(tocBtn);
    wrapper.append(checkboxWrapperEl);
    document.body.append(wrapper);
};
if (!window.isAuthor) {
    (0,_modules_diff__WEBPACK_IMPORTED_MODULE_0__.fetchGetFileReviewers)()
        .then(function (_a) {
        var fileReviewersMapping = _a[0], reviewerFilesMapping = _a[1], fileMapping = _a[2];
        document.querySelectorAll('.differential-file-icon-header').forEach(function (headerEl) {
            var _a, _b;
            var filePath = (_a = headerEl.textContent) !== null && _a !== void 0 ? _a : '';
            var chipsWrapperEl = document.createElement('div');
            chipsWrapperEl.classList.add('Chips-wrapper');
            (_b = fileReviewersMapping[filePath]) === null || _b === void 0 ? void 0 : _b.forEach(function (name) {
                var chipEl = document.createElement('span');
                chipEl.classList.add('Chip');
                chipEl.innerHTML = name;
                chipsWrapperEl.append(chipEl);
            });
            headerEl.appendChild(chipsWrapperEl);
        });
        addOverlay(fileReviewersMapping, reviewerFilesMapping, fileMapping);
    })
        .catch(console.log);
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("c511fd6b20ae52d3ad0a")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=contentScript.76635e30bf78dae5fe57.hot-update.js.map