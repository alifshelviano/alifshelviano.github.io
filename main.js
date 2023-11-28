let Access_Key = "Id2V7q6vjx-Bma-LFw26lG0Inl6eV8dxk0VPjq4Bqdc";
let searchInput = document.getElementById("searchInput");
let showData = document.querySelector(".showData");
let moreBtn = document.getElementById("moreBtn");

let page = 1;

const getCollections = async (username) => {
    try {
        let fetching = await fetch(`https://api.unsplash.com/users/${username}/collections?client_id=${Access_Key}`);
        let collectionsData = await fetching.json();
        return collectionsData;
    } catch (error) {
        console.error("Error fetching collection data:", error);
        return [];
    }
};

const getCollectionId = (collections, collectionName) => {
    let targetCollection = collections.find(collection => collection.title === collectionName);
    return targetCollection ? targetCollection.id : null;
};

const getData = async (username, collectionName, pageNo) => {
    try {
        // Get the collections owned by the specified username
        const collections = await getCollections(username);

        // Find the collection ID based on the collection name
        const collectionId = getCollectionId(collections, collectionName);

        if (!collectionId) {
            console.error("Collection not found");
            return;
        }

        // Fetch images from the specified collection
        let fetching = await fetch(`https://api.unsplash.com/collections/${collectionId}/photos?per_page=25&page=${pageNo}&client_id=${Access_Key}`);
        let jsonData = await fetching.json();
        console.log(jsonData);

        if (pageNo === 1) {
            showData.innerHTML = "";
        }

        if (searchInput.value === "") {
            showData.innerHTML = `<h1>Please enter a collection name</h1>`;
        } else {
            document.querySelector(".loadMore").style.display = "block";
        }

        jsonData.forEach(function (data) {
            console.log(data);

            let div = document.createElement("div");
            div.classList.add("card");
            showData.appendChild(div);

            div.innerHTML = `
                <img src=${data.urls.small} alt="">
                <a href=${data.links.html} target="_blank">${data.alt_description}</a>
            `;
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Usage in the event listeners...
document.getElementById("searchBtn").addEventListener("click", function () {
    let collectionName = searchInput.value.trim();
    if (collectionName !== "") {
        page = 1; // Reset page to 1 when initiating a new search
        const alifseeUsername = "alifsee";
        getData(alifseeUsername, collectionName, page);
    } else {
        alert("Please enter a collection name.");
    }
});

document.getElementById("moreBtn").addEventListener("click", function () {
    let collectionName = searchInput.value.trim();
    if (collectionName !== "") {
        page++; // Increment page for the next set of results
        const alifseeUsername = "alifsee";
        getData(alifseeUsername, collectionName, page);
    } else {
        alert("Please enter a collection name.");
    }
});
