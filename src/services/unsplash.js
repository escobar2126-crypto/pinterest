const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_KEY;

export async function getPhotos() {
  const response = await fetch(
    `https://api.unsplash.com/photos?per_page=10&client_id=${ACCESS_KEY}`
  );

  const data = await response.json();
  return data;
}
