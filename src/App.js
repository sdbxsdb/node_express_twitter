import React, { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [searchTermsInput, setSearchTermsInput] = useState("");
  const [data, setData] = useState(undefined);

  const handleSearchTermsChange = (e) => {
    setSearchTermsInput(e.target.value);
  };

  const handleFetchData = async () => {
    setLoading(true);

    const apiToken = "apify_api_5N2jPVDR7eboInkTo99ugeK19hNQ0L2PztR4";

    const apiUrl =
      "https://api.apify.com/v2/acts/apidojo~tweet-scraper/run-sync-get-dataset-items?token=" +
      apiToken;

    // Convert the input string to an array of search terms
    const inputSearchTerms = searchTermsInput
      .split(",")
      .map((term) => term.trim());

    // Specify your input payload here
    const input = {
      customMapFunction: "(object) => { return {...object} }",
      maxItems: 50,
      maxTweetsPerQuery: 50,
      minimumFavorites: 0,
      minimumReplies: 0,
      minimumRetweets: 0,
      onlyImage: false,
      onlyQuote: false,
      onlyTwitterBlue: false,
      onlyVerifiedUsers: false,
      onlyVideo: false,
      searchTerms: inputSearchTerms,
      sort: "Top",
      tweetLanguage: "en",
    };

    try {
      // Make a POST request to run the Actor synchronously and get dataset items
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data from Apify");
      }

      const data = await response.json();

      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("DATA-", data);

  return (
    <div className="container mx-auto mt-8 p-8 border rounded-lg shadow-lg">
      <p className="text-center font-bold text-xl mb-4">Tweets by keyword</p>
      <label className="block mb-4">
        Search Terms (comma-separated):
        <input
          className="border border-red p-2 w-full"
          type="text"
          value={searchTermsInput}
          onChange={handleSearchTermsChange}
          placeholder="e.g., green day, billie joe armstrong"
        />
      </label>
      <button
        onClick={handleFetchData}
        disabled={loading}
        className={`bg-blue-500 text-white p-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Fetching..." : "Fetch Data"}
      </button>

      {data && (
        <div className="mt-8">
          {data?.map((item) => (
            <div key={item.id} className="border p-4 mb-4 rounded-lg shadow-md">
              <p>
                <strong>Author:</strong> {item.author.name} (@
                {item.author.username})
              </p>
              <p>
                <strong>Profile Picture:</strong>{" "}
                <img
                  src={item.author.profilePicture}
                  alt="Profile"
                  className="rounded-full w-16 h-16 object-cover"
                />
              </p>
              <p>
                <strong>Followers:</strong> {item.author.followers}
              </p>

              <p>
                <strong>Retweets:</strong> {item.retweetCount}
              </p>
              <p>
                <strong>Likes:</strong> {item.likeCount}
              </p>
              <p>
                <strong>Reply Count:</strong> {item.replyCount}
              </p>
              <p>
                <strong>Quote Count:</strong> {item.quoteCount}
              </p>
              <p>
                <strong>Created At:</strong> {item.createdAt}
              </p>
              <p>
                <strong>Bookmark Count:</strong> {item.bookmarkCount}
              </p>
              <p>
                <strong>View Count:</strong> {item.viewCount}
              </p>
              <p>
                <strong>Is Verified:</strong>{" "}
                {item.author.isVerified ? "Yes" : "No"}
              </p>

              <p>
                <strong>Tweet Text:</strong> {item.text}
              </p>

              <div className="flex flex-wrap gap-4 w-full justify-center">
                {item?.media?.map((media, index) =>
                  media.includes("video") ? (
                    <video
                      key={index}
                      src={media}
                      controls
                      className="my-2 rounded-lg shadow-md"
                    ></video>
                  ) : (
                    <img
                      key={index}
                      src={media}
                      alt="Media"
                      className="my-2 rounded-lg max-w-[400px] shadow-md "
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
