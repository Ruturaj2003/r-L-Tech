Check for all the non-get request , if the data goes through query then do it like this
axios.post(url, body); // sent in request body
axios.post(url, null, { params }); // sent in URL

it will be in the serivces folder
