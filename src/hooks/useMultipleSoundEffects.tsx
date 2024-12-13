import { useState } from "react";
import { Howl } from "howler";

const useMultipleSoundEffects = (soundSources: string[]) => {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const sounds = soundSources.map(
    (src) => new Howl({ src: [src], volume: 0.5 })
  );

  const playSound = (index: number) => {
    if (isSoundOn && sounds[index]) {
      sounds[index].play();
    }
  };

  const toggleSound = () => {
    setIsSoundOn((prev) => !prev);
  };

  return { isSoundOn, toggleSound, playSound };
};

export default useMultipleSoundEffects;
