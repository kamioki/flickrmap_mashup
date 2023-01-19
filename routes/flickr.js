const FlickrAPI = 'YOURAPI';
// const FlickrAPI = process.env.FLICKR_API;


//Generate URL query for Flickr
function createFlickrOptions(tags, username) {
  const options = {
    hostname: 'api.flickr.com',
    path: '/services/rest/?'
  };
  const flickr = {
    method: 'flickr.photos.search',
    api_key: FlickrAPI,
    geo: 1,
    format: "json",
    media: "photos",
    nojsoncallback: 1
  };
  var str = 'method=' + flickr.method +
    '&api_key=' + flickr.api_key +
    '&has_geo=' + flickr.geo +
    '&extras=tags,owner_name,geo,description,date_taken';
  // If tags exist
  if (tags !== '') {
    str = str + '&tags=' + tags;
  }
  // If Username exist
  if (username !== '') {
    str = str + '&username=' + username;
  }
  str = str + '&format=' + flickr.format +
    '&media=' + flickr.media +
    '&nojsoncallback=' + flickr.nojsoncallback;
  options.path += str;
  return options;
}

// Parse photo resp
function ParsePhotoRsp(photos) {
  for (var i = 0; i < photos.length; i++) {
    let photo = photos[i];

    photo["photoURL"] = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`;

    photo["webURL"] = `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
  }
  return photos;
};

module.exports = { ParsePhotoRsp, createFlickrOptions };