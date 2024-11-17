import { COLOR_STATES } from "../constants/colors";

export const getColorState = (answered, correct) => {
  if (!answered || answered.length === 0) return COLOR_STATES.GREY;

  const answeredSet = new Set(answered);
  const correctSet = new Set(correct);

  const isExact =
    answeredSet.size === correctSet.size &&
    [...answeredSet].every((option) => correctSet.has(option));

  if (isExact) return COLOR_STATES.GREEN;

  const hasPartialMatch = [...answeredSet].some((option) =>
    correctSet.has(option)
  );

  if (hasPartialMatch) return COLOR_STATES.YELLOW;

  return COLOR_STATES.RED;
};
