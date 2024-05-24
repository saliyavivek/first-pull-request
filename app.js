var input = document.querySelector("input");
var author = "";

var contentData = document.querySelector(".content-data");
var contentBottom = document.querySelector(".content-bottom");

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    author = input.value;
    getData(author);
  }
});

var title = document.querySelector("#data-title");
var num = document.querySelector("#data-number");
var to = document.querySelector("#data-to");
var img = document.querySelector("#data-image");
var username = document.querySelector("#data-user");
var createdAt = document.querySelector("#created-at");
var pullStatus = document.querySelector("#data-status");
var seeEvery = document.querySelector("#every-pr");
var byAuthor = document.querySelector("#by-author");
var bottomBy = document.querySelector("#bottom-by");

const getData = async (author) => {
  await fetch(
    `https://api.github.com/search/issues?q=type:pr+author:${author}&sort=created&order=asc&per_page=1`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.total_count === 0) {
        alert(`It doesn't look like ${author} has sent a pull request yet.`);
        input.value = "";
        input.focus();
        return;
      }
      input.blur();
      contentData.style.display = "flex";
      title.href = data.items[0].user.html_url;
      title.innerHTML = data.items[0].title;
      num.innerHTML = "#" + data.items[0].number;
      img.src = data.items[0].user.avatar_url;
      username.href = data.items[0].user.html_url;
      username.innerHTML = data.items[0].user.login;

      let date = data.items[0].created_at;
      createdAt.innerHTML = convertDate(date);

      if (data.items[0].pull_request.merged_at) {
        pullStatus.innerHTML = "Merged";
      } else {
        pullStatus.innerHTML = "Closed";
        pullStatus.style.backgroundColor = "#fde8ef";
        pullStatus.style.color = "#a81d40";
      }

      let url = data.items[0].html_url;
      to.href = formatURL(url);
      const parts = url.split("/");
      const repositoryPath = parts[3] + "/" + parts[4];
      to.innerHTML = repositoryPath;

      seeEvery.href = `https://github.com/search?q=is%3Apr+author%3A${author}&type=Issues`;
      seeEvery.innerHTML = "See every pull request";
      byAuthor.href = data.items[0].user.html_url;
      byAuthor.innerHTML = author;
      bottomBy.innerHTML = " by";
    });
};

function formatURL(url) {
  const parts = url.split("/");
  const baseURL = `${parts[0]}//${parts[2]}/${parts[3]}/${parts[4]}`;
  return baseURL;
}

function convertDate(dateString) {
  const givenDate = new Date(dateString);
  const currentDate = new Date();

  const diffInMilliseconds = currentDate - givenDate;

  const millisecondsInOneDay = 24 * 60 * 60 * 1000;
  const millisecondsInOneMonth = millisecondsInOneDay * 30.44;
  const millisecondsInOneYear = millisecondsInOneDay * 365.25;

  const diffInYears = Math.floor(diffInMilliseconds / millisecondsInOneYear);
  const diffInMonths = Math.floor(
    (diffInMilliseconds % millisecondsInOneYear) / millisecondsInOneMonth
  );
  const diffInDays = Math.floor(
    (diffInMilliseconds % millisecondsInOneMonth) / millisecondsInOneDay
  );

  if (diffInYears > 0) {
    return (relativeTime =
      diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`);
  } else if (diffInMonths > 0) {
    return (relativeTime =
      diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`);
  } else if (diffInDays > 0) {
    return (relativeTime =
      diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`);
  } else {
    return (relativeTime = "today");
  }
}
