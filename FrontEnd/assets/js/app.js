const apiUrl = "http://localhost:5678/api/";
const errorContainer = document.getElementById('errorContainer') ;
const galleryDiv = document.getElementById('galleryContainer');
filtersError = document.getElementById('filtersError');

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
    return fetch(apiUrl + "categories")
        .then(response => response.json())
        .then(categoriesData => {
            return categoriesData;
        });
};

function fetchWorks() { 
    fetch(apiUrl + "works")
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error("Server not responding")
            }
        })
        .then(works => {
            allWorks = works;
            updateGallery(allWorks);
        })
        .catch(error => {
            errorContainer.textContent = "Server issues";
            galleryContainer.classList.remove('gallery')
            errorContainer.classList.add('errorContainer');
            console.error('Server issues', error);
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

fetchCategories(apiUrl + "categories")
    .then(categoriesData => {
        categories = categoriesData;
        fetchWorks();
    });

filtersAll.addEventListener('click', filterAllClick);
filtersObjects.addEventListener('click', filterObjectsClick);
filtersAppartments.addEventListener('click', filterAppartmentsClick);
filtersHotels.addEventListener('click', filterHotelsClick);

fetchWorks();

// Login 

const loginText = document.getElementById('login-text')

const userAuthenticated = typeof localStorage.getItem('token') === 'string'

if (userAuthenticated) {
    loginText.innerText = "logout"
    const hiddenElements = document.querySelectorAll('.hidden')
    hiddenElements.forEach(element => {
        element.classList.remove('hidden');
    });

}

// Modal