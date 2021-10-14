import { Box, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Book } from "./App";

const Card: React.FC<Book> = ({
  title,
  coverImg,
  author,
  publisher,
  description,
  price,
  rating,
}) => {
  return (
    <Box
      p="8"
      shadow="2xl"
      rounded="xl"
      style={{ boxShadow: "2px 10px 20px 2px rgba(255,255,255,0.1)" }}
    >
      <HStack spacing="6" alignItems="center">
        <Image rounded="xl" h="150px" alt={title} src={coverImg} />
        <Box>
          <HStack justifyContent="space-between">
            <Box>
              <Heading fontSize="2xl">{title}</Heading>
              <Text color="gray.700" isTruncated maxW="80">
                {author} - {publisher}
              </Text>
            </Box>
            <Stack alignItems="flex-end">
              <Text fontWeight="semibold">{price ? "$ " + price : "N/A"}</Text>
              <Box
                className="Stars"
                style={{ "--rating": rating.toString() } as React.CSSProperties}
              />
            </Stack>
          </HStack>
          <Text mt="3" fontSize="sm" noOfLines={3}>
            {description}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default Card;