import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@mui/icons-material";
import "./App.css";
import axios from "axios";
import { format } from "timeago.js";
import timeago from "javascript-time-ago";
import Register from "./components/register";
import Login from "./components/login";



function App() {

  const myStorage=window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setnewPlace] = useState(null);

  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister,setShowRegister]=useState(true);
  const[showLogin,setShowLogin]=useState(false);

  const [viewport, setViewport] = useState({
    latitude: 48.8584,
    longitude: 2.2945,
    zoom: 4,
  });

  //To get all the pins whenever refreshed  useEffect is used

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        // console.log(res.data);
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    //Without calling function it is not going to work
    getPins();
  }, []);
  //Handle Click at time of Choosing point

  const handleAddClick = async (e) => {
    try {
      const data = e.lngLat;
      // console.log(typeof(data.lat));
      setnewPlace({
        lat: data.lat,
        long: data.lng,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setnewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <Map
        {...viewport}
        style={{ height: "100vh", width: "100vw" }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        transitionDuration="200"
        onMove={(e) => setViewport(e.viewport)}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onDblClick={handleAddClick}
      >
        {pins.map((p) => {
          return (
            <div key={p._id}>
              <Marker
                latitude={p.lat}
                longitude={p.long}
                offsetLeft={-20}
                offsetTop={-10}
                anchor="bottom"
                color="blue"
              >
                <Room
                  style={{
                    // fontSize:viewport.zoom*12,
                    color:
                      p.currentUsername === p.username ? "tomato" : "slateblue",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                />
                <div>You are Here</div>
              </Marker>
              {p._id === currentPlaceId && (
                <Popup
                  key={p._id}
                  latitude={p.lat}
                  longitude={p.long}
                  anchor="left"
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                    <label>Review</label>
                    <p className="desc">{p.desc}</p>
                    <label>Rating</label>
                    <div className="star">
                      {Array(p.rating).fill(<Star className="star" />)}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by <b>{p.username}</b>
                    </span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </div>
          );
        })}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setnewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter the title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <input
                  placeholder="Mention about this location"
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUsername ? (
          <button className="button logout">Logout</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={()=>setShowLogin(true)}>Login</button>
            <button className="button register" onClick={()=>setShowRegister(true)}>register</button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin  && <Login setShowLogin={setShowLogin}  myStorage={myStorage} />}
      </Map>
    </div>
  );
}

export default App;
