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
        this.bannerEditer.forEach((button:HTMLElement)=>{
            button.addEventListener('click',()=>{
                let input:any = document.getElementById(button.getAttribute('bindedInput') as string);
                let src:string|null;
                switch (button.getAttribute('filetype')) {
                    case 'file':
                        src = URL.createObjectURL(input.files[0]);
                        break;
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
                    this.bannerDraft.push(new CarouselImage(button.getAttribute('filetype') as string, src, this.bannerDraft.length, this));
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

class Project
{

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

const info = new OwnerInfo({
    banner:[],
    photo: null,
    title:"Full Stack Developer Jr",
    description:"Mi nombre es Alan Duhalde, programador en formación, instruído bajo la tutoría ofrecida por el 'Argentina Programa', aún sin especialización, pero con capacidades de diseñar y programar FrontEnd, de manera como aquí se contempla."
});