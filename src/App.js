import React, { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    // Replace <YOUR_API_TOKEN> with your actual Apify API token
    const apiToken = "apify_api_5N2jPVDR7eboInkTo99ugeK19hNQ0L2PztR4";

    // Replace this URL with the appropriate API endpoint for your use case
    const apiUrl =
      "https://api.apify.com/v2/acts/apidojo~tweet-scraper/run-sync-get-dataset-items?token=" +
      apiToken;

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
      searchTerms: ["green day", "billie joe armstrong"],
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
      {/* You can render any React components here */}
      <p>
        {loading ? "Fetching data from Apify..." : "Data fetched successfully"}
      </p>
      <button onClick={fetchData} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Data"}
      </button>
    </div>
  );
}

export default App;
