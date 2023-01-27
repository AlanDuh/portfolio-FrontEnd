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
    $('#offcanvasNavbar2').offcanvas('hide');
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
    public bannerDraft:CarouselImage[] = [];
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
                    this.bannerDraft.push(new CarouselImage(button.getAttribute('fileType') as string, src, this.bannerDraft.length, ()=>this.bannerDraft, ()=>this.thContainer, (newContainer:CarouselImage[])=>{this.bannerDraft = newContainer}));
                }
                this.bannerDraft[0].refreshTC();
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
        this.bannerDraft[0].refreshTC();
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
    private container:()=>CarouselImage[];
    private shelf:()=>HTMLElement;
    private editContainer:(newContainer:CarouselImage[])=>void;
    private type:string;
    private src:string|null;
    private index:number;
    private thumbnail:HTMLElement;
    private moveForwardButton:HTMLElement = this.createButton('fa-chevron-left','Mover a la izquierda','forward');
    private moveBackwardButton:HTMLElement = this.createButton('fa-chevron-right','Mover a la derecha','backward');
    private deleteButton:HTMLElement = this.createButton('fa-xmark','Eliminar','delete');
    constructor(type:string,src:string|null,index:number,container:()=>CarouselImage[],shelf:()=>HTMLElement,editContainer:(newContainer:CarouselImage[])=>void)
    {
        this.type = type;
        this.src = src;
        this.index = index;
        this.container = ():CarouselImage[] => container();
        this.shelf = ():HTMLElement => shelf();
        this.editContainer = (newContainer:CarouselImage[]) => editContainer(newContainer);
        this.thumbnail = this.createThumbnail();
    }

    public refreshTC():void
    {
        this.shelf().innerHTML = '';
        let container:DocumentFragment = document.createDocumentFragment();
        this.container().forEach((image:CarouselImage)=>{
            image.addThumbnail(container);
        });
        this.shelf().appendChild(container);
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
                    if (needComplement) this.complementMovement(this, 'backward');
                }
                break;
            case 'backward':
                if (this.index < (this.container().length - 1)) {
                    this.index++;
                    if (needComplement) this.complementMovement(this, 'forward');
                }
                break;
        }
    }

    public complementMovement(from:CarouselImage,dir:string):void
    {
        (this.container().find((banner:CarouselImage) => (banner.Index == from.Index && banner != from)) as CarouselImage).move(dir, false);
        this.container().sort((a:CarouselImage, b:CarouselImage) => {return a.Index - b.Index;});
        this.refreshTC();
    }

    private deleteSelf():void
    {
        let newContent = this.container().filter(banner => banner != this);
        this.editContainer(newContent);
        for (let i in this.container()) {
            this.container()[i].Index = parseInt(i);
        }
        this.refreshTC();
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
    private cardEditing:Project;
    private required:{simple:(HTMLInputElement|Node)[],composed:{troggler:HTMLInputElement,cases:{ifVlue:string,required:HTMLInputElement[]}[]}[]|undefined};
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
                        case 'projects':
                            $('#Project-modal').modal('hide');
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
        } else if (this.containerType == 'SSkill') {
            const name:HTMLInputElement = document.getElementById('SSkill-name') as HTMLInputElement;
            const description:HTMLInputElement = document.getElementById('SSkill-general') as HTMLInputElement;
            const subContainer:HTMLInputElement = document.getElementById('SSkill-sub-skills') as HTMLInputElement;
            const subSkillAdder:HTMLElement = document.getElementById('addSubSkill') as HTMLElement;
            subSkillAdder.addEventListener('click',(e)=>{
                e.preventDefault();
                addSubSkill(undefined);
            });
            let idAble:number = 0;
            let allSubSkills:HTMLElement[] = [];
            const allSubSkillsValues = ():{name:string,value:number}[] => {
                let subSkills:{name:string,value:number}[] = [];
                allSubSkills.forEach(subSkill => subSkills.push({
                    name:(subSkill.querySelector('.sub-skill-name') as HTMLInputElement).value,
                    value:parseInt((subSkill.querySelector('.sub-skill-value') as HTMLInputElement).value)
                }));
                return subSkills;
            }
            const refreshRequired = ():void => {
                this.required = {
                    simple: [name,description,...subContainer.querySelectorAll('.sub-skill-name'),...subContainer.querySelectorAll('sub-skill-value')],
                    composed: undefined
                }
                this.allInputs = [name,description,...subContainer.querySelectorAll('.sub-skill-name') as any,...subContainer.querySelectorAll('sub-skill-value')];
            }
            function addSubSkill(initValue:{name:string,value:number}|undefined):void
            {
                let value:HTMLInputElement = createElement('INPUT',['form-range', 'sub-skill-value'],[{att:'type',value:'range'},{att:'min',value:'0'},{att:'max',value:'100'},{att:'id',value:`sub-skill-percent-${idAble}`}],undefined,undefined) as HTMLInputElement;
                let _value:HTMLElement = createElement('DIV',['d-flex', 'align-items-center', 'p-0', 'px-2', 'input-group-item', 'border', 'bg-white'],[{att:'style',value:'flex-grow: 1;'}],undefined,[value]);
                let valueOverview:HTMLElement = createElement('SPAN',['input-group-text', 'p-0', 'px-2'],undefined,undefined,undefined);
                value.addEventListener('input',()=>{valueOverview.innerText = `${value.value}%`});
                let deleter:HTMLElement = createElement('I',['fa-solid', 'fa-xmark'],[{att:'title',value:'Eliminar sub-skill'}],undefined,undefined);
                let _deleter:HTMLElement = createElement('BUTTON',['btn', 'border', 'p-0', 'px-2', 'text-muted', 'bg-white', 'deleter'],[{att:'type',value:'button'},{att:'id',value:`sub-skill-deleter-${idAble}`}],undefined,[deleter]);
                _deleter.addEventListener('click',()=>{
                    subContainer.removeChild(subSkill);
                    allSubSkills = allSubSkills.filter(sskill => sskill != subSkill);
                    if (allSubSkills.length == 1) (allSubSkills[0].querySelector('.deleter') as HTMLElement).classList.add('disabled');
                    refreshRequired();
                });
                let subSkillBody:HTMLElement = createElement('DIV',['input-group','mb-2'],[{att:'style',value:'font-size: 1em; height: 31px;'}],undefined,[valueOverview,_value,_deleter]);
                let label1:HTMLElement = createElement('LABEL',['form-label', 'mb-1'],[{att:'for',value:`sub-skill-percent-${idAble}`}],undefined,undefined);
                label1.innerHTML = 'Porcentaje de <i>sub-skill</i>:';
                let _subSkillBody:HTMLElement = createElement('DIV',['col-sm-8'],undefined,undefined,[label1,subSkillBody]);
                let name:HTMLInputElement = createElement('INPUT',['form-control', 'form-control-sm', 'sub-skill-name'],[{att:'type',value:'text'},{att:'id',value:`sub-skill-name-${idAble}`}],undefined,undefined) as HTMLInputElement;
                let label0:HTMLElement = createElement('LABEL',['mb-1', 'form-label'],[{att:'for',value:`sub-skill-name-${idAble}`}],undefined,undefined);
                label0.innerHTML = 'Nombre de <i>sub-skill</i>:';
                let subSkillHead:HTMLElement = createElement('DIV',['col-sm-4'],undefined,undefined,[label0,name]);
                let subSkill:HTMLElement = createElement('DIV',['m-2', 'row', 'g-2', 'rounded', 'bg-light', 'shadow-sm'],[{att:'id',value:`sub-skill-${idAble}`},{att:'style',value:'font-size: .74em;'}],undefined,[subSkillHead,_subSkillBody]);
                idAble++;
                if (initValue) {
                    value.value = initValue.value.toString();
                    name.value = initValue.name;
                }
                valueOverview.innerText = `${value.value}%`;
                allSubSkills.push(subSkill);
                subContainer.appendChild(subSkill);
                if (allSubSkills.length == 1) _deleter.classList.add('disabled');
                else if (allSubSkills.length > 1) (allSubSkills[0].querySelector('.deleter') as HTMLElement).classList.remove('disabled');
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
                } else {
                    this.hasFailed = true;
                    showAlert('danger','Rellene todas las entradas requeridas');
                }
            };
            this.createCard = ():{name:string,description:string,subSkills:{name:string,value:number}[]} => {
                return {
                    name:name.value,
                    description:description.value,
                    subSkills:allSubSkillsValues()
                };
            };
            this.replaceValues = (toVoid:boolean):void => {
                name.value = (toVoid)?'':this.cardEditing.Name;
                description.value = (toVoid)?'':this.cardEditing.Description;
                subContainer.innerHTML = '';
                allSubSkills = [];
                if (toVoid) addSubSkill(undefined);
                else this.cardEditing.SubSkills.forEach(subSkill => addSubSkill(subSkill));
            };
            this.saveButton = document.getElementById('SSkill-save') as HTMLElement;
            this.cancelButtons = document.querySelectorAll('.SSkill-cancel');
            this.addButton = document.getElementById('add-card-sskill') as HTMLElement;
        } else if (this.containerType == 'projects') {
            const name:HTMLInputElement = document.getElementById('project-name') as HTMLInputElement;
            const description:HTMLInputElement = document.getElementById('project-description') as HTMLInputElement;
            const date:HTMLInputElement = document.getElementById('project-date') as HTMLInputElement;
            const pageLink:HTMLInputElement = document.getElementById('project-link') as HTMLInputElement;
            const pageGitHub:HTMLInputElement = document.getElementById('project-github') as HTMLInputElement;
            const imgFile:HTMLInputElement = document.getElementById('project-img-file') as HTMLInputElement;
            const imgLink:HTMLInputElement = document.getElementById('project-img-link') as HTMLInputElement;
            const addImage:HTMLElement = document.getElementById('project-img-adder') as HTMLElement;
            const thShelf:HTMLElement = document.getElementById('project-img-thumbnails') as HTMLElement;
            let thumbnails:CarouselImage[] = [];
            let idAble:number = 0;
            imgFile.addEventListener('input',()=>imgLink.value = URL.createObjectURL((imgFile.files as FileList)[0]));
            addImage.addEventListener('click',()=>{
                addThumbnail(imgLink.value);
                idAble++;
                thumbnails[0].refreshTC();
            });
            function addThumbnail(value:string):void
            {
                thumbnails.push(new CarouselImage('link',value,idAble,()=>thumbnails,()=>thShelf,(newContainer)=>thumbnails=newContainer));
            }
            function getImages():string[]
            {
                let imgs:string[] = [];
                thumbnails.forEach(img => imgs.push(img.Src as string));
                return imgs;
            }
            this.save = () => {
                if (this.verify()) {
                    this.cardEditing.Name = name.value;
                    this.cardEditing.Description = description.value;
                    this.cardEditing.Date = date.value;
                    this.cardEditing.Links = {
                        page: pageLink.value,
                        gitHub: pageGitHub.value
                    };
                    this.cardEditing.Images = getImages();
                    $('#Project-modal').modal('hide');
                    this.cardEditing.refreshContent();
                    this.cancel();
                } else {
                    this.hasFailed = true;
                    showAlert('danger','Rellene todas las entradas requeridas');
                }
            };
            this.required = {
                simple:[name,description,date,pageLink,pageGitHub],
                composed: undefined
            };
            this.allInputs = [name,description,date,pageLink,pageGitHub];
            this.replaceValues = (toVoid:boolean):void => {
                name.value = (toVoid)?'':this.cardEditing.Name;
                description.value = (toVoid)?'':this.cardEditing.Description;
                date.value = (toVoid)?'':this.cardEditing.Date;
                pageLink.value = (toVoid)?'':this.cardEditing.Links.page;
                pageGitHub.value = (toVoid)?'':this.cardEditing.Links.gitHub;
                thumbnails = [];
                thShelf.innerHTML = '';
                if (!toVoid) {
                    this.cardEditing.Images.forEach(img => addThumbnail(img));
                    thumbnails[0].refreshTC();
                };
            };
            this.createCard = ():{name:string,description:string,date:string,images:string[],links:{page:string,gitHub:string}} => {
                return {
                    name:name.value,
                    description:description.value,
                    date:date.value,
                    images:getImages(),
                    links:{
                        page:pageLink.value,
                        gitHub:pageGitHub.value
                    }
                };
            };
            this.saveButton = document.getElementById('project-save') as HTMLElement;
            this.cancelButtons = document.querySelectorAll('.project-cancel');
            this.addButton = document.getElementById('add-card-projects') as HTMLElement;
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
            this.buttonsContainer.classList.add('card-header', 'bg-white', 'position-relative', 'p-0');
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
    private nameContainer:HTMLElement = createElement('H4',['d-inline-block', 'fs-5', 'me-3', 'mb-0'],undefined,undefined,undefined);
    private value:HTMLElement = createElement('DIV',['progress-bar'],[{att:'role',value:'progressbar'},{att:'style',value:'width: 0%;'},{att:'aria-valuenow',value:'0'},{att:'aria-valuemin',value:'0'},{att:'aria-valuemax',value:'100'}],undefined,undefined);
    private subSkillsContainter:HTMLElement = createElement('DIV',['accordion-body', 'pt-0'],undefined,undefined,undefined);
    private descriptionContainer:HTMLElement = createElement('P',undefined,[{att:'style',value:'font-size: .85em;'}],undefined,undefined);

    public constructor(object:{name:string,description:string,subSkills:{name:string,value:number}[]},container:CardsContainer,id:number)
    {
        super(container,'SSkill',id);
        this.name = object.name;
        this.description = object.description;
        this.subSkills = object.subSkills;
        this.createElement();
        this.refreshContent();
    }

    private createElement():void
    {
        let _value:HTMLElement = createElement('DIV',['progress'],[{att:'style',value:'flex-grow: 1;'}],undefined,[this.value]);
        let head:HTMLElement = createElement('LI',['list-group-item', 'd-flex', 'align-items-center'],[{att:'style',value:'flex-grow: 0;'}],undefined,[this.nameContainer,_value]);
        let _subSkillContainer:HTMLElement = createElement('DIV',['accordion-collapse', 'collapse'],[{att:'id',value:`collapse-${this.id}`}],undefined,[this.subSkillsContainter]);
        let _subSkillButton:HTMLElement = createElement('BUTTON',['accordion-button', 'collapsed', 'p-0', 'm-0', 'w-100', 'h1', 'bg-white', 'shadow-none'],[{att:'type',value:'button'},{att:'data-bs-toggle',value:'collapse'},{att:'data-bs-target',value:`#collapse-${this.id}`},{att:'aria-expanded',value:'false'},{att:'aria-controls',value:`collapse-${this.id}`}],undefined,undefined);
        let __subSkillContainer:HTMLElement = createElement('DIV',['accordion-item'],undefined,undefined,[_subSkillButton,_subSkillContainer]);
        let ___subSkillContainer:HTMLElement = createElement('LI',['list-group-item', 'accordion', 'accordion-flush', 'p-0'],[{att:'style',value:'flex-grow: 0;'}],undefined,[__subSkillContainer]);
        let _description:HTMLElement = createElement('LI',['list-group-item', 'text-muted'],[{att:'style',value:'flex-grow: 1;'}],undefined,[this.descriptionContainer]);
        let body:HTMLElement = createElement('UL',['list-group', 'list-group-flush', 'd-flex', 'flex-column', 'h-100'],undefined,undefined,[head,___subSkillContainer,_description]);
        let card:HTMLElement = createElement('DIV',['card', 'h-100', 'overflow-hidden', 'shadow-sm'],undefined,undefined,[this.buttonsContainer,body]);
        this.element.push(card);
    }

    public refreshContent():void
    {
        this.nameContainer.innerText = this.name;
        let valueSum:number = 0;
        this.subSkillsContainter.innerHTML = '';
        this.subSkills.forEach(skill => {
            valueSum += skill.value;
            let value:HTMLElement = createElement('DIV',['progress-bar'],[{att:'role',value:'progressbar'},{att:'style',value:`width: ${skill.value}%;`},{att:'aria-valuenow',value:`${skill.value}`},{att:'aria-valuemin',value:'0'},{att:'aria-valuemax',value:'100'}],undefined,undefined);
            let _value:HTMLElement = createElement('DIV',['progress'],[{att:'style',value:'flex-grow: 1; height: 1px;'}],undefined,[value]);
            let name:HTMLElement = createElement('H5',['d-inline-block', 'fs-6', 'm-0', 'me-3'],undefined,undefined,undefined);
            name.innerText = skill.name;
            let valueOverview:HTMLElement = createElement('P',['d-inline-block', 'fs-6', 'm-0', 'ms-3'],undefined,undefined,undefined);
            valueOverview.innerText = `${skill.value}%`;
            let container:HTMLElement = createElement('DIV',['d-flex', 'align-items-center'],undefined,this.subSkillsContainter,[name,_value,valueOverview]);
        });
        let valueMid:number = Math.trunc(valueSum / this.subSkills.length);
        this.value.style.width = `${valueMid}%`;
        this.value.setAttribute('aria-valuenow',valueMid.toString());
        this.value.innerText = `${valueMid}%`;
        this.descriptionContainer.innerHTML = this.description;
    }

    get Name():string
    {
        return this.name;
    }
    set Name(newName:string)
    {
        this.name = newName;
    }
    get Description():string
    {
        return this.description;
    }
    set Description(newDescription:string)
    {
        this.description = newDescription;
    }
    get SubSkills():{name:string,value:number}[]
    {
        return this.subSkills;
    }
    set SubSkills(newSubSkills:{name:string,value:number}[])
    {
        this.subSkills = newSubSkills;
    }
}

class Project extends Card
{
    private name:string;
    private description:string;
    private date:string;
    private links:{page:string,gitHub:string};
    private images:string[];
    private nameContainer:HTMLElement = createElement('H3',['card-title', 'm-0', 'fs-5'],undefined,undefined,undefined);
    private descriptionContainer:HTMLElement = createElement('P',['card-text', 'text-muted'],[{att:'style',value:'font-size: .85em;'}],undefined,undefined);
    private dateContainer:HTMLElement = createElement('P',['mb-2'],[{att:'style',value:'color: #555; font-size: .85em;'}],undefined,undefined);
    private pageLink:HTMLAnchorElement = createElement('A',['btn', 'btn-primary', 'disabled', 'p-0', 'px-2', 'mx-2'],undefined,undefined,undefined) as HTMLAnchorElement;
    private gitHubLink:HTMLAnchorElement = createElement('A',['btn', 'btn-outline-dark', 'p-0', 'px-1'],[{att:'title',value:'GitHub'}],undefined,undefined) as HTMLAnchorElement;
    private imagesContainer:HTMLElement = createElement('DIV',['col', 'col-12', 'col-sm-4', 'col-md-12', 'col-lg-4', 'shadow-sm', 'p-0'],[{att:'style',value:'height: 300px;'}],undefined,undefined);

    public constructor(object:{name:string,description:string,date:string,images:string[],links:{page:string,gitHub:string}},container:CardsContainer,id:number)
    {
        super(container,'Project',id);
        this.name = object.name;
        this.description = object.description;
        this.date = object.date;
        this.images = object.images;
        this.links = object.links;
        this.createElement();
        this.refreshContent();
    }

    private createElement():void
    {
        this.gitHubLink.innerHTML = '<i class="fa-brands fa-github"></i>';
        this.pageLink.innerText = 'Ir a la página';
        let _dateContainer:HTMLElement = createElement('DIV',['w-100'],undefined,undefined,[this.dateContainer]);
        let hr1:HTMLElement = createElement('HR',['d-block', 'w-100', 'my-1', 'ms-2', 'ms-sm-0', 'ms-md-2', 'ms-lg-0'],undefined,undefined,undefined);
        let footer:HTMLElement = createElement('DIV',['container-fluid', 'd-flex', 'flex-row', 'flex-wrap', 'justify-content-end', 'ps-0', 'pe-2'],undefined,undefined,[hr1,_dateContainer,this.pageLink,this.gitHubLink]);
        let hr0:HTMLElement = createElement('HR',['d-block', 'me-2', 'ms-2', 'ms-sm-0', 'ms-md-2', 'ms-lg-0', 'my-1'],undefined,undefined,undefined);
        let head:HTMLElement = createElement('DIV',undefined,undefined,undefined,[this.nameContainer,hr0,this.descriptionContainer]);
        let body:HTMLElement = createElement('DIV',['col', 'col-12', 'col-sm-8', 'col-md-12', 'col-lg-8', 'text-center', 'text-sm-start', 'text-md-center', 'text-lg-start', 'd-flex', 'flex-column', 'py-2', 'justify-content-between'],undefined,undefined,[head,footer]);
        let _body:HTMLElement = createElement('DIV',['row', 'w-100', 'm-0'],undefined,undefined,[this.imagesContainer,body]);
        let __body:HTMLElement = createElement('DIV',['card', 'h-100', 'shadow-sm', 'overflow-hidden'],undefined,undefined,[this.buttonsContainer,_body]);
        this.element.push(__body);
    }

    public refreshContent():void
    {
        this.nameContainer.innerText = this.name;
        this.descriptionContainer.innerHTML = this.description;
        this.pageLink.href = this.links.page;
        this.gitHubLink.href = this.links.gitHub;
        this.dateContainer.innerHTML = `Fecha de la última versión: <span class="text-muted">${this.generateUTCDate(new Date(this.date))}</span>`;
        this.imagesContainer.innerHTML = '';
        if (this.images.length == 1) {
            let newImage:HTMLImageElement = createElement('IMG',['h-100','w-100'],[{att:'style',value:'object-fit: cover;'}],this.imagesContainer,undefined) as HTMLImageElement;
            newImage.src = this.images[0];
        } else if (this.images.length > 1) {
            let container:HTMLElement = createElement('DIV',['carousel', 'slide', 'w-100', 'h-100'],[{att:'data-bs-ride',value:'true'},{att:'id',value:`project-${this.Index}-images`}],this.imagesContainer,undefined);
            let indicators:HTMLElement = createElement('DIV',['carousel-indicators'],undefined,container,undefined);
            let images:HTMLElement = createElement('DIV',['carousel-inner', 'w-100', 'h-100'],undefined,container,undefined);
            let idAble:number = 0;
            this.images.forEach(image => {
                let img:HTMLImageElement = createElement('IMG',['d-block', 'w-100', 'h-100'],[{att:'style',value:'object-fit: cover;'},{att:'alt',value:`"${this.name}" project - image ${idAble}`}],undefined,undefined) as HTMLImageElement;
                img.src = image;
                let imgCont:HTMLElement = createElement('DIV',(idAble == 0)?['carousel-item', 'active', 'w-100', 'h-100']:['carousel-item', 'w-100', 'h-100'],undefined,images,[img]);
                let button:HTMLElement = createElement('BUTTON',(idAble == 0)?['active']:undefined,(idAble == 0)?[{att:'type',value:'button'},{att:'data-bs-target',value:`#project-${this.Index}-images`},{att:'data-bs-slide-to',value:`${idAble}`},{att:'aria-current',value:'true'},{att:'aria-label',value:`Image ${idAble + 1}`}]:[{att:'type',value:'button'},{att:'data-bs-target',value:`#project-${this.Index}-images`},{att:'data-bs-slide-to',value:`${idAble}`},{att:'aria-label',value:`Image ${idAble + 1}`}],indicators,undefined);
                idAble++;
            });
            let movePrevious:HTMLElement = createElement('BUTTON',['carousel-control-prev'],[{att:'type',value:'button'},{att:'data-bs-target',value:`#project-${this.Index}-images`},{att:'data-bs-slide',value:'prev'}],container,undefined);
            createElement('SPAN',['carousel-control-prev-icon'],[{att:'aria-hidden',value:'true'}],movePrevious,undefined);
            let prevLabel:HTMLElement = createElement('SPAN',['visually-hidden'],undefined,movePrevious,undefined);
            prevLabel.innerText = 'Previous';
            let moveNext:HTMLElement = createElement('BUTTON',['carousel-control-next'],[{att:'type',value:'button'},{att:'data-bs-target',value:`#project-${this.Index}-images`},{att:'data-bs-slide',value:'next'}],container,undefined);
            createElement('SPAN',['carousel-control-next-icon'],[{att:'aria-hidden',value:'true'}],moveNext,undefined);
            let nextLabel:HTMLElement = createElement('SPAN',['visually-hidden'],undefined,moveNext,undefined);
            nextLabel.innerText = 'Next';
        }
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

    get Name():string
    {
        return this.name;
    }
    set Name(newName:string)
    {
        this.name = newName;
    }
    get Description():string
    {
        return this.description;
    }
    set Description(newDescription:string)
    {
        this.description = newDescription;
    }
    get Date():string
    {
        return this.date;
    }
    set Date(newDate:string)
    {
        this.date = newDate;
    }
    get Links():{page:string,gitHub:string}
    {
        return this.links;
    }
    set Links(newLinks:{page:string,gitHub:string})
    {
        this.links = newLinks;
    }
    get Images():string[]
    {
        return this.images;
    }
    set Images(newImages:string[])
    {
        this.images = newImages;
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