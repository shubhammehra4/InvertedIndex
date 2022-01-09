import { Heading, HStack, Img } from "@chakra-ui/react";
import { memo } from "react";
import { Suggestion } from "../types";

const SuggestionCard: React.FC<
  Suggestion & { handleClick: (suggestion: string) => void }
> = ({ title, coverImg, handleClick }) => (
  <HStack px="3" onClick={() => handleClick(title)} cursor="pointer">
    <Img src={coverImg} width="14" rounded="lg" />
    <Heading maxW="sm" isTruncated fontSize="lg">
      {title}
    </Heading>
  </HStack>
);

export default memo(SuggestionCard);
