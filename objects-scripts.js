"use strict";
let sessionButtons = [];
let allPlaces = [];
const adminAccount = {
    name: 'A D',
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
                    $('#ExpEduc-modal').modal('hide');
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
            this.buttonsContainer.classList.add('card-header', 'bg-white', 'position-relative');
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
        this.name = object.name;
        this.value = object.value;
        this.points = object.points;
        this.background = object.background;
    }
}
class SSkill extends Card {
    constructor(object, container, id) {
        super(container, 'SSkill', id);
        this.name = object.name;
        this.description = object.description;
        this.subSkills = object.subSkills;
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
