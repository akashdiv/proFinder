const CLIENT_ID = '3edcc1880f2e7a7d7b59';
const CLIENT_SECRET = '4fb08a7148c486f7b5661c10747386066248a6ca';

async function getData(name){
  const res = await fetch(`https://api.github.com/users/${name}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`);
  const data = await res.json();
  return data;
}

async function getRepos(profile){
  const res = await fetch(`${profile.repos_url}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&per_page=10`);
  const repo = await res.json();
  return repo;
}

document.querySelector('#search').addEventListener('submit', async(e) => {
  e.preventDefault();
  const getUserName = document.querySelector('#findByUsername').value;

  if(!getUserName) return

  const profile = await getData(getUserName);

  if(profile.message === 'Not Found'){
    document.querySelector('.notFound').style.display = 'block';
    document.querySelector('.user-details').style.display = 'none';
  }

  const repos = await getRepos(profile);
  document.querySelector('.user-details').style.display = 'flex';
  showProfile(profile);
  showRepos(repos)
});

function showProfile(profile){
  document.querySelector('.profile').innerHTML = `
    <img src="${profile.avatar_url}" alt="${profile.name}" />
    <p class="name">${profile.name}</p>
    <p class="username login">${profile.login}</p>
    <p class="bio">
      ${profile.bio}
    </p>

    <div class="followers-stars">
      <p>
        <ion-icon name="people-outline"></ion-icon>
        <span class="followers">${profile.followers}</span> followers
      </p>
      <span class="dot">·</span>
      <p><span class="following">${profile.following}</span> following</p>
    </div>
    <p class="company">
      <ion-icon name="business-outline"></ion-icon>
      ${profile.company}
    </p>
    <p class="location">
      <ion-icon name="location-outline"></ion-icon>${profile.location}
    </p>    
  `;
};

function showRepos(reposi){

  let newHtml = '';

  for(let repo of reposi){
    newHtml = `
    <div class="repo">
      <div class="repo_name">
        <a href="${repo.html_url}">${repo.name}</a>
      </div>
      <p>
        <span class="circle"></span> ${repo.language}
        <ion-icon name="star-outline"></ion-icon> ${repo.watchers_count}
        <ion-icon name="git-branch-outline"></ion-icon> ${repo.forks_count}
      </p>
    </div>
    `;
    document.querySelector('.repos').insertAdjacentHTML('afterbegin', newHtml);
  }
}