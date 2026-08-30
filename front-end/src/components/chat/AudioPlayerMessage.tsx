import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, Slider, Typography, Stack } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

import { PURPLE_PRIMARY } from "../../theme";

interface AudioPlayerMessageProps {
  src?: string;
  durationText?: string;
  isOwn?: boolean;
}

export const AudioPlayerMessage: React.FC<AudioPlayerMessageProps> = ({
  src,
  durationText = "0:00 / 0:00",
  isOwn = false,
}) => {
  const theme = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(audio.currentTime || 0);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      // Simulate play state if no audio src
      setIsPlaying(!isPlaying);
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        setIsPlaying(true);
      });
      setIsPlaying(true);
    }
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    const newTime = value as number;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const displayedTime = duration > 0 ? `${formatTime(currentTime)} / ${formatTime(duration)}` : durationText;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1,
        borderRadius: "10px",
        backgroundColor: isOwn ? alpha("#FFFFFF", 0.15) : alpha("#000000", 0.04),
        minWidth: 260,
        maxWidth: 320,
      }}
    >
      {src && <audio ref={audioRef} src={src} preload="metadata" />}

      {/* Play/Pause Button matching PDF */}
      <IconButton
        size="small"
        onClick={togglePlay}
        sx={{
          backgroundColor: isOwn ? "#FFFFFF" : PURPLE_PRIMARY,
          color: isOwn ? PURPLE_PRIMARY : "#FFFFFF",
          width: 32,
          height: 32,
          "&:hover": {
            backgroundColor: isOwn ? alpha("#FFFFFF", 0.9) : "#6D28D9",
          },
        }}
      >
        {isPlaying ? <PauseRoundedIcon sx={{ fontSize: 18 }} /> : <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />}
      </IconButton>

      {/* Progress & Duration Text */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: "0.725rem",
            color: isOwn ? alpha("#FFFFFF", 0.9) : theme.palette.text.secondary,
            fontWeight: 500,
            lineHeight: 1,
            mb: 0.5,
          }}
        >
          {displayedTime}
        </Typography>

        <Slider
          size="small"
          value={duration > 0 ? currentTime : 0}
          max={duration > 0 ? duration : 100}
          onChange={handleSliderChange}
          sx={{
            py: 0.5,
            color: isOwn ? "#FFFFFF" : PURPLE_PRIMARY,
            "& .MuiSlider-thumb": {
              width: 10,
              height: 10,
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0 0 0 4px ${alpha(PURPLE_PRIMARY, 0.2)}`,
              },
            },
            "& .MuiSlider-rail": {
              opacity: 0.35,
            },
          }}
        />
      </Box>

      {/* Volume icon & Overflow action */}
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <IconButton
          size="small"
          onClick={toggleMute}
          sx={{
            color: isOwn ? alpha("#FFFFFF", 0.8) : theme.palette.text.secondary,
            p: 0.5,
          }}
        >
          {isMuted ? <VolumeOffRoundedIcon sx={{ fontSize: 16 }} /> : <VolumeUpRoundedIcon sx={{ fontSize: 16 }} />}
        </IconButton>

        <IconButton
          size="small"
          sx={{
            color: isOwn ? alpha("#FFFFFF", 0.8) : theme.palette.text.secondary,
            p: 0.5,
          }}
        >
          <MoreVertRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default AudioPlayerMessage;
