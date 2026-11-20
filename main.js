const container = document.getElementById('books-container');
const pagination = document.getElementById('pagination');
const API_URL = 'https://fakeapi.extendsclass.com/books';
const LIMIT = 10;
let allBooks = [];
let currentPage = 1;

const createCard = (book) => {
    const authors = book.authors.filter(a => a.trim() !== '');
    
    const card = document.createElement('div');
    card.className = 'book-card';

    const title = document.createElement('h2');
    title.textContent = book.title;
    card.appendChild(title);

    const info = document.createElement('div');
    info.className = 'book-info';

    const authorsBlock = document.createElement('div');
    const authorsLabel = document.createElement('strong');
    authorsLabel.textContent = authors.length > 1 ? 'Авторы: ' : 'Автор: ';
    authorsBlock.appendChild(authorsLabel);

    if (authors.length > 1) {
        const ul = document.createElement('ul');
        for (let i = 0; i < authors.length; i++) {
            const li = document.createElement('li');
            li.textContent = authors[i];
            ul.appendChild(li);
        }
        authorsBlock.appendChild(ul);
    } else {
        authorsBlock.append(authors[0] || 'не указан');
    }
    info.appendChild(authorsBlock);

    if (book.isbn) {
        const isbn = document.createElement('span');
        const isbnLabel = document.createElement('strong');
        isbnLabel.textContent = 'ISBN: ';
        isbn.appendChild(isbnLabel);
        isbn.append(book.isbn);
        info.appendChild(isbn);
    }

    const pages = document.createElement('span');
    const pagesLabel = document.createElement('strong');
    pagesLabel.textContent = 'Страниц: ';
    pages.appendChild(pagesLabel);
    pages.append(book.pageCount || 'не указано');
    info.appendChild(pages);
    card.appendChild(info);
    return card;
}

const loadBooks = () => {
    const loader = document.createElement('div');
    loader.className = 'loader';
    container.appendChild(loader);
    fetch(API_URL)
        .then(res => res.json())
        .then(books => {
            setTimeout(() => {
                loader.remove();
                allBooks = books;
                currentPage = 1;
                while (container.firstChild) container.removeChild(container.firstChild);
                for (let i = 0; i < LIMIT && allBooks[i]; i++) {
                    container.appendChild(createCard(allBooks[i]));
                }
                while (pagination.firstChild) pagination.removeChild(pagination.firstChild);
                const totalPages = Math.ceil(allBooks.length / LIMIT);
                for (let i = 1; i <= totalPages; i++) {
                    const btn = document.createElement('button');
                    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
                    btn.textContent = i;
                    btn.addEventListener('click', () => {
                        currentPage = i;
                        while (container.firstChild) container.removeChild(container.firstChild);
                        for (let j = (currentPage - 1) * LIMIT; j < currentPage * LIMIT && allBooks[j]; j++) {
                            container.appendChild(createCard(allBooks[j]));
                        }
                        const btns = pagination.querySelectorAll('.page-btn');
                        for (let k = 0; k < btns.length; k++) btns[k].classList.remove('active');
                        btn.classList.add('active');
                    });
                    pagination.appendChild(btn);
                }
            }, 1000);
        })
        .catch(() => {
            loader.remove();
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = 'Ошибка загрузки';
            container.appendChild(error);
            console.error('Ошибка загрузки');
        });
};
document.addEventListener('DOMContentLoaded', loadBooks);
