const getSvgIconPath = (title) => {
  const formattedTitle = title.toLowerCase().replace(/\s+/g, ''); // Format title to match file names
  return `/brands/${formattedTitle}.svg`;
};


export default getSvgIconPath