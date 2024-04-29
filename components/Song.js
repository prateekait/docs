import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

const Song = ({ order, track }) => {
  const song = track.track;
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(song.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [song.uri]
    })
  }

  return (
    <div className="grid grid-cols-2 text-[#808080] py-3 px-5 hover:bg-[#303030] rounded-lg hover:text-white hover:cursor-pointer" onClick={playSong}>
      <div className="flex items-center space-x-4">
        <p>{++order}</p>
        <img src={song.album.images[0].url} alt="" className="w-10 h-10" />
        <div>
          <p className="w-36 lg:w-64 truncate text-white">{song.name}</p>
          <p className="w-40">{song.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <div className="hidden md:inline">{song.album.name}</div>
        <div>{millisToMinutesAndSeconds(song.duration_ms)}</div>
      </div>
    </div>
  );
};

export default Song;
