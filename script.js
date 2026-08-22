const weddingDate = new Date('2026-11-07T16:00:00+07:00');
const GOOGLE_SCRIPT_URL = ''; // Вставим URL веб-приложения Google Apps Script после подключения таблицы.

const pad = n => String(n).padStart(2,'0');
function updateCountdown(){
  const diff = weddingDate - new Date();
  if(diff <= 0){
    document.getElementById('countdown').innerHTML = '<div style="grid-column:1/-1"><strong>Сегодня!</strong><span>Наш день настал</span></div>';
    return;
  }
  const days = Math.floor(diff/86400000);
  const hours = Math.floor(diff/3600000)%24;
  const minutes = Math.floor(diff/60000)%60;
  const seconds = Math.floor(diff/1000)%60;
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
}
updateCountdown();setInterval(updateCountdown,1000);

const io = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting)e.target.classList.add('is-visible')}),{threshold:.14});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const toTop = document.getElementById('toTop');
window.addEventListener('scroll',()=>toTop.classList.toggle('show',scrollY>700),{passive:true});
toTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

const form = document.getElementById('guestForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(!form.reportValidity()) return;
  const fd = new FormData(form);
  const data = {
    name: fd.get('name'),
    guests: fd.get('guests'),
    alcohol: fd.getAll('alcohol').join(', ') || 'Не указано',
    attendance: fd.get('attendance'),
    submittedAt: new Date().toLocaleString('ru-RU')
  };
  const button = form.querySelector('button[type=submit]');
  button.disabled = true;
  button.textContent = 'Отправляем…';
  try{
    if(!GOOGLE_SCRIPT_URL){
      localStorage.setItem('wedding-rsvp-preview', JSON.stringify(data));
      status.textContent = 'Анкета готова. Для финальной отправки осталось подключить Google Таблицу.';
    } else {
      await fetch(GOOGLE_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data)});
      status.textContent = 'Спасибо! Ваш ответ отправлен.';
      form.reset();
    }
  }catch(err){
    status.textContent = 'Не удалось отправить ответ. Попробуйте ещё раз чуть позже.';
  }finally{
    button.disabled = false;
    button.textContent = 'Отправить ответ';
  }
});
