const apiUrl = "http://localhost:5678/api/";
const errorContainer = document.getElementById('errorContainer') ;
const galleryDiv = document.getElementById('galleryContainer');
filtersError = document.getElementById('filtersError');


// Gallery

function updateGallery(works) {
    const gallery = document.getElementsByClassName('gallery')[0]
    gallery.innerHTML = ""   // remove the gallery content

    works.forEach(work => {
        const figure = document.createElement('figure')
        figure.setAttribute("data-id", work.id)
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
            displayModal(allWorks);
        })
        .catch(error => {
            errorContainer.textContent = "Server issues";
            galleryContainer.classList.remove('gallery')
            errorContainer.classList.add('errorContainer');
            console.error('Server issues', error);
        });
};

// Filters

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
const logOutText = document.getElementById('logout-text')

const token = localStorage.getItem('token');

if (token) {
    const hiddenElements = document.querySelectorAll('.hidden');
    const filtersHidden = document.getElementById('filtersActive');
    filtersHidden.classList.add('hidden');
    loginText.classList.add('hidden')
    hiddenElements.forEach(element => {
        element.classList.remove('hidden');
    });
}

logOutText.addEventListener('click', clearLocalStorage)

function clearLocalStorage(){
    localStorage.clear();
}

// Modal

const modalContainer = document.querySelector('.modal-container');
const modalTriggers = document.querySelectorAll('.modal-trigger');
const modalGallery = document.querySelector(".modal-gallery");
const deleteWorkModal = document.querySelectorAll('.modal-icone');

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

function toggleModal(){
    modalContainer.classList.toggle("active");
}

function displayModal(worksArray) {
    let modalContentHTML = "";
    worksArray.forEach((work) => {
        modalContentHTML += `
            <figure class="modal-gallery_img">
                <img src="${work.imageUrl}">
                <div class="modal-icon">
                    <i class="fa-solid fa-trash-can modal-trash_icon" data-id="${work.id}"></i>
                </div>
                <p>éditer</p>
            </figure>
        `;
    })
    modalGallery.innerHTML = modalContentHTML;

    const modalDeleteWorkIcon = document.querySelectorAll(".modal-trash_icon");

    // Delete work
    let deleteRequest = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    modalDeleteWorkIcon.forEach((deleteIcon) => {
        deleteIcon.addEventListener("click", (event) => {
            event.preventDefault()
            const workId = deleteIcon.getAttribute("data-id");
            console.log(workId)
            fetch(`http://localhost:5678/api/works/${workId}`, deleteRequest)
                .then((res) => {
                    if (res.ok) {
                        deleteIcon.parentElement.remove();
                        const deleteFigure = document.querySelector(`figure[data-id="${workId}"]`);
                        deleteFigure.remove();
                    }
                    else {
                        throw new Error("Can't fetch")
                    }
                });
        });
    });
}

