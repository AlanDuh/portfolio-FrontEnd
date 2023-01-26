let sessionButtons:HTMLElement[] = [];
let allPlaces:HTMLElement[] = [];
const adminAccount:{name:string,pass:string} = {
    name: 'Alan',
    pass: '12345'
}
let inSession:boolean = false;
const logInButton:HTMLButtonElement = document.getElementById('logIn-button') as HTMLButtonElement;
const logInModalButtons:any = document.querySelectorAll('.logIn-modalButton');
const logOutButtons:any = document.querySelectorAll('.logOut-button');
const logInCancel:HTMLElement = document.getElementById('LogIn-cancel') as HTMLElement;
logInButton.addEventListener('click',()=>logIn());
logOutButtons.forEach((button:HTMLElement)=>{
    button.addEventListener('click',()=>logOut());
    sessionButtons.push(button);
});
logInCancel.addEventListener('click',()=>hideAlert());

function logIn()
{
    if ((document.getElementById('logIn-name') as HTMLInputElement).value === adminAccount.name && (document.getElementById('logIn-password') as HTMLInputElement).value === adminAccount.pass) {
        logInModalButtons.forEach((button:HTMLElement)=>button.classList.add('d-none'));
        sessionButtons.forEach(element=>element.classList.remove('d-none'));
        inSession = true;
        allPlaces.forEach(place=>place.setAttribute('draggable','true'));
        $('#LogIn-modal').modal('hide');
        $('#offcanvasNavbar2').offcanvas('hide');
        showAlert('success','Inicio de sesión exitoso');
    } else showAlert('danger','Usuario y/o contraseña inválidos');
}
function logOut()
{
    logInModalButtons.forEach((button:HTMLElement)=>button.classList.remove('d-none'));
    sessionButtons.forEach(element=>element.classList.add('d-none'));
    inSession = false;
    allPlaces.forEach(place=>place.setAttribute('draggable','false'));
    showAlert('warning','Se ha cerrado la sesión');
}

function createElement(type:string,classes:string[]|undefined,attributes:{att:string,value:string}[]|undefined,parent:HTMLElement|undefined,children:HTMLElement[]|undefined):HTMLElement|HTMLImageElement
{
    let newElement:HTMLElement|HTMLImageElement = document.createElement(type);
    if (classes) newElement.classList.add(...classes);
    if (attributes) attributes.forEach(attribute=>newElement.setAttribute(attribute.att,attribute.value));
    if (parent) parent.appendChild(newElement);
    if (children) children.forEach(child=>newElement.appendChild(child));
    return newElement;
}

const body:HTMLElement = document.querySelector('body') as HTMLElement;

function showAlert(type:string,message:string):void
{
    hideAlert();
    let alertContent:HTMLElement = document.createElement('DIV');
    alertContent.innerHTML = message;
    let alertButton:HTMLElement = createElement('BUTTON',['btn-close'],[{att:'type',value:'button'},{att:'data-bs-dismiss',value:'alert'},{att:'aria-label',value:'cerrar alerta'}],undefined,undefined);
    body.appendChild(createElement('DIV',['alert', `alert-${type}`, 'alert-dismissible','fixed-top','my-3','start-50'],[{att:'role',value:'alert'},{att:'style',value:'max-width: 540px; z-index: 1100; top: 2em; transform: translate(-50%, 0);'}],undefined,[alertContent,alertButton]));
}
function hideAlert():void
{
    $('.alert').alert('close');
}

class OwnerInfo
{
    private banner:CarouselImage[];
    private photo:any;
    private title:string;
    private description:string;
    private bannerDraft:CarouselImage[] = [];
    private photoDraft:string = '';
    private titleDraft:string = '';
    private descriptionDraft:string = '';
    private bannerContainer:any = document.querySelectorAll('.banner');
    private photoContainer:any = document.querySelectorAll('.photoContainer');
    private titleContainer:any = document.querySelectorAll('.titleContainer');
    private descriptionContainer:any = document.querySelectorAll('.descriptionContainer');
    private bannerEditer:any = document.querySelectorAll('.banner-adder');
    private bannerEditerLink:any = document.getElementById('owner-banner-link');
    private bannerEditerFile:any = document.getElementById('owner-banner-file');
    private photoEditerFile:any = document.getElementById('owner-photo-file');
    private photoEditerLink:any = document.getElementById('owner-photo-link');
    private titleEditer:any = document.getElementById('owner-title');
    private descriptionEditer:any = document.getElementById('owner-description');
    private thContainer:HTMLElement = document.getElementById('owner-thumbnails') as HTMLElement;
    private saver:any = document.getElementById('owner-saver');
    private open:any = document.querySelectorAll('.edit-owner');
    
    public constructor(jsonObj:{banner:[],photo:any,title:string,description:string})
    {
        this.banner = jsonObj.banner;
        this.photo = jsonObj.photo;
        this.title = jsonObj.title;
        this.description = jsonObj.description;
        this.bannerEditerFile.addEventListener('input',()=>{
            this.bannerEditerLink.value = URL.createObjectURL(this.bannerEditerFile.files[0]);
        });
        this.bannerEditer.forEach((button:HTMLElement)=>{
            button.addEventListener('click',()=>{
                let input:any = document.getElementById(button.getAttribute('bindedInput') as string);
                let src:string|null;
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
                    this.bannerDraft.push(new CarouselImage(button.getAttribute('fileType') as string, src, this.bannerDraft.length, this));
                }
                this.refreshTC();
            })
        });
        this.photoEditerFile.addEventListener('input',()=>{
            this.photoDraft = URL.createObjectURL(this.photoEditerFile.files[0]);
            this.photoEditerLink.value = this.photoDraft;
        });
        this.photoEditerLink.addEventListener('input',()=>{
            this.photoDraft = this.photoEditerLink.value;
        });
        this.titleEditer.addEventListener('input',()=>{
            this.titleDraft = this.titleEditer.value;
        });
        this.descriptionEditer.addEventListener('input',()=>{
            this.descriptionDraft = this.descriptionEditer.value;
        });
        this.saver.addEventListener('click',()=>{
            this.saveChanges();
        });
        this.open.forEach((button:HTMLElement) => {
            button.addEventListener('click', ()=>{
                this.openEditor();
            })
        });
        this.open.forEach((button:HTMLElement)=>sessionButtons.push(button));
        this.refresh();
    }

    public refresh():void
    {
        this.bannerContainer.forEach((container:HTMLElement) => {
            container.innerHTML = '';
            let first:boolean = true;
            this.banner.forEach(banner => {
                if (!first) {
                    if(banner.Type == 'file' || banner.Type == 'link'){
                        container.innerHTML += [
                            '<div class="carousel-item w-100 h-100">',
                            `<img src="${banner.Src}" class="h-100 w-100" style="object-fit: cover;">`,
                            '</div>'
                    ].join('');
                    } else if (banner.Type == 'canvas') {

                    }
                } else if (first) {
                    if(banner.Type == 'file' || banner.Type == 'link'){
                        container.innerHTML += [
                            '<div class="carousel-item active w-100 h-100">',
                            `<img src="${banner.Src}" class="h-100 w-100" style="object-fit: cover;">`,
                            '</div>'
                    ].join('');
                    } else if (banner.Type == 'canvas') {

                    }
                    first = false;
                }
            })
        })
        if (this.photo) {
            this.photoContainer.forEach((cont:HTMLElement) => {
                cont.innerHTML = `<img src="${this.photo}" class="w-100 h-100" style="object-fit: cover;">`;
            });
        } else {
            this.photoContainer.forEach((cont:HTMLElement) => {
                cont.innerHTML = `<img src="imgs/non-profile.png" class="w-100 h-100" style="object-fit: cover;">`;
            });
        }
        this.titleContainer.forEach((cont:HTMLElement) => {
            cont.innerHTML = this.title;
        });
        this.descriptionContainer.forEach((cont:HTMLElement) => {
            cont.innerHTML = this.description;
        });
    }

    public refreshTC():void
    {
        this.thContainer.innerHTML = '';
        let container:DocumentFragment = document.createDocumentFragment();
        this.bannerDraft.forEach((image:CarouselImage)=>{
            image.addThumbnail(container);
        });
        this.thContainer.appendChild(container);
    }

    private saveChanges():void
    {
        this.banner = this.bannerDraft;
        this.photo = this.photoDraft;
        this.title = this.titleDraft;
        this.description = this.descriptionDraft;
        this.refresh();
    }

    private openEditor():void
    {
        this.photoEditerLink.value = this.photo;
        this.titleEditer.value = this.title;
        this.descriptionEditer.value = this.description;
        this.bannerDraft = this.banner;
        this.photoDraft = this.photo;
        this.titleDraft = this.title;
        this.descriptionDraft = this.description;
        this.refreshTC();
    }

    public complementMovement(from:CarouselImage,dir:string):void
    {
        (this.bannerDraft.find((banner:CarouselImage) => (banner.Index == from.Index && banner != from)) as CarouselImage).move(dir, false);
        this.bannerDraft.sort((a:CarouselImage, b:CarouselImage) => {return a.Index - b.Index;});
        this.refreshTC();
    }

    get BannerDraftLenght():number
    {
        return this.bannerDraft.length;
    }
    get BannerDraft():CarouselImage[]
    {
        return this.bannerDraft;
    }
    set BannerDraft(newDraft:CarouselImage[])
    {
        this.bannerDraft = newDraft;
    }
}

class CarouselImage
{
    private container:OwnerInfo;
    private type:string;
    private src:string|null;
    private index:number;
    private thumbnail:HTMLElement;
    private moveForwardButton:HTMLElement = this.createButton('fa-chevron-left','Mover a la izquierda','forward');
    private moveBackwardButton:HTMLElement = this.createButton('fa-chevron-right','Mover a la derecha','backward');
    private deleteButton:HTMLElement = this.createButton('fa-xmark','Eliminar','delete');

    constructor(type:string,src:string|null,index:number,container:OwnerInfo)
    {
        this.type = type;
        this.src = src;
        this.index = index;
        this.container = container
        this.thumbnail = this.createThumbnail();
    }

    private createButton(figure:string,title:string,type:string):HTMLElement
    {
        let button = document.createElement('I');
        button.classList.add('fa-solid',figure,'btn','p-0');
        button.setAttribute('title',title);
        if (type == 'delete') {
            button.addEventListener('click',()=>{this.deleteSelf()});
        } else {
            button.addEventListener('click',()=>{this.move(type,true)});
        }
        return button;
    }

    public addThumbnail(container:DocumentFragment):void
    {
        container.append(this.thumbnail);
    }

    public move(dir:string,needComplement:boolean):void
    {
        switch (dir) {
            case 'forward':
                if (this.index > 0) {
                    this.index--;
                    if (needComplement) this.container.complementMovement(this, 'backward');
                }
                break;
            case 'backward':
                if (this.index < (this.container.BannerDraftLenght - 1)) {
                    this.index++;
                    if (needComplement) this.container.complementMovement(this, 'forward');
                }
                break;
        }
    }

    private deleteSelf():void
    {
        this.container.BannerDraft = this.container.BannerDraft.filter(banner => banner != this);
        for (let i in this.container.BannerDraft) {
            this.container.BannerDraft[i].Index = parseInt(i);
        }
        this.container.refreshTC();
    }

    private createThumbnail():HTMLElement
    {
        let container:HTMLElement = document.createElement('DIV');
        if (this.type == 'file' || this.type == 'link') {
            container.style.height = '50px';
            container.style.width = '50px';
            container.classList.add('position-relative','border','mx-2');

            let img:HTMLImageElement = new Image();
            img.src = this.src as string;
            img.style.objectFit = 'cover';
            img.classList.add('w-100');
            img.classList.add('h-100');
            let buttonsCont:HTMLElement = document.createElement('DIV');
            buttonsCont.classList.add('position-absolute', 'top-0', 'text-center', 'w-100');
            buttonsCont.appendChild(this.moveForwardButton);
            buttonsCont.appendChild(this.moveBackwardButton);
            buttonsCont.appendChild(this.deleteButton);

            container.appendChild(img);
            container.appendChild(buttonsCont);
        } else if (this.type == 'canvas') {

        }
        return container;
    }

    set Index(newIndex:number)
    {
        this.index = newIndex;
    }
    get Index():number
    {
        return this.index;
    }
    get Src():string|null
    {
        return this.src;
    }
    get Type():string
    {
        return this.type
    }
}


// ----------------------------------------------------------------------


class CardsContainer
{
    private possibleId:number = 0;
    private element:HTMLElement;
    private places:HTMLElement[] = [];
    private cards:Card[] = [];
    private containerType:string;
    private cardEditing:HSkill;
    private required:{simple:HTMLInputElement|Node[],composed:{troggler:HTMLInputElement,cases:{ifVlue:string,required:HTMLInputElement[]}[]}[]|undefined};
    private saveButton:HTMLElement;
    private cancelButtons:NodeList;
    private addButton:HTMLElement;
    private isVoid:boolean = false;
    private isAdding:boolean = false;
    private hasFailed:boolean = false;
    private allInputs:HTMLElement[] = [];
    public constructor(element:HTMLElement,type:string,initialCards:{}[])
    {
        this.element = element;
        this.containerType = type;
        if (initialCards.length == 0) this.createVoidHolder();
        initialCards.forEach(card=>{this.addCard(card,type)});
        this.setEditConfig();
        this.saveButton.addEventListener('click',()=>{
            if (this.cardEditing) {
                this.save();
            } else if (this.isAdding) {
                if (this.verify()) {
                    this.isAdding = false;
                    this.addCard(this.createCard(),this.containerType);
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
                } else {
                    this.hasFailed = true;
                    showAlert('danger','Rellene todas las entradas requeridas');
                }
            }
        });
        this.addButton.addEventListener('click',()=>{
            this.isAdding = true;
            this.replaceValues(true);
        });
        sessionButtons.push(this.addButton);
        this.cancelButtons.forEach(button=>button.addEventListener('click',()=>{this.cancel()}));
    }

    public createVoidHolder():void
    {
        this.addPlace();
        let text:HTMLElement = createElement('H6',['position-absolute', 'd-flex', 'w-100', 'h-100', 'top-0', 'start-0', 'justify-content-center', 'fw-bold', 'align-items-center'],undefined,this.places[0],undefined);
        text.innerText = 'No hay nada aquí';
        this.isVoid = true;
    }

    private deleteVoidHolder():void
    {
        this.element.removeChild(this.places[0]);
        this.places = [];
        this.isVoid = false;
    }

    private cancel():void
    {
        if (this.hasFailed) {
            this.hasFailed = false;
            hideAlert();
        }
        this.allInputs.forEach(input=>input.classList.remove('bg-danger','bg-success'));
        this.cardEditing = null;
        this.isAdding = false;
    }
    private save:any;
    public replaceValues:any;
    private createCard:any;
    private setEditConfig():void
    {
        if (this.containerType == 'education' || this.containerType == 'experiences') {
            const concept:HTMLInputElement = document.getElementById('ExpEduc-concept') as HTMLInputElement;
            const institutionImageFile:HTMLInputElement = document.getElementById('ExpEduc-institutionImg-file') as HTMLInputElement;
            const institutionImageLink:HTMLInputElement = document.getElementById('ExpEduc-institutionImg-link') as HTMLInputElement;
            institutionImageFile.addEventListener('input',()=>{institutionImageLink.value = URL.createObjectURL((institutionImageFile.files as any)[0])});
            const title:HTMLInputElement = document.getElementById('ExpEduc-title') as HTMLInputElement;
            const institution:HTMLInputElement = document.getElementById('ExpEduc-institution') as HTMLInputElement;
            const state:HTMLInputElement = document.getElementById('ExpEduc-state') as HTMLInputElement;
            const start:HTMLInputElement = document.getElementById('ExpEduc-start-date') as HTMLInputElement;
            const finish:HTMLInputElement = document.getElementById('ExpEduc-finish-date') as HTMLInputElement;
            const general:HTMLInputElement = document.getElementById('ExpEduc-general') as HTMLInputElement;
            this.allInputs = [concept,institutionImageFile,institutionImageLink,title,institution,state,start,finish,general];
            this.replaceValues = (toVoid:Boolean) => {
                concept.value = (toVoid)?'':this.cardEditing.Concept;
                institutionImageLink.value = (toVoid)?'':this.cardEditing.InstitutionImage;
                title.value = (toVoid)?'':this.cardEditing.Title;
                institution.value = (toVoid)?'':this.cardEditing.Institution;
                state.value = (toVoid)?'':this.cardEditing.Date.type;
                start.value = (toVoid)?'':this.cardEditing.Date.start as string;
                finish.value = (toVoid)?'':this.cardEditing.Date.end as string;
                general.value = (toVoid)?'':this.cardEditing.General as string;
            }
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
                } else {
                    this.hasFailed = true;
                    showAlert('danger','Rellene todas las entradas requeridas');
                }
            };
            this.required = {
                simple: [concept,title,institution,state],
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
                            required: [start,finish]
                        }
                    ]
                }]
            };
            this.createCard = () => {
                return {
                    concept:concept.value,
                    institutionImage:institutionImageLink.value,
                    title:title.value,
                    institution:institution.value,
                    date:{
                        type:state.value,
                        start:start.value,
                        end:finish.value
                    },
                    general:general.value
                }
            }
            this.saveButton = document.getElementById('ExpEduc-edition-save') as HTMLElement;
            this.cancelButtons = document.querySelectorAll('.ExpEduc-edition-cancel');
            if (this.containerType == 'education') this.addButton = document.getElementById('add-card-education') as HTMLElement;
            else if (this.containerType == 'experiences') this.addButton = document.getElementById('add-card-experience') as HTMLElement;
        } else if (this.containerType == 'HSkill') {
            const name:HTMLInputElement = document.getElementById('HSkill-name') as HTMLInputElement;
            const valueOverview:HTMLElement = document.getElementById('HSkill-value-overview') as HTMLElement;
            const value:HTMLInputElement = document.getElementById('HSkill-percent') as HTMLInputElement;
            value.addEventListener('input',()=>{
                valueOverview.innerText = `${value.value}%`;
            });
            const bgType:NodeList = document.querySelectorAll('.HSkill-bgType');
            const bgFile:NodeList = document.querySelectorAll('.HSkill-bg-file');
            const bgLink:NodeList = document.querySelectorAll('.HSkill-bg-link');
            bgType.forEach((node:any) => node.addEventListener('input',()=>{
                bgType.forEach((otherNode:any) => {if(otherNode != node)otherNode.value = node.value});
            }));
            bgFile.forEach((node:any) => node.addEventListener('input',()=>{
                bgFile.forEach((otherNode:any) => {if(otherNode != node)otherNode.files = node.files});
                bgLink.forEach((linkNode:any) => {linkNode.value = URL.createObjectURL((node.files as any)[0])});
            }));
            bgLink.forEach((node:any) => node.addEventListener('input',()=>{
                bgLink.forEach((otherNode:any) => {if(otherNode != node)otherNode.value = node.value});
            }));
            const positiveContainer:HTMLElement = document.getElementById('positive-points-container') as HTMLElement;
            let positivePoints:HTMLElement[] = [document.getElementById('positive-point-0') as HTMLElement];
            const getPositivePoints = ():HTMLInputElement[] => {
                let points:HTMLInputElement[] = [];
                positivePoints.forEach(point => points.push(point.querySelector('.point-name') as HTMLInputElement));
                return points;
            };
            const addPositiveButton:HTMLElement = document.getElementById('add-positive-point') as HTMLElement;
            const negativeContainer:HTMLElement = document.getElementById('negative-points-container') as HTMLElement;
            let negativePoints:HTMLElement[] = [document.getElementById('negative-point-0') as HTMLElement];;
            const getNegativePoints = ():HTMLInputElement[] => {
                let points:HTMLInputElement[] = [];
                negativePoints.forEach(point => points.push(point.querySelector('.point-name') as HTMLInputElement));
                return points;
            };
            const addNegativeButton:HTMLElement = document.getElementById('add-negative-point') as HTMLElement;
            let idAble:number = 0;
            const refreshRequired = ():void => {
                this.required = {
                    simple: [name,...bgType,...bgLink,...getPositivePoints(),...getNegativePoints()],
                    composed: undefined
                };
                this.allInputs = [name,...bgType,...bgLink,...getPositivePoints(),...getNegativePoints()] as HTMLElement[];
            }
            refreshRequired();
            function addPositive(value:string|undefined) {
                let deleter:HTMLElement = createElement('I',['fa-solid', 'fa-xmark', 'btn', 'p-0', 'positive-deleter', 'border-0'],[{att:'style', value:'font-size: .75em;'},{att:'bindedInput', value:`positive-point-${idAble}`},{att:'title', value:'Eliminar'}],undefined,undefined);
                addDeleterListener('positive',deleter);
                let _deleter:HTMLElement = createElement('DIV',['input-group-text'],undefined,undefined,[deleter]);
                let input:HTMLInputElement = createElement('INPUT',['form-control', 'form-control-sm', 'point-name'],[{att:'type',value:'text'},{att:'aria-label',value:'type a positive point'}],undefined,undefined) as HTMLInputElement;
                let point:HTMLElement = createElement('DIV',['input-group', 'input-group-sm', 'mb-1'],[{att:'id',value:`positive-point-${idAble}`}],undefined,[input,_deleter]);
                positiveContainer.appendChild(point);
                positivePoints.push(point);
                idAble++;
                if (positivePoints.length == 1) (positivePoints[0].querySelector('.positive-deleter') as HTMLElement).classList.add('disabled');
                else if (positivePoints.length > 1) (positivePoints[0].querySelector('.positive-deleter') as HTMLElement).classList.remove('disabled');
                if (value) input.value = value;
                refreshRequired();
            }
            function addNegative(value:string|undefined) {
                let deleter:HTMLElement = createElement('I',['fa-solid', 'fa-xmark', 'btn', 'p-0', 'negative-deleter', 'border-0'],[{att:'style', value:'font-size: .75em;'},{att:'bindedInput', value:`negative-point-${idAble}`},{att:'title', value:'Eliminar'}],undefined,undefined);
                addDeleterListener('negative',deleter);
                let _deleter:HTMLElement = createElement('DIV',['input-group-text'],undefined,undefined,[deleter]);
                let input:HTMLInputElement = createElement('INPUT',['form-control', 'form-control-sm', 'point-name'],[{att:'type',value:'text'},{att:'aria-label',value:'type a negative point'}],undefined,undefined) as HTMLInputElement;
                let point:HTMLElement = createElement('DIV',['input-group', 'input-group-sm', 'mb-1'],[{att:'id',value:`negative-point-${idAble}`}],undefined,[input,_deleter]);
                negativeContainer.appendChild(point);
                negativePoints.push(point);
                idAble++;
                if (negativePoints.length == 1) (negativePoints[0].querySelector('.negative-deleter') as HTMLElement).classList.add('disabled');
                else if (negativePoints.length > 1) (negativePoints[0].querySelector('.negative-deleter') as HTMLElement).classList.remove('disabled');
                if (value) input.value = value;
                refreshRequired();
            }
            addPositiveButton.addEventListener('click',(e)=>{
                e.preventDefault();
                addPositive(undefined);
            });
            addNegativeButton.addEventListener('click',(e)=>{
                e.preventDefault();
                addNegative(undefined);
            });
            function addDeleterListener(type:string,button:HTMLElement):void
            {
                button.addEventListener('click',()=>{
                    if(!button.classList.contains('disabled')) {
                        switch (type) {
                            case 'positive':
                                let pointToRemove0:HTMLElement = positivePoints.find(point => point.id == button.getAttribute('bindedInput')) as HTMLElement;
                                positivePoints = positivePoints.filter(input => input != pointToRemove0);
                                positiveContainer.removeChild(pointToRemove0);
                                if (positivePoints.length == 1) (positivePoints[0].querySelector('.positive-deleter') as HTMLElement).classList.add('disabled');
                                break;
                            case 'negative':
                                let pointToRemove1:HTMLElement = negativePoints.find(point => point.id == button.getAttribute('bindedInput')) as HTMLElement;
                                negativePoints = negativePoints.filter(input => input != pointToRemove1);
                                negativeContainer.removeChild(pointToRemove1);
                                if (negativePoints.length == 1) (negativePoints[0].querySelector('.negative-deleter') as HTMLElement).classList.add('disabled');
                                break;
                        }
                        refreshRequired();
                    }
                });
            }
            const getValues = (from:HTMLInputElement[]):string[] => {
                let values:string[] = [];
                from.forEach(point => values.push((point as HTMLInputElement).value));
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
                        type: (bgType[0] as HTMLInputElement).value,
                        animation: false,
                        src: (bgLink[0] as HTMLInputElement).value
                    };
                    $('#HSkill-modal').modal('hide');
                    this.cardEditing.refreshContent();
                    this.cancel();
                } else {
                    this.hasFailed = true;
                    showAlert('danger','Rellene todas las entradas requeridas');
                }
            };
            this.replaceValues = (toVoid:Boolean) => {
                positiveContainer.innerHTML = '';
                negativeContainer.innerHTML = '';
                positivePoints = [];
                negativePoints = [];
                if (!toVoid) {
                    for (let point of this.cardEditing.Points.positives) {addPositive(point)};
                    for (let point of this.cardEditing.Points.negatives) {addNegative(point)};
                } else {
                    addPositive(undefined);
                    addNegative(undefined);
                }
                value.value = (toVoid)?'50':this.cardEditing.Value.toString();
                valueOverview.innerText = (toVoid)?'50%':value.value+'%';
                name.value = (toVoid)?'':this.cardEditing.Name;
                bgType.forEach(input => (input as HTMLInputElement).value = (toVoid)?'':this.cardEditing.Background.type);
                bgLink.forEach(input => (input as HTMLInputElement).value = (toVoid)?'':this.cardEditing.Background.src);
            };
            this.createCard = ():{name:string,value:number,points:{positives:string[],negatives:string[]},background:{type:string,animation:boolean,src:string}} => {
                return {
                    name:name.value,
                    value:parseInt(value.value),
                    points: {
                        positives: getValues(getPositivePoints()),
                        negatives: getValues(getNegativePoints())
                    },
                    background: {
                        type: (bgType[0] as HTMLInputElement).value,
                        animation: false,
                        src: (bgLink[0] as HTMLInputElement).value
                    }
                }
            };
            this.saveButton = document.getElementById('HSkill-save') as HTMLElement;
            this.cancelButtons = document.querySelectorAll('.HSkill-cancel');
            this.addButton = document.getElementById('add-card-hskill') as HTMLElement;
        }
    }

    private verify():boolean
    {
        let response:boolean = true;
        let valid:HTMLElement[] = [];
        let invalid:HTMLElement[] = [];
        this.required.simple.forEach(requirement=>{
            if (!requirement.value) {
                response = false;
                invalid.push(requirement);
            } else valid.push(requirement);
        });
        this.required.composed?.forEach(requirement=>{
            let reqs = requirement.cases.find(case_ => case_.ifVlue == requirement.troggler.value);
            reqs?.required.forEach(required=>{
                if (!required.value) {
                    response = false;
                    invalid.push(required);
                } else valid.push(required);
            })
        })
        this.allInputs.forEach(input=>input.classList.remove('bg-danger','bg-success'));
        if (!response) {
            valid.forEach(input=>{input.classList.add('bg-opacity-25','bg-success')});
            invalid.forEach(input=>{input.classList.add('bg-opacity-25','bg-danger')});
        }
        return response;
    }

    private addPlace()
    {
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
        newPlace.addEventListener('dragstart',function(e){
            let currentIndex:number = parseInt(newPlace.id);
            let draggingCard:Card = cont.cards[currentIndex];
            cont.places.forEach(place=>{
                $(place).on('dragover',function(e:DragEvent){e.preventDefault()});
                $(place).on('dragenter',function(e:DragEvent){
                    let placeIndex:number = parseInt((e.delegateTarget as HTMLElement).id);
                    draggingCard.Index = undefined;
                    let cardsToMove = cont.cards.filter(card=>Math.min(currentIndex,placeIndex)<=card.Index && Math.max(currentIndex,placeIndex)>=card.Index);
                    (currentIndex<placeIndex)?cardsToMove.forEach(card=>card.move('forward',false)):cardsToMove.forEach(card=>card.move('backward',false));
                    currentIndex = placeIndex;
                    draggingCard.Index = placeIndex;
                    cont.refresh();
                });
            });
        });
        newPlace.addEventListener('dragend',function(){
            cont.places.forEach(place=>{
                $(place).off('dragover');
                $(place).off('dragenter');
            });
        });
        if (inSession) newPlace.setAttribute('draggable','true');
        allPlaces.push(newPlace);
        this.places.push(newPlace);
        this.element.appendChild(newPlace);
    }

    public rewritePlacesId():void
    {
        for (let i in this.places) {
            this.places[i].id = i;
        }
    }

    public addCard(card:any,type:string)
    {
        if (type == this.containerType) {
            if (this.isVoid) this.deleteVoidHolder();
            this.addPlace();
            switch (type) {
                case 'education':
                    this.cards.push(new ExpEduc(card as any,this,this.possibleId));
                    break;
                case 'experiences':
                    this.cards.push(new ExpEduc(card as any,this,this.possibleId));
                    break;
                case 'HSkill':
                    this.cards.push(new HSkill(card as any,this,this.possibleId));
                    break;
                case 'SSkill':
                    this.cards.push(new SSkill(card as any,this,this.possibleId));
                    break;
                case 'projects':
                    this.cards.push(new Project(card as any,this,this.possibleId));
            }
            this.refresh();
            this.possibleId++;
        }
    }

    public refresh():void
    {
        this.cards.sort((a:Card, b:Card) => {return a.Index - b.Index;});
        for (let i in this.cards) {
            if (!this.cards[i].Dragging) {
                this.cards[i].Element.forEach(node=>{this.places[i].appendChild(node)});
            }
        }
    }

    public complementMovement(from:Card,dir:string):void
    {
        (this.cards.find(card=>(card.Index == from.Index && card != from)) as Card).move(dir,false);
        this.refresh();
    }

    get ContainerType():string
    {
        return this.containerType;
    }
    get CardQuantity():number
    {
        return this.cards.length;
    }
    get Element():HTMLElement
    {
        return this.element;
    }
    get Places():HTMLElement[]
    {
        return this.places;
    }
    set Places(newPlaces:HTMLElement[])
    {
        this.places = newPlaces;
    }
    get Cards():Card[]
    {
        return this.cards;
    }
    set Cards(newCards:Card[])
    {
        this.cards = newCards;
    }
    set CardEditing(newCard:Card)
    {
        this.cardEditing = newCard;
    }
}

class Card
{
    protected container:CardsContainer;
    protected id:number;
    protected type:string;
    private index:number|undefined;
    private dragging:boolean = false;
    private editButton:HTMLElement = document.createElement('BUTTON');
    private deleteButton:HTMLElement = document.createElement('BUTTON');
    private moveForwardButton:HTMLElement = document.createElement('BUTTON');
    private moveBackwardButton:HTMLElement = document.createElement('BUTTON');
    private buttonsArr:HTMLElement[] = [this.moveForwardButton,this.moveBackwardButton,this.editButton,this.deleteButton];
    protected buttonsContainer:HTMLElement = document.createElement('DIV');
    protected element:HTMLElement[] = [];

    public constructor(container:CardsContainer,type:string,id:number)
    {
        this.container = container;
        this.id = id;
        this.type = type;
        this.index = container.CardQuantity;
        this.buttonsArr.forEach(button=>{
            button.setAttribute('type','button');
            if (button !== this.deleteButton) button.classList.add('btn', 'text-warning');
            let i = document.createElement('I');
            i.classList.add('fa-solid');
            switch (button) {
                case this.editButton:
                    button.title = 'Editar';
                    button.setAttribute('data-bs-toggle','modal');
                    button.setAttribute('data-bs-target',`#${type}-modal`);
                    button.addEventListener('click',()=>{this.edit()});
                    i.classList.add('fa-pen-to-square');
                    break;
                case this.deleteButton:
                    button.title = 'Eliminar';
                    button.addEventListener('click',()=>{this.deleteSelf()});
                    button.classList.add('btn', 'text-danger');
                    i.classList.add('fa-circle-xmark');
                    break;
                case this.moveForwardButton:
                    button.title = 'Mover arriba';
                    button.addEventListener('click',()=>{this.move('forward',true)});
                    i.classList.add('fa-circle-chevron-up');
                    break;
                case this.moveBackwardButton:
                    button.title = 'Mover abajo';
                    button.addEventListener('click',()=>{this.move('backward',true)});
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
            this.buttonsArr.forEach(button=>{d.appendChild(button)});
            this.buttonsContainer.appendChild(d);
            sessionButtons.push(this.buttonsContainer);
        } else {
            this.buttonsContainer.classList.add('position-absolute', 'top-50', 'start-50', 'translate-middle', 'd-flex', 'bg-secondary', 'bg-opacity-50', 'rounded');
            this.buttonsArr.forEach(button=>{this.buttonsContainer.appendChild(button)});
            sessionButtons.push(this.buttonsContainer);
        }
        if (!inSession) this.buttonsContainer.classList.add('d-none');
    }

    private edit():void
    {
        this.container.CardEditing = this;
        this.container.replaceValues(false);
    }

    public move(dir:string,needComplement:boolean):void
    {
        if (dir == 'forward' && this.index > 0) {
            this.index--;
            if (needComplement) this.container.complementMovement(this,'backward');
        } else if (dir == 'backward' && this.index < (this.container.CardQuantity - 1)) {
            this.index++;
            if (needComplement) this.container.complementMovement(this,'forward');
        }
    }

    private deleteSelf():void
    {
        this.container.Cards = this.container.Cards.filter(card => card != this);
        let placeToRemove:HTMLElement = this.container.Places.find(place => place.id == (this.index as number).toString()) as HTMLElement;
        this.container.Element.removeChild(placeToRemove);
        this.container.Places = this.container.Places.filter(place => place != placeToRemove);
        this.container.rewritePlacesId();
        for (let i in this.container.Cards) {
            this.container.Cards[i].Index = parseInt(i);
        }
        this.container.refresh();
        if (this.container.Cards.length == 0 && this.container.Places.length == 0) this.container.createVoidHolder();
    }

    get Element():HTMLElement[]
    {
        return this.element;
    }
    get Dragging():boolean
    {
        return this.dragging;
    }
    get Index():number|undefined
    {
        return this.index;
    }
    set Index(newIndex:number|undefined)
    {
        this.index = newIndex;
    }
}

class ExpEduc extends Card
{
    private concept:string;
    private institutionImage:string;
    private title:string;
    private institution:string;
    private date:{
        type:string,
        start:string|null,
        end:string|null
    };
    private general:string|null;
    private dateDescription:any = () => {
        if (this.date.type == 'in progress' || this.date.type == 'finished') return 'Período';
        else if (this.date.type == 'completion only') return 'Fecha de finalización';
    };
    private bg_img:HTMLImageElement = createElement('IMG',['opacity-25', 'ratio', 'ratio-1x1', 'w-auto', 'h-100'],undefined,undefined,undefined) as HTMLImageElement;
    private body_head_img:HTMLImageElement = createElement('IMG',['h-100', 'w-100'],[{att:'style',value:'object-fit: contain;'}],undefined,undefined) as HTMLImageElement;
    private body_headConcept:HTMLElement = createElement('H3',['card-title', 'd-inline-block', 'm-0', 'text-end'],undefined,undefined,undefined);
    private bodyTitle:HTMLElement = createElement('P',['card-text', 'm-0', 'lh-sm'],undefined,undefined,undefined);
    private bodyInstitution:HTMLElement = createElement('P',['card-text', 'm-0', 'lh-sm'],undefined,undefined,undefined);
    private bodyDate:HTMLElement = createElement('P',['card-text', 'm-0', 'lh-sm'],undefined,undefined,undefined);
    private bodyGeneral:HTMLElement = createElement('P',['card-text', 'm-0', 'lh-sm'],undefined,undefined,undefined);

    public constructor(object:{concept:string,institutionImage:string,title:string,institution:string,date:{type:string,start:string|null,end:string|null},general:string|null},container:CardsContainer,id:number)
    {
        super(container,'ExpEduc',id);
        this.concept = object.concept;
        this.institutionImage = object.institutionImage;
        this.title = object.title;
        this.institution = object.institution;
        this.date = object.date;
        this.general = object.general;
        this.createElement();
    }

    private generateUTCDate(date:Date):string
    {
        let response:string = '';
        response+=date.getUTCDate()+'/';
        let month:string|number = date.getUTCMonth()+1;
        if (month < 10) month='0'+month.toString();
        response+=month+'/'+date.getUTCFullYear();
        return response;
    }

    private createDate():string
    {
        switch (this.date.type) {
            case 'in progress':
                let start1 = new Date(this.date.start as string);
                return `${this.generateUTCDate(start1)} - No Finalizado (en curso)`;
            case 'completion only':
                let end1 = new Date(this.date.end as string);
                return this.generateUTCDate(end1);
            default:
                let start2 = new Date(this.date.start as string);
                let end2 = new Date(this.date.end as string);
                return this.generateUTCDate(start2) + ' - ' + this.generateUTCDate(end2);
        }
    }

    private selectBackground():string
    {
        if (this.container.ContainerType == 'education') {
            if (this.date.type == 'in progress') return 'imgs/papel.png';
            else return 'imgs/diploma.png';
        } else if (this.container.ContainerType == 'experiences') return 'imgs/computadora.png';
        else return '/';
    }

    private determinateExtraInfo():string
    {
        if (this.general) return `<span class="text-muted">${this.general}</span>`;
        else return '';
    }

    public refreshContent():void 
    {
        this.bg_img.src = this.selectBackground();
        this.body_head_img.src = this.institutionImage;
        this.body_headConcept.innerText = this.concept;
        this.bodyTitle.innerHTML = `Titulo: <span class="text-muted">${this.title}</span>`;
        this.bodyInstitution.innerHTML = `Institución: <span class="text-muted">${this.institution}</span>`;
        this.bodyDate.innerHTML = `${this.dateDescription()}: <span class="text-muted">${this.createDate()}</span>`;
        this.bodyGeneral.innerHTML = this.determinateExtraInfo();
    }

    private createElement():void
    {
        this.element.push(this.buttonsContainer);

        let bg_ = createElement('DIV',['h-100', 'w-auto', 'd-none', 'd-sm-flex', 'align-items-center', 'flex-row-reverse'],undefined,undefined,[this.bg_img]);
        let bg = createElement('DIV',['card-img', 'h-100', 'w-100', 'p-4', 'position-absolute'],undefined,undefined,[bg_]);
        this.element.push(bg);

        let body_head_ = createElement('DIV',undefined,[{att:'style',value:'width: 80px; height: 40px;'}],undefined,[this.body_head_img]);
        let body_head = createElement('DIV',['container-fluid', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0'],undefined,undefined,[body_head_,this.body_headConcept]);
        let bodyHr1 = createElement('HR',['px-2', 'my-2', 'd-block'],undefined,undefined,undefined);
        let bodyHr2 = createElement('HR',['px-2', 'my-2', 'd-block'],undefined,undefined,undefined);
        let body_ = createElement('DIV',['col', 'card-body', 'text-start', 'd-flex', 'flex-column', 'justify-content-evenly', 'h-100', 'py-0', 'px-4'],undefined,undefined,[body_head,bodyHr1,this.bodyTitle,this.bodyInstitution,bodyHr2,this.bodyDate,this.bodyGeneral]);
        let body = createElement('DIV',['row', 'h-100', 'position-relative'],[{att:'style',value:'z-index: 1;'}],undefined,[body_]);
        this.refreshContent();
        this.element.push(body);
    }

    set Concept(newConcept:string)
    {
        this.concept = newConcept;
    }
    get Concept():string
    {
        return this.concept;
    }
    set InstitutionImage(newImg:string)
    {
        this.institutionImage = newImg;
    }
    get InstitutionImage():string
    {
        return this.institutionImage;
    }
    set Title(newTitle:string)
    {
        this.title = newTitle;
    }
    get Title():string
    {
        return this.title
    }
    set Institution(newInstitution:string)
    {
        this.institution = newInstitution;
    }
    get Institution():string
    {
        return this.institution;
    }
    set Date(newDate:{type:string,start:string|null,end:string|null})
    {
        this.date = newDate;
    }
    get Date():{type:string,start:string|null,end:string|null}
    {
        return this.date;
    }
    set General(newGeneral:string|null)
    {
        this.general = newGeneral;
    }
    get General():string|null
    {
        return this.general;
    }
}

class HSkill extends Card
{
    private name:string;
    private value:number;
    private points:{
        positives:string[],
        negatives:string[]
    };
    private background:{
        type:string,
        animation:boolean,
        src:string
    };
    private nameContainer:HTMLElement = createElement('H4',['invisible', 'position-absolute'],[{att:'style',value:'z-index: 0;'}],undefined,undefined);
    private positiveP:HTMLElement = createElement('P',['m-0'],[{att:'style',value:'color: #555;'}],undefined,undefined);
    private negativeP:HTMLElement = createElement('P',['m-0','mt-3','mt-md-0'],[{att:'style',value:'color: #555;'}],undefined,undefined);
    private bgContainer:HTMLElement = createElement('DIV',['position-absolute', 'h-100', 'w-100', 'top-0', 'start-0'],undefined,undefined,undefined);
    private valuePositive:HTMLElement = createElement('DIV',['progress-bar', 'bg-success', 'position-relative', 'opacity-25'],[{att:'role',value:'progressbar'},{att:'aria-label',value:'positive'},{att:'style',value:'width: 75%; z-index: 1;'},{att:'aria-valuenow',value:'75'},{att:'aria-valuemin',value:'0'},{att:'aria-valuemax',value:'100'}],undefined,undefined);
    private valueNegative:HTMLElement = createElement('DIV',['progress-bar', 'bg-danger', 'position-relative', 'opacity-25'],[{att:'role',value:'progressbar'},{att:'aria-label',value:'negative'},{att:'style',value:'width: 25%; z-index: 1;'},{att:'aria-valuenow',value:'25'},{att:'aria-valuemin',value:'0'},{att:'aria-valuemax',value:'100'}],undefined,undefined);

    public constructor(object:{name:string,value:number,points:{positives:string[],negatives:string[]},background:{type:string,animation:boolean,src:string}},container:CardsContainer,id:number)
    {
        super(container,'HSkill',id);
        this.name = object.name;
        this.value = object.value;
        this.points = object.points;
        this.background = object.background;
        this.createElement();
        this.refreshContent();
    }

    private createElement():void
    {
        let cardBG:HTMLElement = createElement('DIV',['progress', 'position-absolute', 'h-100', 'w-100', 'shadow-sm', 'border'],undefined,undefined,[this.bgContainer,this.valuePositive,this.valueNegative]);

        let cardBody_positivesContainer:HTMLElement = createElement('DIV',['col-12', 'col-md-6', 'text-start'],undefined,undefined,[this.positiveP]);
        let cardBody_negativesContainer:HTMLElement = createElement('DIV',['col-12', 'col-md-6', 'text-end'],undefined,undefined,[this.negativeP]);
        let cardBody_:HTMLElement = createElement('DIV',['row'],undefined,undefined,[cardBody_positivesContainer,cardBody_negativesContainer]);
        let cardBody:HTMLElement = createElement('DIV',['container-fluid', 'position-relative', 'top-0', 'start-0', 'p-3'],[{att:'style',value:'z-index: 2;'}],undefined,[this.nameContainer,cardBody_,this.buttonsContainer]);
        
        let card:HTMLElement = createElement('DIV',['col','position-relative','p-0'],undefined,undefined,[cardBG,cardBody]);
        this.element.push(card);
    }

    public refreshContent():void
    {
        this.nameContainer.innerText = this.name;
        this.valuePositive.setAttribute('aria-valuenow',this.value.toString());
        this.valuePositive.style.width = `${this.value}%`;
        this.valueNegative.setAttribute('aria-valuenow',(100 - this.value).toString());
        this.valueNegative.style.width = `${100 - this.value}%`;
        this.bgContainer.innerHTML = `<img class="h-100 w-100" src="${this.background.src}" alt="${this.name} - Hard Skill Background" style="object-fit: cover;">`;
        this.positiveP.innerHTML = '';
        this.negativeP.innerHTML = '';
        this.points.positives.forEach(point => this.positiveP.innerHTML += `<i class="fa-solid fa-check text-success"></i> ${point}<br>`);
        this.points.negatives.forEach(point => this.negativeP.innerHTML += `${point} <i class="fa-solid fa-xmark text-danger"></i><br>`);
    }
    
    set Name(newName:string)
    {
        this.name = newName;
    }
    get Name():string
    {
        return this.name;
    }
    set Value(newValue:number)
    {
        this.value = newValue;
    }
    get Value():number
    {
        return this.value;
    }
    set Points(newPoints:{positives:string[],negatives:string[]})
    {
        this.points = newPoints;
    }
    get Points():{positives:string[],negatives:string[]}
    {
        return this.points;
    }
    set Background(newBackground:{type:string,animation:boolean,src:string})
    {
        this.background = newBackground;
    }
    get Background():{type:string,animation:boolean,src:string}
    {
        return this.background;
    }
}

class SSkill extends Card
{
    private name:string;
    private description:string;
    private subSkills:{name:string,value:number}[];

    public constructor(object:{name:string,description:string,subSkills:{name:string,value:number}[]},container:CardsContainer,id:number)
    {
        super(container,'SSkill',id);
        this.name = object.name;
        this.description = object.description;
        this.subSkills = object.subSkills;
    }
}

class Project extends Card
{
    private name:string;
    private description:string;
    private date:string;
    private images:{type:string,src:string}[];

    public constructor(object:{name:string,description:string,date:string,images:{type:string,src:string}[]},container:CardsContainer,id:number)
    {
        super(container,'Project',id);
        this.name = object.name;
        this.description = object.description;
        this.date = object.date;
        this.images = object.images;
    }
}

let ownerInfo:OwnerInfo;
let educationSection:CardsContainer;
let experiencesSection:CardsContainer;
let HSkillSection:CardsContainer;
let SSkillSection:CardsContainer;
let ProjectsSection:CardsContainer;
fetch('https://raw.githubusercontent.com/AlanDuh/portfolio-FrontEnd/main/DOMElements.json')
    .then(response=>response.json())
    .then(data=>{
        ownerInfo = new OwnerInfo(data.ownerInfo);
        educationSection = new CardsContainer((document.getElementById('eduactionSectionContainer') as HTMLElement),'education' , data.education);
        experiencesSection = new CardsContainer((document.getElementById('experiencesSectionContainer') as HTMLElement),'experiences' , data.experiences);
        HSkillSection = new CardsContainer((document.getElementById('HSkillsSectionContainer') as HTMLElement),'HSkill' , data.skills.hard);
        SSkillSection = new CardsContainer((document.getElementById('SSkillsSectionContainer') as HTMLElement),'SSkill' , data.skills.soft);
        ProjectsSection = new CardsContainer((document.getElementById('projectsSectionContainer') as HTMLElement),'projects' , data.projects);
    })