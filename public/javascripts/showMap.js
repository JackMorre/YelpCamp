mapboxgl.accessToken = process.env.MAPBOX_TOKEN || mapToken;
const coord = campground.geometry.coordinates;
const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/light-v10", // style URL
	center: coord, // starting position [lng, lat]
	zoom: 9, // starting zoom
});

new mapboxgl.Marker()
	.setLngLat(coord)
	.setPopup(
		new mapboxgl.Popup({ offset: 25, className: "my-class" })
			.setHTML(`<h3>${campground.title}</h3><h4>${campground.location}</h4>`)
			.setMaxWidth("300px")
	)
	.addTo(map);
