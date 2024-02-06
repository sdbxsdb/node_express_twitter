import React, { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [searchTermsInput, setSearchTermsInput] = useState("");
  const [twitterHandlesInput, setTwitterHandlesInput] = useState("");
  const [geocodeInput, setGeocodeInput] = useState("");
  const [follow, setFollow] = useState("");
  const [distance, setDistance] = useState("");
  const [data, setData] = useState(undefined);
  const [followData, setFollowData] = useState(undefined);
  const [radioOption, setRadioOption] = useState("followers");

  const removeSpaces = (inputString) => {
    const resultString = inputString.replace(/\s+/g, "");
    return resultString;
  };

  const handleRadioChange = (option) => {
    setRadioOption(option);
  };

  const handleFollowChange = (e) => {
    setFollow(e.target.value);
  };
  const handleSearchTermsChange = (e) => {
    setSearchTermsInput(e.target.value);
  };

  const handleTwitterHandlesChange = (e) => {
    setTwitterHandlesInput(e.target.value);
  };

  const handleGeocodeChange = (e) => {
    setGeocodeInput(e.target.value);
  };

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  const handleFetchData = async () => {
    setLoading(true);

    const apiToken = "apify_api_5N2jPVDR7eboInkTo99ugeK19hNQ0L2PztR4";

    const apiUrl =
      "https://api.apify.com/v2/acts/apidojo~tweet-scraper/run-sync-get-dataset-items?token=" +
      apiToken;

    const inputSearchTerms = searchTermsInput
      ? searchTermsInput.split(",").map((term) => term.trim())
      : null;

    const inputTwitterHandles = twitterHandlesInput
      ? twitterHandlesInput.split(",").map((handle) => handle.trim())
      : null;

    const inputDistance = distance ? distance.trim() + "km" : null;

    const inputGeocode = geocodeInput
      ? geocodeInput
          .split(",")
          .map((handle) => {
            const trimmedHandle = removeSpaces(handle.trim());
            // Use parseFloat to convert to a floating-point number, and then use toFixed(7)
            // to limit to 7 decimal places
            return parseFloat(trimmedHandle).toFixed(7);
          })
          .join(",") +
        "," +
        inputDistance
      : null;

    const input = {
      customMapFunction: "(object) => { return {...object} }",
      maxItems: 20,
      maxTweetsPerQuery: 20,
      minimumFavorites: 0,
      minimumReplies: 0,
      minimumRetweets: 0,
      onlyImage: false,
      onlyQuote: false,
      onlyTwitterBlue: false,
      onlyVerifiedUsers: false,
      onlyVideo: false,
      ...(inputGeocode && { geocode: inputGeocode }),
      ...(inputSearchTerms && { searchTerms: inputSearchTerms }),
      ...(inputTwitterHandles && { twitterHandles: inputTwitterHandles }),
      sort: "Top",
      tweetLanguage: "en",
    };

    try {
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

  const handleFollowersAndFollowingData = async () => {
    setLoading(true);

    const apiToken = "apify_api_5N2jPVDR7eboInkTo99ugeK19hNQ0L2PztR4";

    const apiUrl =
      "https://api.apify.com/v2/acts/apidojo~twitter-user-scraper/run-sync-get-dataset-items?token=" +
      apiToken;

    const input = {
      maxItems: 50,
      twitterHandles: [follow],
      getFollowers: radioOption === "followers",
      getFollowing: radioOption === "following",
      getRetweeters: false,
      getFavorites: false,
      customMapFunction: "(object) => { return {...object} }",
    };

    try {
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

      console.log("DATA-", data);
      setFollowData(data);
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
          disabled={twitterHandlesInput || geocodeInput || distance || follow}
          className="border border-red p-2 w-full"
          type="text"
          value={searchTermsInput}
          onChange={handleSearchTermsChange}
          placeholder="e.g. green day, avril lavigne"
        />
      </label>
      <label className="block mb-4">
        Twitter Handles (comma-separated):
        <input
          disabled={searchTermsInput || geocodeInput || distance || follow}
          className="border border-blue p-2 w-full"
          type="text"
          value={twitterHandlesInput}
          onChange={handleTwitterHandlesChange}
          placeholder="e.g. ThePaulMcBride"
        />
      </label>
      <div className="flex gap-4">
        <label className="block mb-4 w-11/12">
          Followers / Following for a user Handles:
          <input
            disabled={
              searchTermsInput ||
              geocodeInput ||
              distance ||
              twitterHandlesInput
            }
            className="border border-blue p-2 w-full"
            type="text"
            value={follow}
            onChange={handleFollowChange}
            placeholder="e.g. ThePaulMcBride"
          />
        </label>

        <div className="flex items-center mb-4">
          <label className="mr-4">
            <input
              type="radio"
              value="followers"
              checked={radioOption === "followers"}
              onChange={() => handleRadioChange("followers")}
            />
            Followers
          </label>
          <label>
            <input
              type="radio"
              value="following"
              checked={radioOption === "following"}
              onChange={() => handleRadioChange("following")}
            />
            Following
          </label>
        </div>
      </div>
      <div className="flex gap-4">
        <label className="block mb-4 w-11/12">
          Geocode (lat,long):
          <input
            disabled={searchTermsInput || twitterHandlesInput || follow}
            className="border border-blue p-2 w-full"
            type="text"
            value={geocodeInput}
            onChange={handleGeocodeChange}
            placeholder="e.g. 54.6014331,-5.9300267"
          />
        </label>
        <label className="block mb-4">
          Distance (km):
          <input
            disabled={searchTermsInput || twitterHandlesInput || follow}
            className="border border-blue p-2 w-full"
            type="text"
            value={distance}
            onChange={handleDistanceChange}
            placeholder="e.g. 10"
          />
        </label>
      </div>
      <div className="flex w-full justify-end">
        <button
          onClick={follow ? handleFollowersAndFollowingData : handleFetchData}
          disabled={loading}
          className={`bg-blue-500 text-white p-2 float rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Fetching..." : "Fetch Tweets"}
        </button>
      </div>

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
                <strong>User Mentions:</strong>{" "}
                {item?.author?.entities?.description?.user_mentions?.map(
                  (singleUserMention) => (
                    <p className="pl-4">{singleUserMention.screen_name}</p>
                  )
                )}
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
                <strong>Is Verified:</strong>{" "}
                {item.author.isVerified ? "Yes" : "No"}
              </p>

              <p>
                <strong>Tweet Text:</strong> {item.text}
              </p>
              {item.quote && (
                <div className="pl-12 mt-4">
                  <p>
                    <strong>Quoting:</strong> {item.quote?.authorName}
                  </p>
                  <p>
                    <strong>Created At:</strong> {item.quote?.createdAt}
                  </p>
                  <p>
                    <strong>Bookmark Count:</strong> {item.quote?.bookmarkCount}
                  </p>
                  <p>
                    <strong>Like Count:</strong> {item.quote?.likeCount}
                  </p>
                  <p>
                    <strong>Quote Count:</strong> {item.quote?.quoteCount}
                  </p>
                  <p>
                    <strong>Reply Count:</strong> {item.quote?.replyCount}
                  </p>
                  <p>
                    <strong>ReTweet Count:</strong> {item.quote?.retweetCount}
                  </p>
                  <p>
                    <strong>Text:</strong> {item.quote?.text}
                  </p>
                </div>
              )}
              {item.retweet && (
                <div className="pl-12 mt-4">
                  <p>
                    <strong>Retweet of:</strong> {item.retweet?.authorName}
                  </p>
                  <p>
                    <strong>Created At:</strong> {item.retweet?.createdAt}
                  </p>
                  <p>
                    <strong>Like Count:</strong> {item.retweet?.likeCount}
                  </p>
                  <p>
                    <strong>Quote Count:</strong> {item.retweet?.quoteCount}
                  </p>
                  <p>
                    <strong>Bookmark Count:</strong>{" "}
                    {item.retweet?.bookmarkCount}
                  </p>
                  <p>
                    <strong>Reply Count:</strong> {item.retweet?.replyCount}
                  </p>
                  <p>
                    <strong>ReTweet Count:</strong> {item.retweet?.retweetCount}
                  </p>
                  <p>
                    <strong>Text:</strong> {item.retweet?.text}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 w-full justify-center">
                {item?.media?.map((media, index) =>
                  media.includes("video") ? (
                    <video
                      key={index}
                      src={media}
                      controls
                      className="my-2 rounded-lg shadow-md max-h-[600px]"
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

      {followData && (
        <div className="mt-8">
          <div className="border p-4 mb-4 rounded-lg shadow-md">
            <p>
              <strong>Searched for Handle:</strong> {followData[0].name}
              {followData[0].username}
            </p>
            <p>
              <strong>Cover Picture:</strong>{" "}
              <img
                src={followData[0].coverPicture}
                alt="Profile"
                className="w-full object-contain"
              />
            </p>
            <p>
              <strong>Profile Picture:</strong>{" "}
              <img
                src={followData[0].profilePicture}
                alt="Profile"
                className="rounded-full w-16 h-16 object-cover"
              />
            </p>
            <p>
              <strong>Bio:</strong> {followData[0].description}
            </p>
            <p>
              <strong>Followers:</strong> {followData[0].followers}
            </p>
            <p>
              <strong>Following:</strong> {followData[0].following}
            </p>
            <p>
              <strong>Location:</strong> {followData[0].location}
            </p>
          </div>

          <div className="mb-4 mt-12">
            <p>
              <strong>
                {followData[0].name} is{" "}
                {radioOption === "followers" ? "Followers" : "following"}:
              </strong>
            </p>
          </div>

          {followData?.slice(1).map((item) => (
            <div key={item.id} className="border p-4 mb-4 rounded-lg shadow-md">
              <p>
                <strong>Profile Picture:</strong>{" "}
                <img
                  src={item.profilePicture}
                  alt="Profile"
                  className="rounded-full w-16 h-16 object-cover"
                />
              </p>
              <p>
                <strong>Username:</strong> {item.userName}
              </p>
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Description:</strong> {item.description}
              </p>
              <p>
                <strong>Followers:</strong> {item.followers}
              </p>
              <p>
                <strong>Following:</strong> {item.following}
              </p>
              <p>
                <strong>Media Count:</strong> {item.mediaCount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
