import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { RewindIcon, ReplyIcon, SwitchHorizontalIcon, PauseIcon, PlayIcon, VolumeUpIcon, FastForwardIcon } from "@heroicons/react/solid";

import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { debounce } from "lodash";


const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        setCurrentTrackId(data.body?.item?.id);        
      });
      spotifyApi.getMyCurrentPlaybackState().then(data => {
        setIsPlaying(data.body?.is_playing);
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
      if (data?.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    })
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [spotifyApi, currentTrackIdState, session]);

  const debounceToAdjustVolume = useCallback(debounce((volume) => {
    spotifyApi.setVolume(volume).catch(err => {});
  }, 500), []);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceToAdjustVolume(volume);
    }
  }, [volume])

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-800 text-white grid grid-cols-3 text-sm md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img src={songInfo?.album.images?.[0].url} alt="" className="hidden md:inline h-20 w-20" />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button"/>
        <RewindIcon className="button" // onClick={() => spotifyApi.skipToPrevious()} Issue with API
        />
        {isPlaying ? (
          <PauseIcon className="button w-9 h-9" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="button w-9 h-9" onClick={handlePlayPause} />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon className="button" onClick={() => volume > 0 && setVolume(volume - 10)}/>
        <input className="w-14 md:w-28" type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))} />
        <VolumeUpIcon className="button" onClick={() => volume < 100 && setVolume(volume + 10)} />
      </div>
    </div>
  );
};

export default Player;
