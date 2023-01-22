"use strict";
let sessionButtons = [];
const adminAccount = {
    name: 'A D',
    pass: '12345'
};
const logInButton = document.getElementById('logIn-button');
const logInModalButtons = document.querySelectorAll('.logIn-modalButton');
const logOutButtons = document.querySelectorAll('.logOut-button');
logInButton.addEventListener('click', () => logIn());
logOutButtons.forEach((button) => {
    button.addEventListener('click', () => logOut());
    sessionButtons.push(button);
});
function logIn() {
    if (document.getElementById('logIn-name').value === adminAccount.name && document.getElementById('logIn-password').value === adminAccount.pass) {
        logInModalButtons.forEach((button) => button.classList.add('d-none'));
        sessionButtons.forEach(element => element.classList.remove('d-none'));
        $('#LogIn-modal').modal('hide');
    }
}
function logOut() {
    logInModalButtons.forEach((button) => button.classList.remove('d-none'));
    sessionButtons.forEach(element => element.classList.add('d-none'));
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
const info = new OwnerInfo({
    banner: [],
    photo: null,
    title: "Full Stack Developer Jr",
    description: "Mi nombre es Alan Duhalde, programador en formación, instruído bajo la tutoría ofrecida por el 'Argentina Programa', aún sin especialización, pero con capacidades de diseñar y programar FrontEnd, de manera como aquí se contempla."
});
// ----------------------------------------------------------------------
