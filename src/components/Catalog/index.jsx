import { useEffect, useState } from "react";
import axios from "axios";
import './index.css';
import TrackBlock from "../TrackBlock";
import Player from "../Player";
import LoadingScreen from "../LoadingScreen";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackDetails, setCurrentTrackDetails] = useState({});
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/tracks")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Ошибка при загрузке товаров");
        setLoading(false);
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const playTrack = (track) => {
    if (currentTrack) {
      currentTrack.pause();
    }
    const audio = new Audio(`http://127.0.0.1:8000/${track.url}`);
    audio.play();
    setCurrentTrack(audio);
    setCurrentTrackDetails(track);
  };

  const playPreviousTrack = () => {
    if (currentTrackDetails) {
      const currentIndex = products.findIndex(product => product.id === currentTrackDetails.id);
      if (currentIndex > 0) {
        playTrack(products[currentIndex - 1]);
      }
    }
  };

  const playNextTrack = () => {
    if (currentTrackDetails) {
      const currentIndex = products.findIndex(product => product.id === currentTrackDetails.id);
      if (currentIndex < products.length - 1) {
        playTrack(products[currentIndex + 1]);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (currentTrack) {
        currentTrack.pause();
      }
    };
  }, [currentTrack]);

  if (showLoadingScreen) return <LoadingScreen />;
  if (loading) return <p>Загрузка товаров...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="recommended-songs">
      <h1>Recommended Songs</h1>
      <div className="song-container">
        {products.map((product) => (
          <TrackBlock
            key={product.id}
            product={product}
            onClick={() => playTrack(product)}
            isPlaying={currentTrackDetails && currentTrackDetails.id === product.id}
          />
        ))}
      </div>
      {currentTrackDetails && (
        <Player
          track={currentTrackDetails}
          audio={currentTrack}
          onPrevious={playPreviousTrack}
          onNext={playNextTrack}
        />
      )}
    </div>
  );
}
