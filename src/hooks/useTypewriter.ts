import { useEffect, useState } from "react";

export const useTypewriter = (text: string, speed: number, delay: number) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    let typingInterval: number;
    let resetTimeout: number;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        setDisplayedText((_) => text.slice(0, i + 1));
        i++;
        if (i > text.length) {
          clearInterval(typingInterval);
          resetTimeout = setTimeout(() => {
            setDisplayedText("");
            i = 0;
            startTyping();
          }, delay);
        }
      }, speed);
    };

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(resetTimeout);
    };
  }, [text, speed, delay]);

  return displayedText;
};
