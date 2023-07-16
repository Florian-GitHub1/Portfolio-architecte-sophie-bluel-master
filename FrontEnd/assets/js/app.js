const errorContainer = document.getElementById("errorContainer");

// Gallerie

// Fetch des travaux enregistrés dans la BDD
fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
        allWorks = works;
        // Créeation du HTML pour chaque
        works.forEach((work) => {
            addWorkToGallery(work);
            addWorkToModal(work);
        });
    })
    .catch((error) => {
        errorContainer.style.display = "block";
        errorContainer.textContent = "Server issues";
        galleryContainer.classList.remove("gallery");
        errorContainer.classList.add("errorContainer");
        console.error("Server issues", error);
    });

//-------------------------------------------------------------------------------------------------------------------------------

// Création du contenu HTML des gallery
function updateGallery(works) {
    const gallery = document.getElementsByClassName("gallery")[0];
    gallery.innerHTML = ""; // Réinitialise le contenu de la gellerie

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

function addWorkToGallery(work) {
    const gallery = document.getElementById("galleryContainer");
    const figure = document.createElement("figure");
    figure.setAttribute("data-work-id", work.id);
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);

    image.src = work.imageUrl;
    figcaption.textContent = work.title;
}

// -------------------------------------------------------------------------------------------------------------------------------

//Filtres
fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
        addCategoriesToFilters(categories);
        const filterAllClick = document.createElement("button"); // Créer l'élément 'button'
        filterAllClick.textContent = "Tous";
        filterAllClick.id = "filterAllClick";
        filterAllClick.addEventListener("click", filterAll);
        filterContainer.prepend(filterAllClick); // Place le bouton 'All' au début du container
    })
    .catch((error) => {
        console.log(error);
    });

function addCategoriesToFilters(categories) {
    const filterContainer = document.getElementById("filterContainer");

    categories.forEach((category) => {
        const filterButton = document.createElement("button");
        filterButton.textContent = category.name; // Définit les nom des boutons en fonction des noms de categories
        filterButton.setAttribute("data-category-id", category.id); // Définit un 'data-category-id" pour stocker l'id de la categorie
        filterButton.addEventListener("click", () => {
            filterByCategory(category.id);
        });

        filterContainer.appendChild(filterButton); // Ajout des boutons de filtres au container
    });
}

function filterByCategory(categoryId) {
    const filtered = allWorks.filter((work) => work.categoryId == categoryId);
    updateGallery(filtered); // Met à jour la gallerie avec les projets filtrés
}

function filterAll() {
    updateGallery(allWorks); // Met à jour la gallerie avec tous les projets
}

// Login
const loginText = document.getElementById("login-text");
const logOutText = document.getElementById("logout-text");

const token = localStorage.getItem("token");

// Ajout de classes et apparitions des éléments de modifications si l'utilisateur est connecté
if (token) {
    const hiddenElements = document.querySelectorAll(".hidden");
    const filtersHidden = document.getElementById("filterContainer");
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

// Modal Trigger
modalTriggers.forEach((trigger) =>
    trigger.addEventListener("click", toggleModal)
);

function toggleModal() {
    modalContainer.classList.toggle("active");
}

// -------------------------------------------------------------------------------------------------------------------------------

// Preview des images modal
function addWorkToModal(work) {
    const galleryModal = document.querySelector(".modal-gallery");

    const modalFigure = document.createElement("figure");
    modalFigure.setAttribute("data-work-id", work.id);
    modalFigure.classList.add("modal-gallery_img");

    const modalImage = document.createElement("img");
    modalImage.src = work.imageUrl;
    modalImage.classList.add("modal-gallery_img");

    const modalFigcaption = document.createElement("figcaption");
    modalFigcaption.innerHTML = "éditer";

    const deleteSpan = document.createElement("span");
    deleteSpan.classList.add("modal-icon");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "modal-trash_icon");

    deleteSpan.appendChild(deleteIcon);
    modalFigure.appendChild(modalImage);
    modalFigure.appendChild(modalFigcaption);
    modalFigure.appendChild(deleteSpan);
    galleryModal.appendChild(modalFigure);
    deleteIcon.addEventListener("click", (event) => {
        event.preventDefault();
        deleteWork(work.id);
    });
}

// -------------------------------------------------------------------------------------------------------------------------------

// Delete work lors du click icon preview modal
function deleteWork(id) {
    const accessToken = localStorage.getItem("token");

    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => {
            if (response.ok) {
                removeWorkOnGallery(id);
                allWorks = allWorks.filter((work) => work.id !== id); //filter without the Id removed
            } else {
                console.error("Suppression échouée");
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function removeWorkOnGallery(workId) {
    const figures = document.querySelectorAll(
        `figure[data-work-id="${workId}"]`
    );
    if (figures) {
        figures.forEach((figure) => {
            figure.remove();
        });
    }
}

// -------------------------------------------------------------------------------------------------------------------------------

// Fonction pour ajouter un nouveau travail

//Mise en place de la fonction pour afficher la modal de travail et fermer la modal de preview
const addWorkButton = document.getElementById("addWorkBtn");
addWorkButton.addEventListener("click", openWorkModal);

function openWorkModal() {
    const modal = document.querySelector(".modal");
    const modalWork = document.querySelector(".modal-addwork");

    modalWork.classList.add("active");
    modal.classList.add("none");
}

const backToModalBtn = document.getElementById("backToModalButton");
backToModalBtn.addEventListener("click", backToWorkModal);

function backToWorkModal() {
    const modal = document.querySelector(".modal");
    const modalWork = document.querySelector(".modal-addwork");

    modalWork.classList.remove("active");
    modal.classList.remove("none");
}

// Pour récupérer les catégories

const categorySelectModal = document.getElementById("workCategory");

function fetchCategoriesModal() {
    const apiURL = "http://localhost:5678/api/categories";

    fetch(apiURL)
        .then((response) => response.json())
        .then((categoriesData) => {
            addCategoriesToSelect(categoriesData);
        })
        .catch((error) => {
            console.log(error);
        });
}

// Ajout des catégories au dropdown du select

function addCategoriesToSelect(categories) {
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelectModal.appendChild(option);
    });
}

fetchCategoriesModal();

// Preview de l'image au niveau de la modal Ajout Photo

const uploadButtonLabel = document.getElementById("uploadButton");
const photoPreview = document.getElementById("photo-preview");
let selectedImage = null;

function addPhoto(event) {
    const photo = event.target.files[0];

    if (photo && photo.size > 4 * 1024 * 1024) {
        alert("La taille maximale est de 4 mo");
        return;
    }

    if (photo) {
        selectedImage = photo;
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            const previewImage = new Image();

            previewImage.onload = () => {
                const maxHeight = 169; // Taille maximale photo

                // Calcul pour resize la photo
                const scaleFactor = maxHeight / previewImage.height;
                const width = previewImage.width * scaleFactor;
                const height = previewImage.height * scaleFactor;

                // Application des nouvelles dimensions à l'image
                previewImage.width = width;
                previewImage.height = height;

                // Suppression de contenu preview et ajout de la nouvelle image
                photoPreview.appendChild(previewImage);
            };
            // Defini la source de l'image
            previewImage.src = reader.result;
        });

        // Lis l'image comme une URL de data
        reader.readAsDataURL(photo);
        uploadButton.style.display = "none";

        // Cache les autres éléments pour la preview de l'image
        const elementsHidden = document.querySelectorAll(
            ".modal-content_addwork p, .modal-content_addwork i.fa-image, .modal-content_addwork_img_button"
        );
        elementsHidden.forEach((element) => {
            element.style.display = "none";
        });
        uploadButtonLabel.style.display = "none";
    }
}

// Détecte les changements au niveau du bouton d'upload de l'image
const fileInput = document.getElementById("uploadButton");
fileInput.addEventListener("change", (event) => addPhoto(event));

// Vérification des condition pour soumettre un nouveau travail
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

// Envoie un nouveau projet au back-end via le fomrulaire de la modal
function createWork() {
    const titleInput = document.getElementById("workTitle");
    const categoryInput = document.getElementById("workCategory");

    const image = selectedImage; // Récupération de la photo
    const title = titleInput.value.trim(); // Récupération du titre
    const category = parseInt(categoryInput.value.trim()); // Récupération de l'id de la categorie

    const formData = new FormData(); // Création d'un formData pour envoyez des data
    formData.append("image", image); // Ajout de la photo au formData
    formData.append("title", title); // Ajout du titre au formData
    formData.append("category", category); // Ajout de la categorie au formData

    const accessToken = localStorage.getItem("token");

    // Requête POST pour l'envoie au backend
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    })
        .then((response) => response.json())
        .then((newWork) => {
            addWorkToGallery(newWork); // Ajoute le nouveau projet à la gallerie
            addWorkToModal(newWork); // Ajoute le nouveau projet à la modal
            allWorks.push(newWork);
        })
        .catch((error) => {
            console.error(error);
        });
}

// Fonction de submit du travail et réintialisation du contenu de la modal
submitButtonModal.addEventListener("click", (event) => {
    event.preventDefault();
    createWork();
    backToWorkModal();
    form.reset();
    setupFormValidation();
    submitButtonModal.classList.remove("add-button_form_succes");
    document.getElementById("uploadButton").value = null;
    document
        .getElementById("photo-preview")
        .removeChild(document.querySelector("#photo-preview img"));
    const elementsHidden = document.querySelectorAll(
        ".modal-content_addwork p, .modal-content_addwork i.fa-image, .modal-content_addwork_img_button"
    );
    elementsHidden.forEach((element) => {
        element.style.display = "";
    });
    uploadButtonLabel.style.display = "";
});
