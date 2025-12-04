import { useEffect, useState } from "react";

interface TypewriterState {
  currentMessageIndex: number;
  displayedText: string;
  isTyping: boolean;
}

export function useTypewriter(messages: string[], typingSpeed: number = 30, autoAdvanceDelay: number = 2000) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (messages.length === 0) {
      setDisplayedText("");
      setCurrentMessageIndex(0);
      return;
    }

    const currentMessage = messages[currentMessageIndex] || "";

    if (displayedText.length < currentMessage.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);

      if (currentMessageIndex < messages.length - 1) {
        const advanceTimeout = setTimeout(() => {
          setCurrentMessageIndex(currentMessageIndex + 1);
          setDisplayedText("");
        }, autoAdvanceDelay);

        return () => clearTimeout(advanceTimeout);
      }
    }
  }, [messages, currentMessageIndex, displayedText, typingSpeed, autoAdvanceDelay]);

  const skipTyping = () => {
    if (isTyping) {
      const currentMessage = messages[currentMessageIndex] || "";
      setDisplayedText(currentMessage);
    } else if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
      setDisplayedText("");
    }
  };

  const goToPrevious = () => {
    if (currentMessageIndex > 0) {
      setCurrentMessageIndex(currentMessageIndex - 1);
      setDisplayedText("");
    }
  };

  const goToNext = () => {
    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
      setDisplayedText("");
    }
  };

  return {
    currentMessageIndex,
    displayedText,
    isTyping,
    skipTyping,
    goToPrevious,
    goToNext,
  };
}
