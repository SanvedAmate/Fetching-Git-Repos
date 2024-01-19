let currentPage = 1;
const reposPerPage = 10;


function fetchRepositories() {
    const username = document.getElementById('usernameInput').value.trim();
    if (!username) {
        alert('Please enter a GitHub username.');
        return;
    }

    const repoContainer = document.getElementById('repoContainer');
    repoContainer.innerHTML = ''; // Clear previous results

    // Show loading bar
    showLoadingBar();

    // Fetch user information
    $.ajax({
        url: `https://api.github.com/users/${username}`,
        method: 'GET',
        success: function (userData) {
            displayUserInfo(userData);
        },
        error: function (error) {
            console.error('Error fetching user information:', error.responseJSON.message);
            alert('Error fetching user information. Please check the username and try again.');
        }
    });

    // Fetch repositories
    $.ajax({
        url: `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${reposPerPage}`,
        method: 'GET',
        success: function (repositories, textStatus, xhr) {
            repositoriesCount = parseInt(xhr.getResponseHeader('X-Total-Count'), 10); // Get total repositories count
            hideLoadingBar(); // Hide loading bar when repositories are fetched
            displayRepositories(repositories);

            // Add pagination controls
            addPaginationControls();
        },
        error: function (error) {
            console.error('Error fetching repositories:', error.responseJSON.message);
            alert('Error fetching repositories. Please check the username and try again.');
            hideLoadingBar(); // Hide loading bar on error
        }
    });
}


function addPaginationControls() {
    const paginationContainer = document.getElementById('paginationContainer');

    // Clear previous pagination controls
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
    }

    // Add "Previous" button if not on the first page
    if (currentPage > 1) {
        const previousButton = createPaginationButton('Previous', currentPage - 1);
        paginationContainer.appendChild(previousButton);
    }

    // Add numbered page buttons
    const totalPages = Math.ceil(repositoriesCount / reposPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPaginationButton(i, i);
        paginationContainer.appendChild(pageButton);
    }

    // Add "Next" button if not on the last page
    if (currentPage < totalPages) {
        const nextButton = createPaginationButton('Next', currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }
}

function createPaginationButton(label, page) {
    const button = document.createElement('button');
    button.textContent = label;
    button.classList.add('btn', 'btn-secondary', 'mx-2');

    if (Number.isInteger(page)) {
        // If it's a numbered page, update the button's label and page
        button.textContent = page;
        button.onclick = function () {
            currentPage = page;
            fetchRepositories();
        };
    } else {
        // If it's "Next" or "Previous", handle as before
        button.onclick = function () {
            currentPage = page;
            fetchRepositories();
        };
    }

    return button;
}

function showLoadingBar() {
    const loadingBar = document.getElementById('loadingBar');
    if (loadingBar) {
        loadingBar.style.display = 'block';
    }
}

function hideLoadingBar() {
    const loadingBar = document.getElementById('loadingBar');
    if (loadingBar) {
        loadingBar.style.display = 'none';
    }
}

function displayUserInfo(userData) {
    const userContainer = document.getElementById('userContainer');
    userContainer.innerHTML = ''; // Clear previous user information

    const profileImageContainer = document.createElement('div');
    profileImageContainer.id = 'profileImage';
    const userImage = document.createElement('img');
    userImage.src = userData.avatar_url;
    userImage.alt = 'User Avatar';
    userImage.classList.add('rounded-circle');
    profileImageContainer.appendChild(userImage);

    const userInfoContainer = document.createElement('div');

    const userName = document.createElement('h2');
    userName.textContent = userData.name || 'Name not available';
    userInfoContainer.appendChild(userName);

    const userBio = document.createElement('p');
    userBio.textContent = userData.bio || 'Bio not available';
    userInfoContainer.appendChild(userBio);

    // Add user's location
    if (userData.location) {
        const locationElement = document.createElement('p');
        locationElement.textContent = `Location: ${userData.location}`;
        userInfoContainer.appendChild(locationElement);
    }

    userContainer.appendChild(profileImageContainer);
    userContainer.appendChild(userInfoContainer);

    // Add GitHub link and Twitter handle
    if (userData.html_url) {
        const githubLink = createProfileLink('GitHub', userData.html_url);
        userInfoContainer.appendChild(githubLink);
    }

    if (userData.twitter_username) {
        const twitterLink = createProfileLink('Twitter', `https://twitter.com/${userData.twitter_username}`);
        userInfoContainer.appendChild(twitterLink);
    }
}

function createProfileLink(label, link) {
    const linkElement = document.createElement('p');
    const anchorElement = document.createElement('a');
    anchorElement.href = link;
    anchorElement.textContent = `${label}: ${link}`;
    anchorElement.target = '_blank';
    anchorElement.rel = 'noopener noreferrer';
    anchorElement.classList.add('profile-link');
    linkElement.appendChild(anchorElement);
    return linkElement;
}

function displayUser(profileData) {
    const userContainer = document.getElementById('userContainer');
    userContainer.innerHTML = ''; // Clear previous user information

    // Create a container for the user profile
    const userProfile = document.createElement('div');
    userProfile.classList.add('user-profile');

    // Create elements for profile information
    const profileImage = document.createElement('div');
    profileImage.id = 'profileImage';
    const img = document.createElement('img');
    img.src = profileData.avatar_url;
    profileImage.appendChild(img);

    const userInfo = document.createElement('div');
    const userName = document.createElement('h2');
    userName.textContent = profileData.name || profileData.login;

    const userBio = document.createElement('p');
    userBio.textContent = profileData.bio || 'No bio available.';

    userInfo.appendChild(userName);
    userInfo.appendChild(userBio);

    userProfile.appendChild(profileImage);
    userProfile.appendChild(userInfo);

    // Append the user profile to the container
    userContainer.appendChild(userProfile);
}

function displayRepositories(repositories) {
    const repoContainer = document.getElementById('repoContainer');
    repoContainer.innerHTML = ''; // Clear previous repositories

    // Create a new container for the columns
    const repoColumns = document.createElement('div');
    repoColumns.classList.add('repo-columns');

    // Iterate through repositories and create cards
    repositories.forEach((repo, index) => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');

        const repoName = document.createElement('h3');
        repoName.textContent = repo.name;

        const repoDescription = document.createElement('p');
        repoDescription.textContent = repo.description || 'No description available.';

        const repoLanguages = document.createElement('p');
        repoLanguages.classList.add('language-box');
        repoLanguages.textContent = repo.language || 'Not specified';

        repoCard.appendChild(repoName);
        repoCard.appendChild(repoDescription);
        repoCard.appendChild(repoLanguages);

        repoColumns.appendChild(repoCard);
    });

    // Append the columns to the repo container
    repoContainer.appendChild(repoColumns);
}

function addPaginationControls() {
    const paginationContainer = document.getElementById('paginationContainer');

    // Clear previous pagination controls
    if (paginationContainer) {
        paginationContainer.remove();
    }

    // Create a new pagination container
    const newPaginationContainer = document.createElement('div');
    newPaginationContainer.id = 'paginationContainer';
    newPaginationContainer.classList.add('mt-3');

    // Add "Previous" button if not on the first page
    if (currentPage > 1) {
        const previousButton = createPaginationButton('Previous', currentPage - 1);
        newPaginationContainer.appendChild(previousButton);
    }

    // Add current page indicator
    const currentPageIndicator = document.createElement('span');
    currentPageIndicator.textContent = `Page ${currentPage}`;
    currentPageIndicator.classList.add('mx-2');
    newPaginationContainer.appendChild(currentPageIndicator);

    // Add "Next" button
    const nextButton = createPaginationButton('Next', currentPage + 1);
    newPaginationContainer.appendChild(nextButton);

    // Append the new pagination container
    document.getElementById('repoContainer').insertAdjacentElement('afterend', newPaginationContainer);
}

function createPaginationButton(label, page) {
    const button = document.createElement('button');
    button.textContent = label;
    button.classList.add('btn', 'btn-secondary', 'mx-2');
    button.onclick = function () {
        currentPage = page;
        fetchRepositories();
    };
    return button;
}

document.addEventListener('DOMContentLoaded', function () {
    fetchRepositories();
});
