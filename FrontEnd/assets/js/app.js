const apiUrl = "http://localhost:5678/api/";
const errorContainer = document.getElementById("errorContainer");
const galleryDiv = document.getElementById("galleryContainer");
filtersError = document.getElementById("filtersError");
const modalContent = document.querySelector(".modal");

// Gallery

function updateGallery(works) {
    const gallery = document.getElementsByClassName("gallery")[0];
    gallery.innerHTML = ""; // remove the gallery content

    works.forEach((work) => {
        const figure = document.createElement("figure");
        figure.setAttribute("data-id", work.id);
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        image.src = work.imageUrl;
        figcaption.textContent = work.title;
        gallery.appendChild(figure);
        figure.appendChild(image);
        figure.appendChild(figcaption);
    });
}

const filtersAll = document.getElementById("filters-all");
const filtersObjects = document.getElementById("filters-objects");
const filtersAppartments = document.getElementById("filters-appartments");
const filtersHotels = document.getElementById("filters-hotels");
let allWorks = [];
let categories = [];

async function fetchCategories() {
    return fetch(apiUrl + "categories")
        .then((response) => response.json())
        .then((categoriesData) => {
            return categoriesData;
        });
}

function fetchWorks() {
    fetch(apiUrl + "works")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Server not responding");
            }
        })
        .then((works) => {
            allWorks = works;
            updateGallery(works);
            displayModal(works);
        })
        .catch((error) => {
            errorContainer.textContent = "Server issues";
            galleryContainer.classList.remove("gallery");
            errorContainer.classList.add("errorContainer");
            console.error("Server issues", error);
        });
}

// Filters

filtersAll.classList.add("active");
let filtersElem = document.querySelectorAll(".filters, button");

filtersElem.forEach((i) => {
    i.addEventListener("click", function (e) {
        document
            .querySelector(".filters button.active")
            .classList.remove("active");
        e.target.classList.add("active");
    });
});

function filterAllClick() {
    updateGallery(allWorks);
}

function filterObjectsClick() {
    const filtered = allWorks.filter(
        (work) =>
            work.categoryId ===
            categories.find((category) => category.name === "Objets").id
    );
    updateGallery(filtered);
}

function filterAppartmentsClick() {
    const filtered = allWorks.filter(
        (work) =>
            work.categoryId ===
            categories.find((category) => category.name === "Appartements").id
    );
    updateGallery(filtered);
}

function filterHotelsClick() {
    const filtered = allWorks.filter(
        (work) =>
            work.categoryId ===
            categories.find(
                (category) => category.name === "Hotels & restaurants"
            ).id
    );
    updateGallery(filtered);
}

fetchCategories(apiUrl + "categories").then((categoriesData) => {
    categories = categoriesData;
    fetchWorks();
});

filtersAll.addEventListener("click", filterAllClick);
filtersObjects.addEventListener("click", filterObjectsClick);
filtersAppartments.addEventListener("click", filterAppartmentsClick);
filtersHotels.addEventListener("click", filterHotelsClick);

fetchWorks();

// Login

const loginText = document.getElementById("login-text");
const logOutText = document.getElementById("logout-text");

const token = localStorage.getItem("token");

if (token) {
    const hiddenElements = document.querySelectorAll(".hidden");
    const filtersHidden = document.getElementById("filtersActive");
    filtersHidden.classList.add("hidden");
    loginText.classList.add("hidden");
    hiddenElements.forEach((element) => {
        element.classList.remove("hidden");
    });
}

logOutText.addEventListener("click", clearLocalStorage);

function clearLocalStorage() {
    localStorage.clear();
}

// Modal

const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalGallery = document.querySelector(".modal-gallery");
const deleteWorkModal = document.querySelectorAll(".modal-icone");

modalTriggers.forEach((trigger) =>
    trigger.addEventListener("click", toggleModal)
);

function toggleModal() {
    modalContainer.classList.toggle("active");
}

function displayModal(worksArray) {
    let modalContentHTML = "";
    worksArray.forEach((work) => {
        modalContentHTML += `
            <figure class="modal-gallery_img">
                <img src="${work.imageUrl}">
                <div class="modal-icon" data-id="${work.id}">
                    <i class="fa-solid fa-trash-can modal-trash_icon"></i>
                </div>
                <p>éditer</p>
            </figure>
        `;
    });
    modalGallery.innerHTML = modalContentHTML;

    const modalDeleteWorkIcon = document.querySelectorAll(".modal-icon");

    // Delete work
    let deleteRequest = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    modalDeleteWorkIcon.forEach((deleteIcon) => {
        deleteIcon.addEventListener("click", () => {
            const workId = deleteIcon.getAttribute("data-id");
            fetch(
                `http://localhost:5678/api/works/${workId}`,
                deleteRequest
            ).then((res) => {
                if (res.ok) {
                    deleteIcon.parentElement.remove();
                    const deleteFigure = document.querySelector(
                        `figure[data-id="${workId}"]`
                    );
                    deleteFigure.remove();
                } else {
                    throw new Error("Can't fetch");
                }
            });
        });
    });
}

// Function to add a new work

const addWorkButton = document.getElementById("addWorkBtn");
addWorkButton.addEventListener("click", openWorkModal);

function openWorkModal() {
    const modal = document.querySelector(".modal");
    const modalWork = document.querySelector(".modal-addwork");

    modalWork.classList.add("active");
    modal.classList.add("none");
}

const backToModalBtn = document.getElementById('backToModalButton');
backToModalBtn.addEventListener("click", backToWorkModal);

function backToWorkModal() {
    const modal = document.querySelector(".modal");
    const modalWork = document.querySelector(".modal-addwork");

    modalWork.classList.remove("active");
    modal.classList.remove("none");
}

// to fetch the categories by API

const categorySelectModal = document.getElementById("workCategory");

function fetchCategoriesModal() {
    const apiURL = "http://localhost:5678/api/categories";

    fetch(apiURL)
        .then((response) => response.json())
        .then((categoriesData) => {
            addCategoriesToSelect(categoriesData);
        })
        .catch((error) => {
            console.log("une erreur est survenue", error);
        });
}

// To add the categories to the dropdown list

function addCategoriesToSelect(categories) {
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelectModal.appendChild(option);
    });
}

fetchCategoriesModal();

//preview of the image on the modal

const uploadButtonLabel = document.getElementById("uploadButton");
const photoPreview = document.getElementById("photo-preview");
let selectedImage = null;

function addPhoto(event) {
    const photo = event.target.files[0];

    if (photo && photo.size > 4 * 1024 * 1024) {
        alert("la taille maximale est de 4 mo");
        return;
    }

    if (photo) {
        selectedImage = photo;
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            const previewImage = new Image();

            previewImage.onload = () => {
                const maxHeight = 169; // Photo max height

                //calcul to resize the image
                const scaleFactor = maxHeight / previewImage.height;
                const width = previewImage.width * scaleFactor;
                const height = previewImage.height * scaleFactor;

                //apply the new dimensions to the image
                previewImage.width = width;
                previewImage.height = height;

                //erase preview content + add the new image
                photoPreview.appendChild(previewImage);
            };
            //define the src of image
            previewImage.src = reader.result;
        });

        //read the image as data URL
        reader.readAsDataURL(photo);
        uploadButton.style.display = "none";

        // Hide the other elements on modal
        const elementsHidden = document.querySelectorAll('.modal-content_addwork p, .modal-content_addwork i.fa-image, .modal-content_addwork_img_button');
        elementsHidden.forEach((element) => {
            element.style.display = 'none';
        });
        uploadButtonLabel.style.display = 'none';
        
    }
}

const fileInput = document.getElementById("uploadButton");
fileInput.addEventListener("change", (event) => addPhoto(event));

//conditions check to submit a new work

function setupFormValidation() {
    const photoInput = document.getElementById("uploadButton");
    const titleInput = document.getElementById("workTitle");
    const submitButtonModal = document.getElementById("submitButtonModal");

    submitButtonModal.disabled = true;

    titleInput.addEventListener("keyup", () => {
        if (titleInput.value.trim().length > 0 && photoInput.files.length > 0) {
            submitButtonModal.disabled = false;
            submitButtonModal.classList.add("add-button_form_succes");
        } else {
            submitButtonModal.disabled = true;
        }
    });
}

document.addEventListener("DOMContentLoaded", setupFormValidation);

//send a new project to the back-end by the modal form
function createWork() {
    const titleInput = document.getElementById("workTitle");
    const categoryInput = document.getElementById("workCategory");

    const image = selectedImage; //photo recovery
    const title = titleInput.value.trim(); //title recovery
    const category = parseInt(categoryInput.value.trim()); //category id recovery

    const formData = new FormData(); // create a formdata to send data
    formData.append("image", image); //photo added to formdata
    formData.append("title", title); //title added to formdata
    formData.append("category", category); //category added to formdata

    const accessToken = localStorage.getItem("token");

    //send the request POST
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    })
        .then((response) => response.json())
        .then((newWork) => {
            addWorkToGallery(newWork); //add the new project to the gallery
            addWorkToModal(newWork);
            allWorks.push(newWork);
        })
        .catch((error) => {
            console.error("Une erreur est survenue", error);
        });
}

submitButtonModal.addEventListener("click", (event) => {
    event.preventDefault();
    createWork();
    closeModal();
    form.reset();
    setupFormValidation();
    submitButtonModal.classList.remove("add-button_form_succes");
    document.getElementById("uploadButton").value = null;
    document
        .getElementById("photo-preview")
        .removeChild(document.querySelector("#photo-preview img"));
    const elementsHidden = document.querySelectorAll('.modal-content_addwork p, .modal-content_addwork i.fa-image, .modal-content_addwork_img_button');
    elementsHidden.forEach((element) => {
        element.style.display = "";
    });
    uploadButtonLabel.style.display = "";
});
