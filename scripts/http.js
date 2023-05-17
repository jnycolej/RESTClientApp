export const sendGETRequest = async (url) => {
    const options = new Object();
    options.method = "GET";
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}