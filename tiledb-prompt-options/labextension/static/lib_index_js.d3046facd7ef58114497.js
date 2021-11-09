"use strict";
(self["webpackChunk_tiledb_inc_tiledb_prompt_options"] = self["webpackChunk_tiledb_inc_tiledb_prompt_options"] || []).push([["lib_index_js"],{

/***/ "./lib/dialogs/TileDBPromptOptionsWidget.js":
/*!**************************************************!*\
  !*** ./lib/dialogs/TileDBPromptOptionsWidget.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TileDBPromptOptionsWidget": () => (/* binding */ TileDBPromptOptionsWidget)
/* harmony export */ });
/* harmony import */ var _tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tiledb-inc/tiledb-cloud */ "webpack/sharing/consume/default/@tiledb-inc/tiledb-cloud/@tiledb-inc/tiledb-cloud");
/* harmony import */ var _tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/dom */ "./lib/helpers/dom.js");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _helpers_tiledbAPI__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/tiledbAPI */ "./lib/helpers/tiledbAPI.js");
/* harmony import */ var _helpers_getDefaultS3DataFromNamespace__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/getDefaultS3DataFromNamespace */ "./lib/helpers/getDefaultS3DataFromNamespace.js");







const { UserApi } = _tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0__.v2;
class TileDBPromptOptionsWidget extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Widget {
    constructor(options) {
        const body = document.createElement('div');
        super({ node: body });
        this.addClass('TDB-Prompt-Dialog');
        this.app = options.app;
        this.docManager = options.docManager;
        this.isDefaultS3PathInputDirty = false;
        const name_label = document.createElement('label');
        name_label.textContent = 'Name:';
        const name_input = document.createElement('input');
        name_input.setAttribute('type', 'text');
        name_input.setAttribute('value', 'untitled');
        name_input.setAttribute('name', 'name');
        name_input.setAttribute('required', 'true');
        name_input.setAttribute('pattern', '[a-z][A-Za-z0-9_-]*');
        name_input.setAttribute('maxlength', '250');
        name_input.setAttribute('oninput', 'this.setCustomValidity("")');
        name_input.addEventListener('invalid', (event) => {
            if (event.target.validity.valueMissing) {
                event.target.setCustomValidity('This field is required');
            }
            else {
                event.target.setCustomValidity('Name should start with a lowercase character and consist of letters(a -z and A-Z), numbers, "_" and "-" only');
            }
        });
        const s3_label = document.createElement('label');
        s3_label.textContent = 'Cloud storage path:';
        const s3_input = document.createElement('input');
        s3_input.setAttribute('type', 'text');
        s3_input.setAttribute('value', options.defaultS3Path);
        s3_input.setAttribute('name', 's3_prefix');
        s3_input.onchange = () => {
            this.isDefaultS3PathInputDirty = true;
        };
        const s3_cred_label = document.createElement('label');
        s3_cred_label.textContent = 'Cloud storage credentials:';
        const s3_cred_selectinput = document.createElement('select');
        s3_cred_selectinput.setAttribute('name', 's3_credentials');
        s3_cred_selectinput.setAttribute('required', 'true');
        const credentials = options.credentials.map(cred => cred.name);
        (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_3__.addOptionsToSelectInput)(s3_cred_selectinput, credentials, options.defaultS3CredentialName);
        const addCredentialsLink = document.createElement('a');
        addCredentialsLink.textContent = 'Add credentials';
        addCredentialsLink.classList.add('TDB-Prompt-Dialog__link');
        addCredentialsLink.onclick = () => {
            window.parent.postMessage('@tiledb/prompt_options::add_credentials', '*');
        };
        const owner_label = document.createElement('label');
        owner_label.textContent = 'Owner:';
        const owner_input = document.createElement('select');
        (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_3__.addOptionsToSelectInput)(owner_input, options.owners, options.selectedOwner);
        owner_input.setAttribute('name', 'owner');
        owner_input.onchange = async (e) => {
            const newOwner = e.currentTarget.value;
            // Reset credentials input
            (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_3__.resetSelectInput)(s3_cred_selectinput);
            // Get credentials and default credentials name from API
            const userTileDBAPI = await (0,_helpers_tiledbAPI__WEBPACK_IMPORTED_MODULE_4__["default"])(UserApi, _helpers_tiledbAPI__WEBPACK_IMPORTED_MODULE_4__.Versions.v2);
            const credentialsResponse = await userTileDBAPI.listCredentials(newOwner);
            const newCredentials = credentialsResponse.data.credentials || [];
            const username = options.owners[0];
            const { default_s3_path_credentials_name: defaultCredentialsName, default_s3_path: defaultS3Path } = await (0,_helpers_getDefaultS3DataFromNamespace__WEBPACK_IMPORTED_MODULE_5__["default"])(username, newOwner);
            // Update the s3_path with the new owner's default_s3_path if the input has not changed by the user.
            if (defaultS3Path && !this.isDefaultS3PathInputDirty) {
                s3_input.setAttribute('value', defaultS3Path);
            }
            const credentials = newCredentials.map(cred => cred.name);
            (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_3__.addOptionsToSelectInput)(s3_cred_selectinput, credentials, defaultCredentialsName);
        };
        const kernel_label = document.createElement('label');
        kernel_label.textContent = 'Kernel:';
        const kernel_input = document.createElement('select');
        kernel_input.setAttribute('name', 'kernel');
        const kernelSpecs = this.docManager.services.kernelspecs
            .specs;
        const listOfAvailableKernels = Object.keys(kernelSpecs.kernelspecs);
        const kernelNames = Object.values(kernelSpecs.kernelspecs).map(kernel => kernel.display_name);
        const defaultKernel = kernelSpecs.default;
        (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_3__.addOptionsToSelectInput)(kernel_input, listOfAvailableKernels, defaultKernel, kernelNames);
        const form = document.createElement('form');
        form.classList.add('TDB-Prompt-Dialog__form');
        body.appendChild(form);
        form.appendChild(name_label);
        form.appendChild(name_input);
        form.appendChild(s3_label);
        form.appendChild(s3_input);
        form.appendChild(s3_cred_label);
        form.appendChild(s3_cred_selectinput);
        form.appendChild(addCredentialsLink);
        form.appendChild(owner_label);
        form.appendChild(owner_input);
        form.appendChild(kernel_label);
        form.appendChild(kernel_input);
        // Update credentials input when we get message from parent window
        window.addEventListener('message', async (e) => {
            var _a, _b;
            if (e.data === 'TILEDB_UPDATED_CREDENTIALS') {
                // Make call to update credentials
                const userTileDBAPI = await (0,_helpers_tiledbAPI__WEBPACK_IMPORTED_MODULE_4__["default"])(UserApi, _helpers_tiledbAPI__WEBPACK_IMPORTED_MODULE_4__.Versions.v2);
                const username = options.owners[0];
                const credentialsResponse = await userTileDBAPI.listCredentials(username);
                s3_cred_selectinput.innerHTML = '';
                const credentials = (_b = (_a = credentialsResponse === null || credentialsResponse === void 0 ? void 0 : credentialsResponse.data) === null || _a === void 0 ? void 0 : _a.credentials) === null || _b === void 0 ? void 0 : _b.map(cred => cred.name);
                (0,_helpers_dom__WEBPACK_IMPORTED_MODULE_3__.addOptionsToSelectInput)(s3_cred_selectinput, credentials, options.defaultS3CredentialName);
            }
        });
    }
    /**
     * Add a fake button with a loader to indicate users to wait
     */
    onAfterAttach() {
        var _a;
        const footerElement = (_a = document.querySelector('.TDB-Prompt-Dialog')) === null || _a === void 0 ? void 0 : _a.nextElementSibling;
        const fakeBtn = document.createElement('button');
        fakeBtn.classList.add('TDB-Prompt-Dialog__styled-btn', 'jp-Dialog-button', 'jp-mod-accept', 'jp-mod-styled');
        fakeBtn.textContent = 'GO';
        fakeBtn.onclick = () => onSbumit(this.app, this.docManager);
        footerElement.appendChild(fakeBtn);
    }
    getValue() {
        const input_elem = this.node.getElementsByTagName('input');
        const select_elem = this.node.getElementsByTagName('select');
        return {
            name: input_elem[0].value,
            s3_prefix: input_elem[1].value,
            s3_credentials: select_elem[0].value,
            owner: select_elem[1].value,
            kernel: select_elem[2].value
        };
    }
}
function onSbumit(app, docManager) {
    const fakeBtn = document.querySelector('.TDB-Prompt-Dialog__styled-btn');
    const originalSubmitButton = document.querySelector('.TDB-Prompt-Dialog__btn');
    const formElement = document.querySelector('.TDB-Prompt-Dialog__form');
    const formData = new FormData(formElement);
    // If form is not valid just return
    if (!formElement.reportValidity()) {
        return;
    }
    fakeBtn.textContent = '';
    const loader = document.createElement('div');
    loader.classList.add('TDB-Prompt-Dialog__loader');
    fakeBtn.appendChild(loader);
    const { name, owner, s3_credentials, s3_prefix, kernel: kernelName } = serializeForm(formData);
    const tiledb_options_json = {
        name,
        s3_prefix,
        s3_credentials
    };
    const kernel = { name: kernelName };
    const path = 'cloud/owned/'.concat(owner, '/');
    const options = {
        path: path,
        type: 'notebook',
        options: JSON.stringify(tiledb_options_json)
    };
    docManager.services.contents
        .newUntitled(options)
        .then(model => {
        app.commands.execute('docmanager:open', {
            factory: 'Notebook',
            path: model.path + '.ipynb',
            kernel
        }).finally(() => {
            // We click the original submit button to close the dialog
            originalSubmitButton.click();
        });
    })
        .catch(err => {
        (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.showErrorMessage)('Error', err);
        originalSubmitButton.click();
    });
}
function serializeForm(formData) {
    const obj = {};
    for (const key of formData.keys()) {
        obj[key] = formData.get(key);
    }
    return obj;
}


/***/ }),

/***/ "./lib/helpers/dom.js":
/*!****************************!*\
  !*** ./lib/helpers/dom.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "resetSelectInput": () => (/* binding */ resetSelectInput),
/* harmony export */   "addOptionsToSelectInput": () => (/* binding */ addOptionsToSelectInput)
/* harmony export */ });
const resetSelectInput = (selectInput) => {
    selectInput.value = '';
    selectInput.innerHTML = '';
};
const addOptionsToSelectInput = (selectInput, options, defaultValue, deplayNames) => {
    options.forEach((opt, i) => {
        const diplayName = deplayNames ? deplayNames[i] : opt;
        const option = document.createElement('option');
        option.setAttribute('value', opt);
        option.setAttribute('label', diplayName);
        if (!!defaultValue && defaultValue === opt) {
            option.setAttribute('selected', 'true');
        }
        selectInput.append(option);
    });
};


/***/ }),

/***/ "./lib/helpers/getDefaultS3DataFromNamespace.js":
/*!******************************************************!*\
  !*** ./lib/helpers/getDefaultS3DataFromNamespace.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tiledb-inc/tiledb-cloud */ "webpack/sharing/consume/default/@tiledb-inc/tiledb-cloud/@tiledb-inc/tiledb-cloud");
/* harmony import */ var _tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tiledbAPI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tiledbAPI */ "./lib/helpers/tiledbAPI.js");


const { UserApi, OrganizationApi } = _tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0__.v1;
/**
 * Returns the default_s3_path_credentials_name of the selected owner
 * @param user The user's username
 * @param owner The selected owner
 * @returns The default credentials name of the owner
 */
const getDefaultS3DataFromNamespace = async (user, owner) => {
    const userTileDBAPI = await (0,_tiledbAPI__WEBPACK_IMPORTED_MODULE_1__["default"])(UserApi);
    const orgTileDBAPI = await (0,_tiledbAPI__WEBPACK_IMPORTED_MODULE_1__["default"])(OrganizationApi);
    const isOwnerOrganization = user !== owner;
    /**
     * If the current owner is the user we use UserAPI to get user's data
     * otherwise the current owner is an organization so we use OrganizationApi
     * to get the org's data
     */
    const getOwnerData = () => isOwnerOrganization
        ? orgTileDBAPI.getOrganization(owner)
        : userTileDBAPI.getUser();
    const ownerResponse = await getOwnerData();
    return {
        default_s3_path: ownerResponse.data.default_s3_path,
        default_s3_path_credentials_name: ownerResponse.data.default_s3_path_credentials_name
    };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getDefaultS3DataFromNamespace);


/***/ }),

/***/ "./lib/helpers/getOrgNamesWithWritePermissions.js":
/*!********************************************************!*\
  !*** ./lib/helpers/getOrgNamesWithWritePermissions.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOrgNamesWithWritePermissions)
/* harmony export */ });
function getOrgNamesWithWritePermissions(orgs) {
    const orgNames = [];
    orgs.forEach(org => {
        const orgName = org.organization_name;
        if (orgName !== 'public' &&
            !!~(org === null || org === void 0 ? void 0 : org.allowed_actions.indexOf('write'))) {
            orgNames.push(orgName);
        }
    });
    return orgNames;
}


/***/ }),

/***/ "./lib/helpers/handler.js":
/*!********************************!*\
  !*** ./lib/helpers/handler.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "requestAPI": () => (/* binding */ requestAPI)
/* harmony export */ });
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/services */ "webpack/sharing/consume/default/@jupyterlab/services");
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
async function requestAPI(endPoint = '', init = {}) {
    // Make request to Jupyter API
    const settings = _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeSettings();
    const requestUrl = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.URLExt.join(settings.baseUrl, 'get_access_token', (endPoint = ''));
    let response;
    try {
        response = await _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeRequest(requestUrl, init, settings);
    }
    catch (error) {
        throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.NetworkError(error);
    }
    let data = await response.text();
    if (data.length > 0) {
        try {
            data = JSON.parse(data);
        }
        catch (error) {
            console.log('Not a JSON response body.', response);
        }
    }
    if (!response.ok) {
        throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.ResponseError(response, data.message);
    }
    return data;
}


/***/ }),

/***/ "./lib/helpers/openDialogs.js":
/*!************************************!*\
  !*** ./lib/helpers/openDialogs.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "showMainDialog": () => (/* binding */ showMainDialog)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dialogs_TileDBPromptOptionsWidget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dialogs/TileDBPromptOptionsWidget */ "./lib/dialogs/TileDBPromptOptionsWidget.js");



const showMainDialog = (data) => {
    (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showDialog)({
        body: new _dialogs_TileDBPromptOptionsWidget__WEBPACK_IMPORTED_MODULE_1__.TileDBPromptOptionsWidget(data),
        buttons: [
            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.cancelButton(),
            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.okButton({ label: 'GO', className: 'TDB-Prompt-Dialog__btn' })
        ],
        title: 'TileDB Notebook Options'
    });
};


/***/ }),

/***/ "./lib/helpers/tiledbAPI.js":
/*!**********************************!*\
  !*** ./lib/helpers/tiledbAPI.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Versions": () => (/* binding */ Versions),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handler */ "./lib/helpers/handler.js");

let data;
var Versions;
(function (Versions) {
    Versions["v1"] = "v1";
    Versions["v2"] = "v2";
})(Versions || (Versions = {}));
const getTileDBAPI = async (Api, apiVersion = Versions.v1) => {
    if (!data) {
        data = await (0,_handler__WEBPACK_IMPORTED_MODULE_0__.requestAPI)();
    }
    const config = {
        apiKey: data.token,
        basePath: `${data.api_host}/${apiVersion}`
    };
    return new Api(config);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getTileDBAPI);


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tiledb-inc/tiledb-cloud */ "webpack/sharing/consume/default/@tiledb-inc/tiledb-cloud/@tiledb-inc/tiledb-cloud");
/* harmony import */ var _tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/docmanager */ "webpack/sharing/consume/default/@jupyterlab/docmanager");
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/filebrowser */ "webpack/sharing/consume/default/@jupyterlab/filebrowser");
/* harmony import */ var _jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/launcher */ "webpack/sharing/consume/default/@jupyterlab/launcher");
/* harmony import */ var _jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/mainmenu */ "webpack/sharing/consume/default/@jupyterlab/mainmenu");
/* harmony import */ var _jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _helpers_tiledbAPI__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./helpers/tiledbAPI */ "./lib/helpers/tiledbAPI.js");
/* harmony import */ var _helpers_openDialogs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers/openDialogs */ "./lib/helpers/openDialogs.js");
/* harmony import */ var _helpers_getOrgNamesWithWritePermissions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/getOrgNamesWithWritePermissions */ "./lib/helpers/getOrgNamesWithWritePermissions.js");








const { UserApi } = _tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0__.v1;
const { UserApi: UserApiV2 } = _tiledb_inc_tiledb_cloud__WEBPACK_IMPORTED_MODULE_0__.v2;
const extension = {
    activate,
    autoStart: true,
    id: 'tiledb-prompt-notebook-options',
    optional: [_jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_3__.ILauncher],
    requires: [_jupyterlab_mainmenu__WEBPACK_IMPORTED_MODULE_4__.IMainMenu, _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1__.IDocumentManager, _jupyterlab_filebrowser__WEBPACK_IMPORTED_MODULE_2__.IFileBrowserFactory]
};
function activate(app, menu, docManager, browser, launcher) {
    const OPEN_COMMAND = 'tiledb-prompt-notebook-options:open';
    app.commands.addCommand(OPEN_COMMAND, {
        caption: 'Prompt the user for TileDB notebook options',
        execute: async () => {
            var _a;
            const tileDBAPI = await (0,_helpers_tiledbAPI__WEBPACK_IMPORTED_MODULE_5__["default"])(UserApi);
            const tileDBAPIV2 = await (0,_helpers_tiledbAPI__WEBPACK_IMPORTED_MODULE_5__["default"])(UserApiV2, _helpers_tiledbAPI__WEBPACK_IMPORTED_MODULE_5__.Versions.v2);
            const userResponse = await tileDBAPI.getUser();
            const userData = userResponse.data;
            const username = userData.username;
            const credentialsResponse = await tileDBAPIV2.listCredentials(username);
            const owners = [username];
            const organizationsWithWritePermissions = (0,_helpers_getOrgNamesWithWritePermissions__WEBPACK_IMPORTED_MODULE_6__["default"])(userData.organizations || []);
            const defaultS3Path = userData.default_s3_path || 's3://tiledb-user/notebooks';
            owners.push(...organizationsWithWritePermissions);
            (0,_helpers_openDialogs__WEBPACK_IMPORTED_MODULE_7__.showMainDialog)({
                owners,
                credentials: ((_a = credentialsResponse.data) === null || _a === void 0 ? void 0 : _a.credentials) || [],
                defaultS3Path,
                defaultS3CredentialName: userData.default_s3_path_credentials_name,
                app,
                docManager,
                selectedOwner: userData.username
            });
        },
        isEnabled: () => true,
        label: 'TileDB Notebook'
    });
    // Add a launcher item.
    if (launcher) {
        launcher.add({
            args: { isLauncher: true, kernelName: 'tiledb-prompt-notebook-options' },
            category: 'Notebook',
            command: OPEN_COMMAND,
            kernelIconUrl: 'https://cloud.tiledb.com/static/img/tiledb-logo-jupyterlab.svg',
            rank: 1
        });
    }
    // Add to the file menu.
    if (menu) {
        menu.fileMenu.newMenu.addGroup([{ command: OPEN_COMMAND }], 40);
    }
    console.log('JupyterLab extension @tiledb/tiledb_prompt_options is activated.');
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (extension);


/***/ })

}]);
//# sourceMappingURL=lib_index_js.d3046facd7ef58114497.js.map