"use strict";
let sessionButtons = [];
let allPlaces = [];
const adminAccount = {
    name: 'Alan',
    pass: '12345'
};
let inSession = false;
const logInButton = document.getElementById('logIn-button');
const logInModalButtons = document.querySelectorAll('.logIn-modalButton');
const logOutButtons = document.querySelectorAll('.logOut-button');
const logInCancel = document.getElementById('LogIn-cancel');
logInButton.addEventListener('click', () => logIn());
logOutButtons.forEach((button) => {
    button.addEventListener('click', () => logOut());
    sessionButtons.push(button);
});
logInCancel.addEventListener('click', () => hideAlert());
function logIn() {
    if (document.getElementById('logIn-name').value === adminAccount.name && document.getElementById('logIn-password').value === adminAccount.pass) {
        logInModalButtons.forEach((button) => button.classList.add('d-none'));
        sessionButtons.forEach(element => element.classList.remove('d-none'));
        inSession = true;
        allPlaces.forEach(place => place.setAttribute('draggable', 'true'));
        $('#LogIn-modal').modal('hide');
        $('#offcanvasNavbar2').offcanvas('hide');
        showAlert('success', 'Inicio de sesión exitoso');
    }
    else
        showAlert('danger', 'Usuario y/o contraseña inválidos');
}
function logOut() {
    logInModalButtons.forEach((button) => button.classList.remove('d-none'));
    sessionButtons.forEach(element => element.classList.add('d-none'));
    inSession = false;
    allPlaces.forEach(place => place.setAttribute('draggable', 'false'));
    $('#offcanvasNavbar2').offcanvas('hide');
    showAlert('warning', 'Se ha cerrado la sesión');
}
function createElement(type, classes, attributes, parent, children) {
    let newElement = document.createElement(type);
    if (classes)
        newElement.classList.add(...classes);
    if (attributes)
        attributes.forEach(attribute => newElement.setAttribute(attribute.att, attribute.value));
    if (parent)
        parent.appendChild(newElement);
    if (children)
        children.forEach(child => newElement.appendChild(child));
    return newElement;
}
const body = document.querySelector('body');
function showAlert(type, message) {
    hideAlert();
    let alertContent = document.createElement('DIV');
    alertContent.innerHTML = message;
    let alertButton = createElement('BUTTON', ['btn-close'], [{ att: 'type', value: 'button' }, { att: 'data-bs-dismiss', value: 'alert' }, { att: 'aria-label', value: 'cerrar alerta' }], undefined, undefined);
    body.appendChild(createElement('DIV', ['alert', `alert-${type}`, 'alert-dismissible', 'fixed-top', 'my-3', 'start-50'], [{ att: 'role', value: 'alert' }, { att: 'style', value: 'max-width: 540px; z-index: 1100; top: 2em; transform: translate(-50%, 0);' }], undefined, [alertContent, alertButton]));
}
function hideAlert() {
    $('.alert').alert('close');
}
class OwnerInfo {
    constructor(jsonObj) {
        this.bannerDraft = [];
        this.photoDraft = '';
        this.titleDraft = '';
        this.descriptionDraft = '';
        this.bannerContainer = document.querySelectorAll('.banner');
        this.photoContainer = document.querySelectorAll('.photoContainer');
        this.titleContainer = document.querySelectorAll('.titleContainer');
        this.descriptionContainer = document.querySelectorAll('.descriptionContainer');
        this.bannerEditer = document.querySelectorAll('.banner-adder');
        this.bannerEditerLink = document.getElementById('owner-banner-link');
        this.bannerEditerFile = document.getElementById('owner-banner-file');
        this.photoEditerFile = document.getElementById('owner-photo-file');
        this.photoEditerLink = document.getElementById('owner-photo-link');
        this.titleEditer = document.getElementById('owner-title');
        this.descriptionEditer = document.getElementById('owner-description');
        this.thContainer = document.getElementById('owner-thumbnails');
        this.saver = document.getElementById('owner-saver');
        this.open = document.querySelectorAll('.edit-owner');
        this.banner = jsonObj.banner;
        this.photo = jsonObj.photo;
        this.title = jsonObj.title;
        this.description = jsonObj.description;
        this.bannerEditerFile.addEventListener('input', () => {
            this.bannerEditerLink.value = URL.createObjectURL(this.bannerEditerFile.files[0]);
        });
        this.bannerEditer.forEach((button) => {
            button.addEventListener('click', () => {
                let input = document.getElementById(button.getAttribute('bindedInput'));
                let src;
                switch (button.getAttribute('fileType')) {
                    case 'link':
                        src = input.value;
                        break;
                    case 'canvas':
                        src = input.value;
                        break;
                    default:
                        src = null;
                        break;
                }
                if (input.value) {
                    this.bannerDraft.push(new CarouselImage(button.getAttribute('fileType'), src, this.bannerDraft.length, this));
                }
                this.refreshTC();
            });
        });
        this.photoEditerFile.addEventListener('input', () => {
            this.photoDraft = URL.createObjectURL(this.photoEditerFile.files[0]);
            this.photoEditerLink.value = this.photoDraft;
        });
        this.photoEditerLink.addEventListener('input', () => {
            this.photoDraft = this.photoEditerLink.value;
        });
        this.titleEditer.addEventListener('input', () => {
            this.titleDraft = this.titleEditer.value;
        });
        this.descriptionEditer.addEventListener('input', () => {
            this.descriptionDraft = this.descriptionEditer.value;
        });
        this.saver.addEventListener('click', () => {
            this.saveChanges();
        });
        this.open.forEach((button) => {
            button.addEventListener('click', () => {
                this.openEditor();
            });
        });
        this.open.forEach((button) => sessionButtons.push(button));
        this.refresh();
    }
    refresh() {
        this.bannerContainer.forEach((container) => {
            container.innerHTML = '';
            let first = true;
            this.banner.forEach(banner => {
                if (!first) {
                    if (banner.Type == 'file' || banner.Type == 'link') {
                        container.innerHTML += [
                            '<div class="carousel-item w-100 h-100">',
                            `<img src="${banner.Src}" class="h-100 w-100" style="object-fit: cover;">`,
                            '</div>'
                        ].join('');
                    }
                    else if (banner.Type == 'canvas') {
                    }
                }
                else if (first) {
                    if (banner.Type == 'file' || banner.Type == 'link') {
                        container.innerHTML += [
                            '<div class="carousel-item active w-100 h-100">',
                            `<img src="${banner.Src}" class="h-100 w-100" style="object-fit: cover;">`,
                            '</div>'
                        ].join('');
                    }
                    else if (banner.Type == 'canvas') {
                    }
                    first = false;
                }
            });
        });
        if (this.photo) {
            this.photoContainer.forEach((cont) => {
                cont.innerHTML = `<img src="${this.photo}" class="w-100 h-100" style="object-fit: cover;">`;
            });
        }
        else {
            this.photoContainer.forEach((cont) => {
                cont.innerHTML = `<img src="imgs/non-profile.png" class="w-100 h-100" style="object-fit: cover;">`;
            });
        }
        this.titleContainer.forEach((cont) => {
            cont.innerHTML = this.title;
        });
        this.descriptionContainer.forEach((cont) => {
            cont.innerHTML = this.description;
        });
    }
    refreshTC() {
        this.thContainer.innerHTML = '';
        let container = document.createDocumentFragment();
        this.bannerDraft.forEach((image) => {
            image.addThumbnail(container);
        });
        this.thContainer.appendChild(container);
    }
    saveChanges() {
        this.banner = this.bannerDraft;
        this.photo = this.photoDraft;
        this.title = this.titleDraft;
        this.description = this.descriptionDraft;
        this.refresh();
    }
    openEditor() {
        this.photoEditerLink.value = this.photo;
        this.titleEditer.value = this.title;
        this.descriptionEditer.value = this.description;
        this.bannerDraft = this.banner;
        this.photoDraft = this.photo;
        this.titleDraft = this.title;
        this.descriptionDraft = this.description;
        this.refreshTC();
    }
    complementMovement(from, dir) {
        this.bannerDraft.find((banner) => (banner.Index == from.Index && banner != from)).move(dir, false);
        this.bannerDraft.sort((a, b) => { return a.Index - b.Index; });
        this.refreshTC();
    }
    get BannerDraftLenght() {
        return this.bannerDraft.length;
    }
    get BannerDraft() {
        return this.bannerDraft;
    }
    set BannerDraft(newDraft) {
        this.bannerDraft = newDraft;
    }
}
class CarouselImage {
    constructor(type, src, index, container) {
        this.moveForwardButton = this.createButton('fa-chevron-left', 'Mover a la izquierda', 'forward');
        this.moveBackwardButton = this.createButton('fa-chevron-right', 'Mover a la derecha', 'backward');
        this.deleteButton = this.createButton('fa-xmark', 'Eliminar', 'delete');
        this.type = type;
        this.src = src;
        this.index = index;
        this.container = container;
        this.thumbnail = this.createThumbnail();
    }
    createButton(figure, title, type) {
        let button = document.createElement('I');
        button.classList.add('fa-solid', figure, 'btn', 'p-0');
        button.setAttribute('title', title);
        if (type == 'delete') {
            button.addEventListener('click', () => { this.deleteSelf(); });
        }
        else {
            button.addEventListener('click', () => { this.move(type, true); });
        }
        return button;
    }
    addThumbnail(container) {
        container.append(this.thumbnail);
    }
    move(dir, needComplement) {
        switch (dir) {
            case 'forward':
                if (this.index > 0) {
                    this.index--;
                    if (needComplement)
                        this.container.complementMovement(this, 'backward');
                }
                break;
            case 'backward':
                if (this.index < (this.container.BannerDraftLenght - 1)) {
                    this.index++;
                    if (needComplement)
                        this.container.complementMovement(this, 'forward');
                }
                break;
        }
    }
    deleteSelf() {
        this.container.BannerDraft = this.container.BannerDraft.filter(banner => banner != this);
        for (let i in this.container.BannerDraft) {
            this.container.BannerDraft[i].Index = parseInt(i);
        }
        this.container.refreshTC();
    }
    createThumbnail() {
        let container = document.createElement('DIV');
        if (this.type == 'file' || this.type == 'link') {
            container.style.height = '50px';
            container.style.width = '50px';
            container.classList.add('position-relative', 'border', 'mx-2');
            let img = new Image();
            img.src = this.src;
            img.style.objectFit = 'cover';
            img.classList.add('w-100');
            img.classList.add('h-100');
            let buttonsCont = document.createElement('DIV');
            buttonsCont.classList.add('position-absolute', 'top-0', 'text-center', 'w-100');
            buttonsCont.appendChild(this.moveForwardButton);
            buttonsCont.appendChild(this.moveBackwardButton);
            buttonsCont.appendChild(this.deleteButton);
            container.appendChild(img);
            container.appendChild(buttonsCont);
        }
        else if (this.type == 'canvas') {
        }
        return container;
    }
    set Index(newIndex) {
        this.index = newIndex;
    }
    get Index() {
        return this.index;
    }
    get Src() {
        return this.src;
    }
    get Type() {
        return this.type;
    }
}
// ----------------------------------------------------------------------
class CardsContainer {
    constructor(element, type, initialCards) {
        this.possibleId = 0;
        this.places = [];
        this.cards = [];
        this.isVoid = false;
        this.isAdding = false;
        this.hasFailed = false;
        this.allInputs = [];
        this.element = element;
        this.containerType = type;
        if (initialCards.length == 0)
            this.createVoidHolder();
        initialCards.forEach(card => { this.addCard(card, type); });
        this.setEditConfig();
        this.saveButton.addEventListener('click', () => {
            if (this.cardEditing) {
                this.save();
            }
            else if (this.isAdding) {
                if (this.verify()) {
                    this.isAdding = false;
                    this.addCard(this.createCard(), this.containerType);
                    this.cancel();
                    switch (this.containerType) {
                        case 'education':
                            $('#ExpEduc-modal').modal('hide');
                            break;
                        case 'experiences':
                            $('#ExpEduc-modal').modal('hide');
                            break;
                        case 'HSkill':
                            $('#HSkill-modal').modal('hide');
                            break;
                        case 'SSkill':
                            $('#SSkill-modal').modal('hide');
                            break;
                    }
                }
                else {
                    this.hasFailed = true;
                    showAlert('danger', 'Rellene todas las entradas requeridas');
                }
            }
        });
        this.addButton.addEventListener('click', () => {
            this.isAdding = true;
            this.replaceValues(true);
        });
        sessionButtons.push(this.addButton);
        this.cancelButtons.forEach(button => button.addEventListener('click', () => { this.cancel(); }));
    }
    createVoidHolder() {
        this.addPlace();
        let text = createElement('H6', ['position-absolute', 'd-flex', 'w-100', 'h-100', 'top-0', 'start-0', 'justify-content-center', 'fw-bold', 'align-items-center'], undefined, this.places[0], undefined);
        text.innerText = 'No hay nada aquí';
        this.isVoid = true;
    }
    deleteVoidHolder() {
        this.element.removeChild(this.places[0]);
        this.places = [];
        this.isVoid = false;
    }
    cancel() {
        if (this.hasFailed) {
            this.hasFailed = false;
            hideAlert();
        }
        this.allInputs.forEach(input => input.classList.remove('bg-danger', 'bg-success'));
        this.cardEditing = null;
        this.isAdding = false;
    }
    setEditConfig() {
        if (this.containerType == 'education' || this.containerType == 'experiences') {
            const concept = document.getElementById('ExpEduc-concept');
            const institutionImageFile = document.getElementById('ExpEduc-institutionImg-file');
            const institutionImageLink = document.getElementById('ExpEduc-institutionImg-link');
            institutionImageFile.addEventListener('input', () => { institutionImageLink.value = URL.createObjectURL(institutionImageFile.files[0]); });
            const title = document.getElementById('ExpEduc-title');
            const institution = document.getElementById('ExpEduc-institution');
            const state = document.getElementById('ExpEduc-state');
            const start = document.getElementById('ExpEduc-start-date');
            const finish = document.getElementById('ExpEduc-finish-date');
            const general = document.getElementById('ExpEduc-general');
            this.allInputs = [concept, institutionImageFile, institutionImageLink, title, institution, state, start, finish, general];
            this.replaceValues = (toVoid) => {
                concept.value = (toVoid) ? '' : this.cardEditing.Concept;
                institutionImageLink.value = (toVoid) ? '' : this.cardEditing.InstitutionImage;
                title.value = (toVoid) ? '' : this.cardEditing.Title;
                institution.value = (toVoid) ? '' : this.cardEditing.Institution;
                state.value = (toVoid) ? '' : this.cardEditing.Date.type;
                start.value = (toVoid) ? '' : this.cardEditing.Date.start;
                finish.value = (toVoid) ? '' : this.cardEditing.Date.end;
                general.value = (toVoid) ? '' : this.cardEditing.General;
            };
            this.save = () => {
                if (this.verify()) {
                    this.cardEditing.Concept = concept.value;
                    this.cardEditing.InstitutionImage = institutionImageLink.value;
                    this.cardEditing.Title = title.value;
                    this.cardEditing.Institution = institution.value;
                    this.cardEditing.Date.type = state.value;
                    this.cardEditing.Date.start = start.value;
                    this.cardEditing.Date.end = finish.value;
                    this.cardEditing.General = general.value;
                    $('#ExpEduc-modal').modal('hide');
                    this.cardEditing.refreshContent();
                    this.cancel();
                }
                else {
                    this.hasFailed = true;
                    showAlert('danger', 'Rellene todas las entradas requeridas');
                }
            };
            this.required = {
                simple: [concept, title, institution, state],
                composed: [{
                        troggler: state,
                        cases: [
                            {
                                ifVlue: 'in progress',
                                required: [start]
                            },
                            {
                                ifVlue: 'completion only',
                                required: [finish]
                            },
                            {
                                ifVlue: 'finished',
                                required: [start, finish]
                            }
                        ]
                    }]
            };
            this.createCard = () => {
                return {
                    concept: concept.value,
                    institutionImage: institutionImageLink.value,
                    title: title.value,
                    institution: institution.value,
                    date: {
                        type: state.value,
                        start: start.value,
                        end: finish.value
                    },
                    general: general.value
                };
            };
            this.saveButton = document.getElementById('ExpEduc-edition-save');
            this.cancelButtons = document.querySelectorAll('.ExpEduc-edition-cancel');
            if (this.containerType == 'education')
                this.addButton = document.getElementById('add-card-education');
            else if (this.containerType == 'experiences')
                this.addButton = document.getElementById('add-card-experience');
        }
        else if (this.containerType == 'HSkill') {
            const name = document.getElementById('HSkill-name');
            const valueOverview = document.getElementById('HSkill-value-overview');
            const value = document.getElementById('HSkill-percent');
            value.addEventListener('input', () => {
                valueOverview.innerText = `${value.value}%`;
            });
            const bgType = document.querySelectorAll('.HSkill-bgType');
            const bgFile = document.querySelectorAll('.HSkill-bg-file');
            const bgLink = document.querySelectorAll('.HSkill-bg-link');
            bgType.forEach((node) => node.addEventListener('input', () => {
                bgType.forEach((otherNode) => { if (otherNode != node)
                    otherNode.value = node.value; });
            }));
            bgFile.forEach((node) => node.addEventListener('input', () => {
                bgFile.forEach((otherNode) => { if (otherNode != node)
                    otherNode.files = node.files; });
                bgLink.forEach((linkNode) => { linkNode.value = URL.createObjectURL(node.files[0]); });
            }));
            bgLink.forEach((node) => node.addEventListener('input', () => {
                bgLink.forEach((otherNode) => { if (otherNode != node)
                    otherNode.value = node.value; });
            }));
            const positiveContainer = document.getElementById('positive-points-container');
            let positivePoints = [document.getElementById('positive-point-0')];
            const getPositivePoints = () => {
                let points = [];
                positivePoints.forEach(point => points.push(point.querySelector('.point-name')));
                return points;
            };
            const addPositiveButton = document.getElementById('add-positive-point');
            const negativeContainer = document.getElementById('negative-points-container');
            let negativePoints = [document.getElementById('negative-point-0')];
            ;
            const getNegativePoints = () => {
                let points = [];
                negativePoints.forEach(point => points.push(point.querySelector('.point-name')));
                return points;
            };
            const addNegativeButton = document.getElementById('add-negative-point');
            let idAble = 0;
            const refreshRequired = () => {
                this.required = {
                    simple: [name, ...bgType, ...bgLink, ...getPositivePoints(), ...getNegativePoints()],
                    composed: undefined
                };
                this.allInputs = [name, ...bgType, ...bgLink, ...getPositivePoints(), ...getNegativePoints()];
            };
            refreshRequired();
            function addPositive(value) {
                let deleter = createElement('I', ['fa-solid', 'fa-xmark', 'btn', 'p-0', 'positive-deleter', 'border-0'], [{ att: 'style', value: 'font-size: .75em;' }, { att: 'bindedInput', value: `positive-point-${idAble}` }, { att: 'title', value: 'Eliminar' }], undefined, undefined);
                addDeleterListener('positive', deleter);
                let _deleter = createElement('DIV', ['input-group-text'], undefined, undefined, [deleter]);
                let input = createElement('INPUT', ['form-control', 'form-control-sm', 'point-name'], [{ att: 'type', value: 'text' }, { att: 'aria-label', value: 'type a positive point' }], undefined, undefined);
                let point = createElement('DIV', ['input-group', 'input-group-sm', 'mb-1'], [{ att: 'id', value: `positive-point-${idAble}` }], undefined, [input, _deleter]);
                positiveContainer.appendChild(point);
                positivePoints.push(point);
                idAble++;
                if (positivePoints.length == 1)
                    positivePoints[0].querySelector('.positive-deleter').classList.add('disabled');
                else if (positivePoints.length > 1)
                    positivePoints[0].querySelector('.positive-deleter').classList.remove('disabled');
                if (value)
                    input.value = value;
                refreshRequired();
            }
            function addNegative(value) {
                let deleter = createElement('I', ['fa-solid', 'fa-xmark', 'btn', 'p-0', 'negative-deleter', 'border-0'], [{ att: 'style', value: 'font-size: .75em;' }, { att: 'bindedInput', value: `negative-point-${idAble}` }, { att: 'title', value: 'Eliminar' }], undefined, undefined);
                addDeleterListener('negative', deleter);
                let _deleter = createElement('DIV', ['input-group-text'], undefined, undefined, [deleter]);
                let input = createElement('INPUT', ['form-control', 'form-control-sm', 'point-name'], [{ att: 'type', value: 'text' }, { att: 'aria-label', value: 'type a negative point' }], undefined, undefined);
                let point = createElement('DIV', ['input-group', 'input-group-sm', 'mb-1'], [{ att: 'id', value: `negative-point-${idAble}` }], undefined, [input, _deleter]);
                negativeContainer.appendChild(point);
                negativePoints.push(point);
                idAble++;
                if (negativePoints.length == 1)
                    negativePoints[0].querySelector('.negative-deleter').classList.add('disabled');
                else if (negativePoints.length > 1)
                    negativePoints[0].querySelector('.negative-deleter').classList.remove('disabled');
                if (value)
                    input.value = value;
                refreshRequired();
            }
            addPositiveButton.addEventListener('click', (e) => {
                e.preventDefault();
                addPositive(undefined);
            });
            addNegativeButton.addEventListener('click', (e) => {
                e.preventDefault();
                addNegative(undefined);
            });
            function addDeleterListener(type, button) {
                button.addEventListener('click', () => {
                    if (!button.classList.contains('disabled')) {
                        switch (type) {
                            case 'positive':
                                let pointToRemove0 = positivePoints.find(point => point.id == button.getAttribute('bindedInput'));
                                positivePoints = positivePoints.filter(input => input != pointToRemove0);
                                positiveContainer.removeChild(pointToRemove0);
                                if (positivePoints.length == 1)
                                    positivePoints[0].querySelector('.positive-deleter').classList.add('disabled');
                                break;
                            case 'negative':
                                let pointToRemove1 = negativePoints.find(point => point.id == button.getAttribute('bindedInput'));
                                negativePoints = negativePoints.filter(input => input != pointToRemove1);
                                negativeContainer.removeChild(pointToRemove1);
                                if (negativePoints.length == 1)
                                    negativePoints[0].querySelector('.negative-deleter').classList.add('disabled');
                                break;
                        }
                        refreshRequired();
                    }
                });
            }
            const getValues = (from) => {
                let values = [];
                from.forEach(point => values.push(point.value));
                return values;
            };
            this.save = () => {
                if (this.verify()) {
                    this.cardEditing.Name = name.value;
                    this.cardEditing.Value = parseInt(value.value);
                    this.cardEditing.Points = {
                        positives: getValues(getPositivePoints()),
                        negatives: getValues(getNegativePoints())
                    };
                    this.cardEditing.Background = {
                        type: bgType[0].value,
                        animation: false,
                        src: bgLink[0].value
                    };
                    $('#HSkill-modal').modal('hide');
                    this.cardEditing.refreshContent();
                    this.cancel();
                }
                else {
                    this.hasFailed = true;
                    showAlert('danger', 'Rellene todas las entradas requeridas');
                }
            };
            this.replaceValues = (toVoid) => {
                positiveContainer.innerHTML = '';
                negativeContainer.innerHTML = '';
                positivePoints = [];
                negativePoints = [];
                if (!toVoid) {
                    for (let point of this.cardEditing.Points.positives) {
                        addPositive(point);
                    }
                    ;
                    for (let point of this.cardEditing.Points.negatives) {
                        addNegative(point);
                    }
                    ;
                }
                else {
                    addPositive(undefined);
                    addNegative(undefined);
                }
                value.value = (toVoid) ? '50' : this.cardEditing.Value.toString();
                valueOverview.innerText = (toVoid) ? '50%' : value.value + '%';
                name.value = (toVoid) ? '' : this.cardEditing.Name;
                bgType.forEach(input => input.value = (toVoid) ? '' : this.cardEditing.Background.type);
                bgLink.forEach(input => input.value = (toVoid) ? '' : this.cardEditing.Background.src);
            };
            this.createCard = () => {
                return {
                    name: name.value,
                    value: parseInt(value.value),
                    points: {
                        positives: getValues(getPositivePoints()),
                        negatives: getValues(getNegativePoints())
                    },
                    background: {
                        type: bgType[0].value,
                        animation: false,
                        src: bgLink[0].value
                    }
                };
            };
            this.saveButton = document.getElementById('HSkill-save');
            this.cancelButtons = document.querySelectorAll('.HSkill-cancel');
            this.addButton = document.getElementById('add-card-hskill');
        }
        else if (this.containerType == 'SSkill') {
            const name = document.getElementById('SSkill-name');
            const description = document.getElementById('SSkill-general');
            const subContainer = document.getElementById('SSkill-sub-skills');
            const subSkillAdder = document.getElementById('addSubSkill');
            subSkillAdder.addEventListener('click', (e) => {
                e.preventDefault();
                addSubSkill(undefined);
            });
            let idAble = 0;
            let allSubSkills = [];
            const allSubSkillsValues = () => {
                let subSkills = [];
                allSubSkills.forEach(subSkill => subSkills.push({
                    name: subSkill.querySelector('.sub-skill-name').value,
                    value: parseInt(subSkill.querySelector('.sub-skill-value').value)
                }));
                return subSkills;
            };
            const refreshRequired = () => {
                this.required = {
                    simple: [name, description, ...subContainer.querySelectorAll('.sub-skill-name'), ...subContainer.querySelectorAll('sub-skill-value')],
                    composed: undefined
                };
                this.allInputs = [name, description, ...subContainer.querySelectorAll('.sub-skill-name'), ...subContainer.querySelectorAll('sub-skill-value')];
            };
            function addSubSkill(initValue) {
                let value = createElement('INPUT', ['form-range', 'sub-skill-value'], [{ att: 'type', value: 'range' }, { att: 'min', value: '0' }, { att: 'max', value: '100' }, { att: 'id', value: `sub-skill-percent-${idAble}` }], undefined, undefined);
                let _value = createElement('DIV', ['d-flex', 'align-items-center', 'p-0', 'px-2', 'input-group-item', 'border', 'bg-white'], [{ att: 'style', value: 'flex-grow: 1;' }], undefined, [value]);
                let valueOverview = createElement('SPAN', ['input-group-text', 'p-0', 'px-2'], undefined, undefined, undefined);
                value.addEventListener('input', () => { valueOverview.innerText = `${value.value}%`; });
                let deleter = createElement('I', ['fa-solid', 'fa-xmark'], [{ att: 'title', value: 'Eliminar sub-skill' }], undefined, undefined);
                let _deleter = createElement('BUTTON', ['btn', 'border', 'p-0', 'px-2', 'text-muted', 'bg-white', 'deleter'], [{ att: 'type', value: 'button' }, { att: 'id', value: `sub-skill-deleter-${idAble}` }], undefined, [deleter]);
                _deleter.addEventListener('click', () => {
                    subContainer.removeChild(subSkill);
                    allSubSkills = allSubSkills.filter(sskill => sskill != subSkill);
                    if (allSubSkills.length == 1)
                        allSubSkills[0].querySelector('.deleter').classList.add('disabled');
                    refreshRequired();
                });
                let subSkillBody = createElement('DIV', ['input-group', 'mb-2'], [{ att: 'style', value: 'font-size: 1em; height: 31px;' }], undefined, [valueOverview, _value, _deleter]);
                let label1 = createElement('LABEL', ['form-label', 'mb-1'], [{ att: 'for', value: `sub-skill-percent-${idAble}` }], undefined, undefined);
                label1.innerHTML = 'Porcentaje de <i>sub-skill</i>:';
                let _subSkillBody = createElement('DIV', ['col-sm-8'], undefined, undefined, [label1, subSkillBody]);
                let name = createElement('INPUT', ['form-control', 'form-control-sm', 'sub-skill-name'], [{ att: 'type', value: 'text' }, { att: 'id', value: `sub-skill-name-${idAble}` }], undefined, undefined);
                let label0 = createElement('LABEL', ['mb-1', 'form-label'], [{ att: 'for', value: `sub-skill-name-${idAble}` }], undefined, undefined);
                label0.innerHTML = 'Nombre de <i>sub-skill</i>:';
                let subSkillHead = createElement('DIV', ['col-sm-4'], undefined, undefined, [label0, name]);
                let subSkill = createElement('DIV', ['m-2', 'row', 'g-2', 'rounded', 'bg-light', 'shadow-sm'], [{ att: 'id', value: `sub-skill-${idAble}` }, { att: 'style', value: 'font-size: .74em;' }], undefined, [subSkillHead, _subSkillBody]);
                idAble++;
                if (initValue) {
                    value.value = initValue.value.toString();
                    name.value = initValue.name;
                }
                valueOverview.innerText = `${value.value}%`;
                allSubSkills.push(subSkill);
                subContainer.appendChild(subSkill);
                if (allSubSkills.length == 1)
                    _deleter.classList.add('disabled');
                else if (allSubSkills.length > 1)
                    allSubSkills[0].querySelector('.deleter').classList.remove('disabled');
                refreshRequired();
            }
            this.save = () => {
                if (this.verify()) {
                    this.cardEditing.Name = name.value;
                    this.cardEditing.Description = description.value;
                    this.cardEditing.SubSkills = allSubSkillsValues();
                    $('#SSkill-modal').modal('hide');
                    this.cardEditing.refreshContent();
                    this.cancel();
                }
                else {
                    this.hasFailed = true;
                    showAlert('danger', 'Rellene todas las entradas requeridas');
                }
            };
            this.createCard = () => {
                return {
                    name: name.value,
                    description: description.value,
                    subSkills: allSubSkillsValues()
                };
            };
            this.replaceValues = (toVoid) => {
                name.value = (toVoid) ? '' : this.cardEditing.Name;
                description.value = (toVoid) ? '' : this.cardEditing.Description;
                subContainer.innerHTML = '';
                allSubSkills = [];
                if (toVoid)
                    addSubSkill(undefined);
                else
                    this.cardEditing.SubSkills.forEach(subSkill => addSubSkill(subSkill));
            };
            this.saveButton = document.getElementById('SSkill-save');
            this.cancelButtons = document.querySelectorAll('.SSkill-cancel');
            this.addButton = document.getElementById('add-card-sskill');
        }
    }
    verify() {
        var _a;
        let response = true;
        let valid = [];
        let invalid = [];
        this.required.simple.forEach(requirement => {
            if (!requirement.value) {
                response = false;
                invalid.push(requirement);
            }
            else
                valid.push(requirement);
        });
        (_a = this.required.composed) === null || _a === void 0 ? void 0 : _a.forEach(requirement => {
            let reqs = requirement.cases.find(case_ => case_.ifVlue == requirement.troggler.value);
            reqs === null || reqs === void 0 ? void 0 : reqs.required.forEach(required => {
                if (!required.value) {
                    response = false;
                    invalid.push(required);
                }
                else
                    valid.push(required);
            });
        });
        this.allInputs.forEach(input => input.classList.remove('bg-danger', 'bg-success'));
        if (!response) {
            valid.forEach(input => { input.classList.add('bg-opacity-25', 'bg-success'); });
            invalid.forEach(input => { input.classList.add('bg-opacity-25', 'bg-danger'); });
        }
        return response;
    }
    addPlace() {
        let newPlace = document.createElement('DIV');
        newPlace.id = this.places.length.toString();
        switch (this.containerType) {
            case 'education':
                newPlace.classList.add('col', 'card', 'my-2', 'p-0', 'shadow-sm', 'bg-dark-subtle', 'overflow-hidden', 'position-relative');
                newPlace.style.minHeight = '300px';
                newPlace.style.maxHeight = 'fit-content';
                break;
            case 'experiences':
                newPlace.classList.add('col', 'card', 'my-2', 'p-0', 'shadow-sm', 'bg-dark-subtle', 'overflow-hidden', 'position-relative');
                newPlace.style.minHeight = '300px';
                newPlace.style.maxHeight = 'fit-content';
                break;
            case 'HSkill':
                newPlace.classList.add('row', 'row-cols-1', 'py-3', 'px-sm-4', 'position-relative');
                newPlace.style.paddingLeft = '0.75rem';
                newPlace.style.paddingRight = '0.75rem';
                break;
            case 'SSkill':
                newPlace.classList.add('col', 'px-sm-4', 'position-relative');
                newPlace.style.paddingLeft = '0.75rem';
                newPlace.style.paddingRight = '0.75rem';
                break;
            case 'projects':
                newPlace.classList.add('col', 'p-sm-4', 'position-relative');
                break;
        }
        let cont = this;
        newPlace.addEventListener('dragstart', function (e) {
            let currentIndex = parseInt(newPlace.id);
            let draggingCard = cont.cards[currentIndex];
            cont.places.forEach(place => {
                $(place).on('dragover', function (e) { e.preventDefault(); });
                $(place).on('dragenter', function (e) {
                    let placeIndex = parseInt(e.delegateTarget.id);
                    draggingCard.Index = undefined;
                    let cardsToMove = cont.cards.filter(card => Math.min(currentIndex, placeIndex) <= card.Index && Math.max(currentIndex, placeIndex) >= card.Index);
                    (currentIndex < placeIndex) ? cardsToMove.forEach(card => card.move('forward', false)) : cardsToMove.forEach(card => card.move('backward', false));
                    currentIndex = placeIndex;
                    draggingCard.Index = placeIndex;
                    cont.refresh();
                });
            });
        });
        newPlace.addEventListener('dragend', function () {
            cont.places.forEach(place => {
                $(place).off('dragover');
                $(place).off('dragenter');
            });
        });
        if (inSession)
            newPlace.setAttribute('draggable', 'true');
        allPlaces.push(newPlace);
        this.places.push(newPlace);
        this.element.appendChild(newPlace);
    }
    rewritePlacesId() {
        for (let i in this.places) {
            this.places[i].id = i;
        }
    }
    addCard(card, type) {
        if (type == this.containerType) {
            if (this.isVoid)
                this.deleteVoidHolder();
            this.addPlace();
            switch (type) {
                case 'education':
                    this.cards.push(new ExpEduc(card, this, this.possibleId));
                    break;
                case 'experiences':
                    this.cards.push(new ExpEduc(card, this, this.possibleId));
                    break;
                case 'HSkill':
                    this.cards.push(new HSkill(card, this, this.possibleId));
                    break;
                case 'SSkill':
                    this.cards.push(new SSkill(card, this, this.possibleId));
                    break;
                case 'projects':
                    this.cards.push(new Project(card, this, this.possibleId));
            }
            this.refresh();
            this.possibleId++;
        }
    }
    refresh() {
        this.cards.sort((a, b) => { return a.Index - b.Index; });
        for (let i in this.cards) {
            if (!this.cards[i].Dragging) {
                this.cards[i].Element.forEach(node => { this.places[i].appendChild(node); });
            }
        }
    }
    complementMovement(from, dir) {
        this.cards.find(card => (card.Index == from.Index && card != from)).move(dir, false);
        this.refresh();
    }
    get ContainerType() {
        return this.containerType;
    }
    get CardQuantity() {
        return this.cards.length;
    }
    get Element() {
        return this.element;
    }
    get Places() {
        return this.places;
    }
    set Places(newPlaces) {
        this.places = newPlaces;
    }
    get Cards() {
        return this.cards;
    }
    set Cards(newCards) {
        this.cards = newCards;
    }
    set CardEditing(newCard) {
        this.cardEditing = newCard;
    }
}
class Card {
    constructor(container, type, id) {
        this.dragging = false;
        this.editButton = document.createElement('BUTTON');
        this.deleteButton = document.createElement('BUTTON');
        this.moveForwardButton = document.createElement('BUTTON');
        this.moveBackwardButton = document.createElement('BUTTON');
        this.buttonsArr = [this.moveForwardButton, this.moveBackwardButton, this.editButton, this.deleteButton];
        this.buttonsContainer = document.createElement('DIV');
        this.element = [];
        this.container = container;
        this.id = id;
        this.type = type;
        this.index = container.CardQuantity;
        this.buttonsArr.forEach(button => {
            button.setAttribute('type', 'button');
            if (button !== this.deleteButton)
                button.classList.add('btn', 'text-warning');
            let i = document.createElement('I');
            i.classList.add('fa-solid');
            switch (button) {
                case this.editButton:
                    button.title = 'Editar';
                    button.setAttribute('data-bs-toggle', 'modal');
                    button.setAttribute('data-bs-target', `#${type}-modal`);
                    button.addEventListener('click', () => { this.edit(); });
                    i.classList.add('fa-pen-to-square');
                    break;
                case this.deleteButton:
                    button.title = 'Eliminar';
                    button.addEventListener('click', () => { this.deleteSelf(); });
                    button.classList.add('btn', 'text-danger');
                    i.classList.add('fa-circle-xmark');
                    break;
                case this.moveForwardButton:
                    button.title = 'Mover arriba';
                    button.addEventListener('click', () => { this.move('forward', true); });
                    i.classList.add('fa-circle-chevron-up');
                    break;
                case this.moveBackwardButton:
                    button.title = 'Mover abajo';
                    button.addEventListener('click', () => { this.move('backward', true); });
                    i.classList.add('fa-circle-chevron-down');
                    break;
            }
            button.appendChild(i);
        });
        if (type != 'HSkill') {
            this.buttonsContainer.classList.add('card-header', 'bg-white', 'position-relative', 'p-0');
            this.buttonsContainer.style.zIndex = '1';
            let d = document.createElement('DIV');
            d.classList.add('d-flex', 'justify-content-end');
            this.buttonsArr.forEach(button => { d.appendChild(button); });
            this.buttonsContainer.appendChild(d);
            sessionButtons.push(this.buttonsContainer);
        }
        else {
            this.buttonsContainer.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle', 'd-flex', 'bg-secondary', 'bg-opacity-50', 'rounded');
            this.buttonsArr.forEach(button => { this.buttonsContainer.appendChild(button); });
            sessionButtons.push(this.buttonsContainer);
        }
        if (!inSession)
            this.buttonsContainer.classList.add('d-none');
    }
    edit() {
        this.container.CardEditing = this;
        this.container.replaceValues(false);
    }
    move(dir, needComplement) {
        if (dir == 'forward' && this.index > 0) {
            this.index--;
            if (needComplement)
                this.container.complementMovement(this, 'backward');
        }
        else if (dir == 'backward' && this.index < (this.container.CardQuantity - 1)) {
            this.index++;
            if (needComplement)
                this.container.complementMovement(this, 'forward');
        }
    }
    deleteSelf() {
        this.container.Cards = this.container.Cards.filter(card => card != this);
        let placeToRemove = this.container.Places.find(place => place.id == this.index.toString());
        this.container.Element.removeChild(placeToRemove);
        this.container.Places = this.container.Places.filter(place => place != placeToRemove);
        this.container.rewritePlacesId();
        for (let i in this.container.Cards) {
            this.container.Cards[i].Index = parseInt(i);
        }
        this.container.refresh();
        if (this.container.Cards.length == 0 && this.container.Places.length == 0)
            this.container.createVoidHolder();
    }
    get Element() {
        return this.element;
    }
    get Dragging() {
        return this.dragging;
    }
    get Index() {
        return this.index;
    }
    set Index(newIndex) {
        this.index = newIndex;
    }
}
class ExpEduc extends Card {
    constructor(object, container, id) {
        super(container, 'ExpEduc', id);
        this.dateDescription = () => {
            if (this.date.type == 'in progress' || this.date.type == 'finished')
                return 'Período';
            else if (this.date.type == 'completion only')
                return 'Fecha de finalización';
        };
        this.bg_img = createElement('IMG', ['opacity-25', 'ratio', 'ratio-1x1', 'w-auto', 'h-100'], undefined, undefined, undefined);
        this.body_head_img = createElement('IMG', ['h-100', 'w-100'], [{ att: 'style', value: 'object-fit: contain;' }], undefined, undefined);
        this.body_headConcept = createElement('H3', ['card-title', 'd-inline-block', 'm-0', 'text-end'], undefined, undefined, undefined);
        this.bodyTitle = createElement('P', ['card-text', 'm-0', 'lh-sm'], undefined, undefined, undefined);
        this.bodyInstitution = createElement('P', ['card-text', 'm-0', 'lh-sm'], undefined, undefined, undefined);
        this.bodyDate = createElement('P', ['card-text', 'm-0', 'lh-sm'], undefined, undefined, undefined);
        this.bodyGeneral = createElement('P', ['card-text', 'm-0', 'lh-sm'], undefined, undefined, undefined);
        this.concept = object.concept;
        this.institutionImage = object.institutionImage;
        this.title = object.title;
        this.institution = object.institution;
        this.date = object.date;
        this.general = object.general;
        this.createElement();
    }
    generateUTCDate(date) {
        let response = '';
        response += date.getUTCDate() + '/';
        let month = date.getUTCMonth() + 1;
        if (month < 10)
            month = '0' + month.toString();
        response += month + '/' + date.getUTCFullYear();
        return response;
    }
    createDate() {
        switch (this.date.type) {
            case 'in progress':
                let start1 = new Date(this.date.start);
                return `${this.generateUTCDate(start1)} - No Finalizado (en curso)`;
            case 'completion only':
                let end1 = new Date(this.date.end);
                return this.generateUTCDate(end1);
            default:
                let start2 = new Date(this.date.start);
                let end2 = new Date(this.date.end);
                return this.generateUTCDate(start2) + ' - ' + this.generateUTCDate(end2);
        }
    }
    selectBackground() {
        if (this.container.ContainerType == 'education') {
            if (this.date.type == 'in progress')
                return 'imgs/papel.png';
            else
                return 'imgs/diploma.png';
        }
        else if (this.container.ContainerType == 'experiences')
            return 'imgs/computadora.png';
        else
            return '/';
    }
    determinateExtraInfo() {
        if (this.general)
            return `<span class="text-muted">${this.general}</span>`;
        else
            return '';
    }
    refreshContent() {
        this.bg_img.src = this.selectBackground();
        this.body_head_img.src = this.institutionImage;
        this.body_headConcept.innerText = this.concept;
        this.bodyTitle.innerHTML = `Titulo: <span class="text-muted">${this.title}</span>`;
        this.bodyInstitution.innerHTML = `Institución: <span class="text-muted">${this.institution}</span>`;
        this.bodyDate.innerHTML = `${this.dateDescription()}: <span class="text-muted">${this.createDate()}</span>`;
        this.bodyGeneral.innerHTML = this.determinateExtraInfo();
    }
    createElement() {
        this.element.push(this.buttonsContainer);
        let bg_ = createElement('DIV', ['h-100', 'w-auto', 'd-none', 'd-sm-flex', 'align-items-center', 'flex-row-reverse'], undefined, undefined, [this.bg_img]);
        let bg = createElement('DIV', ['card-img', 'h-100', 'w-100', 'p-4', 'position-absolute'], undefined, undefined, [bg_]);
        this.element.push(bg);
        let body_head_ = createElement('DIV', undefined, [{ att: 'style', value: 'width: 80px; height: 40px;' }], undefined, [this.body_head_img]);
        let body_head = createElement('DIV', ['container-fluid', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0'], undefined, undefined, [body_head_, this.body_headConcept]);
        let bodyHr1 = createElement('HR', ['px-2', 'my-2', 'd-block'], undefined, undefined, undefined);
        let bodyHr2 = createElement('HR', ['px-2', 'my-2', 'd-block'], undefined, undefined, undefined);
        let body_ = createElement('DIV', ['col', 'card-body', 'text-start', 'd-flex', 'flex-column', 'justify-content-evenly', 'h-100', 'py-0', 'px-4'], undefined, undefined, [body_head, bodyHr1, this.bodyTitle, this.bodyInstitution, bodyHr2, this.bodyDate, this.bodyGeneral]);
        let body = createElement('DIV', ['row', 'h-100', 'position-relative'], [{ att: 'style', value: 'z-index: 1;' }], undefined, [body_]);
        this.refreshContent();
        this.element.push(body);
    }
    set Concept(newConcept) {
        this.concept = newConcept;
    }
    get Concept() {
        return this.concept;
    }
    set InstitutionImage(newImg) {
        this.institutionImage = newImg;
    }
    get InstitutionImage() {
        return this.institutionImage;
    }
    set Title(newTitle) {
        this.title = newTitle;
    }
    get Title() {
        return this.title;
    }
    set Institution(newInstitution) {
        this.institution = newInstitution;
    }
    get Institution() {
        return this.institution;
    }
    set Date(newDate) {
        this.date = newDate;
    }
    get Date() {
        return this.date;
    }
    set General(newGeneral) {
        this.general = newGeneral;
    }
    get General() {
        return this.general;
    }
}
class HSkill extends Card {
    constructor(object, container, id) {
        super(container, 'HSkill', id);
        this.nameContainer = createElement('H4', ['invisible', 'position-absolute'], [{ att: 'style', value: 'z-index: 0;' }], undefined, undefined);
        this.positiveP = createElement('P', ['m-0'], [{ att: 'style', value: 'color: #555;' }], undefined, undefined);
        this.negativeP = createElement('P', ['m-0', 'mt-3', 'mt-md-0'], [{ att: 'style', value: 'color: #555;' }], undefined, undefined);
        this.bgContainer = createElement('DIV', ['position-absolute', 'h-100', 'w-100', 'top-0', 'start-0'], undefined, undefined, undefined);
        this.valuePositive = createElement('DIV', ['progress-bar', 'bg-success', 'position-relative', 'opacity-25'], [{ att: 'role', value: 'progressbar' }, { att: 'aria-label', value: 'positive' }, { att: 'style', value: 'width: 75%; z-index: 1;' }, { att: 'aria-valuenow', value: '75' }, { att: 'aria-valuemin', value: '0' }, { att: 'aria-valuemax', value: '100' }], undefined, undefined);
        this.valueNegative = createElement('DIV', ['progress-bar', 'bg-danger', 'position-relative', 'opacity-25'], [{ att: 'role', value: 'progressbar' }, { att: 'aria-label', value: 'negative' }, { att: 'style', value: 'width: 25%; z-index: 1;' }, { att: 'aria-valuenow', value: '25' }, { att: 'aria-valuemin', value: '0' }, { att: 'aria-valuemax', value: '100' }], undefined, undefined);
        this.name = object.name;
        this.value = object.value;
        this.points = object.points;
        this.background = object.background;
        this.createElement();
        this.refreshContent();
    }
    createElement() {
        let cardBG = createElement('DIV', ['progress', 'position-absolute', 'h-100', 'w-100', 'shadow-sm', 'border'], undefined, undefined, [this.bgContainer, this.valuePositive, this.valueNegative]);
        let cardBody_positivesContainer = createElement('DIV', ['col-12', 'col-md-6', 'text-start'], undefined, undefined, [this.positiveP]);
        let cardBody_negativesContainer = createElement('DIV', ['col-12', 'col-md-6', 'text-end'], undefined, undefined, [this.negativeP]);
        let cardBody_ = createElement('DIV', ['row'], undefined, undefined, [cardBody_positivesContainer, cardBody_negativesContainer]);
        let cardBody = createElement('DIV', ['container-fluid', 'position-relative', 'top-0', 'start-0', 'p-3'], [{ att: 'style', value: 'z-index: 2;' }], undefined, [this.nameContainer, cardBody_, this.buttonsContainer]);
        let card = createElement('DIV', ['col', 'position-relative', 'p-0'], undefined, undefined, [cardBG, cardBody]);
        this.element.push(card);
    }
    refreshContent() {
        this.nameContainer.innerText = this.name;
        this.valuePositive.setAttribute('aria-valuenow', this.value.toString());
        this.valuePositive.style.width = `${this.value}%`;
        this.valueNegative.setAttribute('aria-valuenow', (100 - this.value).toString());
        this.valueNegative.style.width = `${100 - this.value}%`;
        this.bgContainer.innerHTML = `<img class="h-100 w-100" src="${this.background.src}" alt="${this.name} - Hard Skill Background" style="object-fit: cover;">`;
        this.positiveP.innerHTML = '';
        this.negativeP.innerHTML = '';
        this.points.positives.forEach(point => this.positiveP.innerHTML += `<i class="fa-solid fa-check text-success"></i> ${point}<br>`);
        this.points.negatives.forEach(point => this.negativeP.innerHTML += `${point} <i class="fa-solid fa-xmark text-danger"></i><br>`);
    }
    set Name(newName) {
        this.name = newName;
    }
    get Name() {
        return this.name;
    }
    set Value(newValue) {
        this.value = newValue;
    }
    get Value() {
        return this.value;
    }
    set Points(newPoints) {
        this.points = newPoints;
    }
    get Points() {
        return this.points;
    }
    set Background(newBackground) {
        this.background = newBackground;
    }
    get Background() {
        return this.background;
    }
}
class SSkill extends Card {
    constructor(object, container, id) {
        super(container, 'SSkill', id);
        this.nameContainer = createElement('H4', ['d-inline-block', 'fs-5', 'me-3', 'mb-0'], undefined, undefined, undefined);
        this.value = createElement('DIV', ['progress-bar'], [{ att: 'role', value: 'progressbar' }, { att: 'style', value: 'width: 0%;' }, { att: 'aria-valuenow', value: '0' }, { att: 'aria-valuemin', value: '0' }, { att: 'aria-valuemax', value: '100' }], undefined, undefined);
        this.subSkillsContainter = createElement('DIV', ['accordion-body', 'pt-0'], undefined, undefined, undefined);
        this.descriptionContainer = createElement('P', undefined, [{ att: 'style', value: 'font-size: .85em;' }], undefined, undefined);
        this.name = object.name;
        this.description = object.description;
        this.subSkills = object.subSkills;
        this.createElement();
        this.refreshContent();
    }
    createElement() {
        let _value = createElement('DIV', ['progress'], [{ att: 'style', value: 'flex-grow: 1;' }], undefined, [this.value]);
        let head = createElement('LI', ['list-group-item', 'd-flex', 'align-items-center'], [{ att: 'style', value: 'flex-grow: 0;' }], undefined, [this.nameContainer, _value]);
        let _subSkillContainer = createElement('DIV', ['accordion-collapse', 'collapse'], [{ att: 'id', value: `collapse-${this.id}` }], undefined, [this.subSkillsContainter]);
        let _subSkillButton = createElement('BUTTON', ['accordion-button', 'collapsed', 'p-0', 'm-0', 'w-100', 'h1', 'bg-white', 'shadow-none'], [{ att: 'type', value: 'button' }, { att: 'data-bs-toggle', value: 'collapse' }, { att: 'data-bs-target', value: `#collapse-${this.id}` }, { att: 'aria-expanded', value: 'false' }, { att: 'aria-controls', value: `collapse-${this.id}` }], undefined, undefined);
        let __subSkillContainer = createElement('DIV', ['accordion-item'], undefined, undefined, [_subSkillButton, _subSkillContainer]);
        let ___subSkillContainer = createElement('LI', ['list-group-item', 'accordion', 'accordion-flush', 'p-0'], [{ att: 'style', value: 'flex-grow: 0;' }], undefined, [__subSkillContainer]);
        let _description = createElement('LI', ['list-group-item', 'text-muted'], [{ att: 'style', value: 'flex-grow: 1;' }], undefined, [this.descriptionContainer]);
        let body = createElement('UL', ['list-group', 'list-group-flush', 'd-flex', 'flex-column', 'h-100'], undefined, undefined, [head, ___subSkillContainer, _description]);
        let card = createElement('DIV', ['card', 'h-100', 'overflow-hidden', 'shadow-sm'], undefined, undefined, [this.buttonsContainer, body]);
        this.element.push(card);
    }
    refreshContent() {
        this.nameContainer.innerText = this.name;
        let valueSum = 0;
        this.subSkillsContainter.innerHTML = '';
        this.subSkills.forEach(skill => {
            valueSum += skill.value;
            let value = createElement('DIV', ['progress-bar'], [{ att: 'role', value: 'progressbar' }, { att: 'style', value: `width: ${skill.value}%;` }, { att: 'aria-valuenow', value: `${skill.value}` }, { att: 'aria-valuemin', value: '0' }, { att: 'aria-valuemax', value: '100' }], undefined, undefined);
            let _value = createElement('DIV', ['progress'], [{ att: 'style', value: 'flex-grow: 1; height: 1px;' }], undefined, [value]);
            let name = createElement('H5', ['d-inline-block', 'fs-6', 'm-0', 'me-3'], undefined, undefined, undefined);
            name.innerText = skill.name;
            let valueOverview = createElement('P', ['d-inline-block', 'fs-6', 'm-0', 'ms-3'], undefined, undefined, undefined);
            valueOverview.innerText = `${skill.value}%`;
            let container = createElement('DIV', ['d-flex', 'align-items-center'], undefined, this.subSkillsContainter, [name, _value, valueOverview]);
        });
        let valueMid = Math.trunc(valueSum / this.subSkills.length);
        this.value.style.width = `${valueMid}%`;
        this.value.setAttribute('aria-valuenow', valueMid.toString());
        this.value.innerText = `${valueMid}%`;
        this.descriptionContainer.innerHTML = this.description;
    }
    get Name() {
        return this.name;
    }
    set Name(newName) {
        this.name = newName;
    }
    get Description() {
        return this.description;
    }
    set Description(newDescription) {
        this.description = newDescription;
    }
    get SubSkills() {
        return this.subSkills;
    }
    set SubSkills(newSubSkills) {
        this.subSkills = newSubSkills;
    }
}
class Project extends Card {
    constructor(object, container, id) {
        super(container, 'Project', id);
        this.name = object.name;
        this.description = object.description;
        this.date = object.date;
        this.images = object.images;
    }
}
let ownerInfo;
let educationSection;
let experiencesSection;
let HSkillSection;
let SSkillSection;
let ProjectsSection;
fetch('https://raw.githubusercontent.com/AlanDuh/portfolio-FrontEnd/main/DOMElements.json')
    .then(response => response.json())
    .then(data => {
    ownerInfo = new OwnerInfo(data.ownerInfo);
    educationSection = new CardsContainer(document.getElementById('eduactionSectionContainer'), 'education', data.education);
    experiencesSection = new CardsContainer(document.getElementById('experiencesSectionContainer'), 'experiences', data.experiences);
    HSkillSection = new CardsContainer(document.getElementById('HSkillsSectionContainer'), 'HSkill', data.skills.hard);
    SSkillSection = new CardsContainer(document.getElementById('SSkillsSectionContainer'), 'SSkill', data.skills.soft);
    ProjectsSection = new CardsContainer(document.getElementById('projectsSectionContainer'), 'projects', data.projects);
});
