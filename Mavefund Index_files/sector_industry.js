const rightArrow = "fa-chevron-circle-right";
const leftArrow = "fa-chevron-circle-left";
const isMobileScreen = window.innerWidth <= 768;
const checkParentCollapse = (element) => {
    if (!element.parentElement.classList.contains("show")) {
        document.querySelector(".industry-list.show").classList.remove("show");
        element.parentElement.classList.add("show");
    }
};
if (!isMobileScreen) {
    document.addEventListener("DOMContentLoaded", function() {
        const scrollableDiv = document.querySelector(".body-container");
        const centralElement = document.querySelector(".center");
        let scrollThreshold = 33;
        let isScrollingIntoView = false;
        if (scrollableDiv) {
            scrollableDiv.addEventListener("scroll", function(e) {
                e.stopPropagation();
                const menuItems = document.querySelectorAll("#sectors-container li");
                const menuItemsArray = Array.from(menuItems);
                const selectedIndex = menuItemsArray.findIndex((item) => item.classList.contains("nav-selected"));
                if (isScrollingIntoView) {
                    isScrollingIntoView = false;
                    return;
                }
                let currentScrollTop = scrollableDiv.scrollTop;
                if (currentScrollTop > scrollThreshold) {
                    if (selectedIndex === menuItemsArray.length - 1) return;
                    menuItemsArray[selectedIndex].classList.remove("nav-selected");
                    menuItemsArray[selectedIndex + 1].classList.add("nav-selected");
                    menuItemsArray[selectedIndex + 1].click();
                    checkParentCollapse(menuItemsArray[selectedIndex + 1]);
                } else {
                    if (selectedIndex === 0) return;
                    menuItemsArray[selectedIndex].classList.remove("nav-selected");
                    menuItemsArray[selectedIndex - 1].classList.add("nav-selected");
                    menuItemsArray[selectedIndex - 1].click();
                    checkParentCollapse(menuItemsArray[selectedIndex - 1]);
                }
                isScrollingIntoView = true;
                centralElement.scrollIntoView({
                    behavior: "instant",
                    block: "nearest",
                });
            });
        }
    });
} else {
    document.addEventListener("DOMContentLoaded", function() {
        const toggleIcon = document.getElementById("toggleIcon");
        const sideMenu = document.querySelector(".left-sidebar");
        if (toggleIcon) {
            toggleIcon.addEventListener("click", function() {
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
    });
}