"use strict";
(self["webpackChunk_tiledb_inc_tiledb_prompt_options"] = self["webpackChunk_tiledb_inc_tiledb_prompt_options"] || []).push([["lib_index_js"],{

/***/ "./lib/dialogs/TileDBPromptOptionsWidget.js":
/*!**************************************************!*\
  !*** ./lib/dialogs/TileDBPromptOptionsWidget.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TileDBPromptOptionsWidget = void 0;
const tiledb_cloud_1 = __webpack_require__(/*! @tiledb-inc/tiledb-cloud */ "webpack/sharing/consume/default/@tiledb-inc/tiledb-cloud/@tiledb-inc/tiledb-cloud");
const dom_1 = __webpack_require__(/*! ./../helpers/dom */ "./lib/helpers/dom.js");
const apputils_1 = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
const widgets_1 = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
const dom_2 = __webpack_require__(/*! ../helpers/dom */ "./lib/helpers/dom.js");
const tiledbAPI_1 = __webpack_require__(/*! ../helpers/tiledbAPI */ "./lib/helpers/tiledbAPI.js");
const getDefaultS3DataFromNamespace_1 = __webpack_require__(/*! ../helpers/getDefaultS3DataFromNamespace */ "./lib/helpers/getDefaultS3DataFromNamespace.js");
const { UserApi } = tiledb_cloud_1.v2;
class TileDBPromptOptionsWidget extends widgets_1.Widget {
    constructor(options) {
        const body = document.createElement('div');
        super({ node: body });
        this.addClass('TDB-Prompt-Dialog');
        this.app = options.app;
        this.docManager = options.docManager;
        const name_label = document.createElement('label');
        name_label.textContent = 'Name:';
        const name_input = document.createElement('input');
        name_input.setAttribute('type', 'text');
        name_input.setAttribute('value', 'untitled');
        name_input.setAttribute('name', 'name');
        name_input.setAttribute('required', 'true');
        name_input.setAttribute('pattern', '[A-Za-z0-9_-]*');
        name_input.setAttribute('maxlength', '250');
        name_input.setAttribute('oninput', 'this.setCustomValidity("")');
        name_input.addEventListener('invalid', function (event) {
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
        const credentials = options.credentials.map((cred) => cred.name);
        dom_1.addOptionsToSelectInput(s3_cred_selectinput, credentials, options.defaultS3CredentialName);
        const addCredentialsLink = document.createElement('a');
        addCredentialsLink.textContent = 'Add credentials';
        addCredentialsLink.classList.add('TDB-Prompt-Dialog__link');
        addCredentialsLink.onclick = () => {
            window.parent.postMessage(`@tiledb/prompt_options::add_credentials`, '*');
        };
        const owner_label = document.createElement('label');
        owner_label.textContent = 'Owner:';
        const owner_input = document.createElement('select');
        dom_1.addOptionsToSelectInput(owner_input, options.owners, options.selectedOwner);
        owner_input.setAttribute('name', 'owner');
        owner_input.onchange = (e) => __awaiter(this, void 0, void 0, function* () {
            const newOwner = e.currentTarget.value;
            // Reset credentials input
            dom_2.resetSelectInput(s3_cred_selectinput);
            // Get credentials and default credentials name from API
            const userTileDBAPI = yield tiledbAPI_1.default(UserApi, tiledbAPI_1.Versions.v2);
            const credentialsResponse = yield userTileDBAPI.listCredentials(newOwner);
            const newCredentials = credentialsResponse.data.credentials || [];
            const username = options.owners[0];
            const { default_s3_path_credentials_name: defaultCredentialsName, default_s3_path: defaultS3Path, } = yield getDefaultS3DataFromNamespace_1.default(username, newOwner);
            // Update the s3_path with the new owner's default_s3_path if the input has not changed by the user.
            if (defaultS3Path && !this.isDefaultS3PathInputDirty) {
                s3_input.setAttribute('value', defaultS3Path);
            }
            const credentials = newCredentials.map((cred) => cred.name);
            dom_1.addOptionsToSelectInput(s3_cred_selectinput, credentials, defaultCredentialsName);
        });
        const kernel_label = document.createElement('label');
        kernel_label.textContent = 'Kernel:';
        const kernel_input = document.createElement('select');
        kernel_input.setAttribute('name', 'kernel');
        const kernelSpecs = this.docManager.services.kernelspecs.specs;
        const listOfAvailableKernels = Object.keys(kernelSpecs.kernelspecs);
        const kernelNames = Object.values(kernelSpecs.kernelspecs).map((kernel) => kernel.display_name);
        const defaultKernel = kernelSpecs.default;
        dom_1.addOptionsToSelectInput(kernel_input, listOfAvailableKernels, defaultKernel, kernelNames);
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
        window.addEventListener('message', (e) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (e.data === 'TILEDB_UPDATED_CREDENTIALS') {
                // Make call to update credentials
                const userTileDBAPI = yield tiledbAPI_1.default(UserApi, tiledbAPI_1.Versions.v2);
                const username = options.owners[0];
                const credentialsResponse = yield userTileDBAPI.listCredentials(username);
                s3_cred_selectinput.innerHTML = '';
                const credentials = (_a = credentialsResponse.data) === null || _a === void 0 ? void 0 : _a.credentials.map((cred) => cred.name);
                dom_1.addOptionsToSelectInput(s3_cred_selectinput, credentials, options.defaultS3CredentialName);
            }
        }));
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
            kernel: select_elem[2].value,
        };
    }
}
exports.TileDBPromptOptionsWidget = TileDBPromptOptionsWidget;
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
    const { name, owner, s3_credentials, s3_prefix, kernel: kernelName, } = serializeForm(formData);
    const tiledb_options_json = {
        name,
        s3_prefix,
        s3_credentials,
    };
    const kernel = { name: kernelName };
    const path = 'cloud/owned/'.concat(owner, '/');
    const options = {
        path: path,
        type: 'notebook',
        options: JSON.stringify(tiledb_options_json),
    };
    docManager.services.contents
        .newUntitled(options)
        .then((model) => {
        app.commands
            .execute('docmanager:open', {
            factory: 'Notebook',
            path: model.path + '.ipynb',
            kernel,
        })
            .finally(() => {
            // We click the original submit button to close the dialog
            originalSubmitButton.click();
        });
    })
        .catch((err) => {
        apputils_1.showErrorMessage('Error', err);
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addOptionsToSelectInput = exports.resetSelectInput = void 0;
const resetSelectInput = (selectInput) => {
    selectInput.value = '';
    selectInput.innerHTML = '';
};
exports.resetSelectInput = resetSelectInput;
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
exports.addOptionsToSelectInput = addOptionsToSelectInput;


/***/ }),

/***/ "./lib/helpers/getDefaultS3DataFromNamespace.js":
/*!******************************************************!*\
  !*** ./lib/helpers/getDefaultS3DataFromNamespace.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tiledb_cloud_1 = __webpack_require__(/*! @tiledb-inc/tiledb-cloud */ "webpack/sharing/consume/default/@tiledb-inc/tiledb-cloud/@tiledb-inc/tiledb-cloud");
const tiledbAPI_1 = __webpack_require__(/*! ./tiledbAPI */ "./lib/helpers/tiledbAPI.js");
const { UserApi, OrganizationApi } = tiledb_cloud_1.v1;
/**
 * Returns the default_s3_path_credentials_name of the selected owner
 * @param user The user's username
 * @param owner The selected owner
 * @returns The default credentials name of the owner
 */
const getDefaultS3DataFromNamespace = (user, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const userTileDBAPI = yield tiledbAPI_1.default(UserApi);
    const orgTileDBAPI = yield tiledbAPI_1.default(OrganizationApi);
    const isOwnerOrganization = user !== owner;
    /**
     * If the current owner is the user we use UserAPI to get user's data
     * otherwise the current owner is an organization so we use OrganizationApi
     * to get the org's data
     */
    const getOwnerData = () => isOwnerOrganization
        ? orgTileDBAPI.getOrganization(owner)
        : userTileDBAPI.getUser();
    const ownerResponse = yield getOwnerData();
    return {
        default_s3_path: ownerResponse.data.default_s3_path,
        default_s3_path_credentials_name: ownerResponse.data.default_s3_path_credentials_name,
    };
});
exports["default"] = getDefaultS3DataFromNamespace;


/***/ }),

/***/ "./lib/helpers/getOrgNamesWithWritePermissions.js":
/*!********************************************************!*\
  !*** ./lib/helpers/getOrgNamesWithWritePermissions.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getOrgNamesWithWritePermissions(orgs) {
    const orgNames = [];
    orgs.forEach((org) => {
        const orgName = org.organization_name;
        if (orgName !== 'public' &&
            !!~org.allowed_actions.indexOf('write')) {
            orgNames.push(orgName);
        }
    });
    return orgNames;
}
exports["default"] = getOrgNamesWithWritePermissions;


/***/ }),

/***/ "./lib/helpers/handler.js":
/*!********************************!*\
  !*** ./lib/helpers/handler.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.requestAPI = void 0;
const coreutils_1 = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
const services_1 = __webpack_require__(/*! @jupyterlab/services */ "webpack/sharing/consume/default/@jupyterlab/services");
/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
function requestAPI(endPoint = '', init = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // Make request to Jupyter API
        const settings = services_1.ServerConnection.makeSettings();
        const requestUrl = coreutils_1.URLExt.join(settings.baseUrl, 'get_access_token', (endPoint = ''));
        let response;
        try {
            response = yield services_1.ServerConnection.makeRequest(requestUrl, init, settings);
        }
        catch (error) {
            throw new services_1.ServerConnection.NetworkError(error);
        }
        const data = yield response.json();
        if (!response.ok) {
            throw new services_1.ServerConnection.ResponseError(response, data.message);
        }
        return data;
    });
}
exports.requestAPI = requestAPI;


/***/ }),

/***/ "./lib/helpers/openDialogs.js":
/*!************************************!*\
  !*** ./lib/helpers/openDialogs.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.showMainDialog = void 0;
const apputils_1 = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
const apputils_2 = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
const TileDBPromptOptionsWidget_1 = __webpack_require__(/*! ../dialogs/TileDBPromptOptionsWidget */ "./lib/dialogs/TileDBPromptOptionsWidget.js");
const showMainDialog = (data) => {
    apputils_1.showDialog({
        body: new TileDBPromptOptionsWidget_1.TileDBPromptOptionsWidget(data),
        buttons: [
            apputils_2.Dialog.cancelButton(),
            apputils_2.Dialog.okButton({ label: 'GO', className: 'TDB-Prompt-Dialog__btn' }),
        ],
        title: 'TileDB Notebook Options',
    });
};
exports.showMainDialog = showMainDialog;


/***/ }),

/***/ "./lib/helpers/tiledbAPI.js":
/*!**********************************!*\
  !*** ./lib/helpers/tiledbAPI.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Versions = void 0;
const handler_1 = __webpack_require__(/*! ./handler */ "./lib/helpers/handler.js");
let data;
var Versions;
(function (Versions) {
    Versions["v1"] = "v1";
    Versions["v2"] = "v2";
})(Versions = exports.Versions || (exports.Versions = {}));
const getTileDBAPI = (Api, apiVersion = Versions.v1) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data) {
        data = yield handler_1.requestAPI();
    }
    const config = {
        apiKey: data.token,
        basePath: `${data.api_host}/${apiVersion}`,
    };
    return new Api(config);
});
exports["default"] = getTileDBAPI;


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tiledb_cloud_1 = __webpack_require__(/*! @tiledb-inc/tiledb-cloud */ "webpack/sharing/consume/default/@tiledb-inc/tiledb-cloud/@tiledb-inc/tiledb-cloud");
const docmanager_1 = __webpack_require__(/*! @jupyterlab/docmanager */ "webpack/sharing/consume/default/@jupyterlab/docmanager");
const filebrowser_1 = __webpack_require__(/*! @jupyterlab/filebrowser */ "webpack/sharing/consume/default/@jupyterlab/filebrowser");
const launcher_1 = __webpack_require__(/*! @jupyterlab/launcher */ "webpack/sharing/consume/default/@jupyterlab/launcher");
const mainmenu_1 = __webpack_require__(/*! @jupyterlab/mainmenu */ "webpack/sharing/consume/default/@jupyterlab/mainmenu");
const tiledbAPI_1 = __webpack_require__(/*! ./helpers/tiledbAPI */ "./lib/helpers/tiledbAPI.js");
const openDialogs_1 = __webpack_require__(/*! ./helpers/openDialogs */ "./lib/helpers/openDialogs.js");
const getOrgNamesWithWritePermissions_1 = __webpack_require__(/*! ./helpers/getOrgNamesWithWritePermissions */ "./lib/helpers/getOrgNamesWithWritePermissions.js");
const { UserApi } = tiledb_cloud_1.v1;
const { UserApi: UserApiV2 } = tiledb_cloud_1.v2;
const extension = {
    activate,
    autoStart: true,
    id: 'tiledb-prompt-notebook-options',
    optional: [launcher_1.ILauncher],
    requires: [mainmenu_1.IMainMenu, docmanager_1.IDocumentManager, filebrowser_1.IFileBrowserFactory],
};
function activate(app, menu, docManager, browser, launcher) {
    const OPEN_COMMAND = 'tiledb-prompt-notebook-options:open';
    app.commands.addCommand(OPEN_COMMAND, {
        caption: 'Prompt the user for TileDB notebook options',
        execute: () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const tileDBAPI = yield tiledbAPI_1.default(UserApi);
            const tileDBAPIV2 = yield tiledbAPI_1.default(UserApiV2, tiledbAPI_1.Versions.v2);
            const userResponse = yield tileDBAPI.getUser();
            const userData = userResponse.data;
            const username = userData.username;
            const credentialsResponse = yield tileDBAPIV2.listCredentials(username);
            const owners = [username];
            const organizationsWithWritePermissions = getOrgNamesWithWritePermissions_1.default(userData.organizations || []);
            const defaultS3Path = userData.default_s3_path || 's3://tiledb-user/notebooks';
            owners.push(...organizationsWithWritePermissions);
            openDialogs_1.showMainDialog({
                owners,
                credentials: ((_a = credentialsResponse.data) === null || _a === void 0 ? void 0 : _a.credentials) || [],
                defaultS3Path,
                defaultS3CredentialName: userData.default_s3_path_credentials_name,
                app,
                docManager,
                selectedOwner: userData.username,
            });
        }),
        isEnabled: () => true,
        label: 'TileDB Notebook',
    });
    // Add a launcher item.
    if (launcher) {
        launcher.add({
            args: { isLauncher: true, kernelName: 'tiledb-prompt-notebook-options' },
            category: 'Notebook',
            command: OPEN_COMMAND,
            kernelIconUrl: 'https://cloud.tiledb.com/static/img/tiledb-logo-jupyterlab.svg',
            rank: 1,
        });
    }
    // Add to the file menu.
    if (menu) {
        menu.fileMenu.newMenu.addGroup([{ command: OPEN_COMMAND }], 40);
    }
    console.log('JupyterLab extension @tiledb/tiledb_prompt_options is activated.');
}
exports["default"] = extension;


/***/ })

}]);
//# sourceMappingURL=lib_index_js.bf0c58c97c16ce1027ed.js.map