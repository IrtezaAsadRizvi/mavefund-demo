const isMobileScreen = window.innerWidth <= 768;
var previousScrollTop = 0

const initializeSectors = () => {
    const sectors = document.querySelectorAll(".sector");
    let allLi = document.querySelectorAll(".sector ul li");
    let selectedIndex = 0;
    let lastScrollTime = 0;
    const debounceTime = 100; // Adjust this value as needed

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
        selectedLi.click()
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

        const now = Date.now();
        if (now - lastScrollTime < debounceTime) {
            return;
        }
        lastScrollTime = now;

        const direction = event.deltaY > 0 ? 1 : -1;
        switchIndustry(direction)

    }

    const handleScrollMobile = (event) => {
        event.preventDefault();

        const now = Date.now();
        if (now - lastScrollTime < debounceTime) {
            return;
        }
        lastScrollTime = now;

        const scrollableDiv = document.querySelector('.sector-content-wrapper')

        if (
            scrollableDiv.scrollTop < previousScrollTop && 
            scrollableDiv.scrollTop === 0) {
            switchIndustry(0)
        }
        if (
            (scrollableDiv.scrollTop > previousScrollTop) && 
            (scrollableDiv.scrollTop + scrollableDiv.clientHeight >= scrollableDiv.scrollHeight)) {
            switchIndustry(1)
            scrollableDiv.scrollTop = 0;
        }
        previousScrollTop = scrollableDiv.scrollTop
    }

    const switchIndustry = (direction) => {
        const currentLi = allLi[selectedIndex];
        const currentUl = currentLi.parentElement;

        if (direction === 1) { // Scrolling down
            if (selectedIndex < allLi.length - 1) {
                selectedIndex++;
            } else {
                const nextUl = currentUl.nextElementSibling;
                if (nextUl) {
                    const nextLis = nextUl.querySelectorAll("li");
                    if (nextLis.length > 0) {
                        selectedIndex = Array.from(allLi).indexOf(nextLis[0]);
                    }
                }
            }
        } else { // Scrolling up
            if (selectedIndex > 0) {
                selectedIndex--;
            } else {
                const previousUl = currentUl.previousElementSibling;
                if (previousUl) {
                    const previousLis = previousUl.querySelectorAll("li");
                    if (previousLis.length > 0) {
                        selectedIndex = Array.from(allLi).indexOf(previousLis[previousLis.length - 1]);
                    }
                }
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
    if (!isMobileScreen) document.querySelector('.content-container').addEventListener("wheel", handleScroll, { passive: false });
    else {
        const scrollableDiv = document.querySelector('.content-container')
        scrollableDiv.addEventListener('touchend', handleScrollMobile);


        const toggleIcon = document.getElementById("toggleIcon");
        const sideMenu = document.querySelector(".sector-index");
        if (toggleIcon) {
            toggleIcon.addEventListener("touchend", function (event) {
                if (sideMenu.classList.contains("show")) {
                    sideMenu.classList.remove("show");
                } else {
                    sideMenu.classList.add("show");
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
                        console.log('sector mounted')
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

function updateCompanyInfo(data) {
    if (data && data.length > 0) {
        const companyData = data[0];
        document.getElementById('name-placeholder').textContent = companyData.company_name;
        document.getElementById('sector-placeholder').textContent = companyData.sector;
        document.getElementById('industry-placeholder').textContent = companyData.industry;
        document.getElementById('stars').setAttribute('data-star', companyData.rating);
        document.getElementById('companyname-placeholder').textContent = companyData.company_name;
        document.getElementById('ticker-placeholder').innerHTML = `<a href="https://mavefund.com/company?key=${companyData.ticker}">${companyData.ticker}</a>`;
        document.getElementById('full-description').textContent = companyData.description;
        document.getElementById('item-description').innerHTML = `${companyData.company_name} has been evaluated based on its fundamentals over the past five years. 
      Companies with high ratings typically demonstrate growing earnings, substantial profit margins, conservative leverage, 
      consistently high returns on equity, and a sustained practice of share repurchases.`
        document.getElementById('item-growth').innerHTML = `Over the last five years, ${companyData.company_name} has achieved an average annual return of ${companyData.avg_last_five}%. This year, 
      it holds the highest rating in its industry.`
        createRadarchart(companyData.ticker, "radarChart", "tooltip");
        addStarsFromData();
        initialDescription();
        // Get the market cap value
        let marketCap = companyData.market_cap;
        if (marketCap >= 1000000) {
            document.getElementById('marketcap-placeholder').textContent = (marketCap / 1000000).toFixed(2) + ' trillion';
        } else if (marketCap >= 1000) {
            document.getElementById('marketcap-placeholder').textContent = (marketCap / 1000).toFixed(2) + ' billion';
        } else {
            document.getElementById('marketcap-placeholder').textContent = marketCap + ' million';
        }
        document.getElementById('avggrowth5y-placeholder').textContent = companyData.avg_last_five;

    } else {
        console.error('Error fetching company data.');
    }
}

function addStarsFromData() {
    const starsDiv = document.getElementById('stars');
    let value = parseFloat(starsDiv.getAttribute('data-star')) || 0;

    starsDiv.innerHTML = ''; // Clear existing stars

    if (value < 1) {
        value = 1;
    }

    mod_value = value % 1
    mod_value = mod_value.toFixed(2)

    const fullStars = Math.floor(value);
    const halfStar = mod_value >= 0.25 && mod_value <= 0.70;
    const quarterStar = mod_value >= 0.71;

    for (let i = 0; i < fullStars; i++) {
        const starImage = document.createElement('img');
        starImage.src = '/static/image/star/star_filled_icon_200260_gold.png';
        starsDiv.appendChild(starImage); // Full star
    }

    if (halfStar) {
        const starImage = document.createElement('img');
        starImage.src = '/static/image/star/star_one_quarter_filled_icon_199689_gold.png';
        starsDiv.appendChild(starImage); // Half star
    }

    if (quarterStar) {
        const starImage = document.createElement('img');
        starImage.src = '/static/image/star/star_three_quarter_filled_icon_200261_gold.png';
        starsDiv.appendChild(starImage); // Quarter star
    }

    // Calculate the number of empty stars needed to make 5 stars
    const emptyStars = 5 - (fullStars + (halfStar ? 1 : 0) + (quarterStar ? 1 : 0));

    for (let i = 0; i < emptyStars; i++) {
        const emptyStarImage = document.createElement('img');
        emptyStarImage.src = '/static/image/star/gold-star.png';
        starsDiv.appendChild(emptyStarImage); // Empty star
    }


    // Add the numerical rating value
    const ratingText = document.createElement('span');
    ratingText.textContent = value + '/' + '5';
    ratingText.classList.add('rating-text'); // Apply the CSS class
    starsDiv.appendChild(ratingText);
}

function fetchDataFromAPI(sector, industry) {
    const apiUrl = `https://mavefund.com/api/v1/info/get_sector_industry_detail?sector=${encodeURIComponent(sector)}&industry=${encodeURIComponent(industry)}`
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => updateCompanyInfo(data))
        .catch(error => console.error('Error fetching data:', error));
}

function toggleDescription() {
    var fullDescription = document.getElementById("full-description");
    var shortDescription = document.getElementById("short-description");
    var readMoreLink = document.getElementById("read-more");

    if (fullDescription.style.display === "none") {
        fullDescription.style.display = "inline";
        shortDescription.style.display = "none";
        readMoreLink.innerHTML = "Read Less";
    } else {
        fullDescription.style.display = "none";
        shortDescription.style.display = "inline";
        readMoreLink.innerHTML = "Read More";
    }
}

function initialDescription() {
    var fullDescription = document.getElementById("full-description");
    var shortDescription = document.getElementById("short-description");
    var readMoreLink = document.getElementById("read-more");

    if (fullDescription && shortDescription && readMoreLink) {
        var maxLength = 300; // Set the maximum length for the shortened description
        var descriptionText = fullDescription.innerText;

        if (descriptionText.length > maxLength) {
            shortDescription.innerText = descriptionText.substring(0, maxLength) + " ...";
            fullDescription.style.display = "none";
            shortDescription.style.display = "inline";
            readMoreLink.style.display = "inline";
        } else {
            // If the description is already short, hide the "Read More" link
            readMoreLink.style.display = "none";
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    observeSectors()
    const sectorsContainer = document.getElementById("sectors-container");
    let currentSectorIndex = 0;
    let currentIndustryIndex = 0;
    let sectors = [];
    let industries = [];

    try {
        const response = await fetch("https://mavefund.com/api/v1/info/get_sector_industry");
        // const response = await fetch("http://localhost:8000/api/v1/info/get_sector_industry");
        const data = await response.json();

        sectors = Object.keys(data);
        industries = sectors.map(sector => data[sector]);

        let firstSector, firstIndustry, firstSectorHeading;

        for (const sector of Object.keys(data)) {
            const sectorDiv = document.createElement("div");
            sectorDiv.classList.add("sector");

            const sectorHeading = document.createElement("h2");
            sectorHeading.textContent = sector;

            const industryList = document.createElement("ul");
            industryList.classList.add("industry-list");

            // Capture the first sector heading
            if (!firstSectorHeading) {
                firstSectorHeading = sectorHeading;
            }
            const toggleIcon = document.getElementById("toggleIcon");

            data[sector].forEach((industry, index) => {
                const industryItem = document.createElement("li");
                industryItem.textContent = industry;
                industryList.appendChild(industryItem);

                industryItem.addEventListener("click", () => {
                    fetchDataFromAPI(sector, industry);
                    // Remove 'nav-selected' class from previously selected item
                    const prevSelected = document.querySelector(".nav-selected");
                    if (prevSelected) {
                        prevSelected.classList.remove("nav-selected");
                    }
                    // Add 'nav-selected' class to the clicked item
                    industryItem.classList.add("nav-selected");
                    const sideMenu = document.querySelector(".sector-index");
                    sideMenu.classList.remove("show");
                });

                if (index === 0 && !firstIndustry) {
                    firstSector = sector;
                    firstIndustry = industry;
                    industryItem.classList.add("nav-selected");
                }
            });

            sectorDiv.appendChild(sectorHeading);
            sectorDiv.appendChild(industryList);

            sectorHeading.addEventListener("click", () => {
                const currentlyOpen = document.querySelector(".industry-list.show");
                if (currentlyOpen && currentlyOpen !== industryList) {
                    currentlyOpen.classList.remove("show");
                }
                industryList.classList.toggle("show");
            });

            sectorsContainer.appendChild(sectorDiv);
        }

        // Initially load the first sector and its first industry and simulate a click on the first sector heading
        if (firstSectorHeading) {
            firstSectorHeading.click();
        }

        if (firstSector && firstIndustry) {
            fetchDataFromAPI(firstSector, firstIndustry);
        }
    } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Error fetching data. Please try again later.";
        sectorsContainer.appendChild(errorMessage);
    }

    
});
