import React, { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [searchTermsInput, setSearchTermsInput] = useState("");
  const [searchTerms, setSearchTerms] = useState([]);

  const handleSearchTermsChange = (e) => {
    setSearchTermsInput(e.target.value);
  };

  const handleFetchData = async () => {
    setLoading(true);

    // Replace <YOUR_API_TOKEN> with your actual Apify API token
    const apiToken = "apify_api_5N2jPVDR7eboInkTo99ugeK19hNQ0L2PztR4";

    // Replace this URL with the appropriate API endpoint for your use case
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

      // Parse the response JSON
      const data = await response.json();

      // Print or use the data as needed
      console.log("Results from dataset", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <p>
        {loading ? "Fetching data from Apify..." : "Data fetched successfully"}
      </p>
      <label>
        Search Terms (comma-separated):
        <input
          type="text"
          value={searchTermsInput}
          onChange={handleSearchTermsChange}
          placeholder="e.g., green day, billie joe armstrong"
        />
      </label>
      <button onClick={handleFetchData} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Data"}
      </button>
    </div>
  );
}

export default App;
