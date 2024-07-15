const isMobileScreen = window.innerWidth <= 768;

const initializeSectors = () => {
    const sectors = document.querySelectorAll(".sector");
    let allLi = document.querySelectorAll(".sector ul li");
    let selectedIndex = 0;


    const clearAllSectors = () => {
        sectors.forEach(sector => {
            const ul = sector.querySelector("ul");
            if (ul) ul.classList.remove("show");
        });
    }
    const clearAllCompany = () => {
        allLi.forEach(li => { li.classList.remove("nav-selected"); });
    }
    const selectCompanyByIndex = (index) => {
        if (index < 0 || index >= allLi.length) return; // Invalid index

        const selectedLi = allLi[index];
        const ul = selectedLi.parentElement;

        clearAllSectors();
        clearAllCompany();

        ul.classList.add("show");
        selectedLi.classList.add("nav-selected");
        selectedLi.scrollIntoView({ behavior: "smooth", block: "nearest" });
        selectedLi.click();
    }
    const selectSector = (event) => {
        const ul = event.target.nextElementSibling;
        clearAllSectors();
        clearAllCompany();

        if (ul) {
            ul.classList.add("show");
            const firstLi = ul.querySelector("li");
            if (firstLi) {
                firstLi.classList.add("nav-selected");
                selectedIndex = Array.from(allLi).indexOf(firstLi);
            }
        }
    }
    const selectCompany = (event) => {
        clearAllCompany();
        event.target.classList.add("nav-selected");
        selectedIndex = Array.from(allLi).indexOf(event.target);
    }
    const handleScroll = (event) => {
        event.preventDefault();

        let direction = event.deltaY > 0 ? 1 : -1;

        if (direction === 1 && selectedIndex < allLi.length - 1) {
            selectedIndex++;
        } else if (direction === -1 && selectedIndex > 0) {
            selectedIndex--;
        } else if (direction === -1 && selectedIndex === 0) {
            const previousUl = allLi[selectedIndex].parentElement.previousElementSibling;
            if (previousUl) {
                selectedIndex = Array.from(allLi).indexOf(previousUl.querySelector("li:last-child"));
            }
        } else if (direction === 1 && selectedIndex === allLi.length - 1) {
            const nextUl = allLi[selectedIndex].parentElement.nextElementSibling;
            if (nextUl) {
                selectedIndex = Array.from(allLi).indexOf(nextUl.querySelector("li:first-child"));
            }
        }

        selectCompanyByIndex(selectedIndex);
    }
    const initialSetup = () => {
        const firstSector = sectors[0];
        const firstUl = firstSector.querySelector("ul");
        const firstLi = firstUl.querySelector("li");

        firstUl.classList.add("show");
        firstLi.classList.add("nav-selected");
        selectedIndex = 0;

        sectors.forEach(sector => {
            const h2 = sector.querySelector("h2");
            h2.addEventListener("click", selectSector);
        });

        allLi.forEach(li => {
            li.addEventListener("click", selectCompany);
        });
    }

    initialSetup();
    if (!isMobileScreen) document.querySelector('.body-container').addEventListener("wheel", handleScroll);
    else {
        const toggleIcon = document.getElementById("toggleIcon");
        const sideMenu = document.querySelector(".left-sidebar");
        if (toggleIcon) {
            toggleIcon.addEventListener("click", function () {
                if (sideMenu.classList.contains("show")) {
                    sideMenu.classList.remove("show");
                    toggleIcon.classList.remove(leftArrow);
                    toggleIcon.classList.add(rightArrow);
                } else {
                    sideMenu.classList.add("show");
                    toggleIcon.classList.remove(rightArrow);
                    toggleIcon.classList.add(leftArrow);
                }
            });
        }
    }
}


function onSectorMounted() {
    initializeSectors();
}
function observeSectors() {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.classList && node.classList.contains("sector")) {
                        onSectorMounted();
                        observer.disconnect();
                        return;
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", observeSectors);
