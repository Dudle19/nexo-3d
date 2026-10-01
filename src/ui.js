import { TECHNOLOGIES } from './config.js';

export class UIController {
  constructor(){
    this.userName='Visitante';this.onEnter=null;this.onSoundChange=null;this.cacheElements();this.renderTechnologies();this.bindEvents();this.addMessage('Sistema','Bienvenido al evento. Explora las estaciones luminosas.',true);
    const params=new URLSearchParams(location.search);const autoName=params.get('autostart');const presetName=(params.get('username')||(autoName&&autoName!=='1'?autoName:''))?.trim().slice(0,24);
    if(presetName){document.getElementById('username-input').value=presetName;if(autoName){this.welcome.style.transition='none';requestAnimationFrame(()=>this.welcomeForm.requestSubmit());}}
  }
  cacheElements(){const byId=id=>document.getElementById(id);this.welcome=byId('welcome-screen');this.welcomeForm=byId('welcome-form');this.appUI=byId('app-ui');this.modal=byId('kiosk-modal');this.guide=byId('guide-drawer');this.chatForm=byId('chat-form');this.chatInput=byId('chat-input');this.chatMessages=byId('chat-messages');this.chatPanel=byId('chat-panel');this.soundButton=byId('sound-button');this.locationNumber=byId('location-number');this.locationTitle=byId('location-title');this.locationHint=byId('location-hint');}
  bindEvents(){
    this.welcomeForm.addEventListener('submit',event=>{event.preventDefault();this.userName=document.getElementById('username-input').value.trim()||'Visitante';this.welcome.classList.add('is-leaving');this.appUI.classList.add('is-visible');this.appUI.setAttribute('aria-hidden','false');this.onEnter?.(this.userName);});
    this.chatForm.addEventListener('submit',event=>{event.preventDefault();const message=this.chatInput.value.trim();if(!message)return;this.addMessage(this.userName,message);this.chatInput.value='';});
    document.getElementById('chat-toggle').addEventListener('click',event=>{const collapsed=this.chatPanel.classList.toggle('is-collapsed');event.currentTarget.textContent=collapsed?'+':'−';event.currentTarget.setAttribute('aria-label',collapsed?'Expandir chat':'Minimizar chat');});
    document.getElementById('guide-button').addEventListener('click',()=>this.openGuide());
    document.querySelectorAll('[data-close-guide]').forEach(button=>button.addEventListener('click',()=>this.closeGuide()));
    document.querySelectorAll('[data-close-modal]').forEach(button=>button.addEventListener('click',()=>this.closeModal()));
    this.soundButton.addEventListener('click',()=>{const active=this.soundButton.getAttribute('aria-pressed')!=='true';this.soundButton.setAttribute('aria-pressed',String(active));this.soundButton.setAttribute('aria-label',active?'Desactivar sonidos':'Activar sonidos');this.onSoundChange?.(active);});
    addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(!this.modal.hidden)this.closeModal();if(!this.guide.hidden)this.closeGuide();});
  }
  renderTechnologies(){const container=document.getElementById('technology-list');TECHNOLOGIES.forEach(technology=>{const item=document.createElement('div');item.className='tech-item';const name=document.createElement('strong');const detail=document.createElement('span');name.textContent=technology.name;detail.textContent=technology.detail;item.append(name,detail);container.appendChild(item);});}
  addMessage(author,content,system=false){const message=document.createElement('div');message.className=system?'message message--system':'message';if(system)message.textContent=content;else{const name=document.createElement('strong');name.textContent=`${author}: `;message.append(name,document.createTextNode(content));}this.chatMessages.appendChild(message);this.chatMessages.scrollTop=this.chatMessages.scrollHeight;}
  showKiosk(kiosk){const data=kiosk.userData;document.getElementById('modal-title').textContent=data.title;document.getElementById('modal-category').textContent=data.category;document.getElementById('modal-description').textContent=data.description;document.getElementById('modal-icon').textContent=data.icon;this.modal.hidden=false;document.body.dataset.modalOpen='true';this.modal.querySelector('[data-close-modal]').focus();}
  closeModal(){this.modal.hidden=true;delete document.body.dataset.modalOpen;}
  openGuide(){this.guide.hidden=false;this.guide.querySelector('.modal__close').focus();}
  closeGuide(){this.guide.hidden=true;}
  updateLocation(kiosk,distance){if(kiosk&&distance<5.2){this.locationNumber.textContent=kiosk.userData.number;this.locationTitle.textContent=kiosk.userData.title;this.locationHint.textContent=distance<3?'Haz clic en la estación para abrirla':'Sigue acercándote para interactuar';return;}this.locationNumber.textContent='01';this.locationTitle.textContent='Plaza central';this.locationHint.textContent='Acércate a una estación luminosa';}
}
