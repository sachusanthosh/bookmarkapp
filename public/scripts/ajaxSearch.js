
document.getElementById("searchForm").addEventListener("keyup", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
        alert("Please enter a search query");
        return;
    }

    // Perform the AJAX request
    fetch(`/bookmark/search?query=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                const bookmarksContainer =
                    document.getElementById("bookmarksContainer");
                bookmarksContainer.innerHTML = ""; // Clear previous bookmarks

                if (data.bookmarks.length === 0) {
                    bookmarksContainer.innerHTML = "<p>No bookmarks found</p>";
                    return;
                }

                data.bookmarks.forEach((bookmark) => {
                    const bookmarkElement = document.createElement("div");
                    bookmarkElement.classList.add("col-sm-6");
                    bookmarkElement.innerHTML = `
                          <div class="card">
                            <div class="card-header">
                              <h5 class="card-title"><b>${bookmark.title}</b></h5>
                            </div>
                            <div class="card-body">
                              <p class="card-text"><a href="${bookmark.url}" target="_blank">${bookmark.url}</a></p>
                              <br>
                              <p class="time">Created at: ${new Date(bookmark.createdAt).toLocaleString()}</p>
                              <a style="background-color: #47a2a9; color: #fff;" href="/bookmark/edit/${bookmark._id}" class="btn">Edit</a>
                              <a style="background-color: #f54854" href="/bookmark/delete/${bookmark._id}" class="btn btn-danger">Delete</a>
                            </div>
                          </div>`;
                    bookmarksContainer.appendChild(bookmarkElement);
                });
            } else {
                console.log("Error:", data.message);
            }
        })
        .catch((error) => console.error("Error:", error));
});
