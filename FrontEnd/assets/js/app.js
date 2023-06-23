var ApiUrl = "http://localhost:5678/api/";

function updateGallery(works) {
    const gallery = document.getElementsByClassName('gallery')[0]
    gallery.innerHTML = ""   // remove the gallery content

    works.forEach(work => {
        const figure = document.createElement('figure')
        const image = document.createElement('img')
        const figcaption = document.createElement('figcaption')
        image.src = work.imageUrl;
        figcaption.textContent = work.title
        gallery.appendChild(figure)
        figure.appendChild(image)
        figure.appendChild(figcaption)
    });
}

const filtersAll = document.getElementById('filters-all')
const filtersObjects = document.getElementById('filters-objects')
const filtersAppartments = document.getElementById('filters-appartments')
const filtersHotels = document.getElementById('filters-hotels')
let allWorks = []
let categories = []

async function fetchCategories() {
    return fetch(ApiUrl + "categories")
        .then(response => response.json())
        .then(categoriesData => {
            return categoriesData;
        })
};

function fetchWorks() {
    const apiURL = 'http://localhost:5678/api/works';
    fetch(apiURL)
        .then(response => response.json())
        .then(works => {
            allWorks = works;
            updateGallery(allWorks);
        });
};

filtersAll.classList.add('active')
let filtersElem = document.querySelectorAll('.filters, button');

filtersElem.forEach(i => {
    i.addEventListener('click', function(e) {
        document.querySelector('.filters button.active').classList.remove("active");
        e.target.classList.add('active');
      });
});


function filterAllClick() {
    updateGallery(allWorks)
};

function filterObjectsClick() {
    const filtered = allWorks.filter(work => work.categoryId === categories.find(category => category.name === 'Objets').id)
    updateGallery(filtered)
};

function filterAppartmentsClick() {
    const filtered = allWorks.filter(work => work.categoryId === categories.find(category => category.name === 'Appartements').id)
    updateGallery(filtered)
};

function filterHotelsClick() {
    const filtered = allWorks.filter(work => work.categoryId === categories.find(category => category.name === 'Hotels & restaurants').id)
    updateGallery(filtered)
};

fetchCategories('http://localhost:5678/api/categories')
    .then(categoriesData => {
        categories = categoriesData;
        fetchWorks();
    });

filtersAll.addEventListener('click', filterAllClick);
filtersObjects.addEventListener('click', filterObjectsClick);
filtersAppartments.addEventListener('click', filterAppartmentsClick);
filtersHotels.addEventListener('click', filterHotelsClick);

fetchWorks();