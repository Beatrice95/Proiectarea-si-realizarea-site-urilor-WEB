const ADRESA_API = 'https://jsonplaceholder.typicode.com/posts';

const listaPostari = document.querySelector('#lista-postari');
const mesajStatusLista = document.querySelector('#mesaj-status-lista');
const formularPostare = document.querySelector('#formular-postare');
const mesajFormular = document.querySelector('#mesaj-formular');

function afiseazaMesaj(elementMesaj, textMesaj, tipMesaj = '') {
  elementMesaj.textContent = textMesaj;
  elementMesaj.className = `mesaj ${tipMesaj}`;
}

function creeazaElementPostare(postare) {
  const elementPostare = document.createElement('li');
  elementPostare.dataset.id = postare.id;

  const titluPostare = document.createElement('h3');
  titluPostare.textContent = postare.title;

  const continutPostare = document.createElement('p');
  continutPostare.textContent = postare.body;

  const butonStergere = document.createElement('button');
  butonStergere.type = 'button';
  butonStergere.className = 'buton-stergere';
  butonStergere.textContent = 'Șterge';

  elementPostare.append(titluPostare, continutPostare, butonStergere);
  return elementPostare;
}

function verificaListaGoala() {
  if (listaPostari.children.length === 0) {
    afiseazaMesaj(mesajStatusLista, 'Nu există postări.');
  } else {
    afiseazaMesaj(mesajStatusLista, '');
  }
}

// Serverul poate trimite mesajul de eroare in JSON; daca nu, afisam codul de status.
async function citesteMesajServer(raspunsServer) {
  try {
    const dateRaspuns = await raspunsServer.json();
    if (dateRaspuns.message) {
      return dateRaspuns.message;
    }
    return `Eroare ${raspunsServer.status}`;
  } catch (eroare) {
    return `Eroare ${raspunsServer.status}`;
  }
}

async function incarcaPostari() {
  afiseazaMesaj(mesajStatusLista, 'Se încarcă...');
  try {
    const raspunsServer = await fetch(`${ADRESA_API}?_limit=10`);
    if (!raspunsServer.ok) {
      afiseazaMesaj(mesajStatusLista, await citesteMesajServer(raspunsServer), 'eroare');
      return;
    }
    const postari = await raspunsServer.json();
    listaPostari.textContent = '';
    postari.forEach(postare => listaPostari.append(creeazaElementPostare(postare)));
    verificaListaGoala();
  } catch (eroare) {
    afiseazaMesaj(mesajStatusLista, 'Eroare de rețea. Verifică conexiunea.', 'eroare');
  }
}

async function adaugaPostare(eveniment) {
  eveniment.preventDefault();
  afiseazaMesaj(mesajFormular, '');

  const datePostare = Object.fromEntries(new FormData(formularPostare));
  datePostare.userId = Number(datePostare.userId);

  try {
    const raspunsServer = await fetch(ADRESA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datePostare)
    });
    if (!raspunsServer.ok) {
      afiseazaMesaj(mesajFormular, await citesteMesajServer(raspunsServer), 'eroare');
      return;
    }
    const postareNoua = await raspunsServer.json();
    listaPostari.prepend(creeazaElementPostare(postareNoua));
    verificaListaGoala();
    formularPostare.reset();
    afiseazaMesaj(mesajFormular, 'Postare adăugată.', 'succes');
  } catch (eroare) {
    afiseazaMesaj(mesajFormular, 'Eroare de rețea. Încearcă din nou.', 'eroare');
  }
}

async function stergePostare(eveniment) {
  if (!eveniment.target.matches('.buton-stergere')) return;

  const elementPostare = eveniment.target.closest('li');
  try {
    const raspunsServer = await fetch(`${ADRESA_API}/${elementPostare.dataset.id}`, { method: 'DELETE' });
    if (!raspunsServer.ok) {
      afiseazaMesaj(mesajStatusLista, await citesteMesajServer(raspunsServer), 'eroare');
      return;
    }
    elementPostare.remove();
    verificaListaGoala();
  } catch (eroare) {
    afiseazaMesaj(mesajStatusLista, 'Eroare de rețea. Încearcă din nou.', 'eroare');
  }
}

formularPostare.addEventListener('submit', adaugaPostare);
listaPostari.addEventListener('click', stergePostare);

incarcaPostari();
