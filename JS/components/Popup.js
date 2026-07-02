document.addEventListener("DOMContentLoaded", () => {
    const pets = document.querySelectorAll(".pet, .top-pet"); 
    const modal = document.getElementById("petModal");
    const closeModal = document.getElementById("closeModal");
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.getElementById("dotsContainer");

    let currentImagesArray = [];
    let currentImageIndex = 0;

    const updateCarouselUI = () => {
        if (!modalImg) return;
        modalImg.classList.add('fade');
        setTimeout(() => {
            modalImg.src = currentImagesArray[currentImageIndex];
            modalImg.classList.remove('fade');
        }, 150);

        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if(index === currentImageIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    };

    pets.forEach(pet => {
        pet.addEventListener("click", () => {
            const dataImg = pet.getAttribute("data-images");
            if (!dataImg) return;
            
            currentImagesArray = JSON.parse(dataImg);
            currentImageIndex = 0; 

            if(modalTitle) modalTitle.textContent = pet.getAttribute("data-name");
            if(modalDesc) modalDesc.textContent = pet.getAttribute("data-desc");

            if(dotsContainer) {
                dotsContainer.innerHTML = ''; 
                currentImagesArray.forEach((_, index) => {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    if(index === 0) dot.classList.add('active');
                    
                    dot.addEventListener('click', () => {
                        currentImageIndex = index;
                        updateCarouselUI();
                    });
                    dotsContainer.appendChild(dot);
                });
            }

            updateCarouselUI();
            if(modal) modal.classList.add("show");
        });
    });

    if(nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentImageIndex++;
            if (currentImageIndex >= currentImagesArray.length) {
                currentImageIndex = 0; 
            }
            updateCarouselUI();
        });
    }

    if(prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentImageIndex--;
            if (currentImageIndex < 0) {
                currentImageIndex = currentImagesArray.length - 1; 
            }
            updateCarouselUI();
        });
    }

    const hideModal = () => { if(modal) modal.classList.remove("show"); }
    
    if(closeModal) closeModal.addEventListener("click", hideModal);
    if(modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) hideModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.classList.contains("show")) {
            hideModal();
        }
    });
});